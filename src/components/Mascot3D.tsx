import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, RoundedBox } from '@react-three/drei';
import { useRef, Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';

// Store mouse position globally for smooth tracking
const mousePosition = { x: 0, y: 0 };

const RobotMascot = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Target rotation values (where we want to go)
  const targetRotation = useRef({ x: 0, y: 0 });
  const targetScale = useRef(1);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Update target based on mouse position
      targetRotation.current.y = mousePosition.x * 0.5; // Rotate left/right
      targetRotation.current.x = mousePosition.y * 0.3; // Tilt up/down

      // Smoothly interpolate current rotation towards target (lerp)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        0.05
      );

      // Smooth scale animation for hover/click
      targetScale.current = clicked ? 0.9 : (hovered ? 1.15 : 1);
      const currentScale = groupRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale.current, 0.1);
      groupRef.current.scale.set(newScale, newScale, newScale);
    }
    if (headRef.current) {
      // Head bobbing animation
      headRef.current.position.y = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  const handlePointerDown = () => setClicked(true);
  const handlePointerUp = () => setClicked(false);

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => { setHovered(false); setClicked(false); }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        {/* Body */}
        <RoundedBox args={[1.2, 1.5, 0.8]} radius={0.2} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#8b5cf6"
            attach="material"
            distort={0.1}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </RoundedBox>

        {/* Head */}
        <Sphere ref={headRef} args={[0.5, 32, 32]} position={[0, 1.2, 0]}>
          <meshStandardMaterial
            color="#3b82f6"
            roughness={0.1}
            metalness={0.9}
            emissive="#3b82f6"
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
        </Sphere>

        {/* Eyes */}
        <Sphere args={[0.12, 16, 16]} position={[-0.18, 1.25, 0.4]}>
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.8} />
        </Sphere>
        <Sphere args={[0.12, 16, 16]} position={[0.18, 1.25, 0.4]}>
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.8} />
        </Sphere>
        <Sphere args={[0.06, 16, 16]} position={[-0.18, 1.25, 0.5]}>
          <meshStandardMaterial color="#1a1a2e" />
        </Sphere>
        <Sphere args={[0.06, 16, 16]} position={[0.18, 1.25, 0.5]}>
          <meshStandardMaterial color="#1a1a2e" />
        </Sphere>

        {/* Antenna */}
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
        <Sphere args={[0.08, 16, 16]} position={[0, 2, 0]}>
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={hovered ? 1 : 0.5}
          />
        </Sphere>

        {/* Arms */}
        <RoundedBox args={[0.25, 0.8, 0.25]} radius={0.1} position={[-0.85, 0.1, 0]}>
          <meshStandardMaterial color="#6366f1" roughness={0.2} metalness={0.8} />
        </RoundedBox>
        <RoundedBox args={[0.25, 0.8, 0.25]} radius={0.1} position={[0.85, 0.1, 0]}>
          <meshStandardMaterial color="#6366f1" roughness={0.2} metalness={0.8} />
        </RoundedBox>

        {/* Legs */}
        <RoundedBox args={[0.3, 0.6, 0.3]} radius={0.08} position={[-0.3, -1.0, 0]}>
          <meshStandardMaterial color="#4f46e5" roughness={0.2} metalness={0.8} />
        </RoundedBox>
        <RoundedBox args={[0.3, 0.6, 0.3]} radius={0.08} position={[0.3, -1.0, 0]}>
          <meshStandardMaterial color="#4f46e5" roughness={0.2} metalness={0.8} />
        </RoundedBox>

        {/* Core glow */}
        <Sphere args={[0.2, 16, 16]} position={[0, 0.2, 0.45]}>
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={1}
            transparent
            opacity={0.9}
          />
        </Sphere>

        {/* Orbit ring */}
        <Torus args={[1.8, 0.03, 16, 100]} rotation={[Math.PI / 2.5, 0, 0]} position={[0, 0.3, 0]}>
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.5}
          />
        </Torus>
      </Float>

      {/* Particles */}
      {[...Array(30)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 3 - 1
          ]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#8b5cf6" : "#3b82f6"} />
        </mesh>
      ))}
    </group>
  );
};

interface Mascot3DProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Mascot3D = ({ className = "", size = "lg" }: Mascot3DProps) => {
  const sizeClasses = {
    sm: "h-32 w-32",
    md: "h-48 w-48",
    lg: "h-64 w-64",
    xl: "h-80 w-80 md:h-96 md:w-96"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#fff" />
        <pointLight position={[-10, -10, -10]} color="#8b5cf6" intensity={0.5} />
        <pointLight position={[0, 5, 5]} color="#3b82f6" intensity={0.3} />
        <Suspense fallback={null}>
          <RobotMascot />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Mascot3D;
