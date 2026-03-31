import { useEffect, useState } from "react";
import logo from "../assets/logo/Logo SherVy-3.svg";

const PROMO_TOURNAMENT_URL =
    "https://myteam.click/tournamentview/6977bbdd5261fd07c37103b6";

const NAV_ITEMS = [
    { label: "Accueil", href: "#accueil" },
    { label: "Tournois", href: "#tournois" },
    { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (href: string) => {
        const targetId = href.replace("#", "");
        const target = document.getElementById(targetId);

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        setIsMenuOpen(false);
    };

    const handleRegisterClick = () => {
        setLoading(true);

        setTimeout(() => {
            window.open(PROMO_TOURNAMENT_URL, "_blank", "noopener,noreferrer");
            setLoading(false);
            setIsMenuOpen(false);
        }, 500);
    };

    const handleLogoClick = () => {
        scrollToSection("#accueil");
    };

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
                ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-rose-100"
                : "bg-black/20 backdrop-blur-md border-b border-white/20"
                }`}
        >
            {!scrolled && (
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-y-0 left-0 w-[28%] bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
                </div>
            )}
            <div className="container mx-auto px-4 sm:px-6 py-4">
                <div className="flex justify-between items-center gap-4">
                    {/* Logo */}
                    <button
                        onClick={handleLogoClick}
                        className="flex items-center space-x-3 group cursor-pointer text-left"
                        aria-label="Retour à l'accueil"
                    >
                        <img
                            src={logo}
                            alt="SherVy Logo"
                            className={`h-22 w-auto transition-all duration-500 group-hover:scale-105 ${scrolled ? "opacity-90" : "opacity-100"
                                }`}
                        />


                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => scrollToSection(item.href)}
                                className={`transition-all duration-300 font-medium relative group ${scrolled
                                    ? "text-gray-600 hover:text-rose-500"
                                    : "text-white hover:text-rose-100"
                                    }`}
                            >
                                <span className="relative z-10">{item.label}</span>
                                <span
                                    className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ease-out ${scrolled ? "bg-rose-400" : "bg-rose-200"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <button
                        onClick={handleRegisterClick}
                        disabled={loading}
                        className={`hidden lg:block px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${loading
                            ? "bg-rose-200 text-rose-600 cursor-wait"
                            : scrolled
                                ? "bg-linear-to-r from-rose-400 to-red-400 text-white hover:from-rose-500 hover:to-red-500 hover:shadow-lg transform hover:scale-105"
                                : "bg-rose-400 text-white border border-white/30 hover:bg-rose-500 hover:shadow-lg transform hover:scale-105"
                            }`}
                    >
                        {loading ? "Redirection..." : "Inscrire Équipe"}
                    </button>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className={`lg:hidden p-2 transition-colors duration-300 ${scrolled ? "text-gray-700" : "text-white"
                            }`}
                        aria-label="Ouvrir le menu"
                    >
                        {isMenuOpen ? (
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
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
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
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div
                        className={`lg:hidden mt-4 pb-4 border-t pt-4 ${scrolled ? "border-rose-200/40" : "border-white/20"
                            }`}
                    >
                        <div className="flex flex-col space-y-3">
                            {NAV_ITEMS.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => scrollToSection(item.href)}
                                    className={`text-left font-medium py-3 px-4 rounded-lg transition-colors ${scrolled
                                        ? "text-gray-700 hover:bg-rose-50"
                                        : "text-white hover:bg-white/10"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}

                            <button
                                onClick={handleRegisterClick}
                                disabled={loading}
                                className={`px-6 py-3 rounded-lg font-medium text-center transition-all duration-300 ${loading
                                    ? "bg-rose-200 text-rose-600 cursor-wait"
                                    : scrolled
                                        ? "bg-linear-to-r from-rose-400 to-red-400 text-white hover:from-rose-500 hover:to-red-500"
                                        : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                                    }`}
                            >
                                {loading ? "Redirection..." : "Inscrire Équipe"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};