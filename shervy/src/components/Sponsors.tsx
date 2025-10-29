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
            color: "from-blue-400 to-cyan-400",
            link: "https://envolley.ca",
        },
        {
            name: "SherDev",
            category: "Partenaire technologique officiel",
            icon: <Code2 className="w-7 h-7 text-blue-700" />,
            description:
                "SherDev est une entreprise de développement basée à Sherbrooke, spécialisée en conception d’applications web, mobiles et solutions cloud. Elle soutient la ligue SherVy avec des outils modernes pour la gestion, les inscriptions et la visibilité.",
            color: "from-green-400 to-emerald-400",
            link: "https://sherdev.com",
        },
    ];

    return (
        <section
            id="sponsors"
            className="py-24 bg-linear-to-b from-white via-rose-50/40 to-white"
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
                    <h3 className="text-4xl font-bold text-gray-800 mb-4 flex justify-center items-center gap-3">
                        <HeartHandshake className="text-rose-500 w-8 h-8" />
                        Nos Partenaires
                    </h3>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
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
                            className="group transform hover:scale-[1.03] transition-all duration-300"
                        >
                            <div
                                className={`p-0.5 rounded-3xl bg-linear-to-br ${sponsor.color} shadow-lg hover:shadow-xl`}
                            >
                                <div className="bg-white rounded-3xl p-8 h-full flex flex-col text-center relative overflow-hidden">
                                    {/* Logo / Icon */}
                                    <div className="flex justify-center items-center w-16 h-16 mx-auto mb-4 rounded-xl bg-linear-to-br from-gray-100 to-gray-50 shadow-inner">
                                        {sponsor.logo ? (
                                            <span className="text-4xl">{sponsor.logo}</span>
                                        ) : (
                                            sponsor.icon
                                        )}
                                    </div>

                                    {/* Info */}
                                    <h4 className="text-xl font-semibold text-gray-800 mb-1">
                                        {sponsor.name}
                                    </h4>
                                    <p className="text-gray-500 text-sm font-medium mb-3">
                                        {sponsor.category}
                                    </p>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        {sponsor.description}
                                    </p>

                                    {/* Link (optional for SherDev) */}
                                    {sponsor.link && (
                                        <a
                                            href={sponsor.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 text-rose-600 text-sm font-semibold hover:text-rose-700 transition-all duration-300"
                                        >
                                            <ExternalLink className="w-4 h-4" /> Visiter le site
                                        </a>
                                    )}
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
                    <div className="bg-linear-to-r from-rose-600 to-pink-500 rounded-3xl p-10 max-w-2xl mx-auto shadow-xl text-white">
                        <h4 className="text-2xl font-semibold mb-3 flex justify-center items-center gap-2">
                            <Star className="w-6 h-6 text-white/90" /> Devenez partenaire de la ligue !
                        </h4>
                        <p className="text-rose-100 mb-6 max-w-md mx-auto">
                            Rejoignez la famille SherVy et contribuez au développement du volleyball amateur dans la région.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                            <a
                                href="mailto:admin@shervy.ca?subject=Partenariat%20avec%20SherVy%20Volleyball"
                                className="flex items-center gap-2 bg-white text-rose-600 px-6 py-2.5 rounded-lg font-medium hover:bg-rose-50 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                            >
                                <Mail className="w-4 h-4" /> Devenir Partenaire
                            </a>
                            {/* <a
                                href="#"
                                className="bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-lg font-medium hover:bg-white/30 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                            >
                                Voir les avantages
                            </a> */}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
