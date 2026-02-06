import { ReactLenis } from "@studio-freight/react-lenis";

interface SmoothScrollProps {
    children: React.ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
            {children}
        </ReactLenis>
    );
};

export default SmoothScroll;
