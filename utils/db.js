// Service WebSocket Réel & API REST pour communiquer avec Spring Boot

const WS_URL = 'http://localhost:8080/ws';
const API_URL = 'http://localhost:8080/api';

let stompClient = null;
let currentSubscription = null;

const listeners = {
    message: [],
    connection: []
};

const notifyListeners = (type, data) => {
    if (listeners[type]) {
        listeners[type].forEach(callback => callback(data));
    }
};

const RealChatService = {
    connect: (username) => {
        return new Promise((resolve, reject) => {
            if (typeof window.SockJS === 'undefined' || typeof window.Stomp === 'undefined') {
                reject("Les librairies WebSocket ne sont pas chargées.");
                return;
            }

            // Si déjà connecté avec le même user, on réutilise
            if (stompClient && stompClient.connected) {
                console.log("Already connected, reusing connection");
                resolve({ username, status: 'online' });
                return;
            }

            const socket = new window.SockJS(WS_URL);
            stompClient = window.Stomp.over(socket);
            stompClient.debug = () => {}; // Silence debug logs

            // Timeout de sécurité (5 secondes)
            const timeoutId = setTimeout(() => {
                if (stompClient && !stompClient.connected) {
                    try { stompClient.disconnect(); } catch(e) {}
                    reject("Le serveur ne répond pas (Timeout 5s). Vérifiez qu'il est bien lancé.");
                }
            }, 5000);

            stompClient.connect({}, (frame) => {
                clearTimeout(timeoutId);
                console.log('Connected to WS');
                notifyListeners('connection', true);
                
                try {
                    // Toujours souscrire au canal public pour les événements globaux (JOIN/LEAVE)
                    stompClient.subscribe('/topic/public', (payload) => {
                        const message = JSON.parse(payload.body);
                        notifyListeners('message', message);
                    });

                    // Envoyer JOIN
                    stompClient.send("/app/chat.addUser", {}, JSON.stringify({sender: username, type: 'JOIN'}));
                    
                    resolve({ username, status: 'online' });
                } catch (e) {
                    console.error("Error in connect callback:", e);
                    reject("Erreur lors de l'initialisation du chat.");
                }

            }, (error) => {
                clearTimeout(timeoutId);
                console.error('WS Error:', error);
                reject("Erreur de connexion au serveur (WebSocket).");
            });
        });
    },

    disconnect: () => {
        if (stompClient !== null) {
            try {
                stompClient.disconnect();
            } catch (e) {
                console.error("Error disconnecting:", e);
            }
            stompClient = null;
        }
    },

    // S'abonner à une salle spécifique
    subscribeToRoom: (roomId) => {
        if (!stompClient || !stompClient.connected) return;

        // Si c'est null ou 'public', on ne fait rien de spécial car on est déjà abonné à /topic/public
        if (!roomId || roomId === 'public' || roomId === 1) { // 1 est souvent l'ID de la salle Général
             if (currentSubscription) {
                currentSubscription.unsubscribe();
                currentSubscription = null;
            }
            return;
        }

        // Se désabonner de l'ancienne salle privée/spécifique
        if (currentSubscription) {
            currentSubscription.unsubscribe();
        }

        console.log("Subscribing to room topic: /topic/room/" + roomId);
        currentSubscription = stompClient.subscribe('/topic/room/' + roomId, (payload) => {
            const message = JSON.parse(payload.body);
            notifyListeners('message', message);
        });
    },

    sendMessage: (sender, content, type = 'CHAT', roomId = 'public') => {
        if (stompClient && stompClient.connected) {
            // S'assurer que roomId est correct (si c'est 1 ou 'public', on met null ou on gère côté back)
            // Dans notre backend actuel: roomId null = public. roomId non null = room specifique.
            let targetRoomId = roomId;
            if (roomId === 'public' || roomId === 1) targetRoomId = null;
            
            const chatMessage = {
                sender: sender,
                content: content,
                type: type,
                roomId: targetRoomId ? parseInt(targetRoomId) : null,
                timestamp: new Date().toISOString()
            };
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        } else {
            console.error("Cannot send message: not connected");
        }
    },

    onMessage: (callback) => {
        listeners.message.push(callback);
        return () => {
            listeners.message = listeners.message.filter(cb => cb !== callback);
        };
    },

    // API REST Calls
    getRooms: async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout pour l'API

            const response = await fetch(`${API_URL}/rooms`, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.warn("Failed to fetch rooms (using fallback):", error);
            // Fallback: Toujours renvoyer au moins la salle Général
            return [
                { id: 1, name: 'Général', type: 'public' }
            ];
        }
    },

    createRoom: async (name, type = 'public') => {
        try {
            const response = await fetch(`${API_URL}/rooms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, type })
            });
            
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Server responded with ${response.status}: ${text}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error("Error creating room:", error);
            throw error;
        }
    },

    deleteRoom: async (id) => {
        try {
            await fetch(`${API_URL}/rooms/${id}`, { method: 'DELETE' });
            return true;
        } catch (error) {
            console.error("Error deleting room:", error);
            return false;
        }
    }
};

const UserService = {
    login: async (username) => RealChatService.connect(username),
    logout: async () => RealChatService.disconnect(),
    getOnlineUsers: async () => [] 
};

const ChatService = {
    getMessages: async () => [], 
    sendMessage: async (sender, content, roomId) => {
        RealChatService.sendMessage(sender, content, 'CHAT', roomId);
    },
    getRooms: async () => RealChatService.getRooms(),
    subscribeToMessages: (callback) => RealChatService.onMessage(callback),
    createRoom: async (name, type) => RealChatService.createRoom(name, type),
    deleteRoom: async (id) => RealChatService.deleteRoom(id),
    joinRoom: (roomId) => RealChatService.subscribeToRoom(roomId)
};

window.RealChatService = RealChatService;
window.UserService = UserService;
window.ChatService = ChatService;