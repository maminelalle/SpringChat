function Toast({ message, type = 'info', onClose }) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        info: 'bg-blue-500',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500'
    };

    const icons = {
        info: 'icon-info',
        success: 'icon-check',
        warning: 'icon-alert-triangle',
        error: 'icon-x-circle'
    };

    return (
        <div className={`flex items-center gap-3 ${bgColors[type]} text-white px-4 py-3 rounded-lg shadow-lg min-w-[300px] animate-fade-in-up transition-all`}>
            <div className={icons[type]}></div>
            <div className="flex-1 text-sm font-medium">{message}</div>
            <button onClick={onClose} className="opacity-80 hover:opacity-100">
                <div className="icon-x w-4 h-4"></div>
            </button>
        </div>
    );
}