import React, { useState } from 'react'

interface Props {
    videoRef: React.RefObject<HTMLVideoElement | null>
    currentVideoIndex: number
    setCurrentVideoIndex: React.Dispatch<React.SetStateAction<number>>
    videoLoaded: boolean
    handleVideoLoad: () => void
    handleVideoError: () => void
    videos: string[]
    videoError: boolean
}

const PROMO_TOURNAMENT_URL =
    'https://myteam.click/tournamentview/6977bbdd5261fd07c37103b6'

export const Hero = ({
    videoRef,
    currentVideoIndex,
    setCurrentVideoIndex,
    handleVideoLoad,
    videoLoaded,
    handleVideoError,
    videos,
    videoError,
}: Props) => {
    const [loading, setLoading] = useState(false)

    const handleVideoSwitch = (index: number) => {
        setCurrentVideoIndex(index)
    }

    const handleRegisterClick = () => {
        setLoading(true)

        setTimeout(() => {
            window.open(PROMO_TOURNAMENT_URL, '_blank', 'noopener,noreferrer')
            setLoading(false)
        }, 500)
    }

    const handleScrollToGallery = () => {
        document.getElementById('galerie')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }

    return (
        <section
            id="accueil"
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-rose-950/80 to-orange-950/70"
        >
            {/* Video Background */}
            <div className="absolute inset-0">
                <video
                    ref={videoRef}
                    key={currentVideoIndex}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-40' : 'opacity-0'
                        }`}
                    onLoadedData={handleVideoLoad}
                    onError={handleVideoError}
                >
                    <source src={videos[currentVideoIndex]} type="video/mp4" />
                </video>

                {!videoLoaded && !videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-slate-950 via-rose-950 to-orange-950">
                        <div className="text-center">
                            <div className="mb-4 text-6xl animate-pulse">🏐</div>
                            <p className="text-sm font-light text-white/70">Chargement...</p>
                        </div>
                    </div>
                )}

                {videoError && (
                    <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-rose-950 to-orange-950">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
                    </div>
                )}

                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-0 bg-linear-to-b from-black/35 via-black/20 to-black/55" />
            </div>

            {/* Decorative Glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-500/20 blur-3xl" />
                <div className="absolute bottom-16 right-10 h-52 w-52 rounded-full bg-orange-400/10 blur-3xl" />
                <div className="absolute bottom-24 left-10 h-52 w-52 rounded-full bg-red-400/10 blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 pt-28 pb-16 mt-10">
                <div className="mx-auto max-w-6xl">
                    <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
                        {/* Left */}
                        <div className="text-center lg:text-left">
                            <div className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                                <span className="text-sm font-medium text-white/90">
                                    Tournoi promotionné • SherVy 3
                                </span>
                            </div>

                            <h1 className="mb-5 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                                SherVy <span className="text-rose-300">3</span>
                            </h1>

                            <p className="mb-4 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
                                Un tournoi féminin 6x6 pensé pour offrir une ambiance compétitive,
                                conviviale et bien organisée à Sherbrooke.
                            </p>

                            <p className="mb-8 max-w-2xl text-base leading-7 text-white/70">
                                Division B et C, places limitées, inscription à 240$ par équipe.
                                Réservez votre place pendant qu’il reste encore de la disponibilité.
                            </p>

                            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                                <button
                                    onClick={handleRegisterClick}
                                    disabled={loading}
                                    className={`rounded-2xl px-8 py-4 font-semibold transition-all duration-300 ${loading
                                            ? 'cursor-wait bg-white/60 text-rose-600'
                                            : 'bg-white text-rose-700 shadow-xl hover:scale-[1.02] hover:bg-rose-50'
                                        }`}
                                >
                                    {loading ? 'Redirection...' : "Inscrire mon équipe"}
                                </button>

                                <button
                                    onClick={handleScrollToGallery}
                                    className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                                >
                                    Voir la galerie
                                </button>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                                    <div className="text-sm text-white/60">Date</div>
                                    <div className="mt-1 text-lg font-semibold text-white">5 avril 2026</div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                                    <div className="text-sm text-white/60">Lieu</div>
                                    <div className="mt-1 text-lg font-semibold text-white">
                                        Séminaire de Sherbrooke
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                                    <div className="text-sm text-white/60">Format</div>
                                    <div className="mt-1 text-lg font-semibold text-white">6x6 Women B / C</div>
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="mx-auto w-full max-w-xl">
                            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
                                <div className="border-b border-white/10 bg-white/5 px-6 py-5">
                                    <p className="text-sm uppercase tracking-[0.18em] text-rose-200/80">
                                        Prochain événement
                                    </p>
                                    <h2 className="mt-2 text-3xl font-bold text-white">Tournoi Féminin</h2>
                                </div>

                                <div className="space-y-6 p-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-black/15 p-4">
                                            <div className="text-sm text-white/60">Quand</div>
                                            <div className="mt-1 text-lg font-semibold text-white">
                                                Dimanche 5 avril • 8:00 AM
                                            </div>
                                        </div>

                                        <div className="rounded-2xl bg-black/15 p-4">
                                            <div className="text-sm text-white/60">Coût</div>
                                            <div className="mt-1 text-lg font-semibold text-white">
                                                240$ par équipe
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-black/15 p-4">
                                        <div className="mb-3 text-sm text-white/60">Disponibilités</div>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="mb-2 flex items-center justify-between text-sm text-white">
                                                    <span className="font-medium">6x6 Women B</span>
                                                    <span className="text-rose-200">4 / 8</span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                                    <div className="h-full w-1/2 rounded-full bg-linear-to-r from-yellow-300 to-cyan-300" />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="mb-2 flex items-center justify-between text-sm text-white">
                                                    <span className="font-medium">6x6 Women C</span>
                                                    <span className="text-rose-200">3 / 8</span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                                    <div className="h-full w-[37.5%] rounded-full bg-linear-to-r from-lime-300 to-cyan-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-black/15 p-4">
                                        <div className="mb-2 text-sm text-white/60">Résumé</div>
                                        <p className="text-sm leading-7 text-white/85">
                                            B: joueuses de ligues compétitives, collégial AA actifs,
                                            collégial AAA ou universitaire inactives depuis 5 ans.
                                            C: ligues récréatives et collégial AA inactif depuis 5 ans.
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <button
                                            onClick={handleRegisterClick}
                                            disabled={loading}
                                            className={`flex-1 rounded-2xl px-6 py-3.5 font-semibold transition ${loading
                                                    ? 'cursor-wait bg-white/50 text-rose-700'
                                                    : 'bg-linear-to-r from-rose-400 to-red-400 text-white hover:from-rose-500 hover:to-red-500'
                                                }`}
                                        >
                                            {loading ? 'Redirection...' : 'Register a team'}
                                        </button>

                                        <a
                                            href="mailto:contact@shervy.ca"
                                            className="rounded-2xl border border-white/15 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-white/10"
                                        >
                                            Contact
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Progress Indicator */}
                    <div className="mt-10 flex justify-center space-x-2">
                        {videos.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleVideoSwitch(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${index === currentVideoIndex
                                        ? 'w-8 bg-rose-400'
                                        : 'w-2.5 bg-white/40 hover:bg-white/70'
                                    }`}
                                aria-label={`Vidéo ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}