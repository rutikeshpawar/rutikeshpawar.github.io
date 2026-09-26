import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, Line } from '@react-three/drei'
import * as THREE from 'three'

interface NeuralNetworkProps {
  recruiterMode: boolean
}

function NeuralNode({ position, delay }: { position: [number, number, number], delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() + delay
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1
      meshRef.current.scale.setScalar(hovered ? 1.3 : 1 + Math.sin(time * 2) * 0.1)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color="#06B6D4"
        emissive="#06B6D4"
        emissiveIntensity={hovered ? 0.8 : 0.3}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

function ConnectionLine({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]

  return (
    <Line
      points={points}
      color="#22D3EE"
      transparent
      opacity={0.3}
      lineWidth={1}
    />
  )
}

function NeuralNetworkScene({ recruiterMode }: { recruiterMode: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (recruiterMode) return
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [recruiterMode])

  useFrame(() => {
    if (groupRef.current && !recruiterMode) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePosition.x * 0.3,
        0.05
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePosition.y * 0.2,
        0.05
      )
    }
  })

  const nodes: [number, number, number][] = [
    [0, 0, 0],
    [1.5, 0.5, 0.5],
    [-1.5, -0.3, 0.3],
    [0.8, 1.2, -0.5],
    [-0.8, -1.1, 0.4],
    [2, -0.8, 0.2],
    [-2, 0.6, -0.3],
    [0.5, -1.5, 0.6],
    [-0.5, 1.4, -0.4],
    [1.2, 0.8, 0.8],
    [-1.2, -0.7, -0.6],
  ]

  const connections: Array<{ start: [number, number, number], end: [number, number, number] }> = [
    { start: nodes[0], end: nodes[1] },
    { start: nodes[0], end: nodes[2] },
    { start: nodes[0], end: nodes[3] },
    { start: nodes[0], end: nodes[4] },
    { start: nodes[1], end: nodes[5] },
    { start: nodes[2], end: nodes[6] },
    { start: nodes[3], end: nodes[7] },
    { start: nodes[4], end: nodes[8] },
    { start: nodes[1], end: nodes[9] },
    { start: nodes[2], end: nodes[10] },
    { start: nodes[5], end: nodes[9] },
    { start: nodes[6], end: nodes[10] },
  ]

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#06B6D4" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22D3EE" />

      {nodes.map((position, i) => (
        <NeuralNode key={i} position={position} delay={i * 0.2} />
      ))}

      {connections.map((conn, i) => (
        <ConnectionLine key={i} start={conn.start} end={conn.end} />
      ))}

      <Stars radius={50} depth={50} count={100} factor={4} saturation={0} fade speed={1} />
    </group>
  )
}

export function NeuralNetwork3D({ recruiterMode }: NeuralNetworkProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Float
          speed={recruiterMode ? 0 : 1}
          rotationIntensity={recruiterMode ? 0 : 0.5}
          floatIntensity={recruiterMode ? 0 : 0.5}
        >
          <NeuralNetworkScene recruiterMode={recruiterMode} />
        </Float>
      </Canvas>
    </div>
  )
}
