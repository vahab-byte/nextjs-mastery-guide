import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Center, RoundedBox, Environment, PerspectiveCamera, Stars } from "@react-three/drei";
import { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";

const GeometricN = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Create geometry references for animation
  const leftBarRef = useRef<THREE.Mesh>(null);
  const diagonalRef = useRef<THREE.Mesh>(null);
  const rightBarRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle overall floating rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
    }

    // Subtle individual animations
    if (diagonalRef.current) {
      // Pulse effect on diagonal
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      diagonalRef.current.scale.set(1, scale, 1);
    }
  });

  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#0070f3", // Next.js Blue
    roughness: 0.1,
    metalness: 0.8,
    transmission: 0.5, // Glass-like
    thickness: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }), []);

  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#7928ca", // Purple accent
    emissive: "#7928ca",
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.8,
  }), []);

  return (
    <group ref={groupRef}>
      <Center>
        {/* Left Vertical Bar */}
        <RoundedBox ref={leftBarRef} args={[0.8, 4, 0.8]} radius={0.1} position={[-1.2, 0, 0]}>
          <primitive object={material} />
        </RoundedBox>

        {/* Diagonal Bar */}
        <RoundedBox
          ref={diagonalRef}
          args={[0.7, 4.6, 0.7]}
          radius={0.1}
          position={[0, 0, 0]}
          rotation={[0, 0, 0.55]} // Angled for 'N'
        >
          <primitive object={accentMaterial} />
        </RoundedBox>

        {/* Right Vertical Bar */}
        <RoundedBox ref={rightBarRef} args={[0.8, 4, 0.8]} radius={0.1} position={[1.2, 0, 0]}>
          <primitive object={material} />
        </RoundedBox>

        {/* Decorative Particles */}
        <mesh position={[2, 2, -1]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial color="#ff0080" emissive="#ff0080" emissiveIntensity={2} />
        </mesh>
        <mesh position={[-2, -1.5, 1]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
        </mesh>

      </Center>
    </group>
  );
};

interface Logo3DProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo3D = ({ className = "", size = "md" }: Logo3DProps) => {
  const sizeClasses = {
    sm: "h-12 w-12", // Increased slightly for visibility
    md: "h-24 w-24",
    lg: "h-32 w-32 md:h-40 md:w-40",
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <Canvas dpr={[1, 1]} gl={{ powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />

        {/* Lighting - Optimized */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#7928ca" />

        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <GeometricN />
          </Float>
          <Environment preset="city" />
          {/* Stars removed for performance */}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Logo3D;
