import React from 'react'

interface Props {
    videoRef: React.RefObject<HTMLVideoElement | null>
    currentVideoIndex: number
    setCurrentVideoIndex: React.Dispatch<React.SetStateAction<number>>
    videoLoaded: boolean;
    handleVideoLoad: () => void;
    handleVideoError: () => void
    videos: string[];
    videoError: boolean
    onOpenRegistrationModal: () => void;
}

export const Hero = ({
    videoRef,
    currentVideoIndex,
    setCurrentVideoIndex,
    handleVideoLoad,
    videoLoaded,
    handleVideoError,
    videos,
    videoError,
    // onOpenRegistrationModal
}: Props) => {

    const handleVideoSwitch = (index: number) => {
        setCurrentVideoIndex(index);
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-rose-50 to-red-50 overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0">
                <video
                    ref={videoRef}
                    key={currentVideoIndex}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-60' : 'opacity-0'
                        }`}
                    onLoadedData={handleVideoLoad}
                    onError={handleVideoError}
                >
                    <source src={videos[currentVideoIndex]} type="video/mp4" />
                </video>

                {/* Loading Animation */}
                {!videoLoaded && !videoError && (
                    <div className="absolute inset-0 bg-linear-to-br from-rose-50 to-red-50 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-pulse text-rose-400 text-6xl mb-4">🏐</div>
                            <p className="text-rose-600/60 text-sm font-light">
                                Chargement...
                            </p>
                        </div>
                    </div>
                )}

                {/* Fallback Background */}
                {videoError && (
                    <div className="absolute inset-0 bg-linear-to-br from-rose-50 to-red-50">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fb7185%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-white/40 via-transparent to-white/20"></div>
            </div>

            {/* Hero Content */}
            <div className="relative container mx-auto px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    {/* Main Title */}
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            <span className="bg-linear-to-r from-rose-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
                                SherVy
                            </span>
                        </h1>

                        {/* Tagline */}
                        <p className="text-xl text-gray-700 mb-8 font-light leading-relaxed max-w-2xl mx-auto">
                            Où la <span className="text-rose-600 font-medium">passion</span> rencontre l'
                            <span className="text-red-600 font-medium">amitié</span> sur le terrain
                        </p>
                        
                        {/* Tournament Dates Banner */}
                        <div className="inline-flex items-center justify-center space-x-6 mb-8 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-rose-100">
                            <div className="text-center">
                                <div className="text-sm text-rose-700 font-semibold">Tournoi Mixte</div>
                                <div className="text-xs text-gray-600">28 mars 2026</div>
                            </div>
                            <div className="h-6 w-px bg-rose-200"></div>
                            <div className="text-center">
                                <div className="text-sm text-rose-700 font-semibold">Tournoi Féminin</div>
                                <div className="text-xs text-gray-600">5 avril 2026</div>
                            </div>
                        </div>
                    </div>

                    {/* Tournament Info Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
                        {/* Mixed Tournament Card */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-rose-100 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Tournoi Mixte</h3>
                                <div className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                                    6x6
                                </div>
                            </div>
                            <div className="space-y-3 text-left">
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Samedi 28 mars 2026    • 8:00 AM</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>La Ruche - Magog</span>
                                </div>
                                <div className="text-sm text-gray-700 mt-4">
                                    <div className="font-medium mb-1">Places disponibles:</div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">B: 6 équipes</span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">C: 8 équipes</span>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">C-: 8 équipes</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Female Tournament Card */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-rose-100 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Tournoi Féminin</h3>
                                <div className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                                    6x6
                                </div>
                            </div>
                            <div className="space-y-3 text-left">
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Dimanche 5 avril 2026 • 8:00 AM</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Seminaire de Sherbrooke</span>
                                </div>
                                <div className="text-sm text-gray-700 mt-4">
                                    <div className="font-medium mb-1">Places disponibles:</div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">B: 8 équipes</span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">C: 8 équipes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
<<<<<<< Updated upstream

                        {/* TOURNOI BUTTON */}

                        {/* <button className="bg-linear-to-r from-rose-400 to-red-400 px-8 py-3 rounded-xl font-medium text-white hover:from-rose-500 hover:to-red-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                            <span>Tournoi du 7 Décembre</span>
                        </button> */}
                        {/* <button className="border border-rose-400 px-8 py-3 rounded-xl font-medium text-rose-600 hover:bg-rose-50 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                            <span>Voir le Calendrier</span>
=======
                        {/* <button 
                            onClick={onOpenRegistrationModal}
                            className="bg-linear-to-r from-rose-400 to-red-400 px-8 py-4 rounded-xl font-medium text-white hover:from-rose-500 hover:to-red-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 group"
                        > */}
                            {/* <span className="text-lg">S'inscrire Maintenant</span> */}
                            {/* <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
>>>>>>> Stashed changes
                        </button> */}
                        
                        {/* <a 
                            href="#tournois"
                            className="border border-rose-400 px-8 py-4 rounded-xl font-medium text-rose-600 hover:bg-rose-50 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                        >
                            <span className="text-lg">Plus d'Informations</span>
                        </a> */}
                    </div>

                    {/* Pricing Info */}
                    <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 inline-block border border-rose-100">
                        <div className="flex items-center space-x-2 text-gray-700">
                            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">Frais d'inscription:</span>
                            <span className="text-lg font-bold text-rose-600">240$ par équipe</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Progress Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {videos.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleVideoSwitch(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentVideoIndex
                                ? 'bg-rose-500 scale-125'
                                : 'bg-rose-300 hover:bg-rose-400'
                            }`}
                    />
                ))}
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    )
}