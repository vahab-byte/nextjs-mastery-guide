import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
    minDisplayTime?: number;
}

const PageLoader = ({ minDisplayTime = 1500 }: PageLoaderProps) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => {
            // Wait for minimum display time for smooth UX
            setTimeout(() => {
                setLoading(false);
            }, minDisplayTime);
        };

        // Check if document is already loaded
        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, [minDisplayTime]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900"
                >
                    <div className="flex flex-col items-center gap-8">
                        {/* Animated Logo/Icon */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="relative"
                        >
                            {/* Glowing background */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 blur-2xl opacity-50 animate-pulse" />

                            {/* Main icon container */}
                            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 p-1 shadow-2xl">
                                <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                        NX
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Loading text */}
                        <div className="flex flex-col items-center gap-3">
                            <h2 className="text-xl font-semibold text-white/90">
                                NextJS Mastery
                            </h2>

                            {/* Animated dots */}
                            <div className="flex gap-2">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            y: [0, -10, 0],
                                            opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            repeat: Infinity,
                                            delay: i * 0.15,
                                            ease: 'easeInOut',
                                        }}
                                        className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="w-full h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PageLoader;
