function ChatArea({ currentUser, currentRoom, messages, onlineUsersCount, onSendMessage, onDeleteMessage, isTyping }) {
    const [newMessage, setNewMessage] = React.useState('');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
    
    const messagesEndRef = React.useRef(null);
    const fileInputRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages, currentRoom, isTyping]); 

    // --- Sending Logic ---
    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage('');
        setShowEmojiPicker(false);
    };

    const handleEmojiSelect = (emoji) => {
        setNewMessage(prev => prev + emoji);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (simulated limit)
            if (file.size > 1024 * 1024) { // 1MB limit for demo
                alert("Fichier trop volumineux pour la démo.");
                return;
            }
            const fileMessage = `📎 Fichier partagé: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
            onSendMessage(fileMessage);
            e.target.value = null; 
        }
    };

    const filteredMessages = messages.filter(msg => {
        const content = msg.content || '';
        const sender = msg.sender || '';
        return content.toLowerCase().includes(searchTerm.toLowerCase()) ||
               sender.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // --- Render Logic ---
    const renderMessageContent = (msg) => {
        if (!msg.content) return null;

        // Fallback pour anciens messages vocaux
        if (msg.content.startsWith('VOICE::') || msg.content.startsWith('🎤 Message Vocal')) {
             return (
                <div className="flex items-center gap-3 pr-2 min-w-[150px]">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-50">
                        <div className="icon-mic-off text-sm"></div>
                    </div>
                    <div className="text-xs opacity-70 italic">Message vocal (Désactivé)</div>
                </div>
            );
        }

        const isFile = msg.content.startsWith('📎 Fichier partagé:');
        
        if (isFile) {
             return (
                <div className="flex items-center gap-3 pr-2">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                        <div className="icon-file text-xl"></div>
                    </div>
                    <div>
                        <div className="font-medium underline hover:text-blue-100 cursor-pointer">{msg.content.replace('📎 Fichier partagé: ', '').split('(')[0]}</div>
                        <div className="text-xs opacity-70">Cliquer pour télécharger</div>
                    </div>
                </div>
            );
        }

        return msg.content;
    };

    if (!currentRoom) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <div className="icon-message-square text-4xl opacity-50"></div>
                </div>
                <h3 className="text-xl font-medium mb-2">Sélectionnez une salle</h3>
                <p>Choisissez une salle dans la barre latérale pour commencer à discuter.</p>
            </div>
        );
    }

    let roomDisplayName = currentRoom.name;
    let isPrivate = currentRoom.type === 'private';
    
    if (isPrivate && currentRoom.name.startsWith('private_')) {
        // Format du nom: private_user1_user2
        const parts = currentRoom.name.split('_');
        // On récupère les utilisateurs (index 1 et 2)
        const users = parts.slice(1); 
        const otherUser = users.find(u => u !== currentUser.username) || users[0];
        // Si on a trouvé un autre utilisateur, on l'affiche, sinon on garde le nom par défaut
        if (otherUser) {
            roomDisplayName = otherUser;
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 relative transition-colors duration-300">
            {/* Header */}
            <div className="h-16 border-b border-gray-200 dark:border-slate-700 flex items-center px-6 justify-between flex-shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <div className={`icon-${isPrivate ? 'user' : 'hash'} text-xl`}></div>
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 dark:text-white">
                            {roomDisplayName}
                        </h2>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <div className="icon-lock w-3 h-3"></div>
                            {isPrivate ? 'Message Privé' : 'Canal Public'}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className={`flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg px-2 transition-all ${isSearchOpen ? 'w-48' : 'w-8'}`}>
                        <button 
                            onClick={() => {
                                setIsSearchOpen(!isSearchOpen);
                                if(isSearchOpen) setSearchTerm('');
                            }}
                            className="p-1 text-gray-500 hover:text-blue-500"
                        >
                            <div className="icon-search w-4 h-4"></div>
                        </button>
                        {isSearchOpen && (
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Chercher..."
                                className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-700 dark:text-gray-200 px-2 py-1"
                                autoFocus
                            />
                        )}
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {onlineUsersCount} en ligne
                    </div>
                </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/subtle-dark-vertical.png')] dark:bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
                {messages.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                             <div className="icon-message-circle text-4xl text-gray-400"></div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Aucun message pour le moment.</p>
                        <p className="text-sm text-gray-400">Soyez le premier à envoyer un message ! 👋</p>
                    </div>
                ) : (
                    filteredMessages.map((msg) => {
                        const isMe = msg.sender === currentUser.username;
                        const isSystem = msg.type !== 'CHAT';

                        if (isSystem) {
                            return (
                                <div key={msg.id} className="flex justify-center my-4">
                                    <span className="bg-gray-100/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-500 dark:text-gray-400 text-xs py-1 px-4 rounded-full flex items-center gap-2 border border-gray-200 dark:border-slate-700 shadow-sm">
                                        <div className={`icon-${msg.type === 'JOIN' ? 'log-in' : 'log-out'} w-3 h-3`}></div>
                                        {msg.sender} {msg.type === 'JOIN' ? 'a rejoint' : 'a quitté'} le chat
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''} group animate-fade-in-up items-end`}>
                                <Avatar name={msg.sender} size="sm" />
                                <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'} relative group`}>
                                    
                                    {/* Delete Button (Only for me, visible on hover) */}
                                    {isMe && (
                                        <button 
                                            onClick={() => {
                                                if(confirm('Supprimer ce message ?')) onDeleteMessage(msg.id);
                                            }}
                                            className="absolute -top-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 dark:bg-red-900/50 text-red-500 p-1 rounded-full shadow-sm z-10"
                                            title="Supprimer"
                                        >
                                            <div className="icon-trash-2 w-3 h-3"></div>
                                        </button>
                                    )}

                                    <div className="flex items-center gap-2 mb-1 px-1">
                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                            {msg.sender}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            {formatTime(msg.timestamp)}
                                        </span>
                                    </div>
                                    <div className={`
                                        py-2.5 px-4 rounded-2xl text-sm leading-relaxed shadow-md transition-all relative
                                        ${isMe 
                                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-none' 
                                            : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-slate-700'}
                                    `}>
                                        {renderMessageContent(msg)}
                                        
                                        {/* Ticks */}
                                        {isMe && (
                                            <div className="absolute -bottom-5 right-0 text-xs text-gray-400 flex items-center gap-1">
                                                <span className="text-[10px]">Lu</span>
                                                <div className="icon-check-check w-3 h-3 text-blue-500"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                
                {isTyping && (
                    <div className="flex gap-3 items-end animate-pulse ml-2">
                         <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                             <div className="icon-more-horizontal text-gray-500"></div>
                         </div>
                         <div className="text-xs text-gray-500 italic">Quelqu'un écrit...</div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <EmojiPicker 
                    onSelect={handleEmojiSelect} 
                    onClose={() => setShowEmojiPicker(false)} 
                />
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0 z-20">
                <form onSubmit={handleSend} className="flex gap-2 items-center">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileUpload}
                    />
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
                        title="Partager un fichier"
                    >
                        <div className="icon-paperclip text-xl"></div>
                    </button>
                    
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message à #${roomDisplayName}`}
                            className="w-full pl-5 pr-12 py-3.5 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none text-gray-900 dark:text-white transition-all"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                            <div className="icon-smile text-xl"></div>
                        </button>
                    </div>

                    <button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3.5 bg-[var(--primary-color)] text-white rounded-full hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:scale-100"
                    >
                        <div className="icon-send-horizontal text-xl"></div>
                    </button>
                </form>
            </div>
        </div>
    );
}