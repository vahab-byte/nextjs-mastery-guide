import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, RoundedBox, Torus } from '@react-three/drei';
import { useRef, Suspense, useState } from 'react';
import * as THREE from 'three';

const SpaceAstronaut = () => {
  const groupRef = useRef<THREE.Group>(null);
  const visorRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
    }
    if (visorRef.current) {
      (visorRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 
        0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group 
      ref={groupRef} 
      scale={hovered ? 1.08 : 1} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={2} rotationIntensity={0.4} floatIntensity={1}>
        {/* Helmet */}
        <Sphere args={[0.7, 32, 32]} position={[0, 1.2, 0]}>
          <meshStandardMaterial
            color="#e8e8e8"
            roughness={0.2}
            metalness={0.6}
          />
        </Sphere>

        {/* Visor - Glowing */}
        <Sphere ref={visorRef} args={[0.55, 32, 32]} position={[0, 1.25, 0.25]}>
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.1}
            metalness={0.9}
            emissive={hovered ? "#60a5fa" : "#3b82f6"}
            emissiveIntensity={0.5}
          />
        </Sphere>

        {/* Visor reflection */}
        <Sphere args={[0.15, 16, 16]} position={[-0.2, 1.35, 0.5]}>
          <meshStandardMaterial
            color="#fff"
            transparent
            opacity={0.4}
          />
        </Sphere>

        {/* Body - Space suit */}
        <RoundedBox args={[1.0, 1.3, 0.7]} radius={0.2} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#f8fafc"
            attach="material"
            distort={0.05}
            speed={1}
            roughness={0.3}
            metalness={0.4}
          />
        </RoundedBox>

        {/* Chest panel */}
        <RoundedBox args={[0.5, 0.4, 0.1]} radius={0.05} position={[0, 0.2, 0.35]}>
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.3}
            metalness={0.7}
          />
        </RoundedBox>

        {/* Control lights on chest */}
        <Sphere args={[0.05, 8, 8]} position={[-0.12, 0.28, 0.42]}>
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
        </Sphere>
        <Sphere args={[0.05, 8, 8]} position={[0, 0.28, 0.42]}>
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} />
        </Sphere>
        <Sphere args={[0.05, 8, 8]} position={[0.12, 0.28, 0.42]}>
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={hovered ? 3 : 1} />
        </Sphere>

        {/* Backpack */}
        <RoundedBox args={[0.6, 0.8, 0.4]} radius={0.1} position={[0, 0.1, -0.45]}>
          <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.5} />
        </RoundedBox>

        {/* Oxygen tubes */}
        <Torus args={[0.15, 0.03, 8, 32]} rotation={[0, Math.PI / 2, 0]} position={[0.35, 0.8, -0.1]}>
          <meshStandardMaterial color="#94a3b8" roughness={0.5} metalness={0.6} />
        </Torus>
        <Torus args={[0.15, 0.03, 8, 32]} rotation={[0, Math.PI / 2, 0]} position={[-0.35, 0.8, -0.1]}>
          <meshStandardMaterial color="#94a3b8" roughness={0.5} metalness={0.6} />
        </Torus>

        {/* Arms */}
        <RoundedBox args={[0.25, 0.7, 0.25]} radius={0.1} position={[-0.7, 0.1, 0]} rotation={[0, 0, 0.2]}>
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} metalness={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.25, 0.7, 0.25]} radius={0.1} position={[0.7, 0.1, 0]} rotation={[0, 0, -0.2]}>
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} metalness={0.3} />
        </RoundedBox>

        {/* Gloves */}
        <Sphere args={[0.15, 16, 16]} position={[-0.8, -0.25, 0]}>
          <meshStandardMaterial color="#f59e0b" roughness={0.5} />
        </Sphere>
        <Sphere args={[0.15, 16, 16]} position={[0.8, -0.25, 0]}>
          <meshStandardMaterial color="#f59e0b" roughness={0.5} />
        </Sphere>

        {/* Legs */}
        <RoundedBox args={[0.28, 0.6, 0.28]} radius={0.1} position={[-0.22, -0.9, 0]}>
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.28, 0.6, 0.28]} radius={0.1} position={[0.22, -0.9, 0]}>
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.3} />
        </RoundedBox>

        {/* Boots */}
        <RoundedBox args={[0.32, 0.2, 0.4]} radius={0.08} position={[-0.22, -1.25, 0.05]}>
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.4} />
        </RoundedBox>
        <RoundedBox args={[0.32, 0.2, 0.4]} radius={0.08} position={[0.22, -1.25, 0.05]}>
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.4} />
        </RoundedBox>

        {/* Flag/Badge on arm */}
        <RoundedBox args={[0.15, 0.1, 0.02]} radius={0.02} position={[-0.78, 0.3, 0.13]}>
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
        </RoundedBox>
      </Float>

      {/* Stars/particles around */}
      {[...Array(25)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 3 - 1.5
          ]}
        >
          <sphereGeometry args={[0.02 + Math.random() * 0.02, 6, 6]} />
          <meshBasicMaterial 
            color={i % 4 === 0 ? "#f59e0b" : i % 4 === 1 ? "#3b82f6" : i % 4 === 2 ? "#8b5cf6" : "#ffffff"} 
          />
        </mesh>
      ))}
    </group>
  );
};

interface FloatingCharacter3DProps {
  className?: string;
  position?: 'left' | 'right' | 'center';
}

const FloatingCharacter3D = ({ className = "", position = "right" }: FloatingCharacter3DProps) => {
  const positionClasses = {
    left: "left-4 md:left-8",
    right: "right-4 md:right-8",
    center: "left-1/2 -translate-x-1/2"
  };

  return (
    <div 
      className={`fixed bottom-20 ${positionClasses[position]} w-48 h-64 md:w-64 md:h-80 pointer-events-auto z-10 opacity-90 hover:opacity-100 transition-opacity ${className}`}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.9} color="#fff" />
        <pointLight position={[-5, 5, 5]} color="#3b82f6" intensity={0.5} />
        <pointLight position={[5, -5, 5]} color="#8b5cf6" intensity={0.4} />
        <pointLight position={[0, 0, 8]} color="#f59e0b" intensity={0.2} />
        <Suspense fallback={null}>
          <SpaceAstronaut />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default FloatingCharacter3D;
