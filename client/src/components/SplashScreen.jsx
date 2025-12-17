import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Show splash for 2.5 seconds then fade out
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onComplete();
        }
    };

    return (
        <AnimatePresence onExitComplete={handleAnimationComplete}>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--color-background)',
                        zIndex: 9999
                    }}
                >
                    {/* Background Orbs */}
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            top: '20%',
                            left: '20%',
                            width: '300px',
                            height: '300px',
                            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
                            filter: 'blur(60px)'
                        }}
                    />
                    <motion.div
                        animate={{
                            scale: [1.3, 1, 1.3],
                            rotate: [360, 180, 0]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            bottom: '20%',
                            right: '20%',
                            width: '250px',
                            height: '250px',
                            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)',
                            filter: 'blur(60px)'
                        }}
                    />

                    {/* Logo Animation */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            duration: 0.8,
                            type: "spring",
                            stiffness: 200
                        }}
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '32px',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 60px rgba(124, 58, 237, 0.5)',
                            marginBottom: '32px'
                        }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                            <Palette size={56} color="white" />
                        </motion.div>
                    </motion.div>

                    {/* Text Animation */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        style={{
                            fontSize: '3rem',
                            fontWeight: '800',
                            marginBottom: '16px'
                        }}
                    >
                        Art<span className="text-gradient">Folio</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        style={{
                            color: 'var(--color-text-muted)',
                            fontSize: '1.1rem',
                            marginBottom: '48px'
                        }}
                    >
                        Digital Art Portfolio & Gallery
                    </motion.p>

                    {/* Loading Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        style={{
                            width: '200px',
                            height: '4px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}
                    >
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{
                                duration: 1.2,
                                repeat: 1,
                                ease: "easeInOut"
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, var(--color-primary), var(--color-secondary), transparent)'
                            }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
