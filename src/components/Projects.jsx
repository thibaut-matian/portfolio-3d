import React, { useState, useEffect, useRef, Suspense } from 'react'
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
  const touchStartX = useRef(0)
  const isTouchOnCanvas = useRef(false)
  const sectionRef = useRef(null)

  const currentProject = projects[currentIndex]
  const slides = currentProject.screenshots || (currentProject.screenshot ? [currentProject.screenshot] : [])

  const formattedIndex = String(currentIndex + 1).padStart(2, '0')
  const formattedTotal = String(projects.length).padStart(2, '0')

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
    if (newIndex >= 0 && newIndex < projects.length && !isLocked.current) {
      isLocked.current = true
      setShowScreenshot(false)
      setCurrentIndex(newIndex)

      setTimeout(() => {
        isLocked.current = false
      }, 500)
    }
  }

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const handleWheel = (e) => {
      if (showScreenshot) return

      const rect = el.getBoundingClientRect()
      const inView = rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.6
      if (!inView) return

      const threshold = 25

      if (e.deltaY > threshold && currentIndex < projects.length - 1) {
        e.preventDefault()
        goToProject(currentIndex + 1)
      } else if (e.deltaY < -threshold && currentIndex > 0) {
        e.preventDefault()
        goToProject(currentIndex - 1)
      }
    }

    const handleTouchStart = (e) => {
      if (e.target.tagName === 'CANVAS' || e.target.closest('canvas')) {
        isTouchOnCanvas.current = true
        return
      }
      isTouchOnCanvas.current = false
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e) => {
      if (showScreenshot || isTouchOnCanvas.current) return

      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      const deltaX = touchStartX.current - e.changedTouches[0].clientX

      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && currentIndex < projects.length - 1) {
          goToProject(currentIndex + 1)
        } else if (deltaX < 0 && currentIndex > 0) {
          goToProject(currentIndex - 1)
        }
      }
    }

    const handleKeyDown = (e) => {
      if (showScreenshot) {
        if (e.key === 'Escape') setShowScreenshot(false)
        if (e.key === 'ArrowRight') nextSlide()
        if (e.key === 'ArrowLeft') prevSlide()
        return
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (currentIndex < projects.length - 1) goToProject(currentIndex + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentIndex > 0) goToProject(currentIndex - 1)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentIndex, showScreenshot, slides.length])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] bg-[#08090b] text-white select-none overflow-hidden flex flex-col justify-between"
    >
      {/* Fond : suppression du filtre blur CSS responsable de l'écran noir sous Safari */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentProject.id}
            src={currentProject.bgImage}
            alt={currentProject.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/85 via-black/70 to-black/90" />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 px-5 sm:px-8 md:px-16 flex flex-col md:grid md:grid-cols-2 items-center justify-center gap-2 sm:gap-6 md:gap-16 pt-14 pb-16 md:py-0">
        
        {/* Zone 3D isolée avec Suspense pour sécuriser le rendu mobile */}
        <div className="w-full h-[220px] sm:h-[280px] md:h-[500px] flex items-center justify-center shrink-0 touch-none cursor-grab active:cursor-grabbing">
          <Suspense fallback={<div className="font-mono text-xs text-zinc-600">Chargement...</div>}>
            <CartridgeCanvas activeIndex={currentIndex} />
          </Suspense>
        </div>

        {/* Détails du projet */}
        <div className="w-full flex flex-col justify-center max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 sm:space-y-4 md:space-y-6"
            >
              <div className="flex items-center gap-3 font-mono text-xs sm:text-sm text-zinc-400">
                <div>
                  <span className="text-white font-bold">{formattedIndex}</span>
                  <span className="mx-2">—</span>
                  <span>{formattedTotal}</span>
                </div>

                {currentProject.inProgress && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono bg-emerald-950/70 border border-emerald-500/30 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En cours
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                {currentProject.title}
              </h2>

              <p className="text-zinc-300 text-xs sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-none font-light">
                {currentProject.description}
              </p>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                {currentProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[10px] sm:text-xs text-zinc-300 bg-zinc-900/90 border border-zinc-700/80 px-2.5 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2 sm:pt-4 font-mono text-xs sm:text-sm">
                {currentProject.inProgress ? (
                  slides.length > 0 && (
                    <button
                      onClick={openCarousel}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded border border-zinc-700 bg-zinc-900/90 text-zinc-200 hover:border-emerald-500/50 hover:text-white transition cursor-pointer"
                    >
                      <span>Aperçu maquettes ({slides.length})</span>
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
                        className="text-white hover:text-emerald-400 transition inline-flex items-center gap-1 font-semibold py-1"
                      >
                        Voir le projet ↗
                      </a>
                    )}
                    {currentProject.githubUrl && (
                      <a
                        href={currentProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-zinc-200 transition py-1"
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

      {/* Pagination desktop */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-20">
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

      {/* Contrôles bas */}
      <div className="relative z-20 w-full pb-4 sm:pb-6 flex items-center justify-center gap-6 font-mono text-xs text-zinc-400">
        <button
          onClick={() => goToProject(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="p-2 disabled:opacity-20 hover:text-white transition cursor-pointer touch-manipulation"
        >
          [ PREV ]
        </button>

        <span className="text-[11px] tracking-widest text-zinc-500">
          {currentIndex + 1} / {projects.length}
        </span>

        <button
          onClick={() => goToProject(currentIndex + 1)}
          disabled={currentIndex === projects.length - 1}
          className="p-2 disabled:opacity-20 hover:text-white transition cursor-pointer touch-manipulation"
        >
          [ NEXT ]
        </button>
      </div>

      {/* Modale carrousel */}
      <AnimatePresence>
        {showScreenshot && slides.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowScreenshot(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-12 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90dvh] bg-[#0c0d11] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-[#08090b]">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-mono text-[11px] sm:text-xs text-zinc-400 truncate">
                    {currentProject.title} ({currentSlide + 1}/{slides.length})
                  </span>
                </div>

                <button
                  onClick={() => setShowScreenshot(false)}
                  className="font-mono text-xs text-zinc-400 hover:text-white transition cursor-pointer p-1"
                >
                  ✕ FERMER
                </button>
              </div>

              <div className="relative overflow-hidden flex-1 flex items-center justify-center bg-[#050608] min-h-[240px] max-h-[calc(90dvh-90px)] p-2 sm:p-4">
                <AnimatePresence mode="wait" custom={slideDirection}>
                  <motion.img
                    key={currentSlide}
                    src={slides[currentSlide]}
                    alt={`Capture ${currentSlide + 1}`}
                    custom={slideDirection}
                    initial={(dir) => ({ opacity: 0, x: dir > 0 ? 25 : -25 })}
                    animate={{ opacity: 1, x: 0 }}
                    exit={(dir) => ({ opacity: 0, x: dir > 0 ? -25 : 25 })}
                    transition={{ duration: 0.2 }}
                    className="max-h-[calc(90dvh-120px)] max-w-full w-auto object-contain rounded select-none"
                  />
                </AnimatePresence>

                {slides.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      aria-label="Image précédente"
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 border border-zinc-700 text-zinc-200 flex items-center justify-center font-mono cursor-pointer"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextSlide}
                      aria-label="Image suivante"
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 border border-zinc-700 text-zinc-200 flex items-center justify-center font-mono cursor-pointer"
                    >
                      →
                    </button>
                  </>
                )}
              </div>

              {slides.length > 1 && (
                <div className="flex items-center justify-center px-4 py-2 border-t border-zinc-800 bg-[#08090b]">
                  <div className="flex items-center gap-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSlideDirection(i > currentSlide ? 1 : -1)
                          setCurrentSlide(i)
                        }}
                        className={`transition-all rounded-full ${
                          i === currentSlide
                            ? 'w-5 h-1.5 bg-emerald-400'
                            : 'w-1.5 h-1.5 bg-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}