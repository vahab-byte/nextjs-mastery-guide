import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Text, Sparkles, Text3D, Center } from '@react-three/drei';
import { useRef, Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';

// Mouse position for smooth tracking
const mousePos = { x: 0, y: 0 };

// Next.js "N" Logo Component
const NextLogo = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Main "N" shape using boxes */}
            {/* Left vertical bar */}
            <RoundedBox args={[0.3, 1.8, 0.3]} radius={0.05} position={[-0.6, 0, 0]}>
                <meshStandardMaterial
                    color="#ffffff"
                    roughness={0.1}
                    metalness={0.8}
                    emissive="#ffffff"
                    emissiveIntensity={0.1}
                />
            </RoundedBox>

            {/* Diagonal bar */}
            <RoundedBox args={[0.3, 2.2, 0.3]} radius={0.05} position={[0, 0, 0]} rotation={[0, 0, -0.55]}>
                <meshStandardMaterial
                    color="#ffffff"
                    roughness={0.1}
                    metalness={0.8}
                    emissive="#ffffff"
                    emissiveIntensity={0.1}
                />
            </RoundedBox>

            {/* Right vertical bar */}
            <RoundedBox args={[0.3, 1.8, 0.3]} radius={0.05} position={[0.6, 0, 0]}>
                <meshStandardMaterial
                    color="#ffffff"
                    roughness={0.1}
                    metalness={0.8}
                    emissive="#ffffff"
                    emissiveIntensity={0.1}
                />
            </RoundedBox>

            {/* Glowing outline effect */}
            <mesh position={[0, 0, -0.2]}>
                <planeGeometry args={[2, 2.2]} />
                <meshStandardMaterial
                    color="#8b5cf6"
                    emissive="#8b5cf6"
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.3}
                />
            </mesh>
        </group>
    );
};

// Floating Learning Icons
const LearningIcon = ({ position, iconType, delay = 0 }: { position: [number, number, number], iconType: 'book' | 'code' | 'certificate' | 'rocket', delay?: number }) => {
    const ref = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (ref.current) {
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + delay) * 0.15;
            ref.current.rotation.y = state.clock.elapsedTime * 0.3 + delay;
        }
    });

    const getColor = () => {
        switch (iconType) {
            case 'book': return '#8b5cf6';
            case 'code': return '#22d3ee';
            case 'certificate': return '#f59e0b';
            case 'rocket': return '#ec4899';
            default: return '#8b5cf6';
        }
    };

    return (
        <group ref={ref} position={position}>
            {iconType === 'book' && (
                <>
                    <RoundedBox args={[0.4, 0.5, 0.08]} radius={0.02}>
                        <meshStandardMaterial color={getColor()} emissive={getColor()} emissiveIntensity={0.5} />
                    </RoundedBox>
                    <mesh position={[-0.18, 0, 0.05]}>
                        <boxGeometry args={[0.02, 0.4, 0.1]} />
                        <meshStandardMaterial color="#fff" />
                    </mesh>
                </>
            )}
            {iconType === 'code' && (
                <>
                    <mesh>
                        <boxGeometry args={[0.5, 0.35, 0.05]} />
                        <meshStandardMaterial color="#1a1a2e" emissive={getColor()} emissiveIntensity={0.2} />
                    </mesh>
                    {[0, 1, 2].map((i) => (
                        <mesh key={i} position={[-0.1, 0.08 - i * 0.1, 0.03]}>
                            <boxGeometry args={[0.25 - i * 0.05, 0.04, 0.01]} />
                            <meshStandardMaterial color={getColor()} emissive={getColor()} emissiveIntensity={0.8} />
                        </mesh>
                    ))}
                </>
            )}
            {iconType === 'certificate' && (
                <>
                    <RoundedBox args={[0.45, 0.35, 0.03]} radius={0.02}>
                        <meshStandardMaterial color="#fef3c7" />
                    </RoundedBox>
                    <mesh position={[0, 0.02, 0.02]}>
                        <circleGeometry args={[0.08, 32]} />
                        <meshStandardMaterial color={getColor()} emissive={getColor()} emissiveIntensity={0.5} />
                    </mesh>
                </>
            )}
            {iconType === 'rocket' && (
                <>
                    <mesh rotation={[0, 0, 0.5]}>
                        <coneGeometry args={[0.12, 0.4, 32]} />
                        <meshStandardMaterial color={getColor()} emissive={getColor()} emissiveIntensity={0.5} />
                    </mesh>
                    <mesh position={[0.15, -0.15, 0]}>
                        <coneGeometry args={[0.08, 0.15, 32]} />
                        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1} />
                    </mesh>
                </>
            )}
        </group>
    );
};

