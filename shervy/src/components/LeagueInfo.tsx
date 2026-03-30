import { motion } from "framer-motion";
import { useState } from "react";
// import { useState } from "react";

interface LeagueInfoProps {
    onOpenRegistrationModal: () => void;
}

export const LeagueInfo = ({  }: LeagueInfoProps) => {

    const [loading, setLoading] = useState(false);
    const [selectedGender, setSelectedGender] = useState<"mixed" | "female">("mixed");
    const [showInfoModal, setShowInfoModal] = useState(false);



    const features = [
        { icon: "🏆", title: "Deux Tournois", description: "Tournoi mixte et tournoi féminin" },
        { icon: "👥", title: "Équipes Multiples", description: "6x6 - Plusieurs divisions disponibles" },
        { icon: "💰", title: "Prix Abordable", description: "$240 par équipe pour un tournoi d'une journée" },
        { icon: "📍", title: "Emplacements", description: "Sherbrooke et Magog" },
        { icon: "🎯", title: "Tous Niveaux", description: "Divisions B, C et C- selon l'expérience" },
        { icon: "🤝", title: "Communauté", description: "Ambiance conviviale et compétitive" },
    ];

    const tournaments = [
        {
            id: "mixed",
            title: "Tournoi Mixte",
            date: "28 mars 2026",
            day: "Samedi",
            location: "La Ruche - Magog",
            time: "8h00 - Fin de journée",
            divisions: [
                { name: "B", spots: 6, color: "bg-amber-100 text-amber-800", description: "Compétitif" },
                { name: "C", spots: 8, color: "bg-blue-100 text-blue-800", description: "Récréatif" },
                { name: "C-", spots: 8, color: "bg-green-100 text-green-800", description: "Retrouvailles" },
            ],
            price: "$240",
            registrationEnd: "21 mars 2026",
            gradient: "from-rose-500 to-orange-500"
        },
        {
            id: "female",
            title: "Tournoi Féminin",
            date: "5 avril 2026",
            day: "Dimanche",
            location: "Seminaire de Sherbrooke",
            time: "8h00 - Fin de journée",
            divisions: [
                { name: "B", spots: 8, color: "bg-amber-100 text-amber-800", description: "Compétitif" },
                { name: "C", spots: 8, color: "bg-blue-100 text-blue-800", description: "Récréatif" },
            ],
            price: "$240",
            registrationEnd: "29 mars 2026",
            gradient: "from-purple-500 to-pink-500"
        }
    ];

    const skillLevels = [
        {
            level: "B",
            title: "Division B",
            description: "Joueurs(euses) de ligues compétitives, collégial AA actifs (ves), collégial AAA ou Universitaire inactif(ves) depuis 5 ans.",
            color: "border-amber-200 bg-amber-50",
            icon: "⚡"
        },
        {
            level: "C",
            title: "Division C",
            description: "Joueurs(euses) de ligues récréatives, collégial AA inactif (ves) depuis 5 ans.",
            color: "border-blue-200 bg-blue-50",
            icon: "🎯"
        },
        {
            level: "C-",
            title: "Division C-",
            description: "Classe Retrouvailles pour ceux qui veulent jouer pour le plaisir comme dans le temps.",
            color: "border-green-200 bg-green-50",
            icon: "🤝"
        }
    ];

    const handleConfirmRegistration = () => {
        setLoading(true);

        // URLs actualizadas con los enlaces correctos
        const registrationUrls: any = {
            mixed: "https://myteam.click/tournamentview/6977bbbd5261fd07c3710396",
            female: "https://myteam.click/tournamentview/6977bbdd5261fd07c37103b6"
        };

        setTimeout(() => {
            window.open(
                registrationUrls[selectedGender],
                "_blank",
                "noopener,noreferrer"
            );
            setLoading(false);
            setShowInfoModal(false);
        }, 700);
    };

    return (
        <section id="league" className="relative py-24 bg-linear-to-b from-white via-rose-50/30 to-white">
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
                        Nos Tournois 2026
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Deux tournois passionnants pour tous les niveaux
                    </p>
                </motion.div>

                {/* TOURNAMENTS */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid md:grid-cols-2 gap-8 mb-20"
                >
                    {tournaments.map((tournament) => (
                        <div
                            key={tournament.id}
                            className={`rounded-3xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
                        >
                            {/* Tournament Header */}
                            <div className={`bg-linear-to-r ${tournament.gradient} p-6 text-white`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
                                            {tournament.day}
                                        </div>
                                        <h3 className="text-2xl font-bold">{tournament.title}</h3>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">{tournament.price}</div>
                                        <div className="text-sm opacity-90">par équipe</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{tournament.date}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        <span>{tournament.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tournament Content */}
                            <div className="bg-white p-6">
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-700 mb-3">Divisions Disponibles</h4>
                                    <div className="space-y-2">
                                        {tournament.divisions.map((division) => (
                                            <div key={division.name} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${division.color}`}>
                                                        Division {division.name}
                                                    </span>
                                                    <span className="text-sm text-gray-600">{division.description}</span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {division.spots} équipes
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Info Row */}
                                <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
                                    <div className="flex justify-between">
                                        <span>⏰ Horaire:</span>
                                        <span className="font-medium">{tournament.time}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>📝 Fin des inscriptions:</span>
                                        <span className="font-medium">{tournament.registrationEnd}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* SKILL LEVELS */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-20"
                >
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">
                            Définitions des Niveaux
                        </h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Choisissez la division qui correspond le mieux à votre niveau d'expérience
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {skillLevels.map((level) => (
                            <div
                                key={level.level}
                                className={`rounded-2xl border-2 ${level.color} p-6 hover:shadow-lg transition-all duration-300`}
                            >
                                <div className="flex items-center mb-4">
                                    <span className="text-3xl mr-3">{level.icon}</span>
                                    <div>
                                        <div className="font-bold text-xl text-gray-800">{level.title}</div>
                                        <div className="text-sm text-gray-500">Division {level.level}</div>
                                    </div>
                                </div>
                                <p className="text-gray-700">{level.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* FEATURES */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mb-20"
                >
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">
                            Ce que nous offrons
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 text-center group"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                                    {feature.title}
                                </h4>
                                <p className="text-gray-600 text-xs">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* PAYMENT INFORMATION */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mb-20"
                >
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-8 border border-rose-200 max-w-2xl mx-auto">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Informations de Paiement
                            </h3>
                            <p className="text-gray-600">
                                Comment procéder à l'inscription et au paiement
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-rose-600 mb-2">240$</div>
                                <div className="text-gray-700">Frais d'inscription par équipe</div>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-rose-100">
                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 text-rose-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    Procédure de paiement
                                </h4>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                            1
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700">Envoyer le paiement à:</p>
                                            <p className="text-lg font-bold text-rose-600">info@shervy.ca</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                            2
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700">Mot de passe:</p>
                                            <p className="text-lg font-bold text-rose-600">shervy2</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                            3
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700">Note importante:</p>
                                            <p className="text-gray-600 text-sm">Karla gérera les paiements directement. Recevez une confirmation par courriel.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center text-sm text-gray-600">
                                Questions? <a href="mailto:contact@shervy.ca" className="text-rose-600 hover:text-rose-700 font-medium">contact@shervy.ca</a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 rounded-3xl p-10 shadow-2xl max-w-3xl mx-auto text-white relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20"></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                Prêt à vous inscrire?
                            </h3>
                            <p className="text-rose-100 mb-2 text-lg">
                                Places limitées pour chaque division
                            </p>
                            <p className="text-rose-100/80 mb-8 max-w-xl mx-auto">
                                Inscrivez votre équipe dès maintenant pour garantir votre place dans le tournoi de votre choix.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleConfirmRegistration}
                                    className="px-8 py-4 rounded-xl font-bold transition-all duration-300 bg-white text-rose-600 hover:bg-rose-50 hover:scale-105 shadow-lg"
                                >
                                    Inscrire mon équipe
                                </button>
                                <a
                                    href="mailto:contact@shervy.ca"
                                    className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-300 hover:scale-105"
                                >
                                    Nous contacter
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

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
                            {/* Gender Selection */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium text-gray-800">
                                    Sélectionnez le tournoi
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setSelectedGender("mixed")}
                                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${selectedGender === "mixed"
                                            ? "border-rose-500 bg-rose-50 text-rose-700"
                                            : "border-gray-200 hover:border-rose-300 hover:bg-rose-50/50 text-gray-700"
                                            }`}
                                    >
                                        <div className="font-medium mb-1">Tournoi Mixte</div>
                                        <div className="text-xs opacity-75">Samedi 28 mars</div>
                                        <div className="text-xs opacity-75">La Ruche - Magog</div>
                                        <div className="text-xs mt-1 font-semibold text-rose-600">6 équipes B, 8 équipes C, 8 équipes C-</div>
                                    </button>
                                    <button
                                        onClick={() => setSelectedGender("female")}
                                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${selectedGender === "female"
                                            ? "border-rose-500 bg-rose-50 text-rose-700"
                                            : "border-gray-200 hover:border-rose-300 hover:bg-rose-50/50 text-gray-700"
                                            }`}
                                    >
                                        <div className="font-medium mb-1">Tournoi Féminin</div>
                                        <div className="text-xs opacity-75">Dimanche 5 avril</div>
                                        <div className="text-xs opacity-75">Seminaire de Sherbrooke</div>
                                        <div className="text-xs mt-1 font-semibold text-rose-600">8 équipes B, 8 équipes C</div>
                                    </button>
                                </div>
                            </div>

                            {/* Category Definitions */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800">
                                    Définitions des catégories
                                </h3>

                                {/* Mixed Tournament Info */}
                                {selectedGender === "mixed" && (
                                    <div className="space-y-3">
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-amber-800 mb-2">B - 6x6 Mixte B (6 places)</h4>
                                            <p className="text-amber-700 text-sm">
                                                Joueurs(euses) de ligues compétitives, collégial AA actifs (ves), collégial AAA ou Universitaire inactif(ves) depuis 5 ans.
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-blue-800 mb-2">C - 6x6 Mixte C (8 places)</h4>
                                            <p className="text-blue-700 text-sm">
                                                Joueurs(euses) de ligues récréatives, collégial AA inactif (ves) depuis 5 ans.
                                            </p>
                                        </div>
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-green-800 mb-2">C- - 6x6 Mixte C- (8 places)</h4>
                                            <p className="text-green-700 text-sm">
                                                Classe Retrouvailles pour ceux qui veulent jouer pour le plaisir comme dans le temps.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Female Tournament Info */}
                                {selectedGender === "female" && (
                                    <div className="space-y-3">
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-amber-800 mb-2">B - 6x6 Women B (8 places)</h4>
                                            <p className="text-amber-700 text-sm">
                                                Joueurs(euses) de ligues compétitives, collégial AA actifs (ves), collégial AAA ou Universitaire inactif(ves) depuis 5 ans.
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-blue-800 mb-2">C - 6x6 Women C (8 places)</h4>
                                            <p className="text-blue-700 text-sm">
                                                Joueurs(euses) de ligues récréatives, collégial AA inactif (ves) depuis 5 ans.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Payment Info */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium text-gray-800">
                                    Informations de paiement
                                </h3>
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <p className="text-purple-700 text-sm font-semibold mb-2">
                                        Frais d'inscription : <span className="text-lg">240$</span> par équipe
                                    </p>
                                    <p className="text-purple-700 text-sm font-semibold mb-1">
                                        Envoyer le paiement à:
                                    </p>
                                    <p className="text-purple-700 text-sm">
                                        <strong>info@shervy.ca</strong>
                                    </p>
                                    <p className="text-purple-700 text-sm mt-2 font-semibold">
                                        Mot de passe: <strong>shervy2</strong>
                                    </p>
                                    <p className="text-purple-700 text-xs mt-2 opacity-75">
                                        Note: Karla gérera les paiements directement.
                                    </p>
                                </div>
                            </div>

                            {/* Tournament Details */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 mb-2">Détails du tournoi</h4>
                                <div className="text-sm text-gray-700 space-y-1">
                                    <p><span className="font-medium">Date:</span> {selectedGender === "mixed" ? "Samedi 28 mars 2026, 8:00 AM" : "Dimanche 5 avril 2026, 8:00 AM"}</p>
                                    <p><span className="font-medium">Lieu:</span> {selectedGender === "mixed" ? "La Ruche - Magog" : "Seminaire de Sherbrooke"}</p>
                                    <p><span className="font-medium">Fin des inscriptions:</span> {selectedGender === "mixed" ? "21 mars 23:55" : "29 mars 23:55"}</p>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="text-center text-sm text-gray-600 border-t border-gray-100 pt-4">
                                Questions? <strong>admin@shervy.ca</strong>
                            </div>
                        </div>

<<<<<<< Updated upstream
                        {/* Modal Footer */}
=======
                        {/* Modal Footer - Two Rows */}
>>>>>>> Stashed changes
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
                                    {loading ? "Redirection..." : `Continuer vers l'inscription ${selectedGender === "mixed" ? "Mixte" : "Féminin"}`}
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
        </section>
    );
};