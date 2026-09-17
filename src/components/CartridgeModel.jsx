import React from 'react'
import { useGLTF } from '@react-three/drei'

// Modèle 3D Cartouche
export default function CartridgeModel(props) {
  const { scene } = useGLTF('/sonic_2_mega_drive_cartridge.glb')
  return <primitive object={scene} {...props} />
}

useGLTF.preload('/sonic_2_mega_drive_cartridge.glb')