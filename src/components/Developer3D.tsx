import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Sphere } from '@react-three/drei';
import { useRef, Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';

// Mouse position for smooth tracking
const mousePos = { x: 0, y: 0 };

const Developer = () => {
    const groupRef = useRef<THREE.Group>(null);
    const laptopRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);

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
        const t = state.clock.elapsedTime;

        if (groupRef.current) {
            // Smooth mouse following
            targetRotation.current.y = mousePos.x * 0.3;
            targetRotation.current.x = mousePos.y * 0.15;

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

            // Smooth scale for hover/click
            targetScale.current = clicked ? 0.95 : (hovered ? 1.08 : 1);
            const currentScale = groupRef.current.scale.x;
            const newScale = THREE.MathUtils.lerp(currentScale, targetScale.current, 0.1);
            groupRef.current.scale.set(newScale, newScale, newScale);
        }

        if (headRef.current) {
            // Subtle head movement
            headRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
        }

        if (laptopRef.current) {
            // Laptop screen glow animation
            laptopRef.current.position.y = Math.sin(t * 2) * 0.02;
        }
    });

    return (
        <group
            ref={groupRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => { setHovered(false); setClicked(false); }}
            onPointerDown={() => setClicked(true)}
            onPointerUp={() => setClicked(false)}
        >
            <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.3}>
                {/* === BODY === */}
                {/* Torso */}
                <RoundedBox args={[0.9, 1.2, 0.5]} radius={0.15} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.1} />
                </RoundedBox>

                {/* Shoulders */}
                <RoundedBox args={[1.3, 0.25, 0.4]} radius={0.1} position={[0, 0.5, 0]}>
                    <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.1} />
                </RoundedBox>

                {/* === HEAD === */}
                <group ref={headRef} position={[0, 1.1, 0]}>
                    {/* Head base */}
                    <Sphere args={[0.35, 32, 32]}>
                        <meshStandardMaterial color="#fcd9b6" roughness={0.6} />
                    </Sphere>

                    {/* Hair */}
                    <Sphere args={[0.36, 32, 32]} position={[0, 0.08, -0.02]}>
                        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
                    </Sphere>

                    {/* Eyes */}
                    <Sphere args={[0.05, 16, 16]} position={[-0.12, 0, 0.3]}>
                        <meshStandardMaterial color="#1a1a2e" />
                    </Sphere>
                    <Sphere args={[0.05, 16, 16]} position={[0.12, 0, 0.3]}>
                        <meshStandardMaterial color="#1a1a2e" />
                    </Sphere>

                    {/* Smile */}
                    <mesh position={[0, -0.12, 0.32]} rotation={[0, 0, 0]}>
                        <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
                        <meshStandardMaterial color="#d4a574" />
                    </mesh>

                    {/* Glasses */}
                    <mesh position={[-0.12, 0, 0.32]}>
                        <torusGeometry args={[0.09, 0.015, 8, 16]} />
                        <meshStandardMaterial color="#1a1a2e" metalness={0.8} />
                    </mesh>
                    <mesh position={[0.12, 0, 0.32]}>
                        <torusGeometry args={[0.09, 0.015, 8, 16]} />
                        <meshStandardMaterial color="#1a1a2e" metalness={0.8} />
                    </mesh>
                    {/* Glasses bridge */}
                    <mesh position={[0, 0, 0.33]}>
                        <boxGeometry args={[0.08, 0.02, 0.02]} />
                        <meshStandardMaterial color="#1a1a2e" metalness={0.8} />
                    </mesh>
                </group>

                {/* === ARMS === */}
                {/* Left arm */}
                <RoundedBox args={[0.2, 0.8, 0.2]} radius={0.08} position={[-0.7, 0.1, 0.3]} rotation={[0.3, 0, 0.2]}>
                    <meshStandardMaterial color="#3b82f6" roughness={0.4} />
                </RoundedBox>
                {/* Left hand */}
                <Sphere args={[0.12, 16, 16]} position={[-0.65, -0.3, 0.55]}>
                    <meshStandardMaterial color="#fcd9b6" roughness={0.6} />
                </Sphere>

                {/* Right arm */}
                <RoundedBox args={[0.2, 0.8, 0.2]} radius={0.08} position={[0.7, 0.1, 0.3]} rotation={[0.3, 0, -0.2]}>
                    <meshStandardMaterial color="#3b82f6" roughness={0.4} />
                </RoundedBox>
                {/* Right hand */}
                <Sphere args={[0.12, 16, 16]} position={[0.65, -0.3, 0.55]}>
                    <meshStandardMaterial color="#fcd9b6" roughness={0.6} />
                </Sphere>

                {/* === LAPTOP === */}
                <group ref={laptopRef} position={[0, -0.2, 0.7]}>
                    {/* Laptop base */}
                    <RoundedBox args={[0.9, 0.05, 0.6]} radius={0.02} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.7} />
                    </RoundedBox>

                    {/* Keyboard area */}
                    <mesh position={[0, 0.03, 0]}>
                        <boxGeometry args={[0.8, 0.01, 0.5]} />
                        <meshStandardMaterial color="#1f2937" roughness={0.5} />
                    </mesh>

                    {/* Laptop screen (tilted) */}
                    <group position={[0, 0.35, -0.28]} rotation={[-0.3, 0, 0]}>
                        <RoundedBox args={[0.88, 0.6, 0.03]} radius={0.02}>
                            <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.7} />
                        </RoundedBox>

                        {/* Screen display */}
                        <mesh position={[0, 0, 0.02]}>
                            <planeGeometry args={[0.78, 0.5]} />
                            <meshStandardMaterial
                                color="#8b5cf6"
                                emissive="#8b5cf6"
                                emissiveIntensity={hovered ? 0.8 : 0.4}
                            />
                        </mesh>

                        {/* Code lines on screen */}
                        {[...Array(5)].map((_, i) => (
                            <mesh key={i} position={[-0.2 + (i % 2) * 0.1, 0.15 - i * 0.08, 0.025]}>
                                <boxGeometry args={[0.3 - (i % 3) * 0.05, 0.02, 0.001]} />
                                <meshStandardMaterial
                                    color="#22d3ee"
                                    emissive="#22d3ee"
                                    emissiveIntensity={0.5}
                                />
                            </mesh>
                        ))}

                        {/* Logo on screen */}
                        <mesh position={[0, -0.1, 0.025]}>
                            <circleGeometry args={[0.08, 32]} />
                            <meshStandardMaterial
                                color="#f59e0b"
                                emissive="#f59e0b"
                                emissiveIntensity={0.6}
                            />
                        </mesh>
                    </group>
                </group>

                {/* === LEGS === */}
                <RoundedBox args={[0.3, 0.9, 0.3]} radius={0.1} position={[-0.25, -1, 0]}>
                    <meshStandardMaterial color="#1f2937" roughness={0.5} />
                </RoundedBox>
                <RoundedBox args={[0.3, 0.9, 0.3]} radius={0.1} position={[0.25, -1, 0]}>
                    <meshStandardMaterial color="#1f2937" roughness={0.5} />
                </RoundedBox>

                {/* Shoes */}
                <RoundedBox args={[0.32, 0.15, 0.45]} radius={0.05} position={[-0.25, -1.5, 0.05]}>
                    <meshStandardMaterial color="#f59e0b" roughness={0.4} />
                </RoundedBox>
                <RoundedBox args={[0.32, 0.15, 0.45]} radius={0.05} position={[0.25, -1.5, 0.05]}>
                    <meshStandardMaterial color="#f59e0b" roughness={0.4} />
                </RoundedBox>
            </Float>
        </group>
    );
};

interface Developer3DProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Developer3D = ({ className = "", size = "lg" }: Developer3DProps) => {
    const sizeClasses = {
        sm: "h-48 w-48",
        md: "h-64 w-64",
        lg: "h-80 w-80",
        xl: "h-96 w-96 md:h-[28rem] md:w-[28rem]"
    };

    return (
        <div className={`${sizeClasses[size]} ${className}`}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <color attach="background" args={['transparent']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#fff" />
                <pointLight position={[-10, 5, -10]} color="#8b5cf6" intensity={0.4} />
                <pointLight position={[0, -5, 5]} color="#22d3ee" intensity={0.3} />
                <directionalLight position={[5, 5, 5]} intensity={0.5} />
                <Suspense fallback={null}>
                    <Developer />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Developer3D;
