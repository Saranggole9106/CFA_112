import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Heart, ShoppingBag, DollarSign, Image, MessageSquare, TrendingUp, Plus, Eye, Calendar, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className="glass-panel"
        style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        <div style={{
            padding: '14px',
            borderRadius: '16px',
            background: `${color}20`,
            color: color
        }}>
            <Icon size={26} />
        </div>
        <div style={{ flex: 1 }}>
            <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                fontWeight: '500',
                marginBottom: '4px'
            }}>
                {title}
            </p>
            <p style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                lineHeight: 1
            }}>
                {value}
            </p>
            {trend && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '8px',
                    fontSize: '0.8rem',
                    color: trend > 0 ? '#22c55e' : '#ef4444'
                }}>
                    <TrendingUp size={14} />
                    {trend > 0 ? '+' : ''}{trend}% this week
                </div>
            )}
        </div>
        <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
            borderRadius: '50%'
        }} />
    </motion.div>
);

const ArtistDashboard = () => {
    const { user } = useAuth();
    const [artworks, setArtworks] = useState([]);
    const [sales, setSales] = useState([]);
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { icon: Image, title: 'Artworks', value: '0', color: '#8b5cf6' },
        { icon: Heart, title: 'Total Likes', value: '0', color: '#ec4899' },
        { icon: DollarSign, title: 'Total Earnings', value: '$0', color: '#22c55e' },
        { icon: ShoppingBag, title: 'Sales', value: '0', color: '#f59e0b' }
    ]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                const artworksRes = await fetch('/api/artworks/user/uploaded', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                let artworksData = [];
                if (artworksRes.ok) {
                    artworksData = await artworksRes.json();
                    setArtworks(artworksData);
                }

                const salesRes = await fetch('/api/orders/sales/history', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                let salesData = [];
                if (salesRes.ok) {
                    salesData = await salesRes.json();
                    setSales(salesData);
                }

                const commissionsRes = await fetch('/api/commissions/artist', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                let commissionsData = [];
                if (commissionsRes.ok) {
                    commissionsData = await commissionsRes.json();
                    setCommissions(commissionsData);
                }

                const totalLikes = artworksData.reduce((acc, curr) => acc + (curr.likes ? curr.likes.length : 0), 0);
                const salesEarnings = salesData.reduce((acc, curr) => acc + curr.amount, 0);
                const commissionEarnings = commissionsData
                    .filter(c => c.status === 'completed' && c.price)
                    .reduce((acc, curr) => acc + curr.price, 0);
                const totalEarnings = salesEarnings + commissionEarnings;

                setStats([
                    { icon: Image, title: 'Artworks', value: artworksData.length.toString(), color: '#8b5cf6' },
                    { icon: Heart, title: 'Total Likes', value: totalLikes.toString(), color: '#ec4899' },
                    { icon: DollarSign, title: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}`, color: '#22c55e' },
                    { icon: ShoppingBag, title: 'Sales', value: salesData.length.toString(), color: '#f59e0b' }
                ]);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    const pendingCommissions = commissions.filter(c => c.status === 'pending').length;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="container"
            style={{ paddingTop: '120px', paddingBottom: '60px' }}
        >
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    marginBottom: '40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '24px'
                }}
            >
                <div>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        marginBottom: '8px',
                        fontSize: '1rem'
                    }}>
                        Welcome back, {user?.username}! 👋
                    </p>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                        fontWeight: '800'
                    }}>
                        Artist <span className="text-gradient">Studio</span>
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link
                        to="/artist/commissions"
                        className="glass-panel"
                        style={{
                            padding: '14px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '14px',
                            position: 'relative',
                            fontWeight: '500'
                        }}
                    >
                        <MessageSquare size={20} />
                        Commissions
                        {pendingCommissions > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: '#ef4444',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                {pendingCommissions}
                            </motion.span>
                        )}
                    </Link>
                    <Link to="/artist/artworks/new" className="btn-primary" style={{ borderRadius: '14px' }}>
                        <Plus size={20} />
                        Upload Artwork
                    </Link>
                </div>
            </motion.header>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                    >
                        <StatCard {...stat} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Earnings Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-panel"
                style={{ padding: '28px', marginBottom: '32px', borderRadius: '20px' }}
            >
                <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <BarChart size={22} color="var(--color-primary-glow)" />
                    Earnings Breakdown
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                }}>
                    <div style={{
                        padding: '20px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '16px',
                        border: '1px solid rgba(34, 197, 94, 0.2)'
                    }}>
                        <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text-muted)',
                            marginBottom: '8px'
                        }}>
                            Print Sales
                        </p>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: '#22c55e' }}>
                            ${sales.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            {sales.length} {sales.length === 1 ? 'sale' : 'sales'}
                        </p>
                    </div>
                    <div style={{
                        padding: '20px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '16px',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                        <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text-muted)',
                            marginBottom: '8px'
                        }}>
                            Commissions
                        </p>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: '#8b5cf6' }}>
                            ${commissions.filter(c => c.status === 'completed' && c.price).reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            {commissions.filter(c => c.status === 'completed').length} completed
                        </p>
                    </div>
                    <div style={{
                        padding: '20px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '16px',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                    }}>
                        <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text-muted)',
                            marginBottom: '8px'
                        }}>
                            Total Income
                        </p>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}>
                            ${(
                                sales.reduce((acc, curr) => acc + curr.amount, 0) +
                                commissions.filter(c => c.status === 'completed' && c.price).reduce((acc, curr) => acc + curr.price, 0)
                            ).toFixed(2)}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            All sources
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Content Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '24px'
            }}>
                {/* Recent Artworks */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="glass-panel"
                    style={{ padding: '28px', borderRadius: '20px' }}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <Image size={22} color="var(--color-primary-glow)" />
                            Recent Artworks
                        </h2>
                        <Link
                            to="/artist/artworks"
                            style={{
                                color: 'var(--color-primary-glow)',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            View all <ArrowUpRight size={16} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="skeleton" style={{ height: '70px', borderRadius: '12px' }} />
                            ))}
                        </div>
                    ) : artworks.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: 'var(--color-text-muted)'
                        }}>
                            <Image size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p style={{ marginBottom: '16px' }}>No artworks uploaded yet</p>
                            <Link to="/artist/artworks/new" className="btn-primary" style={{ display: 'inline-flex' }}>
                                <Plus size={18} />
                                Upload Your First Artwork
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {artworks.slice(0, 5).map((artwork) => (
                                <Link
                                    key={artwork._id}
                                    to={`/artwork/${artwork._id}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '12px',
                                        borderRadius: '14px',
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid var(--glass-border)',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        flexShrink: 0
                                    }}>
                                        <img
                                            src={artwork.imageUrl}
                                            alt={artwork.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{
                                            fontWeight: '600',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {artwork.title}
                                        </p>
                                        <div style={{
                                            display: 'flex',
                                            gap: '16px',
                                            fontSize: '0.8rem',
                                            color: 'var(--color-text-muted)'
                                        }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Heart size={14} color="#ec4899" />
                                                {artwork.likes?.length || 0}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={14} />
                                                {new Date(artwork.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontWeight: '700',
                                        color: '#22c55e',
                                        fontSize: '1rem'
                                    }}>
                                        ${artwork.price}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Recent Sales */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="glass-panel"
                    style={{ padding: '28px', borderRadius: '20px' }}
                >
                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <ShoppingBag size={22} color="#22c55e" />
                        Recent Sales
                    </h2>

                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="skeleton" style={{ height: '70px', borderRadius: '12px' }} />
                            ))}
                        </div>
                    ) : sales.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: 'var(--color-text-muted)'
                        }}>
                            <ShoppingBag size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p>No sales yet</p>
                            <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                                Keep uploading great work!
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {sales.slice(0, 5).map(sale => (
                                <div
                                    key={sale._id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px',
                                        borderRadius: '14px',
                                        background: 'rgba(34, 197, 94, 0.05)',
                                        border: '1px solid rgba(34, 197, 94, 0.1)'
                                    }}
                                >
                                    <div>
                                        <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                                            {sale.artwork?.title || 'Artwork'}
                                        </p>
                                        <p style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--color-text-muted)'
                                        }}>
                                            Buyer: {sale.buyer?.username || 'Unknown'}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{
                                            color: '#22c55e',
                                            fontWeight: '800',
                                            fontSize: '1.1rem'
                                        }}>
                                            +${sale.amount}
                                        </p>
                                        <p style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--color-text-muted)'
                                        }}>
                                            {new Date(sale.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ArtistDashboard;
