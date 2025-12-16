import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Palette, Search, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        if (user.role === 'admin') return '/admin';
        if (user.role === 'artist') return '/artist/dashboard';
        return '/profile'; // Visitor dashboard or profile
    };

    return (
        <nav className="glass-panel" style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '1200px',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
                <Palette color="var(--color-primary-glow)" size={28} />
                <span>Art<span className="text-gradient">Folio</span></span>
            </Link>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/explore" style={{ color: 'var(--color-text-muted)', fontWeight: '500' }}>Explore</Link>
                <Link to="/artists" style={{ color: 'var(--color-text-muted)', fontWeight: '500' }}>Artists</Link>
                {/* Only show public commissions page if user is visitor or not logged in, or maybe everyone? */}
                {/* The prompt says "Protected artist routes: Commissions /artist/commissions". */}
                {/* The public commissions link might be for requesting? Prompt says "Request Commission button ... sending to /api/commissions". */}
                {/* Let's keep a generic Commissions link or maybe remove public link if not relevant. */}
                <Link to="/commissions" style={{ color: 'var(--color-text-muted)', fontWeight: '500' }}>Commissions</Link>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button style={{ background: 'transparent', color: 'white' }}>
                    <Search size={20} />
                </button>

                {user ? (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to={getDashboardLink()} title="Dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                            <LayoutDashboard size={20} />
                            {user.role === 'artist' ? 'Artist Hub' : user.role === 'admin' ? 'Admin' : 'Profile'}
                        </Link>
                        <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--color-text-muted)' }} title="Logout">
                            <LogOut size={20} />
                        </button>
                        {user.profileImage ? (
                            <img src={user.profileImage || `https://ui-avatars.com/api/?name=${user.username}`} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        ) : (
                            <User size={24} color="var(--color-primary-glow)" />
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to="/login" style={{ color: 'white', fontWeight: '500' }}>Login</Link>
                        <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '30px', fontSize: '0.9rem' }}>
                            Join Now
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
