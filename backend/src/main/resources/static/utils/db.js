// Groupe 9 : Client JavaScript connecté au backend Spring Boot
// Connexion WebSocket via SockJS + STOMP (éléments clés du sujet).
// - SockJS : connexion au endpoint /ws (fallback si WebSocket pur bloqué)
// - STOMP : envoi vers /app/chat.sendMessage et /app/chat.addUser, souscription à /topic/public et /topic/room/{id}

// URLs relatives quand le frontend est servi par Spring (http://localhost:8080)
const WS_URL = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin + '/ws' : 'http://localhost:8080/ws';
const API_URL = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin + '/api' : 'http://localhost:8080/api';

let stompClient = null;
let currentSubscription = null;
let privateSubscription = null;

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

    subscribeToPrivateRoom: (roomId) => {
        if (!stompClient || !stompClient.connected || !roomId) return;
        if (privateSubscription) {
            privateSubscription.unsubscribe();
            privateSubscription = null;
        }
        privateSubscription = stompClient.subscribe('/topic/room/' + roomId, (payload) => {
            const message = JSON.parse(payload.body);
            notifyListeners('message', message);
        });
    },

    leavePrivateRoom: () => {
        if (privateSubscription) {
            privateSubscription.unsubscribe();
            privateSubscription = null;
        }
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

    getOrCreatePrivateRoom: async (myUsername, otherUsername) => {
        try {
            const params = new URLSearchParams({ me: myUsername, with: otherUsername });
            const response = await fetch(`${API_URL}/rooms/private?${params}`);
            if (!response.ok) throw new Error('Impossible d\'ouvrir la conversation privée');
            return await response.json();
        } catch (error) {
            console.error("Error getOrCreatePrivateRoom:", error);
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
    },

    uploadVoice: async (blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'voice.webm');
        const response = await fetch(`${API_URL}/upload/voice`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Upload vocal échoué');
        const data = await response.json();
        return data.id;
    },

    getVoiceUrl: (id) => {
        const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
        return (origin || 'http://localhost:8080') + '/api/voice/' + encodeURIComponent(id);
    },

    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        const response = await fetch(`${API_URL}/upload/file`, { method: 'POST', body: formData });
        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || 'Upload fichier échoué');
        }
        return await response.json();
    },

    getFileUrl: (id, download = false) => {
        const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
        const base = (origin || 'http://localhost:8080') + '/api/files/' + encodeURIComponent(id);
        return download ? base + '?download=true' : base;
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
    getOrCreatePrivateRoom: async (me, withUser) => RealChatService.getOrCreatePrivateRoom(me, withUser),
    deleteRoom: async (id) => RealChatService.deleteRoom(id),
    joinRoom: (roomId) => RealChatService.subscribeToRoom(roomId),
    subscribeToPrivateRoom: (roomId) => RealChatService.subscribeToPrivateRoom(roomId),
    leavePrivateRoom: () => RealChatService.leavePrivateRoom(),
    uploadVoice: async (blob) => RealChatService.uploadVoice(blob),
    getVoiceUrl: (id) => RealChatService.getVoiceUrl(id),
    uploadFile: async (file) => RealChatService.uploadFile(file),
    getFileUrl: (id, download) => RealChatService.getFileUrl(id, download)
};

window.RealChatService = RealChatService;
window.UserService = UserService;
window.ChatService = ChatService;