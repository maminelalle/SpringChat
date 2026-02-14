function ThemeToggle({ isDark, toggleTheme }) {
    return (
        <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        >
            {isDark ? (
                <div className="icon-sun text-yellow-400 text-xl"></div>
            ) : (
                <div className="icon-moon text-slate-600 text-xl"></div>
            )}
        </button>
    );
}