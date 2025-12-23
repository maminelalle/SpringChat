function ChatLayout({ currentUser, onLogout }) {
    // Accès explicite aux services globaux
    const ChatService = window.ChatService;

    const [rooms, setRooms] = React.useState([]);
    const [messages, setMessages] = React.useState([]);
    const [users, setUsers] = React.useState([]); 
    const [currentRoomId, setCurrentRoomId] = React.useState(1); 
    const [isTyping, setIsTyping] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    
    // Initial Setup
    React.useEffect(() => {
        const init = async () => {
            try {
                const r = await ChatService.getRooms();
                if (r && r.length > 0) {
                    setRooms(r);
                    setCurrentRoomId(r[0].id);
                } else {
                     setRooms([{ id: 1, name: 'Général', type: 'public' }]);
                     setCurrentRoomId(1);
                }
            } catch (e) {
                console.error("Failed to load rooms", e);
            }
        };
        init();

        const unsubscribe = ChatService.subscribeToMessages((msg) => {
            // Check relevance
            const isRelevant = !msg.roomId || msg.roomId === currentRoomId || msg.roomId === 'public';
            
            if (isRelevant) {
                setMessages(prev => [...prev, {
                    ...msg,
                    id: msg.id || (Date.now() + Math.random()) 
                }]);
            }

            if (msg.type === 'JOIN') {
                setUsers(prev => {
                    const exists = prev.some(u => u.username === msg.sender);
                    if (!exists) {
                        return [...prev, { username: msg.sender, status: 'online' }];
                    }
                    return prev;
                });
            } else if (msg.type === 'LEAVE') {
                 setUsers(prev => prev.filter(u => u.username !== msg.sender));
            }
        });

        // Add self to users list immediately
        setUsers(prev => {
            const exists = prev.some(u => u.username === currentUser.username);
            return exists ? prev : [...prev, { username: currentUser.username, status: 'online' }];
        });

        return () => {
            unsubscribe();
        };
    }, [currentRoomId, currentUser]); 

    // Handle room switching
    const handleSelectRoom = (roomId) => {
        setCurrentRoomId(roomId);
        setMessages([]); 
        ChatService.joinRoom(roomId);
    };

    const handleCreateRoom = async (name) => {
        try {
            const newRoom = await ChatService.createRoom(name, 'public');
            setRooms(prev => [...prev, newRoom]);
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la création du salon. Vérifiez la console pour les détails.");
        }
    };

    const handleDeleteRoom = async (id) => {
        try {
            await ChatService.deleteRoom(id);
            setRooms(prev => prev.filter(r => r.id !== id));
            if (currentRoomId === id) {
                setCurrentRoomId(rooms[0]?.id || 1);
            }
        } catch (e) {
            alert("Erreur lors de la suppression.");
        }
    };

    // Private Message Logic
    const handleSelectUser = async (targetUsername) => {
        if (targetUsername === currentUser.username) return;

        // 1. Définir un nom unique pour la salle privée (trié alphabétiquement)
        const sortedUsers = [currentUser.username, targetUsername].sort();
        const roomName = `private_${sortedUsers[0]}_${sortedUsers[1]}`;

        // 2. Chercher si elle existe déjà dans la liste locale
        let targetRoom = rooms.find(r => r.name === roomName && r.type === 'private');

        // 3. Si elle n'existe pas, on tente de la créer (ou de la récupérer si elle existe côté serveur mais pas chargée)
        if (!targetRoom) {
            try {
                // On crée (le backend doit gérer si elle existe déjà, ou on vérifie avant)
                // Note: Ici on simplifie en créant directement. Si doublon, le backend renverra l'existante ou erreur.
                // Idéalement on ferait un GET /api/rooms/find?name=...
                
                // On essaie de créer, si ça échoue on re-fetch tout
                targetRoom = await ChatService.createRoom(roomName, 'private');
                setRooms(prev => [...prev, targetRoom]);
            } catch (e) {
                // Si erreur (ex: existe déjà), on rafraichit la liste
                console.log("Room might exist, refreshing...");
                const allRooms = await ChatService.getRooms();
                setRooms(allRooms);
                targetRoom = allRooms.find(r => r.name === roomName);
            }
        }

        if (targetRoom) {
            // Important: Mettre à jour la liste des rooms si c'est une nouvelle
            if (!rooms.find(r => r.id === targetRoom.id)) {
                setRooms(prev => [...prev, targetRoom]);
            }
            handleSelectRoom(targetRoom.id);
        } else {
            alert("Impossible d'ouvrir la conversation privée.");
        }
    };

    const handleSendMessage = async (content) => {
        try {
            await ChatService.sendMessage(currentUser.username, content, currentRoomId);
        } catch (e) {
            console.error("Send error", e);
        }
    };

    const handleLogout = () => {
        onLogout();
    };

    // Filter rooms for Sidebar: only show public ones in the "Salons" list
    // Private rooms are shown in a separate section (or handled implicitly if we want them in list)
    // For now, let's keep "Salons" strictly public, and "Messages Privés" handled via User list or a separate "Conversations" list?
    // Current Sidebar implementation separates "Salons" (rooms prop) and "Users" (users prop).
    // Private rooms (1-on-1) are usually accessed by clicking the user.
    
    const publicRooms = rooms.filter(r => r.type !== 'private');
    
    const currentRoom = rooms.find(r => r.id === currentRoomId) || rooms[0];

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] relative">
            <Sidebar 
                currentUser={currentUser}
                rooms={publicRooms} // On passe seulement les salons publics ici
                users={users} 
                currentRoomId={currentRoomId}
                onSelectRoom={handleSelectRoom}
                onSelectUser={handleSelectUser}
                onLogout={handleLogout}
                onCreateRoom={() => setIsModalOpen(true)}
                onDeleteRoom={handleDeleteRoom}
            />
            <CreateRoomModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateRoom}
            />
            <ChatArea 
                currentUser={currentUser}
                currentRoom={currentRoom}
                messages={messages}
                onlineUsersCount={users.length}
                onSendMessage={handleSendMessage}
                onDeleteMessage={() => {}}
                isTyping={false}
            />
        </div>
    );
}