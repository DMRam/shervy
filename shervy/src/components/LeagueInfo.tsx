import { motion } from "framer-motion";
import { useState } from "react";

export const LeagueInfo = () => {
    const [loading, setLoading] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);

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

    const features = [
        { icon: "🏐", title: "Tournois Réguliers", description: "Tournoi à Sherbrooke." },
        { icon: "👥", title: "16 Équipes", description: "8 équipes masculines + 8 équipes féminines." },
        { icon: "💰", title: "Prix", description: "$200 par équipe." },
    ];

    const upcomingTournament = {
        date: "7 Décembre 2024",
        location: "CEGEP Sherbrooke",
        time: "8h00 - 18h00",
        spots: "16 équipes max",
        price: "$200 par équipe",
        deadline: "Inscriptions avant le 1 Décembre",
    };

    return (
        <section id="league" className="relative py-24 bg-linear-to-b from-white via-rose-50 to-white">
            <div className="container mx-auto px-6">
                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                        Volleyball à Sherbrooke
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        où la passion locale prend vie.
                    </p>
                </motion.div>

                {/* TOURNAMENT HIGHLIGHT */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-linear-to-r from-rose-100 via-rose-50 to-pink-50 rounded-3xl p-10 border border-rose-200 shadow-sm mb-20 max-w-3xl mx-auto"
                >
                    <div className="text-center mb-6">
                        <div className="bg-rose-600 text-white text-sm font-semibold px-4 py-2 rounded-full inline-block mb-4 shadow-md">
                            PROCHAIN TOURNOI
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-2">
                            {upcomingTournament.date}
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 text-base">
                        <div className="space-y-3">
                            <p>📍 {upcomingTournament.location}</p>
                            <p>⏰ {upcomingTournament.time}</p>
                            <p>👥 {upcomingTournament.spots}</p>
                        </div>
                        <div className="space-y-3">
                            <p>💰 {upcomingTournament.price}</p>
                            <p>📝 {upcomingTournament.deadline}</p>
                            <p>🏆 Prix et médailles</p>
                        </div>
                    </div>
                </motion.div>

                {/* DIVISIONS */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-10">
                        Comment ça marche?
                    </h3>

                    <div className="grid md:grid-cols-2 gap-10 max-w-3xl mx-auto">
                        {[
                            { emoji: "👨", title: "Division Masculine", color: "from-blue-400 to-indigo-500" },
                            { emoji: "👩", title: "Division Féminine", color: "from-pink-400 to-rose-500" },
                        ].map((div, i) => (
                            <div
                                key={i}
                                className={`p-0.5 rounded-3xl bg-linear-to-br ${div.color} shadow-lg`}
                            >
                                <div className="bg-white rounded-3xl p-8 h-full">
                                    <div className="text-4xl mb-3">{div.emoji}</div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{div.title}</h4>
                                    <p className="text-gray-600 text-sm">8 équipes</p>
                                    <p className="text-gray-600 text-sm">Tous niveaux</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* FEATURES */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid md:grid-cols-3 gap-8 mb-24"
                >
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
                        >
                            <div className="text-4xl mb-3">{feature.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="bg-linear-to-r from-rose-600 to-pink-500 rounded-3xl p-10 shadow-xl max-w-3xl mx-auto text-white">
                        <h3 className="text-2xl font-semibold mb-4">
                            Inscrivez votre équipe dès maintenant
                        </h3>
                        <p className="text-rose-100 mb-2">
                            Places limitées
                        </p>
                        <p className="text-rose-100 mb-8">
                            Premier arrivé, premier servi
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleExternalClick}
                                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-white text-rose-600 hover:bg-rose-50"
                            >
                                Réserver notre place
                            </button>
                            <button
                                onClick={() =>
                                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                                }
                                className="border border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                            >
                                Nous écrire
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Information Modal */}
            {showInfoModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-rose-100"
                    >
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

                        {/* Modal Footer */}
                        {/* Modal Footer - Two Rows */}
                        <div className="p-6 border-t border-rose-100">
                            <div className="flex flex-col space-y-3">
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
                    </motion.div>
                </div>
            )}
        </section>
    );
};