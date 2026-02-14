// Petite fenêtre de chat privé entre deux utilisateurs (style formulaire / popup)
function PrivateChatPopup({ currentUser, otherUsername, roomId, messages, onSendMessage, onClose }) {
    const ChatService = window.ChatService;
    const formatTime = window.formatTime || ((t) => t ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
    const [input, setInput] = React.useState('');
    const [isRecording, setIsRecording] = React.useState(false);
    const [recordingSeconds, setRecordingSeconds] = React.useState(0);
    const [voiceUploading, setVoiceUploading] = React.useState(false);
    const messagesEndRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const chunksRef = React.useRef([]);
    const recordingTimerRef = React.useRef(null);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    React.useEffect(() => {
        if (isRecording) {
            recordingTimerRef.current = setInterval(() => {
                setRecordingSeconds(s => s + 1);
            }, 1000);
        } else {
            setRecordingSeconds(0);
        }
        return () => { if (recordingTimerRef.current) clearInterval(recordingTimerRef.current); };
    }, [isRecording]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input.trim());
        setInput('');
    };

    const startVoice = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
            const recorder = new MediaRecorder(stream);
            chunksRef.current = [];
            recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
            recorder.onstop = async () => {
                stream.getTracks().forEach(t => t.stop());
                if (chunksRef.current.length === 0) return;
                const blob = new Blob(chunksRef.current, { type: mime.split(';')[0] });
                setVoiceUploading(true);
                try {
                    const id = await ChatService.uploadVoice(blob);
                    onSendMessage('VOICE:' + id);
                } catch (err) {
                    console.error(err);
                    alert("Envoi du vocal échoué.");
                } finally {
                    setVoiceUploading(false);
                }
            };
            mediaRecorderRef.current = recorder;
            recorder.start(200);
            setIsRecording(true);
        } catch (err) {
            console.error(err);
            alert("Accès au micro refusé.");
        }
    };

    const stopVoice = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
            setIsRecording(false);
        }
    };

    const renderContent = (msg) => {
        if (!msg.content) return null;
        if (msg.content.startsWith('VOICE:')) {
            const id = msg.content.replace('VOICE:', '').trim();
            if (!id) return <span className="text-xs italic opacity-70">Vocal</span>;
            const url = ChatService.getVoiceUrl(id);
            return (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <div className="icon-mic text-sm"></div>
                    </div>
                    <audio controls src={url} className="max-w-[200px] h-8" />
                </div>
            );
        }
        if (msg.content.startsWith('IMAGE:')) {
            const id = msg.content.replace('IMAGE:', '').trim();
            if (!id) return null;
            const url = ChatService.getFileUrl(id);
            const downloadUrl = ChatService.getFileUrl(id, true);
            return (
                <div className="flex flex-col gap-1">
                    <img src={url} alt="Image" className="max-w-full max-h-32 rounded object-contain" />
                    <a href={downloadUrl} download target="_blank" rel="noopener noreferrer" className="text-[10px] underline opacity-90">Télécharger</a>
                </div>
            );
        }
        if (msg.content.startsWith('PDF:')) {
            const id = msg.content.replace('PDF:', '').trim();
            if (!id) return null;
            const url = ChatService.getFileUrl(id);
            const downloadUrl = ChatService.getFileUrl(id, true);
            return (
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-600">PDF</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs underline">Ouvrir</a>
                    <a href={downloadUrl} download target="_blank" rel="noopener noreferrer" className="text-xs underline">Télécharger</a>
                </div>
            );
        }
        return msg.content;
    };

    const filtered = messages.filter(m => m.type === 'CHAT' || !m.type);
    const mm = Math.floor(recordingSeconds / 60);
    const ss = recordingSeconds % 60;
    const timeStr = `${mm}:${ss.toString().padStart(2, '0')}`;

    return (
        <div className="fixed bottom-6 right-6 w-[380px] h-[480px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-blue-500 text-white rounded-t-2xl flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                        <div className="icon-user text-lg"></div>
                    </div>
                    <div>
                        <div className="font-semibold">Conversation avec {otherUsername}</div>
                        <div className="text-xs opacity-90">Chat privé</div>
                    </div>
                </div>
                <button type="button" onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Fermer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 dark:bg-slate-900">
                {filtered.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">Aucun message. Envoyez le premier.</div>
                )}
                {filtered.map((msg) => {
                    const isMe = msg.sender === currentUser.username;
                    return (
                        <div key={msg.id || (msg.timestamp + msg.sender)} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] py-1.5 px-3 rounded-2xl text-sm ${isMe ? 'bg-blue-500 text-white rounded-br-md' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-bl-md'}`}>
                                {!isMe && <div className="text-xs font-medium opacity-80 mb-0.5">{msg.sender}</div>}
                                {renderContent(msg)}
                                <div className="text-[10px] opacity-70 mt-1">{formatTime(msg.timestamp)}</div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Enregistrement en cours (style WhatsApp) */}
            {isRecording && (
                <div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-sm font-medium">Enregistrement {timeStr}</span>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={stopVoice} className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                            Envoyer
                        </button>
                    </div>
                </div>
            )}

            {/* Zone de saisie */}
            <div className="p-3 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
                <form onSubmit={handleSend} className="flex gap-2 items-center">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                        placeholder="Message..."
                        className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                        disabled={voiceUploading} />
                    <button type="button" disabled={voiceUploading}
                        onPointerDown={(e) => { e.preventDefault(); if (!isRecording) startVoice(); }}
                        onPointerUp={(e) => { e.preventDefault(); if (isRecording) stopVoice(); }}
                        onPointerLeave={(e) => { if (isRecording) stopVoice(); }}
                        onClick={(e) => { e.preventDefault(); if (!isRecording) startVoice(); else stopVoice(); }}
                        className={`p-2.5 rounded-full transition-colors select-none ${isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
                        title="Tenir pour enregistrer un vocal">
                        <div className="icon-mic text-xl"></div>
                    </button>
                    <button type="submit" disabled={!input.trim()} className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50">
                        <div className="icon-send-horizontal text-xl"></div>
                    </button>
                </form>
                <p className="text-[10px] text-gray-400 mt-1 text-center">Cliquez sur le micro pour enregistrer un vocal</p>
            </div>
        </div>
    );
}
