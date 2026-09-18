import React, { useRef, Component } from 'react'
import Hero from './components/Hero'
import Projects from './components/Projects'

// Empêche l'écran noir total si un composant plante
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Crash React :", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen p-6 bg-red-950/90 text-red-200 font-mono text-xs overflow-auto">
          <h2 className="text-base font-bold text-red-100 mb-2">Erreur au chargement :</h2>
          <pre className="whitespace-pre-wrap">{this.state.error?.toString()}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const projectsRef = useRef(null)

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="w-full min-h-screen bg-[#08090b]">
      <ErrorBoundary>
        <Hero onStart={scrollToProjects} />
      </ErrorBoundary>
      <div ref={projectsRef}>
        <ErrorBoundary>
          <Projects />
        </ErrorBoundary>
      </div>
    </main>
  )
}