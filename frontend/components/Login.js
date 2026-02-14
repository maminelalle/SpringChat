function Login({ onLogin }) {
    // Accès explicite aux services globaux
    const UserService = window.UserService;

    const [username, setUsername] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    // Image d'illustration issue des assets fournis
    const HERO_IMAGE = "https://app.trickle.so/storage/public/images/usr_191d7671f0000001/fee00bfc-f809-4a0e-b97d-1bfb0b17d6b5.jpeg";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            const user = await UserService.login(username);
            onLogin(user);
        } catch (err) {
            setError("Erreur de connexion. Veuillez réessayer.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]">
            <div className="flex w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 mb-2 text-[var(--primary-color)]">
                            <div className="icon-message-circle text-2xl"></div>
                            <span className="font-bold text-xl">SpringChat</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Bienvenue !</h1>
                        <p className="text-gray-500 dark:text-gray-400">Connectez-vous pour rejoindre la discussion en temps réel.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nom d'utilisateur
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                                placeholder="ex: Ali, Sarah..."
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm flex items-center gap-2">
                                <div className="icon-alert-circle"></div>
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                            disabled={isLoading || !username.trim()}
                        >
                            {isLoading ? (
                                <>
                                    <div className="icon-loader-2 animate-spin"></div>
                                    Connexion...
                                </>
                            ) : (
                                <>
                                    Se connecter
                                    <div className="icon-arrow-right"></div>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 text-center text-sm text-gray-500">
                        <p>Simulation du projet Spring Boot + WebSocket</p>
                    </div>
                </div>

                {/* Right Side - Image */}
                <div className="hidden md:block w-1/2 relative">
                    <img 
                        src={HERO_IMAGE} 
                        alt="Login illustration" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px]"></div>
                    <div className="absolute bottom-12 left-12 right-12 text-white">
                        <blockquote className="text-lg font-medium mb-4">
                            "La communication en temps réel simplifiée pour les équipes modernes."
                        </blockquote>
                        <div className="flex items-center gap-2 opacity-75">
                            <div className="icon-shield-check"></div>
                            <span className="text-sm">Sécurisé & Rapide</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}