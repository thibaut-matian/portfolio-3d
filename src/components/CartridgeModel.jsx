import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

export default function CartridgeModel(props) {
  const { nodes, materials } = useGLTF('/sonic_2_mega_drive_cartridge.glb')

  useMemo(() => {
    if (nodes['Cartridge_01_-_Default_0']?.geometry) {
      nodes['Cartridge_01_-_Default_0'].geometry.center()
    }
  }, [nodes])

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.025}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group scale={[0.901, 1, 1.203]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes['Cartridge_01_-_Default_0'].geometry}
              material={materials['01_-_Default']}
            />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/sonic_2_mega_drive_cartridge.glb')