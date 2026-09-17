import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Float, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'

// Modèle 3D Cartouche
function CartridgeModel() {
  const { scene } = useGLTF('/sonic_2_mega_drive_cartridge.glb')
  return (
    <primitive
      object={scene}
      scale={2.2}
      position={[0, -0.2, 0]}
      rotation={[0.1, -0.3, 0]}
    />
  )
}

// Modèle 3D Disque optique
function DiscModel() {
  const { scene } = useGLTF('/cd.glb')
  return (
    <primitive
      object={scene}
      scale={2.8}
      position={[0, 0, 0]}
      rotation={[0.4, 0.2, 0]}
    />
  )
}

// Sélecteur d'objet selon l'index
function InteractiveAsset({ activeIndex }) {
  // Alterne entre Cartouche (pair) et CD (impair)
  const isDisc = activeIndex % 2 !== 0

  return (
    <PresentationControls
      global={false}
      cursor={true}
      snap={{ mass: 2, tension: 350 }} // Snap-back physique au relâchement
      speed={2.2}
      zoom={1}
      rotation={[0, 0, 0]}
      polar={[-Math.PI / 4, Math.PI / 4]} // Amplitude verticale
      azimuth={[-Math.PI / 2.5, Math.PI / 2.5]} // Amplitude horizontale
    >
      <Float
        speed={2}
        rotationIntensity={0.6}
        floatIntensity={0.8}
      >
        <Suspense fallback={null}>
          {isDisc ? <DiscModel /> : <CartridgeModel />}
        </Suspense>
      </Float>
    </PresentationControls>
  )
}

export default function CartridgeCanvas({ activeIndex = 0 }) {
  return (
    <div className="w-full h-full touch-none select-none">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        style={{
          width: '100%',
          height: '100%',
          touchAction: 'none' // Empêche le navigateur mobile de voler l'événement tactile
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={2.2} castShadow />
        <directionalLight position={[-5, -2, -3]} intensity={0.8} color="#10b981" />
        <pointLight position={[0, 3, 2]} intensity={1.5} />

        <InteractiveAsset activeIndex={activeIndex} />
      </Canvas>
    </div>
  )
}

// Préchargement des assets pour éviter les saccades lors du swipe
useGLTF.preload('/sonic_2_mega_drive_cartridge.glb')
useGLTF.preload('/cd.glb')