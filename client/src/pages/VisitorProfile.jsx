import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MasonryGrid from '../components/MasonryGrid';

const VisitorProfile = () => {
    const { user } = useAuth();
    // In a real app, we would fetch liked artworks from the backend
    // For now, allow viewing "Explore" as a placeholder for personal collection
    const [orders, setOrders] = useState([]);

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

    return (
        <div className="container" style={{ paddingTop: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
                <img
                    src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.username}`}
                    alt="Profile"
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hello, {user?.username}</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Welcome to your personal collection.</p>
                </div>
            </div>

            <div style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Purchased Artworks</h2>
                {orders.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>No purchases yet.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                        {orders.map(order => (
                            <div key={order._id} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                                <img
                                    src={order.artwork?.imageUrl}
                                    alt={order.artwork?.title}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{order.artwork?.title}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#4ade80', fontWeight: 'bold' }}>paid: ${order.amount}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Your Favorites</h2>
                {loading ? <p>Loading...</p> : (
                    <>
                        {likedArtworks.length === 0 ? (
                            <p style={{ color: 'var(--color-text-muted)' }}>You haven't liked any artworks yet.</p>
                        ) : (
                            <MasonryGrid artworks={likedArtworks} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default VisitorProfile;
