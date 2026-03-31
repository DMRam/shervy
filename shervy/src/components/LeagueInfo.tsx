import { motion } from "framer-motion";
import { useState } from "react";

export const LeagueInfo = () => {
    const [loading, setLoading] = useState(false);

    const promoUrl =
        "https://myteam.click/tournamentview/6977bbdd5261fd07c37103b6";

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
                { name: "B", spots: 6, tone: "bg-amber-400/15 text-amber-200 border border-amber-300/20", description: "Compétitif" },
                { name: "C", spots: 8, tone: "bg-sky-400/15 text-sky-200 border border-sky-300/20", description: "Récréatif" },
                { name: "C-", spots: 8, tone: "bg-emerald-400/15 text-emerald-200 border border-emerald-300/20", description: "Retrouvailles" },
            ],
            price: "$240",
            registrationEnd: "21 mars 2026",
            gradient: "from-rose-400/25 to-orange-400/15",
        },
        {
            id: "female",
            title: "Tournoi Féminin",
            date: "5 avril 2026",
            day: "Dimanche",
            location: "Seminaire de Sherbrooke",
            time: "8h00 - Fin de journée",
            divisions: [
                { name: "B", spots: 8, tone: "bg-amber-400/15 text-amber-200 border border-amber-300/20", description: "Compétitif" },
                { name: "C", spots: 8, tone: "bg-sky-400/15 text-sky-200 border border-sky-300/20", description: "Récréatif" },
            ],
            price: "$240",
            registrationEnd: "29 mars 2026",
            gradient: "from-fuchsia-400/20 to-pink-400/15",
        },
    ];

    const skillLevels = [
        {
            level: "B",
            title: "Division B",
            description:
                "Joueurs(euses) de ligues compétitives, collégial AA actifs(ves), collégial AAA ou Universitaire inactif(ves) depuis 5 ans.",
            tone: "border-amber-300/20 bg-amber-400/10",
            icon: "⚡",
        },
        {
            level: "C",
            title: "Division C",
            description:
                "Joueurs(euses) de ligues récréatives, collégial AA inactif(ves) depuis 5 ans.",
            tone: "border-sky-300/20 bg-sky-400/10",
            icon: "🎯",
        },
        {
            level: "C-",
            title: "Division C-",
            description:
                "Classe Retrouvailles pour ceux qui veulent jouer pour le plaisir comme dans le temps.",
            tone: "border-emerald-300/20 bg-emerald-400/10",
            icon: "🤝",
        },
    ];

    const handlePromoRegistration = () => {
        setLoading(true);

        setTimeout(() => {
            window.open(promoUrl, "_blank", "noopener,noreferrer");
            setLoading(false);
        }, 500);
    };

    return (
        <section id="league" className="relative py-24">
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Nos Tournois 2026
                    </h2>
                    <p className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto">
                        Deux tournois passionnants pour tous les niveaux
                    </p>
                </motion.div>

                {/* Tournaments */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="grid md:grid-cols-2 gap-8 mb-20"
                >
                    {tournaments.map((tournament) => (
                        <div
                            key={tournament.id}
                            className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(244,63,94,0.22)]"
                        >
                            <div className={`bg-linear-to-r ${tournament.gradient} border-b border-white/10 p-6`}>
                                <div className="flex justify-between items-start mb-4 gap-4">
                                    <div>
                                        <div className="text-sm font-medium bg-white/10 text-white/80 px-3 py-1 rounded-full inline-block mb-3 border border-white/10">
                                            {tournament.day}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">{tournament.title}</h3>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">{tournament.price}</div>
                                        <div className="text-sm text-white/65">par équipe</div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-white/75">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{tournament.date}</span>
                                    </div>

                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        <span>{tournament.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <h4 className="font-semibold text-white mb-4">Divisions Disponibles</h4>

                                    <div className="space-y-3">
                                        {tournament.divisions.map((division) => (
                                            <div
                                                key={division.name}
                                                className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                                            >
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${division.tone}`}>
                                                        Division {division.name}
                                                    </span>
                                                    <span className="text-sm text-white/60">{division.description}</span>
                                                </div>

                                                <span className="text-sm font-medium text-white/80 whitespace-nowrap">
                                                    {division.spots} équipes
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm border-t border-white/10 pt-4">
                                    <div className="flex justify-between gap-4">
                                        <span className="text-white/50">⏰ Horaire</span>
                                        <span className="font-medium text-white/85 text-right">{tournament.time}</span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-white/50">📝 Fin des inscriptions</span>
                                        <span className="font-medium text-white/85 text-right">{tournament.registrationEnd}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Skill levels */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="mb-20"
                >
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            Définitions des Niveaux
                        </h3>
                        <p className="text-white/65 max-w-2xl mx-auto">
                            Choisissez la division qui correspond le mieux à votre niveau d'expérience
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {skillLevels.map((level) => (
                            <div
                                key={level.level}
                                className={`rounded-[24px] border ${level.tone} p-6 backdrop-blur-sm`}
                            >
                                <div className="flex items-center mb-4">
                                    <span className="text-3xl mr-3">{level.icon}</span>
                                    <div>
                                        <div className="font-bold text-xl text-white">{level.title}</div>
                                        <div className="text-sm text-white/45">Division {level.level}</div>
                                    </div>
                                </div>

                                <p className="text-white/70 leading-7">{level.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="mb-20"
                >
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            Ce que nous offrons
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-md text-center transition-all duration-300 hover:bg-white/[0.07]"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h4 className="font-semibold text-white mb-2 text-sm">
                                    {feature.title}
                                </h4>
                                <p className="text-white/55 text-xs leading-6">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Payment */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className="mb-20"
                >
                    <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 max-w-2xl mx-auto shadow-[0_20px_60px_-30px_rgba(244,63,94,0.22)]">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                Informations de Paiement
                            </h3>
                            <p className="text-white/60">
                                Comment procéder à l'inscription et au paiement
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-rose-300 mb-2">240$</div>
                                <div className="text-white/70">Frais d'inscription par équipe</div>
                            </div>

                            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6">
                                <h4 className="font-semibold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 text-rose-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    Procédure de paiement
                                </h4>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-rose-300/15 text-rose-200 rounded-full flex items-center justify-center text-sm font-bold mr-3 border border-rose-200/15">
                                            1
                                        </div>
                                        <div>
                                            <p className="font-medium text-white/80">Envoyer le paiement à:</p>
                                            <p className="text-lg font-bold text-rose-200">info@shervy.ca</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-rose-300/15 text-rose-200 rounded-full flex items-center justify-center text-sm font-bold mr-3 border border-rose-200/15">
                                            2
                                        </div>
                                        <div>
                                            <p className="font-medium text-white/80">Mot de passe:</p>
                                            <p className="text-lg font-bold text-rose-200">shervy2</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center text-sm text-white/60">
                                Questions?{" "}
                                <a
                                    href="mailto:contact@shervy.ca"
                                    className="text-rose-300 hover:text-rose-200 font-medium"
                                >
                                    contact@shervy.ca
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.55 }}
                    className="text-center"
                >
                    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_20px_60px_-30px_rgba(244,63,94,0.30)] max-w-3xl mx-auto text-white">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-rose-500/15 via-red-500/10 to-orange-500/15" />
                        <div className="pointer-events-none absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16"></div>
                        <div className="pointer-events-none absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-20 translate-y-20"></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                Prêt à vous inscrire?
                            </h3>
                            <p className="text-white/75 mb-2 text-lg">
                                Places limitées pour chaque division
                            </p>
                            <p className="text-white/60 mb-8 max-w-xl mx-auto">
                                Inscrivez votre équipe dès maintenant pour garantir votre place.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handlePromoRegistration}
                                    disabled={loading}
                                    className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg ${loading
                                            ? "bg-white/70 text-rose-500 cursor-wait"
                                            : "bg-white text-rose-600 hover:bg-rose-50"
                                        }`}
                                >
                                    {loading ? "Redirection..." : "Inscrire mon équipe"}
                                </button>

                                <a
                                    href="#contact"
                                    className="border border-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300"
                                >
                                    Nous contacter
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};