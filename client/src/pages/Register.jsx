import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('visitor');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await register(username, email, password, role);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}
            >
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>create account</h2>

                {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>I am a...</label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => setRole('visitor')}
                                style={{ flex: 1, minWidth: '100px', padding: '10px', borderRadius: '8px', border: role === 'visitor' ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)', background: role === 'visitor' ? 'rgba(109, 40, 217, 0.2)' : 'transparent', color: 'white' }}
                            >
                                Visitor
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('artist')}
                                style={{ flex: 1, minWidth: '100px', padding: '10px', borderRadius: '8px', border: role === 'artist' ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)', background: role === 'artist' ? 'rgba(109, 40, 217, 0.2)' : 'transparent', color: 'white' }}
                            >
                                Artist
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                style={{ flex: 1, minWidth: '100px', padding: '10px', borderRadius: '8px', border: role === 'admin' ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)', background: role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'transparent', color: 'white' }}
                            >
                                Admin
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                        Register
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-primary-glow)' }}>Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
