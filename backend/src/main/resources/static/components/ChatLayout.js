function ChatLayout({ currentUser, onLogout }) {
    // Accès explicite aux services globaux
    const ChatService = window.ChatService;

    const [rooms, setRooms] = React.useState([]);
    const [messages, setMessages] = React.useState([]);
    const [users, setUsers] = React.useState([]); 
    const [currentRoomId, setCurrentRoomId] = React.useState(1); 
    const [isTyping, setIsTyping] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [privateChat, setPrivateChat] = React.useState(null); // { username, roomId, room }
    
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
            const msgRoom = msg.roomId != null ? Number(msg.roomId) : null;
            const curRoom = currentRoomId != null ? Number(currentRoomId) : null;
            const privateRoomId = privateChat && privateChat.roomId != null ? Number(privateChat.roomId) : null;
            const isRelevant = msgRoom == null || msgRoom === curRoom || msgRoom === 1 || (privateRoomId != null && msgRoom === privateRoomId);
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
    }, [currentRoomId, currentUser, privateChat]); 

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

    // Ouvrir la petite fenêtre de chat privé (sans changer la salle principale)
    const handleSelectUser = async (targetUsername) => {
        if (!targetUsername || targetUsername === currentUser.username) return;
        try {
            const targetRoom = await ChatService.getOrCreatePrivateRoom(currentUser.username, targetUsername);
            if (!targetRoom || !targetRoom.id) {
                alert("Impossible d'ouvrir la conversation.");
                return;
            }
            setRooms(prev => {
                const exists = prev.some(r => r.id === targetRoom.id);
                return exists ? prev : [...prev, targetRoom];
            });
            setPrivateChat({
                username: targetUsername,
                roomId: Number(targetRoom.id),
                room: targetRoom
            });
            ChatService.subscribeToPrivateRoom(Number(targetRoom.id));
        } catch (e) {
            console.error(e);
            alert("Erreur : impossible d'ouvrir la conversation privée. Vérifiez que le serveur est démarré.");
        }
    };

    const closePrivateChat = () => {
        setPrivateChat(null);
        ChatService.leavePrivateRoom();
    };

    const openPrivateChatByRoom = (room) => {
        if (!room || room.type !== 'private') return;
        const parts = room.name && room.name.startsWith('private_') ? room.name.split('_').slice(1) : [];
        const other = parts.find(u => u !== currentUser.username) || parts[0] || 'Inconnu';
        setPrivateChat({ username: other, roomId: Number(room.id), room });
        ChatService.subscribeToPrivateRoom(Number(room.id));
    };

    const handleSendPrivateMessage = (content) => {
        if (!privateChat) return;
        ChatService.sendMessage(currentUser.username, content, privateChat.roomId);
    };

    const handleSendMessage = async (content) => {
        try {
            const roomId = currentRoomId != null ? Number(currentRoomId) : null;
            ChatService.sendMessage(currentUser.username, content, roomId);
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
    const privateRooms = rooms.filter(r => r.type === 'private');
    const currentRoom = rooms.find(r => r.id === currentRoomId) || rooms[0];
    const privateChatMessages = privateChat ? messages.filter(m => Number(m.roomId) === Number(privateChat.roomId)) : [];

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] relative">
            <Sidebar 
                currentUser={currentUser}
                rooms={publicRooms}
                privateRooms={privateRooms}
                users={users} 
                currentRoomId={currentRoomId}
                onSelectRoom={handleSelectRoom}
                onSelectPrivateRoom={openPrivateChatByRoom}
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
            {privateChat && (
                <PrivateChatPopup
                    currentUser={currentUser}
                    otherUsername={privateChat.username}
                    roomId={privateChat.roomId}
                    messages={privateChatMessages}
                    onSendMessage={handleSendPrivateMessage}
                    onClose={closePrivateChat}
                />
            )}
        </div>
    );
}