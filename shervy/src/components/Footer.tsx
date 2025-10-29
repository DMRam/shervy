export const Footer = () => {
    return (
        <footer className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-t border-rose-100/10">
            <div className="container mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10 mb-12">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center space-x-3 mb-5">
                            <div className="w-12 h-12 bg-linear-to-br from-rose-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                                <span className="font-semibold text-white text-lg">SV</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-light bg-linear-to-r from-rose-200 to-rose-400 bg-clip-text text-transparent">
                                    SherVy
                                </h3>
                                <p className="text-xs tracking-wider text-rose-300">VOLLEYBALL</p>
                            </div>
                        </div>
                        <p className="text-rose-100/80 text-sm leading-relaxed max-w-xs">
                            Une communauté où la passion du volleyball unit les cœurs de Sherbrooke.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-rose-100 mb-4">Navigation</h4>
                        <div className="space-y-2">
                            {["Accueil", "Tournois", "Contact"].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="block text-rose-200/80 hover:text-white transition-colors duration-300 text-sm"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* League Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-rose-100 mb-4">Informations</h4>
                        <div className="space-y-2">
                            <a
                                href="#"
                                className="block text-rose-200/80 hover:text-white transition-colors duration-300 text-sm"
                            >
                                Règlements & Politiques
                            </a>
                            <a
                                href="https://www.myteam.click/leaguelist/68f9515456d0a2b52b78a677/68f9515456d0a2b52b78a678"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-rose-200/80 hover:text-white transition-colors duration-300 text-sm"
                            >
                                Inscription d’Équipe
                            </a>
                            <a
                                href="#sponsors"
                                className="block text-rose-200/80 hover:text-white transition-colors duration-300 text-sm"
                            >
                                Devenir Partenaire
                            </a>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-rose-100 mb-4">Coordonnées</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-rose-500/20 rounded-lg flex items-center justify-center">
                                    📍
                                </div>
                                <p className="text-rose-100">Sherbrooke, Québec</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-rose-500/20 rounded-lg flex items-center justify-center">
                                    📞
                                </div>
                                <p className="text-rose-100">+1 (819) 555-1234</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-rose-500/20 rounded-lg flex items-center justify-center">
                                    ✉️
                                </div>
                                <a
                                    href="mailto:admin@shervy.ca"
                                    className="text-rose-100 hover:text-rose-200 transition-colors"
                                >
                                    admin@shervy.ca
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-rose-300/70">
                    <p>© 2024 SherVy Volleyball — Fait avec ❤️ pour Sherbrooke.</p>
                    <p className="mt-3 md:mt-0">Conçu par SherDev ⚡</p>
                </div>
            </div>
        </footer>
    );
};
