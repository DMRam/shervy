import { useState } from 'react';
import emailjs from '@emailjs/browser';

export const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const data = Object.fromEntries(formData);

        try {
            await emailjs.send(
                'service_wxjdnld',
                'template_ha6b5uj',
                {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    email: data.email,
                    message: data.message,
                    date: new Date().toLocaleString('fr-CA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                },
                {
                    publicKey: 'wasMvBKZBM2FCSTMD',
                }
            );

            alert('Merci! Votre message a été envoyé. Nous vous répondrons bientôt! 📧');
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error('Email error:', error);
            alert("Erreur lors de l'envoi. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-20">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-14">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-rose-300/80 mb-3">
                        Contact
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-white">
                        Contactez-nous
                    </h2>
                    <p className="text-base md:text-lg text-white/65 max-w-2xl mx-auto">
                        Pour les inscriptions, les commandites ou toute question liée à SherVy,
                        nous serons heureux de vous répondre.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left info panel */}
                    <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-7 shadow-[0_20px_60px_-30px_rgba(244,63,94,0.20)]">
                        <h3 className="text-xl font-semibold text-white mb-5">
                            Coordonnées
                        </h3>

                        <p className="text-white/65 mb-8 leading-7">
                            Pour toute information sur les inscriptions, les partenariats ou
                            l’organisation des tournois, n’hésitez pas à nous écrire.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                                <span className="text-rose-300 text-lg">📧</span>
                                <div>
                                    <p className="text-sm text-white/45">Courriel</p>
                                    <p className="text-white font-medium">admin@shervy.ca</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                                <span className="text-rose-300 text-lg">📍</span>
                                <div>
                                    <p className="text-sm text-white/45">Région</p>
                                    <p className="text-white font-medium">Sherbrooke, QC</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 rounded-2xl border border-rose-400/15 bg-rose-400/8 px-4 py-4">
                            <p className="text-sm text-white/70 leading-6">
                                Nous faisons de notre mieux pour répondre rapidement, surtout
                                pendant les périodes d’inscription.
                            </p>
                        </div>
                    </div>

                    {/* Form panel */}
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-7 shadow-[0_20px_60px_-30px_rgba(244,63,94,0.20)] space-y-4"
                    >
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Prénom"
                                required
                                className="w-full px-4 py-3 bg-white/6 border border-white/10 rounded-2xl text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-transparent transition-all duration-300"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Nom"
                                required
                                className="w-full px-4 py-3 bg-white/6 border border-white/10 rounded-2xl text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-transparent transition-all duration-300"
                            />
                        </div>

                        <input
                            type="email"
                            name="email"
                            placeholder="Adresse courriel"
                            required
                            className="w-full px-4 py-3 bg-white/6 border border-white/10 rounded-2xl text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-transparent transition-all duration-300"
                        />

                        <textarea
                            name="message"
                            placeholder="Votre message..."
                            rows={5}
                            required
                            className="w-full px-4 py-3 bg-white/6 border border-white/10 rounded-2xl text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-transparent transition-all duration-300 resize-none"
                        ></textarea>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-linear-to-r from-rose-400 to-red-400 text-white py-3 rounded-2xl font-medium hover:from-rose-500 hover:to-red-500 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};