function Alert({ message, type = 'error', onClose }) {
    if (!message) return null;

    const bgClass = type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
    const icon = type === 'error' ? 'icon-circle-alert' : 'icon-check-circle';

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${bgClass} animate-fade-in`}>
            <div className={`${icon} text-xl`}></div>
            <p>{message}</p>
            {onClose && (
                <button onClick={onClose} className="ml-2 hover:opacity-75">
                    <div className="icon-x text-lg"></div>
                </button>
            )}
        </div>
    );
}