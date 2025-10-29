import { useState, useEffect } from "react";

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleExternalClick = () => {
        setShowInfoModal(true);
    };

    const handleConfirmRegistration = () => {
        setLoading(true);
        setTimeout(() => {
            window.open(
                "https://www.myteam.click/leaguelist/68f9515456d0a2b52b78a677/68f9515456d0a2b52b78a678",
                "_blank",
                "noopener,noreferrer"
            );
            setLoading(false);
            setShowInfoModal(false);
        }, 700);
    };

    return (
        <>
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
                    ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-rose-100"
                    : "bg-black/10 backdrop-blur-md border-b border-white/20"
                    }`}
            >
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center space-x-3 group cursor-pointer">
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 ${scrolled
                                    ? "bg-linear-to-br from-rose-400 to-red-400 shadow-sm"
                                    : "bg-linear-to-br from-rose-500 to-red-500 shadow-lg shadow-rose-500/30"
                                    }`}
                            >
                                <span className="font-semibold text-white text-lg">SV</span>
                            </div>
                            <div className="flex flex-col">
                                <span
                                    className={`text-2xl font-light tracking-tight transition-colors duration-500 ${scrolled
                                        ? "bg-linear-to-r from-rose-500 to-red-500 bg-clip-text text-transparent"
                                        : "text-gray-700"
                                        }`}
                                >
                                    SherVy
                                </span>
                                <span
                                    className={`text-xs tracking-wider transition-colors duration-500 ${scrolled ? "text-rose-500" : "text-gray-700"
                                        }`}
                                >
                                    VOLLEYBALL
                                </span>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden lg:flex space-x-8">
                            {["Accueil", "Tournois", "Contact"].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className={`transition-all duration-300 font-medium relative group ${scrolled
                                        ? "text-gray-600 hover:text-rose-500"
                                        : "text-gray-700 hover:text-rose-100"
                                        }`}
                                >
                                    <span className="relative z-10">{item}</span>
                                    <span
                                        className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ease-out ${scrolled ? "bg-rose-400" : "bg-rose-200"
                                            }`}
                                    ></span>
                                </a>
                            ))}
                        </div>

                        {/* Register Button (Desktop) */}
                        <button
                            onClick={handleExternalClick}
                            className={`hidden lg:block px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${scrolled
                                ? "bg-linear-to-r from-rose-400 to-red-400 text-white hover:from-rose-500 hover:to-red-500 hover:shadow-lg transform hover:scale-105"
                                : "bg-rose-400 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:shadow-lg transform hover:scale-105"
                                }`}
                        >
                            Inscrire Équipe
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`lg:hidden p-2 transition-colors duration-300 ${scrolled ? "text-gray-600" : "text-white"
                                }`}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div
                            className={`lg:hidden mt-4 pb-4 border-t pt-4 ${scrolled ? "border-rose-200/20" : "border-white/20"
                                }`}
                        >
                            <div className="flex flex-col space-y-3">
                                {["Accueil", "Tournois", "Contact"].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        className={`transition-colors font-medium py-2 px-4 rounded-lg ${scrolled
                                            ? "text-gray-600 hover:bg-rose-50"
                                            : "text-white hover:bg-white/10"
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item}
                                    </a>
                                ))}

                                {/* Register Button (Mobile) */}
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        handleExternalClick();
                                    }}
                                    className={`px-6 py-3 rounded-lg font-medium text-center transition-all duration-300 ${scrolled
                                        ? "bg-linear-to-r from-rose-400 to-red-400 text-white hover:from-rose-500 hover:to-red-500"
                                        : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                                        }`}
                                >
                                    Inscrire Équipe
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Information Modal */}
            {showInfoModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-rose-100">
                        {/* Modal Header */}
                        <div className="bg-linear-to-r from-rose-500 to-red-500 rounded-t-2xl p-6 text-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-light mb-2">Avant de continuer...</h2>
                                    <p className="text-rose-100/90 text-sm">
                                        Informations importantes sur le tournoi
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowInfoModal(false)}
                                    className="text-rose-100 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-rose-500/30"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Skill Level Info */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium text-gray-800">
                                    Catégorie C/C+
                                </h3>
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <p className="text-amber-700 text-sm">
                                        Maîtriser un 70% les techniques de volleyball, joueurs qui ont déjà joués dans de ligues récréatives.
                                        Aucun joueur de calibre universitaire, AAA, AA, A, ne peut pas jouer dans cette catégorie.
                                    </p>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium text-gray-800">
                                    Paiement
                                </h3>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-blue-700 text-sm font-semibold mb-2">
                                        Envoyer le paiement à:
                                    </p>
                                    <p className="text-blue-700 text-sm">
                                        <strong>admin@shervy.ca</strong>
                                    </p>
                                    <p className="text-blue-700 text-sm mt-1">
                                        Mot de passe: <strong>SHERVY1</strong>
                                    </p>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="text-center text-sm text-gray-600 border-t border-gray-100 pt-4">
                                Questions? <strong>contact@shervy.ca</strong>
                            </div>
                        </div>

                        {/* Modal Footer - Two Rows */}
                        <div className="p-6 border-t border-rose-100">
                            <div className="space-y-3">
                                <button
                                    onClick={handleConfirmRegistration}
                                    disabled={loading}
                                    className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${loading
                                            ? "bg-gray-400 text-white cursor-wait"
                                            : "bg-linear-to-r from-rose-400 to-red-400 text-white hover:from-rose-500 hover:to-red-500 hover:shadow-lg"
                                        }`}
                                >
                                    {loading ? "Redirection..." : "Continuer vers l'inscription"}
                                </button>
                                <button
                                    onClick={() => setShowInfoModal(false)}
                                    className="w-full py-2.5 border border-rose-300 text-rose-700 rounded-lg hover:bg-rose-50 transition-all duration-300 font-medium"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};