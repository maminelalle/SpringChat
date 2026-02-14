function Sidebar({ currentUser, rooms, privateRooms = [], users, currentRoomId, onSelectRoom, onSelectPrivateRoom, onSelectUser, onLogout, onCreateRoom, onDeleteRoom }) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [privateUsername, setPrivateUsername] = React.useState('');

    const getPrivateRoomDisplayName = (room) => {
        if (!room.name || !room.name.startsWith('private_')) return room.name;
        const parts = room.name.split('_').slice(1);
        const other = parts.find(u => u !== currentUser.username) || parts[0];
        return other || room.name;
    };

    return (
        <div className="w-80 bg-gray-50 dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 flex flex-col h-full flex-shrink-0 transition-colors duration-300">
            <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar name={currentUser.username} src={currentUser.avatar} status="online" />
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{currentUser.username}</h3>
                        <span className="text-xs text-green-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> En ligne
                        </span>
                    </div>
                </div>
                <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Se déconnecter">
                    <div className="icon-log-out"></div>
                </button>
            </div>

            <div className="p-4 pb-2">
                <div className="relative">
                    <div className="absolute left-3 top-2.5 text-gray-400"><div className="icon-search w-4 h-4"></div></div>
                    <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
                <section>
                    <h4 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between group">
                        Salons
                        <button onClick={onCreateRoom} className="text-blue-500 hover:text-blue-600 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="Créer un salon">
                            <div className="icon-plus w-4 h-4"></div>
                        </button>
                    </h4>
                    <div className="space-y-1">
                        {rooms.map(room => (
                            <div key={room.id} className="group relative">
                                <button onClick={() => onSelectRoom(room.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${currentRoomId === room.id ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-900'}`}>
                                    <div className="icon-hash w-4 h-4 opacity-70"></div>
                                    <span className="truncate">{room.name}</span>
                                    {room.unreadCount > 0 && <span className="ml-auto bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{room.unreadCount}</span>}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); if(confirm('Supprimer ce salon ?')) onDeleteRoom(room.id); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Supprimer le salon">
                                    <div className="icon-trash-2 w-3 h-3"></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {privateRooms.length > 0 && (
                    <section>
                        <h4 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Conversations privées</h4>
                        <div className="space-y-1">
                            {privateRooms.map(room => (
                                <button key={room.id} onClick={() => (onSelectPrivateRoom ? onSelectPrivateRoom(room) : onSelectRoom(room.id))}
                                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${currentRoomId === room.id ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-900'}`}>
                                    <div className="icon-user w-4 h-4 opacity-70"></div>
                                    <span className="truncate">{getPrivateRoomDisplayName(room)}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <h4 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Démarrer une conversation</h4>
                    <div className="px-2 mb-3 flex gap-2">
                        <input type="text" value={privateUsername} onChange={(e) => setPrivateUsername(e.target.value)}
                            placeholder="Nom d'utilisateur..."
                            className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white placeholder-gray-400"
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onSelectUser(privateUsername.trim()), setPrivateUsername(''))} />
                        <button type="button" onClick={() => { const u = privateUsername.trim(); if (u) { onSelectUser(u); setPrivateUsername(''); } }}
                            className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600">Ouvrir</button>
                    </div>
                    <div className="space-y-1">
                        {users.filter(u => u.username !== currentUser.username).map(user => (
                            <button key={user.username} onClick={() => onSelectUser(user.username)}
                                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors group">
                                <div className="relative">
                                    <Avatar name={user.username} src={user.avatar} size="sm" />
                                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-950 ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                </div>
                                <span className="truncate">{user.username}</span>
                                <div className="ml-auto icon-message-circle w-4 h-4 opacity-0 group-hover:opacity-50 text-[var(--primary-color)]"></div>
                            </button>
                        ))}
                        {users.filter(u => u.username !== currentUser.username).length === 0 && (
                            <p className="px-4 text-xs text-gray-400 italic">Personne d'autre en ligne.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}