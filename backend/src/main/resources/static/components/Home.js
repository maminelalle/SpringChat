function Home({ onEnter }) {
    // Images des assets
    const HERO_BG = "https://app.trickle.so/storage/public/images/usr_191d7671f0000001/8e6c37f0-6bab-4f7e-8b0f-0f5dbbec33f4.jpeg"; 
    // Image de référence fournie par l'utilisateur pour le style
    const MOCKUP_IMG = "https://app.trickle.so/storage/public/images/usr_191d7671f0000001/4b02f358-fc6d-45b7-a10d-d5df4c08250e.png";

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 scroll-smooth">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-colors">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[var(--primary-color)] font-bold text-2xl">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <div className="icon-message-circle text-xl"></div>
                        </div>
                        SpringChat
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-[var(--primary-color)] font-medium transition-colors">Fonctionnalités</a>
                        <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-[var(--primary-color)] font-medium transition-colors">À propos</a>
                        <button 
                            onClick={onEnter}
                            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Accéder à l'espace
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-semibold mb-6 animate-fade-in">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                Architecture WebSocket & Spring Boot
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
                                Connectez-vous <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">sans limites.</span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Une plateforme de messagerie instantanée nouvelle génération, conçue pour démontrer la puissance du temps réel avec une sécurité de bout en bout.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button onClick={onEnter} className="btn-primary text-lg px-8 py-4 rounded-full shadow-blue-500/20 shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
                                    Commencer maintenant
                                    <div className="icon-arrow-right"></div>
                                </button>
                                <a href="#about" className="px-8 py-4 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center">
                                    En savoir plus
                                </a>
                            </div>
                            
                            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="icon-check-circle text-green-500"></div>
                                    <span>Gratuit</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="icon-check-circle text-green-500"></div>
                                    <span>Open Source</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="icon-check-circle text-green-500"></div>
                                    <span>Sécurisé</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="lg:w-1/2 relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                <div className="absolute top-0 w-full h-8 bg-gray-100 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <img 
                                    src={MOCKUP_IMG} 
                                    alt="Interface de l'application" 
                                    className="w-full h-auto pt-8 object-cover hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-blue-100 to-violet-100 dark:from-blue-900/20 dark:to-violet-900/20 rounded-full blur-3xl opacity-50"></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50 dark:bg-slate-950">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Une expérience complète</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Tout ce dont vous avez besoin pour communiquer efficacement en équipe.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: 'mic',
                                title: 'Messages Vocaux',
                                desc: 'Communiquez naturellement avec l\'envoi de messages vocaux instantanés.',
                                color: 'bg-purple-100 text-purple-600'
                            },
                            {
                                icon: 'file-text',
                                title: 'Partage de Fichiers',
                                desc: 'Échangez des documents et images en toute simplicité via le chat.',
                                color: 'bg-blue-100 text-blue-600'
                            },
                            {
                                icon: 'bell',
                                title: 'Notifications Intelligentes',
                                desc: 'Restez informé avec des alertes en temps réel et des badges de messages non lus.',
                                color: 'bg-orange-100 text-orange-600'
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-all hover:-translate-y-1">
                                <div className={`w-14 h-14 ${feature.color} dark:bg-opacity-20 rounded-xl flex items-center justify-center mb-6`}>
                                    <div className={`icon-${feature.icon} text-2xl`}></div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2 relative">
                             <img 
                                src={HERO_BG} 
                                alt="Équipe travaillant ensemble" 
                                className="rounded-2xl shadow-2xl object-cover w-full h-[500px]"
                            />
                            <div className="absolute -bottom-8 -right-8 w-64 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <div className="icon-users text-xl"></div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">Groupe 9</div>
                                        <div className="text-sm text-gray-500">Développeurs</div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    "Notre mission est de simplifier la communication d'entreprise grâce à des technologies open-source robustes."
                                </p>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <span className="text-[var(--primary-color)] font-semibold tracking-wider uppercase text-sm mb-2 block">À Propos de Nous</span>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Une initiative académique devenue solution professionnelle.
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                SpringChat est né d'un projet universitaire du <strong>Groupe 9</strong> visant à explorer les limites du protocole WebSocket. Aujourd'hui, c'est une démonstration complète d'une architecture fullstack moderne.
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                Nous croyons que la communication temps réel ne devrait pas être complexe. En combinant la robustesse de Java Spring Boot avec la réactivité de React, nous offrons une expérience fluide et instantanée.
                            </p>
                            
                            <div className="border-l-4 border-[var(--primary-color)] pl-6 py-2 bg-gray-50 dark:bg-slate-800/50 rounded-r-lg">
                                <p className="italic text-gray-700 dark:text-gray-300 font-medium">
                                    "La simplicité est la sophistication suprême." - Léonard de Vinci
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* Footer */}
             <footer className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                         <div className="flex items-center gap-2 font-bold text-2xl mb-4 md:mb-0">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <div className="icon-message-circle text-xl"></div>
                            </div>
                            SpringChat
                        </div>
                        <div className="flex gap-8 text-gray-400">
                            <a href="#" className="hover:text-white transition-colors">Documentation</a>
                            <a href="#" className="hover:text-white transition-colors">Support</a>
                            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                        <p>© 2025 SpringChat. Projet Académique - Groupe 9. Tous droits réservés.</p>
                    </div>
                </div>
             </footer>
        </div>
    );
}