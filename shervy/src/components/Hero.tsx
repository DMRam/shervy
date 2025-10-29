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
}

export const Hero = ({
    videoRef,
    currentVideoIndex,
    setCurrentVideoIndex,
    handleVideoLoad,
    videoLoaded,
    handleVideoError,
    videos,
    videoError
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
                    className={`w-full h-full object-cover transition-opacity duration-1000 ${
                        videoLoaded ? 'opacity-60' : 'opacity-0'
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

                        {/* Subtitle */}
                        {/* <div className="mb-6">
                            <p className="text-lg font-light tracking-wide text-rose-700/80 uppercase">
                                Ligue de Volleyball Amateur
                            </p>
                        </div> */}

                        {/* Tagline */}
                        <p className="text-xl text-gray-700 mb-8 font-light leading-relaxed max-w-2xl mx-auto">
                            Où la <span className="text-rose-600 font-medium">passion</span> rencontre l'
                            <span className="text-red-600 font-medium">amitié</span> sur le terrain
                        </p>
                    </div>

                    {/* Stats Bar */}
                    {/* <div className="flex justify-center items-center space-x-8 mb-8">
                        {[
                            { number: '16+', label: 'Équipes' },
                            { number: '3', label: 'Divisions' },
                            { number: '100%', label: 'Plaisir' }
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl font-semibold text-rose-600">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div> */}

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="bg-linear-to-r from-rose-400 to-red-400 px-8 py-3 rounded-xl font-medium text-white hover:from-rose-500 hover:to-red-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                            <span>Tournoi du 7 Décembre</span>
                        </button>
                        {/* <button className="border border-rose-400 px-8 py-3 rounded-xl font-medium text-rose-600 hover:bg-rose-50 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                            <span>Voir le Calendrier</span>
                        </button> */}
                    </div>
                </div>
            </div>

            {/* Video Progress Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {videos.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleVideoSwitch(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentVideoIndex
                                ? 'bg-rose-500 scale-125'
                                : 'bg-rose-300 hover:bg-rose-400'
                        }`}
                    />
                ))}
            </div>
        </section>
    )
}