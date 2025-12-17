import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Calendar, User, Eye, ExternalLink, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MasonryGrid from '../components/MasonryGrid';

const VisitorProfile = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [likedArtworks, setLikedArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('purchases');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // Fetch liked artworks
                const likedRes = await fetch('/api/artworks/user/liked', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (likedRes.ok) {
                    setLikedArtworks(await likedRes.json());
                }

                // Fetch orders
                const ordersRes = await fetch('/api/orders/my-orders', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (ordersRes.ok) {
                    setOrders(await ordersRes.json());
                }
            } catch (err) {
                console.error("Failed to fetch profile data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const tabs = [
        { id: 'purchases', label: 'Purchases', icon: ShoppingBag, count: orders.length },
        { id: 'favorites', label: 'Favorites', icon: Heart, count: likedArtworks.length }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="container"
            style={{ paddingTop: '120px', paddingBottom: '60px' }}
        >
            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass-panel"
                style={{
                    padding: '40px',
                    borderRadius: '24px',
                    marginBottom: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '32px',
                    flexWrap: 'wrap',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background Accent */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
                    borderRadius: '50%'
                }} />

                {/* Avatar */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                        padding: '4px',
                        boxShadow: 'var(--shadow-glow-primary)'
                    }}
                >
                    <img
                        src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.username}&background=7c3aed&color=fff`}
                        alt="Profile"
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid var(--color-surface)'
                        }}
                    />
                </motion.div>

                {/* User Info */}
                <div style={{ flex: 1 }}>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem'
                    }}>
                        <User size={16} />
                        Art Enthusiast
                    </p>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 2.75rem)',
                        fontWeight: '800',
                        marginBottom: '12px'
                    }}>
                        Hello, <span className="text-gradient">{user?.username}</span>
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
                        Your personal art collection and purchase history
                    </p>
                </div>

                {/* Quick Stats */}
                <div style={{
                    display: 'flex',
                    gap: '24px'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{
                            fontSize: '1.75rem',
                            fontWeight: '800',
                            color: '#22c55e'
                        }}>
                            {orders.length}
                        </p>
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--color-text-muted)'
                        }}>
                            Purchases
                        </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{
                            fontSize: '1.75rem',
                            fontWeight: '800',
                            color: '#ec4899'
                        }}>
                            {likedArtworks.length}
                        </p>
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--color-text-muted)'
                        }}>
                            Favorites
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '32px',
                    flexWrap: 'wrap'
                }}
            >
                {tabs.map(tab => (
                    <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '14px 28px',
                            borderRadius: '14px',
                            background: activeTab === tab.id
                                ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))'
                                : 'var(--glass-bg)',
                            border: activeTab === tab.id
                                ? 'none'
                                : '1px solid var(--glass-border)',
                            color: 'white',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            boxShadow: activeTab === tab.id
                                ? 'var(--shadow-glow-primary)'
                                : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <tab.icon size={20} />
                        {tab.label}
                        <span style={{
                            background: activeTab === tab.id
                                ? 'rgba(255,255,255,0.2)'
                                : 'rgba(255,255,255,0.1)',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.85rem'
                        }}>
                            {tab.count}
                        </span>
                    </motion.button>
                ))}
            </motion.div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                {loading ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '24px'
                    }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="skeleton" style={{ height: '280px', borderRadius: '20px' }} />
                        ))}
                    </div>
                ) : activeTab === 'purchases' ? (
                    <>
                        {orders.length === 0 ? (
                            <div
                                className="glass-panel"
                                style={{
                                    textAlign: 'center',
                                    padding: '80px 40px',
                                    borderRadius: '24px'
                                }}
                            >
                                <Package size={64} color="var(--color-text-subtle)" style={{ marginBottom: '24px' }} />
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No purchases yet</h3>
                                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                                    Discover amazing artworks and start your collection
                                </p>
                                <Link to="/explore" className="btn-primary">
                                    <Eye size={20} />
                                    Explore Gallery
                                </Link>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '24px'
                            }}>
                                {orders.map((order, index) => (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -8 }}
                                        className="glass-panel"
                                        style={{
                                            padding: 0,
                                            borderRadius: '20px',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Link
                                            to={`/artwork/${order.artwork?._id}`}
                                            style={{ display: 'block' }}
                                        >
                                            <div style={{ position: 'relative' }}>
                                                <img
                                                    src={order.artwork?.imageUrl}
                                                    alt={order.artwork?.title}
                                                    style={{
                                                        width: '100%',
                                                        height: '200px',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    right: '12px',
                                                    background: 'rgba(34, 197, 94, 0.9)',
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}>
                                                    <ShoppingBag size={14} />
                                                    Purchased
                                                </div>
                                            </div>
                                        </Link>
                                        <div style={{ padding: '20px' }}>
                                            <h3 style={{
                                                fontSize: '1.2rem',
                                                fontWeight: '700',
                                                marginBottom: '12px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {order.artwork?.title}
                                            </h3>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div>
                                                    <p style={{
                                                        color: '#22c55e',
                                                        fontWeight: '800',
                                                        fontSize: '1.25rem'
                                                    }}>
                                                        ${order.amount}
                                                    </p>
                                                    <p style={{
                                                        fontSize: '0.8rem',
                                                        color: 'var(--color-text-muted)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        marginTop: '4px'
                                                    }}>
                                                        <Calendar size={12} />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Link
                                                    to={`/artwork/${order.artwork?._id}`}
                                                    style={{
                                                        padding: '10px 16px',
                                                        background: 'var(--glass-bg)',
                                                        border: '1px solid var(--glass-border)',
                                                        borderRadius: '10px',
                                                        color: 'var(--color-text)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    View
                                                    <ExternalLink size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {likedArtworks.length === 0 ? (
                            <div
                                className="glass-panel"
                                style={{
                                    textAlign: 'center',
                                    padding: '80px 40px',
                                    borderRadius: '24px'
                                }}
                            >
                                <Heart size={64} color="var(--color-text-subtle)" style={{ marginBottom: '24px' }} />
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No favorites yet</h3>
                                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                                    Browse the gallery and like artworks you love
                                </p>
                                <Link to="/explore" className="btn-primary">
                                    <Eye size={20} />
                                    Explore Gallery
                                </Link>
                            </div>
                        ) : (
                            <MasonryGrid artworks={likedArtworks} />
                        )}
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

export default VisitorProfile;
