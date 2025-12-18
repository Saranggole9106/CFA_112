/**
 * Home Component (Landing Page)
 * 
 * The entry point for the ArtFolio application.
 * Designed to immediately impress visitors with high-quality visuals and clear value propositions.
 * 
 * Features:
 * - Immersive Hero Section: Uses animated gradient orbs and glassmorphism.
 * - Value Proposition: "Showcase", "Build", "Sell", "Discover" cards.
 * - Social Proof: Live stats counter (mocked for now) and featured artworks.
 * - Call to Action (CTA): Prompts both collectors and artists to sign up or browse.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Palette, Heart, ShoppingBag, Users, Award, ArrowRight, Star, Zap, Globe } from 'lucide-react';
import MasonryGrid from '../components/MasonryGrid';
import { artworks as mockArtworks } from '../data/mockData';

const Home = () => {
    // Data State to hold featured artworks (fetched from API)
    const [featuredArtworks, setFeaturedArtworks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Animation State for cycling through feature highlights
    const [activeFeature, setActiveFeature] = useState(0);

    // Static Content Configuration
    const features = [
        {
            icon: Palette,
            title: "Showcase Your Art",
            description: "Create a stunning portfolio to display your masterpieces to the world",
            color: "#8b5cf6"
        },
        {
            icon: Heart,
            title: "Build Community",
            description: "Connect with art lovers, receive feedback, and grow your audience",
            color: "#ec4899"
        },
        {
            icon: ShoppingBag,
            title: "Sell Your Work",
            description: "Monetize your creativity with print sales and commission requests",
            color: "#22c55e"
        },
        {
            icon: Award,
            title: "Get Discovered",
            description: "Featured collections and curated galleries highlight exceptional talent",
            color: "#f59e0b"
        }
    ];

    const stats = [
        { value: "10K+", label: "Artists", icon: Users },
        { value: "50K+", label: "Artworks", icon: Palette },
        { value: "100K+", label: "Art Lovers", icon: Heart },
        { value: "$2M+", label: "Earned", icon: Zap }
    ];

    /**
     * Effect: Fetch Featured Artworks
     * Retrieves the latest artworks to display in the "Featured" section.
     * Limits the result to 8 items for a clean layout.
     */
    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                // Attempt to fetch from API
                const res = await fetch('/api/artworks');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setFeaturedArtworks(data.slice(0, 8));
                    } else {
                        // API empty -> Use Mock Data
                        console.warn('API returned empty, using mock data');
                        setFeaturedArtworks(mockArtworks.slice(0, 8));
                    }
                } else {
                    throw new Error('API response not ok');
                }
            } catch (err) {
                console.error('Failed to fetch featured artworks, falling back to mock data', err);
                setFeaturedArtworks(mockArtworks.slice(0, 8));
            } finally {
                setIsLoading(false);
            }
        };
        fetchArtworks();
    }, []);

    /**
     * Effect: Cycle Active Feature
     * Automatically rotates the "active" highlight in the features section every 3 seconds
     * to draw attention to different value props.
     */
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
            {/* 
                HERO SECTION 
                Contains the main headline, animated background orbs, and primary CTAs.
            */}
            <section style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '100px',
                paddingBottom: '60px'
            }}>
                {/* Background Layer: Animated Gradient Orbs */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    zIndex: -1
                }}>
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            position: 'absolute',
                            top: '10%',
                            left: '20%',
                            width: '600px',
                            height: '600px',
                            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
                            filter: 'blur(60px)',
                        }}
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.3, 0.4, 0.3],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '10%',
                            right: '10%',
                            width: '500px',
                            height: '500px',
                            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
                            filter: 'blur(60px)',
                        }}
                    />
                    {/* Grid Overlay for Texture */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)'
                    }} />
                </div>

                {/* Hero Content */}
                <div className="container" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: 'rgba(124, 58, 237, 0.15)',
                            border: '1px solid rgba(124, 58, 237, 0.3)',
                            borderRadius: '50px',
                            marginBottom: '32px'
                        }}
                    >
                        <Sparkles size={16} color="#a78bfa" />
                        <span style={{ fontSize: '0.875rem', color: '#a78bfa', fontWeight: '500' }}>
                            The Premier Art Platform
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                            fontWeight: '800',
                            lineHeight: '1.1',
                            marginBottom: '24px',
                            maxWidth: '900px'
                        }}
                    >
                        Where <span className="text-gradient">Artists</span> Meet
                        <br />Their Audience
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{
                            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                            color: 'var(--color-text-muted)',
                            maxWidth: '600px',
                            marginBottom: '40px',
                            lineHeight: '1.7'
                        }}
                    >
                        Showcase your portfolio, connect with collectors, sell prints,
                        and accept commissions. Your creative journey starts here.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        style={{
                            display: 'flex',
                            gap: '16px',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            marginBottom: '60px'
                        }}
                    >
                        <Link to="/explore" className="btn-primary">
                            <Globe size={20} />
                            Explore Gallery
                        </Link>
                        <Link to="/register" className="btn-secondary">
                            <Palette size={20} />
                            Join as Artist
                        </Link>
                    </motion.div>

                    {/* Stats Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        style={{
                            display: 'flex',
                            gap: '40px',
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'var(--glass-bg)',
                                    border: '1px solid var(--glass-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <stat.icon size={22} color="#a78bfa" />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stat.value}</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Animated Scroll Down Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div style={{
                        width: '30px',
                        height: '50px',
                        borderRadius: '15px',
                        border: '2px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '10px'
                    }}>
                        <motion.div
                            animate={{ y: [0, 15, 0], opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{
                                width: '6px',
                                height: '10px',
                                borderRadius: '3px',
                                background: 'var(--color-primary-glow)'
                            }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* 
                FEATURES SECTION
                Highlights core platform capabilities (Showcase, Community, Commerce).
            */}
            <section style={{
                padding: '100px 0',
                position: 'relative',
                background: 'linear-gradient(180deg, transparent 0%, rgba(124, 58, 237, 0.03) 50%, transparent 100%)'
            }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        style={{ textAlign: 'center', marginBottom: '60px' }}
                    >
                        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '700', marginBottom: '16px' }}>
                            Everything You Need to <span className="text-gradient">Succeed</span>
                        </h2>
                        <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
                            A complete platform designed for artists who want to share their passion and build a career.
                        </p>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px'
                    }}>
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                onHoverStart={() => setActiveFeature(index)}
                                className="glass-panel"
                                style={{
                                    padding: '32px',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Active State Highlight Line */}
                                <AnimatePresence>
                                    {activeFeature === index && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '3px',
                                                background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`
                                            }}
                                        />
                                    )}
                                </AnimatePresence>

                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '16px',
                                    background: `${feature.color}20`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '20px'
                                }}>
                                    <feature.icon size={28} color={feature.color} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 
                FEATURED GALLERY
                A preview of the content available on the site.
            */}
            <section style={{ padding: '80px 0 120px' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            marginBottom: '40px',
                            flexWrap: 'wrap',
                            gap: '20px'
                        }}
                    >
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '700', marginBottom: '8px' }}>
                                Featured <span className="text-gradient">Artworks</span>
                            </h2>
                            <p style={{ color: 'var(--color-text-muted)' }}>
                                Discover exceptional pieces from talented artists worldwide
                            </p>
                        </div>
                        <Link
                            to="/explore"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: 'var(--color-primary-glow)',
                                fontWeight: '600',
                                transition: 'gap 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.gap = '12px'}
                            onMouseLeave={(e) => e.currentTarget.style.gap = '8px'}
                        >
                            View All Artworks <ArrowRight size={20} />
                        </Link>
                    </motion.div>

                    {isLoading ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '24px'
                        }}>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="skeleton" style={{ height: '300px' }} />
                            ))}
                        </div>
                    ) : featuredArtworks.length > 0 ? (
                        <MasonryGrid artworks={featuredArtworks} />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                textAlign: 'center',
                                padding: '80px 20px',
                                background: 'var(--glass-bg)',
                                borderRadius: 'var(--border-radius-xl)',
                                border: '1px solid var(--glass-border)'
                            }}
                        >
                            <Palette size={64} color="var(--color-text-subtle)" style={{ marginBottom: '24px' }} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No Artworks Yet</h3>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                                Be the first to share your masterpiece with the world
                            </p>
                            <Link to="/register" className="btn-primary">
                                Start Creating
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* 
                BOTTOM CTA 
                Final push to get users to register.
            */}
            <section style={{
                padding: '100px 0',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="glass-panel"
                        style={{
                            padding: 'clamp(40px, 8vw, 80px)',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Star size={48} color="#f59e0b" style={{ marginBottom: '24px' }} />
                        <h2 style={{
                            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                            fontWeight: '700',
                            marginBottom: '16px'
                        }}>
                            Ready to Share Your Art?
                        </h2>
                        <p style={{
                            color: 'var(--color-text-muted)',
                            maxWidth: '500px',
                            margin: '0 auto 32px',
                            fontSize: '1.1rem'
                        }}>
                            Join thousands of artists already growing their audience and selling their work on ArtFolio.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn-primary">
                                Create Free Account
                            </Link>
                            <Link to="/explore" className="btn-secondary">
                                Browse Gallery
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
