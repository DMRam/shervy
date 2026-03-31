import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { Sponsors } from './components/Sponsors'
import { TournamentGallery } from './TournamentGallery'
import { LeagueInfo } from './components/LeagueInfo'
import video1 from './assets/hero_videos/v1.mp4'
import video2 from './assets/hero_videos/v2.mp4'
import video3 from './assets/hero_videos/v3.mp4'
import './firebase/firebaseInit'

function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(value)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress)
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="fixed left-0 top-0 z-[60] h-1 w-full bg-transparent">
      <div
        className="h-full bg-linear-to-r from-rose-400 via-red-400 to-orange-400 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function SectionDivider() {
  return (
    <div className="relative mx-auto h-20 w-full max-w-6xl overflow-hidden">
      <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-linear-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}

function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text: string
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-rose-300/80">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-white/65 md:text-lg">
        {text}
      </p>
    </div>
  )
}

export const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  const videos = useMemo(() => [video1, video2, video3], [])

  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true)
    setVideoError(false)
  }, [])

  const handleVideoError = useCallback(() => {
    setVideoError(true)
    setVideoLoaded(false)

    setTimeout(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
    }, 2000)
  }, [videos.length])

  useEffect(() => {
    if (!videoLoaded || videos.length <= 1) return

    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [videoLoaded, videos.length])

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <ScrollProgress />

      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-red-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_35%)]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main>
          <section id="accueil" className="relative">
            <Hero
              videoRef={videoRef}
              currentVideoIndex={currentVideoIndex}
              setCurrentVideoIndex={setCurrentVideoIndex}
              videoLoaded={videoLoaded}
              handleVideoLoad={handleVideoLoad}
              handleVideoError={handleVideoError}
              videos={videos}
              videoError={videoError}
            />
          </section>

          {/* Transition strip under hero */}
          <section
            id="tournois"
            className="relative -mt-10 px-4 sm:px-6 lg:px-8"
          >
            <div className="mx-auto max-w-6xl">
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_30px_80px_-30px_rgba(244,63,94,0.25)] backdrop-blur-xl">
                <div className="grid gap-0 md:grid-cols-3">
                  <div className="border-b border-white/10 bg-white/5 p-6 md:border-b-0 md:border-r">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-rose-300/75">
                      Prochain tournoi
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      SherVy 3
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/65">
                      Une ambiance compétitive, propre et conviviale pour faire vivre
                      un tournoi bien organisé à Sherbrooke.
                    </p>
                  </div>

                  <div className="border-b border-white/10 bg-white/[0.03] p-6 md:border-b-0 md:border-r">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300/75">
                      Inscriptions
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      Équipes B et C
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/65">
                      Places limitées, inscription simple, paiement clair et accès
                      rapide au lien officiel du tournoi.
                    </p>
                  </div>

                  <div className="bg-white/[0.02] p-6">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-red-300/75">
                      Galerie
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      Souvenirs des événements
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/65">
                      Une galerie plus propre, mieux structurée par tournoi, avec
                      seulement quelques photos en avant-plan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <SectionDivider />

          <section className="relative px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <SectionIntro
                eyebrow="Tournois"
                title="Un format simple, clair et agréable à parcourir"
                text="Toutes les informations importantes sont présentées dans une structure plus propre, en gardant l’expérience visuelle alignée avec l’ambiance premium du haut de page."
              />

              <div className="rounded-[32px] border border-white/10 bg-white/5 p-2 shadow-[0_20px_60px_-30px_rgba(244,63,94,0.25)] backdrop-blur-xl">
                <LeagueInfo />
              </div>
            </div>
          </section>

          <SectionDivider />

          <section className="relative px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <SectionIntro
                eyebrow="Galerie"
                title="Revivez les meilleurs moments"
                text="Une galerie plus légère en premier chargement, mieux organisée par tournoi, et pensée pour mettre de l’avant les bons souvenirs sans surcharger la page."
              />

              <div className="rounded-[32px] border border-white/10 bg-white/5 p-2 shadow-[0_20px_60px_-30px_rgba(244,63,94,0.22)] backdrop-blur-xl">
                <TournamentGallery featuredOnly={false} initialLimit={8} />
              </div>
            </div>
          </section>

          <SectionDivider />

          <section className="relative px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <SectionIntro
                eyebrow="Contact"
                title="Une question avant de vous inscrire ?"
                text="Contactez-nous directement pour les inscriptions, les détails du tournoi, les commandites ou toute autre information liée à SherVy."
              />

              <div className="rounded-[32px] border border-white/10 bg-white/5 p-2 shadow-[0_20px_60px_-30px_rgba(244,63,94,0.22)] backdrop-blur-xl">
                <Contact />
              </div>
            </div>
          </section>

          <SectionDivider />

          <section className="relative px-4 sm:px-6 lg:px-8 pb-8">
            <div className="mx-auto max-w-6xl">
              <SectionIntro
                eyebrow="Partenaires"
                title="Ils contribuent à faire grandir SherVy"
                text="Des partenaires qui soutiennent le développement du volleyball local et qui nous aident à offrir une meilleure expérience tournoi après tournoi."
              />

              <div className="rounded-[32px] border border-white/10 bg-white/5 p-2 shadow-[0_20px_60px_-30px_rgba(244,63,94,0.22)] backdrop-blur-xl">
                <Sponsors />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}