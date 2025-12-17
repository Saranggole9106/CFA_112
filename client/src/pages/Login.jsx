import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Attempting login with:', { email, password: '***' });

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            console.log('Login response:', res.status, data);

            if (res.ok) {
                login(data);
                // Access role from user object in response
                const userRole = data.user?.role || data.role;
                console.log('User role:', userRole);
                if (userRole === 'admin') {
                    navigate('/admin');
                } else if (userRole === 'artist') {
                    navigate('/artist/dashboard');
                } else {
                    navigate('/explore');
                }
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 20px 40px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Elements */}
            <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        top: '10%',
                        left: '10%',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
                        filter: 'blur(60px)'
                    }}
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '10%',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
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
                    maxWidth: '440px'
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
                        <LogIn size={36} color="white" />
                    </motion.div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '12px' }}>
                        Welcome <span className="text-gradient">Back</span>
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Sign in to continue your creative journey
                    </p>
                </div>

                {/* Login Form */}
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="input-field"
                                style={{ paddingLeft: '48px' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
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
                                Sign In
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
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            style={{
                                color: 'var(--color-primary-glow)',
                                fontWeight: '600'
                            }}
                        >
                            Create one
                        </Link>
                    </div>
                </motion.form>

                {/* Demo Credentials */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="glass-panel"
                    style={{
                        marginTop: '24px',
                        padding: '20px',
                        borderRadius: '16px'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Sparkles size={18} color="#f59e0b" />
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Admin Demo Access</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        <p>📧 <strong>Email:</strong> admin@gmail.com</p>
                        <p>🔑 <strong>Password:</strong> 890098</p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
