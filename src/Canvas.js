import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, AccumulativeShadows, RandomizedLight, Decal, Environment, Center, Gltf, PerformanceMonitor, Text, Html } from '@react-three/drei'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import { state } from './store'
import { Perf } from 'r3f-perf'

export const App = ({ fov = 25, position = [0, 0, 2.5] }) => {
  return (
    <>
      <Canvas shadows camera={{ position, fov }} gl={{ preserveDrawingBuffer: true }} eventPrefix="client" eventSource={document.getElementById('root')}>
        <Suspense fallback={<Html center>Loading....</Html>}>
          <ambientLight intensity={0.5 * Math.PI} />
          <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
          <Perf />
          <CameraRig>
            <Backdrop />
            <Center>
              <Shirt />
            </Center>
          </CameraRig>
        </Suspense>
      </Canvas>
    </>
  )
}

function Backdrop() {
  const shadows = useRef()
  useFrame((state, delta) => easing.dampC(shadows.current.getMesh().material.color, state.color, 0.25, delta))
  return (
    <AccumulativeShadows ref={shadows} temporal frames={30} alphaTest={0.85} scale={10} resolution={2048} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.4]}>
      <RandomizedLight amount={4} radius={9} intensity={0.55 * Math.PI} ambient={0.25} position={[5, 5, -10]} />
      <RandomizedLight amount={4} radius={5} intensity={0.25 * Math.PI} ambient={0.55} position={[-5, 5, -9]} />
    </AccumulativeShadows>
  )
}

function CameraRig({ children }) {
  const group = useRef()
  const snap = useSnapshot(state)
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [snap.intro ? -state.viewport.width / 4 : 0, 0, 0.2], 0.25, delta)
    easing.dampE(group.current.rotation, [-state.pointer.y, -state.pointer.x, 0], 0.25, delta)
  })
  return <group ref={group}>{children}</group>
}

function Shirt(props) {
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF('/ring.glb')
  const heart = useGLTF('/heart.glb')
  const emerald = useGLTF('/emerald.glb')
  // const texture = useTexture(`/${snap.decal?.includes('.webp') || snap.decal?.includes('.jpg') ? snap.decal : snap.decal}`)

  useFrame((state, delta) => {
    easing.dampC(materials.tala.color, snap.color, 0.25, delta)
    easing.dampC(materials.shishe.color, snap.color, 0.25, delta)
    easing.dampC(heart?.materials.shishe.color, snap.color, 0.25, delta)
    easing.dampC(emerald?.materials.shishe.color, snap.color, 0.25, delta)
  })

  return (
    <>
      <mesh castShadow geometry={nodes?.Round006_1?.geometry} material={materials.tala} material-roughness={0.1} dispose={null}>
        {/* {snap !== '' && <Decal position={[0, 0, 0]} rotation={[0, 0, 0]} scale={0.1} map={texture} />} */}
      </mesh>

      {['#EFBD4E', '#80C670'].includes(snap.color) && (
        <mesh castShadow geometry={emerald?.nodes?.Emerald_1ct?.geometry} material={emerald?.materials.shishe} material-roughness={0.1} dispose={null} />
      )}
      {['#726DE8', '#EF674E'].includes(snap.color) && (
        <mesh castShadow geometry={heart?.nodes?.Heart_1ct?.geometry} material={heart?.materials.shishe} material-roughness={0.1} dispose={null} />
      )}
      {['#353934', '#dafdaf'].includes(snap.color) && (
        <mesh castShadow geometry={nodes?.Round006?.geometry} material={materials.shishe} material-roughness={0.1} dispose={null} />
      )}
    </>
  )
}

useGLTF.preload('/ring.glb')
useGLTF.preload('/emerald.glb')
useGLTF.preload('/heart.glb')
