import { useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Environment, ContactShadows, Center, Html, useProgress, Text } from "@react-three/drei";
import * as THREE from "three";

interface RobotModelProps {
    autoRotate?: boolean;
    scale?: number;
    className?: string;
}

function Loader() {
    const { progress } = useProgress()
    return <Html center><span style={{ color: 'white' }}>{progress.toFixed(0)}%</span></Html>
}

const Robot = ({ scale = 2 }: { scale: number }) => {
    const groupRef = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF("/models/futuristic_robot.glb");
    const { actions } = useAnimations(animations, groupRef);
    const { mouse, viewport } = useThree();

    // Play all animations from the GLB file
    useEffect(() => {
        // Play the first available animation, or all of them
        if (actions) {
            Object.values(actions).forEach((action) => {
                if (action) {
                    action.reset().fadeIn(0.5).play();
                }
            });
        }
        return () => {
            // Cleanup: stop animations when component unmounts
            Object.values(actions).forEach((action) => {
                if (action) {
                    action.fadeOut(0.5);
                }
            });
        };
    }, [actions]);

    // Apply premium materials to the robot
    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // Safer approach: Modify existing material instead of replacing it
                // This ensures we don't lose textures or specific color mappings
                if ((mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                    const mat = mesh.material as THREE.MeshStandardMaterial;
                    mat.roughness = 0.3; // Balanced smoothness
                    mat.metalness = 0.5; // Balanced metallic look
                    mat.envMapIntensity = 1.0;
                    mat.needsUpdate = true;
                }
            }
        });
    }, [scene]);

    useFrame((state) => {
        if (groupRef.current) {
            // Gentle floating animation
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

            // Mouse tracking logic
            const targetRotationY = (mouse.x * viewport.width) / 10;
            const targetRotationX = (mouse.y * viewport.height) / 10;

            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                targetRotationY,
                0.1
            );
            groupRef.current.rotation.x = THREE.MathUtils.lerp(
                groupRef.current.rotation.x,
                targetRotationX * 0.2, // Limit vertical rotation
                0.1
            );

            // Add slight position movement (parallax)
            groupRef.current.position.x = THREE.MathUtils.lerp(
                groupRef.current.position.x,
                mouse.x * 0.5,
                0.05
            );
        }
    });

    // Laptop specific elements commented out for new model compatibility
    /*
    <pointLight
        position={[0, 0.5, 0.5]}
        intensity={5}
        distance={2}
        color="#00ffff"
        decay={2}
    />
    <group position={[0, 0.52, 0.6]} rotation={[-0.5, 0, 0]}>
        <mesh>
            <planeGeometry args={[0.45, 0.3]} />
            <meshBasicMaterial color="#000000" />
        </mesh>
        <Text
            position={[0, 0, 0.01]}
            fontSize={0.06}
            color="#00ffff"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff"
        >
            {`<Dev_Mode />`}
        </Text>
        <mesh position={[0, -0.08, 0.01]}>
            <planeGeometry args={[0.3, 0.015]} />
            <meshBasicMaterial color="#00ffff" />
        </mesh>
    </group>
    <pointLight position={[0, 0.5, 0.5]} distance={1} intensity={1} color="#00ffff" />
    */

    return (
        <group ref={groupRef}>
            {/* Auto-centering the model to ensure it's always in the middle */}
            <Center>
                <primitive
                    object={scene}
                    scale={scale}
                    rotation={[0, 0, 0]}
                />
            </Center>
        </group>
    );
};

const RobotModel = ({
    autoRotate = false,
    scale = 4.5,
    className = "w-full h-[600px]"
}: RobotModelProps) => {
    return (
        <div className={className}>
            <Canvas
                camera={{ position: [0, 0, 10], fov: 45 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: true
                }}
                style={{ background: "transparent" }}
                dpr={[1, 1.5]} // Cap DPI to save GPU
            >
                {/* Optimized Lighting Setup */}
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
                <spotLight position={[-5, 5, 5]} intensity={1} angle={0.5} penumbra={1} />
                {/* Rim Light for Cinematic Effect */}
                <spotLight position={[0, 5, -5]} intensity={2} angle={0.5} penumbra={1} color="#8b5cf6" />
                <pointLight position={[5, -5, 5]} intensity={1} color="#00ffff" />
                <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff00ff" />

                <Suspense fallback={<Loader />}>
                    <Robot scale={scale} />
                    <Environment preset="city" blur={0.8} />
                    {/* Realistic Ground Shadows */}
                    <ContactShadows
                        resolution={256}
                        scale={10}
                        blur={2}
                        opacity={0.5}
                        far={10}
                        color="#000000"
                        frames={1}
                    />
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    enableRotate={true}
                    autoRotate={autoRotate}
                    autoRotateSpeed={0.5}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.5}
                />

            </Canvas>
        </div>
    );
};

// Preload the model
useGLTF.preload("/models/futuristic_robot.glb");

export default RobotModel;
