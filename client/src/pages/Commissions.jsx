import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MessageSquare, Sparkles, ArrowRight, Palette, CheckCircle, Clock, DollarSign, Users } from 'lucide-react';

const Commissions = () => {
    const steps = [
        {
            title: "Find Your Artist",
            desc: "Browse portfolios and discover artists whose style resonates with your vision. Each artist has unique specialties.",
            step: "01",
            icon: Search,
            color: "#8b5cf6"
        },
        {
            title: "Submit Request",
            desc: "Use the commission form on their profile to describe your project, timeline, and budget expectations.",
            step: "02",
            icon: MessageSquare,
            color: "#ec4899"
        },
        {
            title: "Collaborate & Create",
            desc: "Work together through revisions, review sketches, and receive your final masterpiece.",
            step: "03",
            icon: Sparkles,
            color: "#22c55e"
        }
    ];

    const benefits = [
        { icon: CheckCircle, title: "Quality Guaranteed", desc: "Work with verified artists" },
        { icon: Clock, title: "Timely Delivery", desc: "Track progress in real-time" },
        { icon: DollarSign, title: "Secure Payments", desc: "Pay safely for custom work" },
        { icon: Users, title: "Direct Communication", desc: "Chat with your artist" }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '80px' }}
        >
            {/* Hero Section */}
            <section className="container" style={{ marginBottom: '80px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center', marginBottom: '60px' }}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '24px',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 28px',
                            boxShadow: 'var(--shadow-glow-primary)'
                        }}
                    >
                        <Palette size={40} color="white" />
                    </motion.div>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        fontWeight: '800',
                        marginBottom: '20px',
                        lineHeight: 1.1
                    }}>
                        Commission <span className="text-gradient">Custom Art</span>
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                        color: 'var(--color-text-muted)',
                        maxWidth: '700px',
                        margin: '0 auto',
                        lineHeight: 1.7
                    }}>
                        Bring your vision to life by collaborating directly with talented digital artists.
                        Get personalized artwork created just for you.
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '28px'
                }}>
                    {steps.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="glass-panel"
                            style={{
                                padding: '40px',
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '24px'
                            }}
                        >
                            {/* Background Step Number */}
                            <span style={{
                                position: 'absolute',
                                bottom: '-30px',
                                right: '-10px',
                                fontSize: '10rem',
                                fontWeight: '900',
                                color: 'rgba(255,255,255,0.02)',
                                lineHeight: 1,
                                pointerEvents: 'none'
                            }}>
                                {item.step}
                            </span>

                            {/* Top Glow Line */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 0.8, delay: idx * 0.2 }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '3px',
                                    background: `linear-gradient(90deg, ${item.color}, transparent)`
                                }}
                            />

                            {/* Icon */}
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '16px',
                                background: `${item.color}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '20px',
                                position: 'relative'
                            }}>
                                <item.icon size={28} color={item.color} />
                            </div>

                            {/* Step Badge */}
                            <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                background: `${item.color}20`,
                                color: item.color,
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                marginBottom: '16px'
                            }}>
                                Step {item.step}
                            </span>

                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                marginBottom: '12px',
                                position: 'relative'
                            }}>
                                {item.title}
                            </h3>
                            <p style={{
                                color: 'var(--color-text-muted)',
                                position: 'relative',
                                lineHeight: 1.7
                            }}>
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section style={{
                padding: '60px 0',
                background: 'linear-gradient(180deg, transparent, rgba(124, 58, 237, 0.03), transparent)'
            }}>
                <div className="container">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{
                            textAlign: 'center',
                            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                            fontWeight: '700',
                            marginBottom: '40px'
                        }}
                    >
                        Why Commission on <span className="text-gradient">ArtFolio</span>?
                    </motion.h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '20px'
                    }}>
                        {benefits.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                style={{
                                    padding: '28px',
                                    background: 'var(--glass-bg)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '16px',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: 'rgba(124, 58, 237, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px'
                                }}>
                                    <benefit.icon size={24} color="var(--color-primary-glow)" />
                                </div>
                                <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>{benefit.title}</h4>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container" style={{ marginTop: '40px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass-panel"
                    style={{
                        padding: 'clamp(40px, 8vw, 80px)',
                        borderRadius: '28px',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Background Accents */}
                    <div style={{
                        position: 'absolute',
                        top: '-80px',
                        left: '-80px',
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-80px',
                        right: '-80px',
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%'
                    }} />

                    <h2 style={{
                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                        fontWeight: '800',
                        marginBottom: '16px',
                        position: 'relative'
                    }}>
                        Ready to Create Something <span className="text-gradient">Amazing</span>?
                    </h2>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        marginBottom: '32px',
                        fontSize: '1.1rem',
                        maxWidth: '500px',
                        margin: '0 auto 32px',
                        position: 'relative'
                    }}>
                        Explore our talented artists and start your commission today.
                    </p>
                    <Link
                        to="/artists"
                        className="btn-primary"
                        style={{
                            display: 'inline-flex',
                            padding: '18px 36px',
                            fontSize: '1.1rem',
                            borderRadius: '16px'
                        }}
                    >
                        Find Artists Now
                        <ArrowRight size={22} />
                    </Link>
                </motion.div>
            </section>
        </motion.div>
    );
};

export default Commissions;
