import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

export default function CdModel(props) {
  const { nodes, materials } = useGLTF('/cd.glb')

  useMemo(() => {
    if (nodes?.Object_2?.geometry) {
      nodes.Object_2.geometry.center()
    }
  }, [nodes])

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_2.geometry}
        material={materials.lambert2SG}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  )
}

useGLTF.preload('/cd.glb')