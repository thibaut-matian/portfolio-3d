import React, { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'
import CartridgeModel from './CartridgeModel'
import CdModel from './CdModel'

function InteractiveItem({ activeIndex = 0 }) {
  const isCd = activeIndex % 2 === 1
  const outerGroup = useRef()
  const dragGroup = useRef()
  const swapGroup = useRef()
  const modelRef = useRef()

  const prevIndex = useRef(activeIndex)
  const swapProgress = useRef(1)

  const isDragging = useRef(false)
  const previousPointer = useRef({ x: 0, y: 0 })
  const dragRotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (prevIndex.current !== activeIndex) {
      prevIndex.current = activeIndex
      swapProgress.current = 0
      dragRotation.current = { x: 0, y: 0 }
    }
  }, [activeIndex])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // Transition au switch de projet (rotation 360°)
    if (swapProgress.current < 1) {
      swapProgress.current = Math.min(1, swapProgress.current + delta * 2.8)
      const ease = 1 - Math.pow(1 - swapProgress.current, 3)

      swapGroup.current.rotation.y = (1 - ease) * Math.PI * 2
      const s = 0.7 + 0.3 * ease
      swapGroup.current.scale.set(s, s, s)
    } else {
      swapGroup.current.rotation.y = 0
      swapGroup.current.scale.set(1, 1, 1)
    }

    // Retour élastique quand on relâche
    if (!isDragging.current) {
      dragRotation.current.x = THREE.MathUtils.lerp(dragRotation.current.x, 0, 0.05)
      dragRotation.current.y = THREE.MathUtils.lerp(dragRotation.current.y, 0, 0.05)
    }

    dragGroup.current.rotation.x = dragRotation.current.x
    dragGroup.current.rotation.y = dragRotation.current.y

    // Flottaison
    const floatY = Math.sin(t * 1.8) * 0.1 + Math.cos(t * 0.9) * 0.03
    outerGroup.current.position.y = THREE.MathUtils.lerp(
      outerGroup.current.position.y,
      isDragging.current ? 0 : floatY,
      0.08
    )

    // Rotation continue propre à l'objet
    if (modelRef.current) {
      if (isCd) {
        modelRef.current.rotation.z += delta * 0.25
      } else {
        modelRef.current.rotation.z = Math.sin(t * 1.2) * 0.025
      }
    }
  })

  const handlePointerDown = (e) => {
    e.stopPropagation()
    try {
      e.target.setPointerCapture(e.pointerId)
    } catch (_) {}
    isDragging.current = true
    previousPointer.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current) return
    e.stopPropagation()

    const deltaX = e.clientX - previousPointer.current.x
    const deltaY = e.clientY - previousPointer.current.y
    previousPointer.current = { x: e.clientX, y: e.clientY }

    dragRotation.current.y += deltaX * 0.007
    dragRotation.current.x = Math.max(
      -Math.PI / 3.2,
      Math.min(Math.PI / 3.2, dragRotation.current.x + deltaY * 0.007)
    )
  }

  const handlePointerUp = (e) => {
    e.stopPropagation()
    try {
      e.target.releasePointerCapture(e.pointerId)
    } catch (_) {}
    isDragging.current = false
  }

  return (
    <group
      ref={outerGroup}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <group ref={dragGroup}>
        <group ref={swapGroup}>
          <group ref={modelRef}>
            {isCd ? (
              <CdModel
                scale={0.135}
                rotation={[0.3, -0.4, 0.05]}
                position={[0, 0, 0]}
              />
            ) : (
              <CartridgeModel
                scale={22}
                rotation={[0.18, -0.38, 0.04]}
                position={[0, 0, 0]}
              />
            )}
          </group>
        </group>
      </group>
    </group>
  )
}

function Scene({ activeIndex = 0 }) {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 8, 5]} intensity={2.2} />
      <directionalLight position={[-5, -2, -2]} intensity={0.5} />

      <InteractiveItem activeIndex={activeIndex} />

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={9}
        blur={2.5}
        far={4}
      />
      <Environment preset="city" />
    </>
  )
}

export default function CartridgeCanvas({ activeIndex = 0 }) {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'default'
        }}
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          <Scene activeIndex={activeIndex} />
        </Suspense>
      </Canvas>
    </div>
  )
}