// Orbiting Ring with code snippets
const CodeOrbit = () => {
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <group>
            {/* Main orbit ring */}
            <mesh ref={ringRef} rotation={[0.3, 0, 0]}>
                <torusGeometry args={[2.5, 0.015, 16, 100]} />
                <meshStandardMaterial
                    color="#8b5cf6"
                    emissive="#8b5cf6"
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.6}
                />
            </mesh>

            {/* Second ring */}
            <mesh rotation={[0.5, 0.3, 0]}>
                <torusGeometry args={[2.2, 0.01, 16, 100]} />
                <meshStandardMaterial
                    color="#22d3ee"
                    emissive="#22d3ee"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.4}
                />
            </mesh>
        </group>
    );
};

// Main Hero Component
const NextJSHero = () => {
    const mainRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    const targetRotation = useRef({ x: 0, y: 0 });
    const targetScale = useRef(1);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
            mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        if (mainRef.current) {
            // Smooth mouse following
            targetRotation.current.y = mousePos.x * 0.2;
            targetRotation.current.x = mousePos.y * 0.1;

            mainRef.current.rotation.y = THREE.MathUtils.lerp(
                mainRef.current.rotation.y,
                targetRotation.current.y,
                0.03
            );
            mainRef.current.rotation.x = THREE.MathUtils.lerp(
                mainRef.current.rotation.x,
                targetRotation.current.x,
                0.03
            );

            // Smooth scale
            targetScale.current = hovered ? 1.05 : 1;
            const currentScale = mainRef.current.scale.x;
            const newScale = THREE.MathUtils.lerp(currentScale, targetScale.current, 0.1);
            mainRef.current.scale.set(newScale, newScale, newScale);
        }
    });

    return (
        <group
            ref={mainRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.15}>
                {/* Central Next.js Logo */}
                <NextLogo />

                {/* Orbiting Rings */}
                <CodeOrbit />

                {/* Floating Learning Icons */}
                <LearningIcon position={[-2, 0.8, 0.5]} iconType="book" delay={0} />
                <LearningIcon position={[2, 0.5, 0.3]} iconType="code" delay={1} />
                <LearningIcon position={[1.8, -1, 0.4]} iconType="certificate" delay={2} />
                <LearningIcon position={[-1.8, -0.8, 0.6]} iconType="rocket" delay={3} />

                {/* Glowing Background Sphere */}
                <mesh position={[0, 0, -0.5]}>
                    <sphereGeometry args={[1.5, 32, 32]} />
                    <meshStandardMaterial
                        color="#1a1a2e"
                        emissive="#3b82f6"
                        emissiveIntensity={0.15}
                        transparent
                        opacity={0.3}
                    />
                </mesh>

                {/* Accent orbs */}
                <mesh position={[-1.5, 1.5, -0.3]}>
                    <sphereGeometry args={[0.08, 32, 32]} />
                    <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} toneMapped={false} />
                </mesh>
                <mesh position={[1.5, 1.2, 0.2]}>
                    <sphereGeometry args={[0.06, 32, 32]} />
                    <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} toneMapped={false} />
                </mesh>
                <mesh position={[0.5, -1.5, 0.3]}>
                    <sphereGeometry args={[0.07, 32, 32]} />
                    <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2} toneMapped={false} />
                </mesh>
                <mesh position={[-1, -1.3, -0.2]}>
                    <sphereGeometry args={[0.05, 32, 32]} />
                    <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2} toneMapped={false} />
                </mesh>

                {/* Sparkles */}
                <Sparkles
                    count={60}
                    scale={5}
                    size={1.5}
                    speed={0.3}
                    color="#8b5cf6"
                />
            </Float>
        </group>
    );
};

interface Hero3DProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Hero3D = ({ className = "", size = "xl" }: Hero3DProps) => {
    const sizeClasses = {
        sm: "h-48 w-48",
        md: "h-64 w-64",
        lg: "h-80 w-80",
        xl: "h-96 w-96 md:h-[28rem] md:w-[28rem]"
    };

    return (
        <div className={`${sizeClasses[size]} ${className}`}>
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <color attach="background" args={['transparent']} />
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#fff" />
                <pointLight position={[-5, 5, -5]} color="#8b5cf6" intensity={0.8} />
                <pointLight position={[5, -5, 5]} color="#22d3ee" intensity={0.5} />
                <spotLight position={[0, 10, 5]} angle={0.3} penumbra={1} intensity={0.5} />
                <Suspense fallback={null}>
                    <NextJSHero />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Hero3D;
