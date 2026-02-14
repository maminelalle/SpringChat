// Important: DO NOT remove this `ErrorBoundary` component.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
          <div className="text-center p-8">
            <div className="icon-alert-triangle text-4xl text-red-500 mb-4 mx-auto"></div>
            <h1 className="text-2xl font-bold mb-4">Une erreur est survenue</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Veuillez recharger la page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Recharger
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
    // Accès explicite aux services globaux pour éviter les ReferenceError
    const UserService = window.UserService;

    // State
    const [view, setView] = React.useState('home'); // home, login, chat
    const [currentUser, setCurrentUser] = React.useState(null);
    const [isDark, setIsDark] = React.useState(false);

    // Theme Management
    React.useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    // Navigation handlers
    const handleLogin = (user) => {
        setCurrentUser(user);
        setView('chat');
    };

    const handleLogout = async () => {
        if (currentUser) {
            await UserService.logout(currentUser.id, currentUser);
        }
        setCurrentUser(null);
        setView('login');
    };

    return (
        <div className="antialiased text-[var(--text-primary)] transition-colors duration-300">
            {/* Global Theme Toggle (Floating) */}
            <div className="fixed top-4 right-4 z-[100]">
                <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
            </div>

            {view === 'home' && (
                <Home onEnter={() => setView('login')} />
            )}

            {view === 'login' && (
                <Login onLogin={handleLogin} />
            )}

            {view === 'chat' && currentUser && (
                <ChatLayout 
                    currentUser={currentUser} 
                    onLogout={handleLogout} 
                />
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);