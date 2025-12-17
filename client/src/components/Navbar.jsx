import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Palette, LayoutDashboard, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setProfileOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        if (user.role === 'admin') return '/admin';
        if (user.role === 'artist') return '/artist/dashboard';
        return '/profile';
    };

    const navLinks = [
        { path: '/explore', label: 'Explore' },
        { path: '/artists', label: 'Artists' },
        { path: '/commissions', label: 'Commissions' }
    ];

    const navStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled ? 'rgba(13, 13, 18, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
        transition: 'all 0.3s ease'
    };

    const containerStyle = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    return (
        <>
            <nav style={navStyle}>
                <div style={containerStyle}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Palette size={22} color="white" />
                        </div>
                        <span style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white' }}>
                            Art<span style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Folio</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="desktop-nav" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                style={{
                                    padding: '10px 18px',
                                    borderRadius: '10px',
                                    color: location.pathname === link.path ? 'white' : '#A0A0A0',
                                    fontWeight: '500',
                                    fontSize: '0.95rem',
                                    background: location.pathname === link.path ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {/* Show auth buttons when not logged in */}
                        {!user && !loading && (
                            <>
                                <Link
                                    to="/login"
                                    className="desktop-nav"
                                    style={{
                                        color: '#A0A0A0',
                                        fontWeight: '500',
                                        padding: '10px 16px',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="desktop-nav"
                                    style={{
                                        padding: '10px 24px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                                        color: 'white',
                                        fontWeight: '600',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}

                        {/* Show user menu when logged in */}
                        {user && !loading && (
                            <>
                                <Link
                                    to={getDashboardLink()}
                                    className="desktop-nav"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 16px',
                                        borderRadius: '12px',
                                        background: 'rgba(124, 58, 237, 0.15)',
                                        border: '1px solid rgba(124, 58, 237, 0.3)',
                                        color: '#A78BFA',
                                        fontWeight: '500',
                                        textDecoration: 'none'
                                    }}
                                >
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>

                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        style={{
                                            width: '42px',
                                            height: '42px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                                            border: 'none',
                                            color: 'white',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {user.username?.charAt(0).toUpperCase() || <User size={18} />}
                                    </button>

                                    {profileOpen && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 'calc(100% + 8px)',
                                            right: 0,
                                            width: '200px',
                                            background: 'rgba(26, 26, 32, 0.98)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            padding: '8px',
                                            zIndex: 1001
                                        }}>
                                            <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '8px' }}>
                                                <p style={{ fontWeight: '600', color: 'white' }}>{user.username}</p>
                                                <p style={{ fontSize: '0.8rem', color: '#707070', textTransform: 'capitalize' }}>{user.role}</p>
                                            </div>
                                            <Link
                                                to={getDashboardLink()}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '10px 12px',
                                                    borderRadius: '8px',
                                                    color: '#E0E0E0',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                <LayoutDashboard size={18} /> Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '10px 12px',
                                                    borderRadius: '8px',
                                                    color: '#EF4444',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                <LogOut size={18} /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="mobile-menu-btn"
                            style={{
                                display: 'none',
                                width: '42px',
                                height: '42px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                cursor: 'pointer',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    left: '16px',
                    right: '16px',
                    background: 'rgba(26, 26, 32, 0.98)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '16px',
                    zIndex: 999
                }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                display: 'block',
                                padding: '14px 16px',
                                borderRadius: '10px',
                                color: location.pathname === link.path ? 'white' : '#A0A0A0',
                                fontWeight: '500',
                                textDecoration: 'none',
                                background: location.pathname === link.path ? 'rgba(124, 58, 237, 0.2)' : 'transparent'
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '12px 0' }} />

                    {!user ? (
                        <>
                            <Link to="/login" style={{ display: 'block', padding: '14px 16px', color: '#A0A0A0', textDecoration: 'none' }}>
                                Sign In
                            </Link>
                            <Link to="/register" style={{
                                display: 'block',
                                padding: '14px 16px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                                color: 'white',
                                fontWeight: '600',
                                textAlign: 'center',
                                textDecoration: 'none',
                                marginTop: '8px'
                            }}>
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to={getDashboardLink()} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '14px 16px',
                                color: '#A78BFA',
                                textDecoration: 'none'
                            }}>
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '14px 16px',
                                    color: '#EF4444',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    )}
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .mobile-menu-btn { display: flex !important; }
                }
            `}</style>
        </>
    );
};

export default Navbar;
