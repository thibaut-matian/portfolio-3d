import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function ZenWaves() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let step = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Profils d'ondes avec opacités rehaussées et amplitudes plus amples
    const waves = [
      { amp: 55, freq: 0.0035, speed: 0.012, color: 'rgba(52, 211, 153, 0.55)', glow: 'rgba(52, 211, 153, 0.4)', width: 2.5 },
      { amp: 75, freq: 0.0025, speed: 0.008, color: 'rgba(255, 255, 255, 0.25)', glow: 'rgba(255, 255, 255, 0.15)', width: 1.5 },
      { amp: 65, freq: 0.0045, speed: 0.015, color: 'rgba(16, 185, 129, 0.45)', glow: 'rgba(16, 185, 129, 0.3)', width: 2 },
      { amp: 40, freq: 0.0055, speed: 0.01, color: 'rgba(110, 231, 183, 0.3)', glow: 'rgba(110, 231, 183, 0.2)', width: 1.5 },
      { amp: 90, freq: 0.002, speed: 0.006, color: 'rgba(5, 150, 105, 0.25)', glow: 'rgba(5, 150, 105, 0.15)', width: 3 },
    ]

    const render = () => {
      step += 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerY = canvas.height * 0.62

      waves.forEach((wave) => {
        ctx.save()
        ctx.beginPath()
        ctx.lineWidth = wave.width
        ctx.strokeStyle = wave.color
        ctx.shadowColor = wave.glow
        ctx.shadowBlur = 12

        for (let x = 0; x <= canvas.width; x += 3) {
          const y =
            centerY +
            Math.sin(x * wave.freq + step * wave.speed) * wave.amp +
            Math.cos(x * 0.002 + step * (wave.speed * 0.5)) * (wave.amp * 0.35)

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  )
}

export default function Hero({ onStart }) {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between p-8 md:p-16 bg-[#08090b] text-white select-none overflow-hidden font-sans">
      
      {/* 1. ONDES VISIBLES + HALO CENTRAL */}
      <ZenWaves />
      <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* 2. NAVIGATION ÉPURÉE */}
      <header className="relative z-10 flex justify-between items-center w-full max-w-5xl mx-auto">
        <span className="text-xs font-mono tracking-widest text-zinc-400">
          Thibaut MATIAN
        </span>

        <button
          onClick={onStart}
          className="text-xs font-mono text-zinc-400 hover:text-white transition cursor-pointer"
        >
          Projets
        </button>
      </header>

      {/* 3. CENTRE */}
      <div className="relative z-10 max-w-3xl mx-auto w-full text-center my-auto space-y-8 px-4">
        
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xs font-mono text-emerald-400 tracking-widest uppercase"
        >
          Développeur Web & Mobile
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-zinc-100 leading-tight"
        >
          Épurer la technique.<br />
          <span className="font-normal text-zinc-400">Apaiser l'interaction.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-zinc-400 text-sm sm:text-base font-light max-w-md mx-auto leading-relaxed"
        >
          Conception d'applications full stack réactives et soignées, pensées pour durer sans bruit superflu.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="pt-4"
        >
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-zinc-700 bg-zinc-900/70 backdrop-blur-md text-zinc-200 text-xs font-light tracking-wide hover:border-emerald-500/50 hover:text-white transition-all cursor-pointer shadow-lg"
          >
            <span>Découvrir les cartouches</span>
            <span className="text-emerald-400 group-hover:translate-y-0.5 transition-transform">
              ↓
            </span>
          </button>
        </motion.div>

      </div>

      {/* 4. BAS DE PAGE */}
      <footer className="relative z-10 flex justify-between items-center w-full max-w-5xl mx-auto text-[11px] font-mono text-zinc-500">
        <span>MARSEILLE</span>
        <span>DÉFILER VERS LE BAS</span>
      </footer>

    </section>
  )
}