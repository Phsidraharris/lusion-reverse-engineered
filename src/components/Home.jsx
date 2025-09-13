import { Environment, Lightformer, MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, N8AO } from '@react-three/postprocessing';
import { BallCollider, CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import { easing } from 'maath';
import { useMemo, useReducer, useRef } from 'react';
import * as THREE from 'three';
import Button from "./Button";
import LogoCarousel from './LogoCarousel';

const accents = ['#4060ff', '#20ffa0', '#ff4060', '#ffcc00']
const shuffle = (accent = 0) => [
  { color: '#444', roughness: 0.1 },
  { color: '#444', roughness: 0.75 },
  { color: '#444', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true }
]

export const Apps = () => (
  <div className="container">
    <div className="nav">
      <h1 className="label" />
      <div />
      <span className="caption" />
      <div />
      <a href="https://lusion.co/">
        <div className="button">VISIT LUSION</div>
      </a>
      <div className="button gray">///</div>
    </div>
    <Scene style={{ borderRadius: 20 }} />
  </div>
)

function Scene(props) {
  const [accent, click] = useReducer((state) => ++state % accents.length, 0)
  const connectors = useMemo(() => shuffle(accent), [accent])
  return (
    <Canvas onClick={click} shadows dpr={[1, 1.5]} gl={{ antialias: false }} camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }} {...props}>
      <color attach="background" args={[getComputedStyle(document.documentElement).getPropertyValue('--brand-color') || '#141622']} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Physics /*debug*/ gravity={[0, 0, 0]}>
        <Pointer />
        {connectors.map((props, i) => <Connector key={i} {...props} />) /* prettier-ignore */}
        <Connector position={[10, 10, 5]}>
          <Model>
            <MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={8} resolution={512} />
          </Model>
        </Connector>
      </Physics>
      <EffectComposer disableNormalPass multisampling={8}>
        <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
      </EffectComposer>
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
        </group>
      </Environment>
    </Canvas>
  )
}

function Connector({ position, children, vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, accent, ...props }) {
  const api = useRef()
  const pos = useMemo(() => position || [r(10), r(10), r(10)], [])
  useFrame((state, delta) => {
    delta = Math.min(0.1, delta)
    api.current?.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(0.2))
  })
  return (
    <RigidBody linearDamping={4} angularDamping={1} friction={0.1} position={pos} ref={api} colliders={false}>
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      {children ? children : <Model {...props} />}
      {accent && <pointLight intensity={4} distance={2.5} color={props.color} />}
    </RigidBody>
  )
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef()
  useFrame(({ mouse, viewport }) => {
    ref.current?.setNextKinematicTranslation(vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0))
  })
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  )
}

function Model({ children, color = 'white', roughness = 0, ...props }) {
  const ref = useRef()
  const { nodes, materials } = useGLTF('/c-transformed.glb')
  useFrame((state, delta) => {
    easing.dampC(ref.current.material.color, color, 0.2, delta)
  })
  return (
    <mesh ref={ref} castShadow receiveShadow scale={10} geometry={nodes.connector.geometry}>
      <meshStandardMaterial metalness={0.2} roughness={roughness} map={materials.base.map} />
      {children}
    </mesh>
  )
}

function Home() {
  return (
    <div className="w-full relative">
      {/* Single shared canvas (kept) */}
      <canvas id="canvas" className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />

      <div className="relative z-10">


        {/* HERO BLOCK WITH PHYSICS BACKGROUND */}
        <div
          id="hero-with-physics"
          className="relative w-full py-6 lg:py-16 2xl:py-26 max-w-screen-xl mx-auto pt-28 lg:pt-36"
        >
          {/* Physics target (background layer) */}
            {/* This div defines the area PhysicsSandbox will size to.
                Absolutely positioned, behind the text. */}
          <div
            id="physics-sandbox-div"
            className="absolute inset-0 -z-10 pointer-events-none"
          />

          <div className="flex flex-col justify-between lg:gap-y-12 gap-y-6 pb-10 relative">
            <div className="lg:mb-0 md:mb-4">
              <h1 className="2xl:text-7xl text-5xl font-[serif]">
                <span>The Leading</span>
                <br /> <span>Enterprise AI Platform</span>
              </h1>
            </div>
            <div className="lg:mb-10 mb-6">
              <p className="2xl:text-[38px] text-2xl font-starcil font-extrabold">
                Built on the language of business
              </p>
            </div>
            <div className="lg:mb-0 md:mb-4">
              <p className="2xl:text-2xl text-[18px] font-starcil font-extrabold">
                <span> Optimized for enterprise generative AI,</span> <br />
                <span>search and discovery, and advanced retrieval.</span>
              </p>
            </div>
            <div className="flex flex-col gap-y-3">
              <Button
                bgColor="bg-[#212121]"
                title="Contact Sales"
                textSize="text-[14px]"
              />
              <div className="relative rounded-lg cursor-pointer">
                <div className="absolute text-black text-sm top-1 -left-5 ml-8 mt-1 rounded-lg sm:w-auto w-full">
                  TRY THE PLAYGROUND
                </div>
                <input
                  className="sm:w-auto w-full text-white px-16 py-2 text-left border-black border-[1px] rounded-lg cursor-pointer"
                  type="text"
                  aria-label="search"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        <LogoCarousel />
        
        <div id="home-content" className="fade-out">

  
        </div>
        {/* REMOVE the old separate <section style={{ height: '100vh' }}> that only contained physics-sandbox-div */}
        {/* ...rest of your content... */}
      </div>
    </div>
  );
}
export default Home;
