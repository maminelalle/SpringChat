function Avatar({ src, name, size = 'md', status = null }) {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-base',
        xl: 'w-24 h-24 text-xl'
    };

    const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-gray-400',
        busy: 'bg-red-500'
    };

    // Utilisation du style 'initials' au lieu de 'avataaars' (style bitmoji)
    // Si l'URL contient 'avataaars', on la remplace par 'initials' pour respecter la demande
    let finalSrc = src;
    if (!src || src.includes('avataaars')) {
        finalSrc = `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=3b82f6&textColor=ffffff`;
    }

    return (
        <div className="relative inline-block">
            <img 
                src={finalSrc} 
                alt={name}
                className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white dark:border-slate-800 bg-gray-100`}
            />
            {status && (
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${statusColors[status] || 'bg-gray-400'}`}></span>
            )}
        </div>
    );
}