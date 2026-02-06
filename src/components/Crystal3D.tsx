import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment, Sparkles } from '@react-three/drei';
import { useRef, Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';

// Store mouse position for interaction
const mousePos = { x: 0, y: 0 };

const FloatingCrystal = () => {
    const crystalRef = useRef<THREE.Mesh>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    const targetRotation = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
            mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        if (crystalRef.current) {
            // Smooth mouse following
            targetRotation.current.y = mousePos.x * 0.4;
            targetRotation.current.x = mousePos.y * 0.2;

            crystalRef.current.rotation.y = THREE.MathUtils.lerp(
                crystalRef.current.rotation.y,
                targetRotation.current.y + t * 0.3,
                0.05
            );
            crystalRef.current.rotation.x = THREE.MathUtils.lerp(
                crystalRef.current.rotation.x,
                targetRotation.current.x,
                0.05
            );

            // Floating animation
            crystalRef.current.position.y = Math.sin(t * 0.8) * 0.15;
        }

        if (coreRef.current) {
            // Pulsing core
            const pulse = 0.3 + Math.sin(t * 2) * 0.05;
            coreRef.current.scale.setScalar(pulse);
        }

        if (ringRef.current) {
            // Counter-rotating ring
            ringRef.current.rotation.z = -t * 0.5;
            ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
        }
    });

    return (
        <group>
            {/* Main Crystal - Octahedron */}
            <mesh
                ref={crystalRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color={hovered ? "#a855f7" : "#8b5cf6"}
                    metalness={0.9}
                    roughness={0.1}
                    emissive={hovered ? "#a855f7" : "#6366f1"}
                    emissiveIntensity={hovered ? 0.8 : 0.4}
                    transparent
                    opacity={0.85}
                />
            </mesh>

            {/* Inner Glowing Core */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial
                    color="#22d3ee"
                    emissive="#22d3ee"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>

            {/* Orbiting Ring */}
            <mesh ref={ringRef}>
                <torusGeometry args={[1.5, 0.02, 16, 100]} />
                <meshStandardMaterial
                    color="#f59e0b"
                    emissive="#f59e0b"
                    emissiveIntensity={1}
                />
            </mesh>

            {/* Second Ring - perpendicular */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.3, 0.015, 16, 100]} />
                <meshStandardMaterial
                    color="#ec4899"
                    emissive="#ec4899"
                    emissiveIntensity={0.8}
                />
            </mesh>

            {/* Sparkles around the crystal */}
            <Sparkles
                count={50}
                scale={4}
                size={2}
                speed={0.4}
                color="#8b5cf6"
            />

            {/* Small orbiting particles */}
            {[...Array(8)].map((_, i) => (
                <OrbitingParticle key={i} index={i} />
            ))}
        </group>
    );
};

// Individual orbiting particle component
const OrbitingParticle = ({ index }: { index: number }) => {
    const ref = useRef<THREE.Mesh>(null);
    const angle = (index / 8) * Math.PI * 2;
    const radius = 1.8 + (index % 3) * 0.2;
    const speed = 0.5 + (index % 2) * 0.3;

    useFrame((state) => {
        if (ref.current) {
            const t = state.clock.elapsedTime * speed + angle;
            ref.current.position.x = Math.cos(t) * radius;
            ref.current.position.z = Math.sin(t) * radius;
            ref.current.position.y = Math.sin(t * 2) * 0.3;
        }
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial
                color={index % 2 === 0 ? "#3b82f6" : "#8b5cf6"}
                emissive={index % 2 === 0 ? "#3b82f6" : "#8b5cf6"}
                emissiveIntensity={1}
            />
        </mesh>
    );
};

interface Crystal3DProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Crystal3D = ({ className = "", size = "lg" }: Crystal3DProps) => {
    const sizeClasses = {
        sm: "h-32 w-32",
        md: "h-48 w-48",
        lg: "h-64 w-64",
        xl: "h-80 w-80 md:h-96 md:w-96"
    };

    return (
        <div className={`${sizeClasses[size]} ${className}`}>
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                <color attach="background" args={['transparent']} />
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#fff" />
                <pointLight position={[-10, -10, -5]} color="#8b5cf6" intensity={0.5} />
                <pointLight position={[0, 5, 0]} color="#22d3ee" intensity={0.3} />
                <Suspense fallback={null}>
                    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                        <FloatingCrystal />
                    </Float>
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Crystal3D;
