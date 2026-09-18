import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function CartridgeModel(props) {
  const { scene } = useGLTF('/sonic_2_mega_drive_cartridge.glb')

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/sonic_2_mega_drive_cartridge.glb')