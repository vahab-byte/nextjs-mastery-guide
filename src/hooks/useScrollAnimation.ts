import { useEffect, useRef, useState } from 'react';

// Hook to trigger animations when element comes into view
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Once visible, stop observing
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
}

// Hook for staggered children animations
export function useStaggeredAnimation(itemCount: number, baseDelay: number = 100) {
    const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Stagger the visibility of each item
                    for (let i = 0; i < itemCount; i++) {
                        setTimeout(() => {
                            setVisibleItems((prev) => {
                                const newState = [...prev];
                                newState[i] = true;
                                return newState;
                            });
                        }, i * baseDelay);
                    }
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [itemCount, baseDelay]);

    return { containerRef, visibleItems };
}

// Smooth scroll to element
export function smoothScrollTo(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
}

// Animation variants for common use cases
export const animationVariants = {
    fadeInUp: 'animate-fade-in-up',
    fadeInDown: 'animate-fade-in-down',
    fadeInLeft: 'animate-fade-in-left',
    fadeInRight: 'animate-fade-in-right',
    fadeIn: 'animate-fade-in',
    scaleIn: 'animate-scale-in',
};

// Get staggered delay class
export function getDelayClass(index: number, baseDelay: number = 100): string {
    const delay = Math.min((index + 1) * baseDelay, 800);
    return `delay-${delay}`;
}
