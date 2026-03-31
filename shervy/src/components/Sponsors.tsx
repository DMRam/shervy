import { motion } from "framer-motion";
import { Mail, HeartHandshake, Star, Code2, ExternalLink } from "lucide-react";

export const Sponsors = () => {
    const sponsors = [
        {
            name: "Envolley",
            category: "Club de volleyball de Sherbrooke",
            logo: "🏐",
            description:
                "Le Club Envolley regroupe plus de 2 000 passionnés de volleyball et de volleyball de plage de tous âges, encadrés par une trentaine d’entraîneurs dévoués.",
            color: "from-cyan-400/30 to-blue-500/20",
            link: "https://envolley.ca",
        },
        {
            name: "SherDev",
            category: "Partenaire technologique officiel",
            icon: <Code2 className="w-7 h-7 text-cyan-200" />,
            description:
                "SherDev est une entreprise de développement basée à Sherbrooke, spécialisée en conception d’applications web, mobiles et solutions cloud. Elle soutient SherVy avec des outils modernes pour la gestion, les inscriptions et la visibilité.",
            color: "from-emerald-400/30 to-teal-500/20",
            link: "https://sherdev.com",
        },
    ];

    return (
        <section
            id="sponsors"
            className="relative py-24"
        >
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h3 className="text-4xl font-bold text-white mb-4 flex justify-center items-center gap-3">
                        <HeartHandshake className="text-rose-300 w-8 h-8" />
                        Nos Partenaires
                    </h3>
                    <p className="text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
                        Des partenaires qui partagent notre passion et soutiennent le
                        développement du volleyball local à Sherbrooke.
                    </p>
                </motion.div>

                {/* Sponsors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-20">
                    {sponsors.map((sponsor, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="group transition-all duration-300"
                        >
                            <div
                                className={`rounded-[28px] border border-white/10 bg-linear-to-br ${sponsor.color} p-[1px] shadow-[0_20px_60px_-30px_rgba(244,63,94,0.30)]`}
                            >
                                <div className="rounded-[28px] bg-white/5 backdrop-blur-xl p-8 h-full flex flex-col text-center relative overflow-hidden border border-white/5">
                                    {/* glow */}
                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />

                                    {/* Logo / Icon */}
                                    <div className="relative z-10 flex justify-center items-center w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/10 border border-white/10 shadow-inner">
                                        {sponsor.logo ? (
                                            <span className="text-4xl">{sponsor.logo}</span>
                                        ) : (
                                            sponsor.icon
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="relative z-10">
                                        <h4 className="text-xl font-semibold text-white mb-1">
                                            {sponsor.name}
                                        </h4>
                                        <p className="text-white/45 text-sm font-medium mb-4">
                                            {sponsor.category}
                                        </p>
                                        <p className="text-white/70 text-sm leading-relaxed mb-6">
                                            {sponsor.description}
                                        </p>

                                        {sponsor.link && (
                                            <a
                                                href={sponsor.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-2 text-rose-300 text-sm font-semibold hover:text-rose-200 transition-all duration-300"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Visiter le site
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-10 max-w-2xl mx-auto shadow-[0_20px_60px_-30px_rgba(244,63,94,0.30)] text-white">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-rose-500/15 via-red-500/10 to-orange-500/15" />
                        <div className="pointer-events-none absolute -top-10 -left-10 w-32 h-32 rounded-full bg-rose-400/10 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-orange-400/10 blur-3xl" />

                        <div className="relative z-10">
                            <h4 className="text-2xl font-semibold mb-3 flex justify-center items-center gap-2">
                                <Star className="w-6 h-6 text-rose-200" />
                                Devenez partenaire de la ligue
                            </h4>
                            <p className="text-white/70 mb-6 max-w-md mx-auto">
                                Rejoignez la famille SherVy et contribuez au développement du
                                volleyball amateur dans la région.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                <a
                                    href="#contact"
                                    className="flex items-center gap-2 bg-white text-rose-700 px-6 py-3 rounded-xl font-medium hover:bg-rose-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                >
                                    <Mail className="w-4 h-4" />
                                    Devenir Partenaire
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};