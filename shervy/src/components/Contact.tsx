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
                        minute: '2-digit'
                    })
                },
                {
                    publicKey: "wasMvBKZBM2FCSTMD" // Your EmailJS public key
                }
            );

            alert('Merci! Votre message a été envoyé. Nous vous répondrons bientôt! 📧');
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error('Email error:', error);
            alert('Erreur lors de l\'envoi. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-20 bg-rose-50/30">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                        Contactez-nous
                    </h2>
                    <p className="text-lg text-gray-600">
                        Des questions sur la ligue? Nous serions ravis de vous entendre!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                            Coordonnées
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Pour toute information sur les inscriptions, les commandites ou la
                            ligue, n'hésitez pas à nous joindre :
                        </p>

                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-center space-x-3">
                                <span className="text-rose-500">📞</span>
                                <span>+1 (819) 555-1234</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <span className="text-rose-500">📧</span>
                                <span>admin@shervy.ca</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <span className="text-rose-500">📍</span>
                                <span>Sherbrooke, QC</span>
                            </li>
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Prénom"
                                required
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Nom"
                                required
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Adresse courriel"
                            required
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300"
                        />
                        <textarea
                            name="message"
                            placeholder="Votre message..."
                            rows={4}
                            required
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300 resize-none"
                        ></textarea>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-linear-to-r from-rose-400 to-red-400 text-white py-2.5 rounded-lg font-medium hover:from-rose-500 hover:to-red-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};