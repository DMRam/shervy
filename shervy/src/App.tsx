import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { LeagueInfo } from "./components/LeagueInfo";
import { Navbar } from "./components/Navbar";
import { Schedule } from "./components/Schedule";
import { Sponsors } from "./components/Sponsors";
import video1 from './assets/hero_videos/v1.mp4'
import video2 from './assets/hero_videos/v2.mp4'
import video3 from './assets/hero_videos/v3.mp4'
import './firebase/firebaseInit'


import React, { useRef, useState, useCallback } from 'react'

export const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  const videos = [video1, video2, video3]

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

  React.useEffect(() => {
    if (videoLoaded && videos.length > 1) {
      const interval = setInterval(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
      }, 8000)
      return () => clearInterval(interval)
    }
  }, [videoLoaded, videos.length])

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-25 via-red-25 to-orange-25 text-gray-800">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-rose-100 to-pink-200 rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-br from-orange-100 to-red-200 rounded-full blur-3xl opacity-20 animate-float-delayed"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
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
        <LeagueInfo />
        {/* <Teams /> */}
        <Schedule />
        <Contact />
        <Sponsors />
        <Footer />
      </div>
    </div>
  )
}