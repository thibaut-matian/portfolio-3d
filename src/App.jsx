import React, { useRef } from 'react'
import Hero from './components/Hero'
import Projects from './components/Projects'

export default function App() {
  const projectsRef = useRef(null)

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="w-full min-h-screen bg-[#08090b]">
      <Hero onStart={scrollToProjects} />
      <div ref={projectsRef}>
        <Projects />
      </div>
    </main>
  )
}