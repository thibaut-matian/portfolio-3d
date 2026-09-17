import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects } from '../data/projectsData'
import CartridgeCanvas from './CartridgeCanvas'

export default function Projects() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showScreenshot, setShowScreenshot] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideDirection, setSlideDirection] = useState(1)

  const isLocked = useRef(false)
  const touchStartY = useRef(0)
  const sectionRef = useRef(null)

  const currentProject = projects[currentIndex]
  const slides = currentProject.screenshots || (currentProject.screenshot ? [currentProject.screenshot] : [])

  const openCarousel = () => {
    setCurrentSlide(0)
    setShowScreenshot(true)
  }

  const nextSlide = () => {
    if (slides.length <= 1) return
    setSlideDirection(1)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    if (slides.length <= 1) return
    setSlideDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToProject = (newIndex) => {
    if (newIndex >= 0 && newIndex < projects.length) {
      isLocked.current = true
      setShowScreenshot(false)
      setCurrentIndex(newIndex)

      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

      setTimeout(() => {
        isLocked.current = false
      }, 600)
    }
  }

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const handleWheel = (e) => {
      if (showScreenshot) return

      const rect = el.getBoundingClientRect()
      const inView = rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5
      if (!inView) return

      const threshold = 20

      if (e.deltaY < -threshold) {
        if (currentIndex > 0) {
          e.preventDefault()
          if (!isLocked.current) goToProject(currentIndex - 1)
        }
      } else if (e.deltaY > threshold) {
        if (currentIndex < projects.length - 1) {
          e.preventDefault()
          if (!isLocked.current) goToProject(currentIndex + 1)
        }
      } else if (isLocked.current && Math.abs(e.deltaY) > 5) {
        if (currentIndex > 0 || (currentIndex === 0 && e.deltaY > 0)) {
          e.preventDefault()
        }
      }
    }

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      if (showScreenshot) return
      const rect = el.getBoundingClientRect()
      const inView = rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5
      if (!inView) return

      const deltaY = touchStartY.current - e.touches[0].clientY

      if (deltaY < -40 && currentIndex > 0) {
        e.preventDefault()
        if (!isLocked.current) goToProject(currentIndex - 1)
      } else if (deltaY > 40 && currentIndex < projects.length - 1) {
        e.preventDefault()
        if (!isLocked.current) goToProject(currentIndex + 1)
      }
    }

    const handleKeyDown = (e) => {
      if (showScreenshot) {
        if (e.key === 'Escape') {
          setShowScreenshot(false)
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          nextSlide()
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          prevSlide()
        }
        return
      }

      const rect = el.getBoundingClientRect()
      const inView = rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5
      if (!inView) return

      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          e.preventDefault()
          goToProject(currentIndex - 1)
        }
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (currentIndex < projects.length - 1) {
          e.preventDefault()
          goToProject(currentIndex + 1)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentIndex, showScreenshot, slides.length])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full h-screen bg-[#08090b] text-white select-none overflow-hidden"
    >
      {/* 1. IMAGE DE FOND NETTE AVEC DÉGRADÉ DE LECTURE */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentProject.id}
            src={currentProject.bgImage}
            alt={currentProject.title}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 0.55, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover filter blur-[1px]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/50 to-black/75" />
      </div>

      {/* 2. GRILLE PRINCIPALE */}
      <div className="relative z-10 max-w-7xl mx-auto w-full h-full px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        
        <div className="flex justify-center items-center w-full h-[400px] md:h-[550px]">
          <CartridgeCanvas activeIndex={currentIndex} />
        </div>

        <div className="flex flex-col justify-center min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 font-mono text-sm text-zinc-400 tracking-wider">
                <div>
                  <span className="text-white font-bold">{currentProject.index}</span>
                  <span className="mx-2">—</span>
                  <span>{currentProject.total}</span>
                </div>

                {currentProject.inProgress && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-normal bg-emerald-950/70 border border-emerald-500/30 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En cours de réalisation
                  </span>
                )}
              </div>

              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                {currentProject.title}
              </h2>

              <p className="text-zinc-300 text-base md:text-lg leading-relaxed max-w-lg font-light">
                {currentProject.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {currentProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs text-zinc-300 bg-zinc-900/80 border border-zinc-700 px-3 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 font-mono text-sm">
                {currentProject.inProgress ? (
                  slides.length > 0 && (
                    <button
                      onClick={openCarousel}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded border border-zinc-700 bg-zinc-900/90 text-zinc-200 hover:border-emerald-500/50 hover:text-white transition cursor-pointer"
                    >
                      <span>Aperçu des maquettes ({slides.length})</span>
                      <span className="text-emerald-400">↗</span>
                    </button>
                  )
                ) : (
                  <>
                    {currentProject.demoUrl && (
                      <a
                        href={currentProject.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:text-emerald-400 transition inline-flex items-center gap-1 font-semibold"
                      >
                        Voir le projet ↗
                      </a>
                    )}
                    {currentProject.githubUrl && (
                      <a
                        href={currentProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-zinc-200 transition"
                      >
                        Code source
                      </a>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* 3. PAGINATION LATÉRALE */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-20">
        {projects.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => goToProject(idx)}
            aria-label={`Aller au projet ${p.title}`}
            className={`w-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex
                ? 'h-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                : 'h-2 bg-zinc-600 hover:bg-zinc-400'
            }`}
          />
        ))}
      </div>

      {/* 4. CONTRÔLES BAS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 font-mono text-[11px] text-zinc-500 uppercase tracking-widest z-20">
        <button
          onClick={() => goToProject(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="disabled:opacity-20 hover:text-white transition cursor-pointer"
        >
          [ PREV ]
        </button>
        <span>
          {currentIndex + 1} / {projects.length}
        </span>
        <button
          onClick={() => goToProject(currentIndex + 1)}
          disabled={currentIndex === projects.length - 1}
          className="disabled:opacity-20 hover:text-white transition cursor-pointer"
        >
          [ NEXT ]
        </button>
      </div>

      {/* 5. CARROUSEL MAQUETTES */}
      <AnimatePresence>
        {showScreenshot && slides.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowScreenshot(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/85 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[85vh] bg-[#0c0d11] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col cursor-default"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-[#08090b]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 font-mono text-xs text-zinc-400">
                    {currentProject.title} — Maquette {currentSlide + 1}/{slides.length}
                  </span>
                </div>

                <button
                  onClick={() => setShowScreenshot(false)}
                  className="font-mono text-xs text-zinc-400 hover:text-white transition cursor-pointer px-2"
                >
                  ✕ FERMER [ESC]
                </button>
              </div>

              <div className="relative overflow-hidden flex-1 flex items-center justify-center bg-[#050608] min-h-[320px] max-h-[calc(85vh-95px)] p-4">
                <AnimatePresence mode="wait" custom={slideDirection}>
                  <motion.img
                    key={currentSlide}
                    src={slides[currentSlide]}
                    alt={`Capture ${currentSlide + 1}`}
                    custom={slideDirection}
                    initial={(dir) => ({ opacity: 0, x: dir > 0 ? 30 : -30 })}
                    animate={{ opacity: 1, x: 0 }}
                    exit={(dir) => ({ opacity: 0, x: dir > 0 ? -30 : 30 })}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="max-h-[calc(85vh-130px)] max-w-full w-auto object-contain rounded select-none"
                  />
                </AnimatePresence>

                {slides.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      aria-label="Image précédente"
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 flex items-center justify-center font-mono transition cursor-pointer"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextSlide}
                      aria-label="Image suivante"
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 flex items-center justify-center font-mono transition cursor-pointer"
                    >
                      →
                    </button>
                  </>
                )}
              </div>

              {slides.length > 1 && (
                <div className="flex items-center justify-between px-6 py-2.5 border-t border-zinc-800 bg-[#08090b] font-mono text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSlideDirection(i > currentSlide ? 1 : -1)
                          setCurrentSlide(i)
                        }}
                        className={`transition-all rounded-full cursor-pointer ${
                          i === currentSlide
                            ? 'w-6 h-1.5 bg-emerald-400'
                            : 'w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-500'
                        }`}
                      />
                    ))}
                  </div>

                  <span>UTILISEZ LES FLÈCHES [←] [→]</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}