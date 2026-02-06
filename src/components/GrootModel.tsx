import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

interface GrootModelProps {
    autoRotate?: boolean;
    scale?: number;
    className?: string;
}

const Groot = ({ scale = 2 }: { scale: number }) => {
    const groupRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF("/models/groot.glb");
    const { mouse, viewport } = useThree();

    useFrame((state) => {
        if (groupRef.current) {
            // Gentle floating animation
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

            // Mouse tracking logic
            // Calculate target rotation based on mouse position
            // Mouse x goes from -1 to 1
            const targetRotationY = (mouse.x * viewport.width) / 10;
            const targetRotationX = (mouse.y * viewport.height) / 10;

            // Smoothly interpolate current rotation to target rotation
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

    return (
        <group ref={groupRef}>
            <primitive
                object={scene}
                scale={scale}
                position={[0, -2, 0]} // Adjusted relative to group
                rotation={[0, 0, 0]}
            />
        </group>
    );
};

const GrootModel = ({
    autoRotate = false,
    scale = 7, // Updated default
    className = "w-full h-[600px]"
}: GrootModelProps) => {
    return (
        <div className={className}>
            <Canvas
                camera={{ position: [0, 0, 7], fov: 40 }} // Adjusted camera
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={1.2} />
                <directionalLight position={[2, 5, 5]} intensity={2.5} castShadow />
                <spotLight position={[-5, 5, 5]} intensity={1} angle={0.5} color="#a78bfa" />
                <pointLight position={[5, -5, 5]} intensity={0.8} color="#fcd34d" />

                <Suspense fallback={null}>
                    <Groot scale={scale} />
                    <Environment preset="city" />
                    <ContactShadows
                        position={[0, -2.5, 0]}
                        opacity={0.6}
                        scale={12}
                        blur={2.5}
                    />
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    enableRotate={false} // Disable manual rotation to let mouse tracking work
                />
            </Canvas>
        </div>
    );
};

// Preload the model
useGLTF.preload("/models/groot.glb");

export default GrootModel;
