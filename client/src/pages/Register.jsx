import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, ArrowRight, Palette, Heart, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'visitor'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                })
            });

            const data = await res.json();

            if (res.ok) {
                login(data);
                if (data.role === 'artist') {
                    navigate('/artist/dashboard');
                } else {
                    navigate('/explore');
                }
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const roles = [
        {
            value: 'artist',
            icon: Palette,
            title: 'Artist',
            description: 'Showcase and sell your artwork',
            color: '#8b5cf6',
            features: ['Upload artworks', 'Accept commissions', 'Sell prints', 'Track earnings']
        },
        {
            value: 'visitor',
            icon: Heart,
            title: 'Art Lover',
            description: 'Discover and collect amazing art',
            color: '#ec4899',
            features: ['Browse gallery', 'Like & comment', 'Purchase prints', 'Request commissions']
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '120px 20px 60px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Elements */}
            <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, 50, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        top: '5%',
                        right: '10%',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
                        filter: 'blur(80px)'
                    }}
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        bottom: '5%',
                        left: '5%',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
                        filter: 'blur(80px)'
                    }}
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
                        filter: 'blur(60px)'
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    width: '100%',
                    maxWidth: '520px'
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
                            margin: '0 auto 24px',
                            boxShadow: 'var(--shadow-glow-primary)'
                        }}
                    >
                        <UserPlus size={36} color="white" />
                    </motion.div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '12px' }}>
                        Join <span className="text-gradient">ArtFolio</span>
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Create your account and start your creative journey
                    </p>
                </div>

                {/* Registration Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="glass-panel"
                    style={{ padding: '40px', borderRadius: '24px' }}
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '12px',
                                padding: '14px 16px',
                                marginBottom: '24px',
                                color: '#ef4444',
                                fontSize: '0.9rem'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Role Selection */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '12px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: 'var(--color-text)'
                        }}>
                            I want to join as...
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {roles.map((role) => (
                                <motion.button
                                    key={role.value}
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setFormData({ ...formData, role: role.value })}
                                    style={{
                                        padding: '20px 16px',
                                        borderRadius: '16px',
                                        background: formData.role === role.value
                                            ? `${role.color}15`
                                            : 'rgba(0,0,0,0.2)',
                                        border: formData.role === role.value
                                            ? `2px solid ${role.color}`
                                            : '2px solid var(--glass-border)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        position: 'relative',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <AnimatePresence>
                                        {formData.role === role.value && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    right: '12px',
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    background: role.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Check size={14} color="white" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <role.icon
                                        size={28}
                                        color={formData.role === role.value ? role.color : 'var(--color-text-muted)'}
                                        style={{ marginBottom: '12px' }}
                                    />
                                    <p style={{
                                        fontWeight: '600',
                                        marginBottom: '4px',
                                        color: formData.role === role.value ? 'white' : 'var(--color-text-muted)'
                                    }}>
                                        {role.title}
                                    </p>
                                    <p style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--color-text-subtle)'
                                    }}>
                                        {role.description}
                                    </p>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Username */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            color: 'var(--color-text-muted)'
                        }}>
                            Username
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User
                                size={20}
                                color="var(--color-text-subtle)"
                                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
                            />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                required
                                className="input-field"
                                style={{ paddingLeft: '48px' }}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            color: 'var(--color-text-muted)'
                        }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail
                                size={20}
                                color="var(--color-text-subtle)"
                                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="input-field"
                                style={{ paddingLeft: '48px' }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            color: 'var(--color-text-muted)'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={20}
                                color="var(--color-text-subtle)"
                                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
                            />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                                className="input-field"
                                style={{ paddingLeft: '48px', paddingRight: '48px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    color: 'var(--color-text-subtle)',
                                    padding: '4px'
                                }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '28px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            color: 'var(--color-text-muted)'
                        }}>
                            Confirm Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={20}
                                color="var(--color-text-subtle)"
                                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                                className="input-field"
                                style={{ paddingLeft: '48px' }}
                            />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary"
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '1rem',
                            opacity: isLoading ? 0.7 : 1
                        }}
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: 'white',
                                    borderRadius: '50%'
                                }}
                            />
                        ) : (
                            <>
                                Create Account
                                <ArrowRight size={20} />
                            </>
                        )}
                    </motion.button>

                    <div style={{
                        marginTop: '24px',
                        textAlign: 'center',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.9rem'
                    }}>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            style={{
                                color: 'var(--color-primary-glow)',
                                fontWeight: '600'
                            }}
                        >
                            Sign in
                        </Link>
                    </div>
                </motion.form>

                {/* Features based on selected role */}
                <motion.div
                    key={formData.role}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel"
                    style={{
                        marginTop: '24px',
                        padding: '20px 24px',
                        borderRadius: '16px'
                    }}
                >
                    <p style={{
                        fontWeight: '600',
                        marginBottom: '12px',
                        fontSize: '0.9rem',
                        color: roles.find(r => r.value === formData.role)?.color
                    }}>
                        What you'll get as {formData.role === 'artist' ? 'an Artist' : 'an Art Lover'}:
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '8px'
                    }}>
                        {roles.find(r => r.value === formData.role)?.features.map((feature, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.85rem',
                                    color: 'var(--color-text-muted)'
                                }}
                            >
                                <Check size={14} color={roles.find(r => r.value === formData.role)?.color} />
                                {feature}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;
