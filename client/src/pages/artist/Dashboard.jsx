import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Heart, ShoppingBag, DollarSign, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '10px', borderRadius: '12px', background: `${color}20`, color: color }}>
            <Icon size={24} />
        </div>
        <div>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: '400' }}>{title}</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{value}</p>
        </div>
    </div>
);

const ArtistDashboard = () => {
    const { user } = useAuth();
    const [artworks, setArtworks] = useState([]);
    const [sales, setSales] = useState([]);
    const [commissions, setCommissions] = useState([]);
    const [stats, setStats] = useState([
        { icon: Image, title: 'Artworks', value: '0', color: '#8b5cf6' },
        { icon: Heart, title: 'Total Likes', value: '0', color: '#ec4899' },
        { icon: DollarSign, title: 'Total Earnings', value: '$0', color: '#eab308' },
        { icon: ShoppingBag, title: 'Sales', value: '0', color: '#22c55e' }
    ]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                // Fetch Uploaded Artworks
                const artworksRes = await fetch('/api/artworks/user/uploaded', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                let artworksData = [];
                if (artworksRes.ok) {
                    artworksData = await artworksRes.json();
                    setArtworks(artworksData);
                }

                // Fetch Sales History (Print Sales)
                const salesRes = await fetch('/api/orders/sales/history', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                let salesData = [];
                if (salesRes.ok) {
                    salesData = await salesRes.json();
                    setSales(salesData);
                }

                // Fetch Commissions
                const commissionsRes = await fetch('/api/commissions/artist', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                let commissionsData = [];
                if (commissionsRes.ok) {
                    commissionsData = await commissionsRes.json();
                    setCommissions(commissionsData);
                }

                // Calculate Stats
                const totalLikes = artworksData.reduce((acc, curr) => acc + (curr.likes ? curr.likes.length : 0), 0);

                // Calculate earnings from print sales
                const salesEarnings = salesData.reduce((acc, curr) => acc + curr.amount, 0);

                // Calculate earnings from completed commissions
                const commissionEarnings = commissionsData
                    .filter(c => c.status === 'completed' && c.price)
                    .reduce((acc, curr) => acc + curr.price, 0);

                // Total earnings from both sources
                const totalEarnings = salesEarnings + commissionEarnings;

                setStats([
                    { icon: Image, title: 'Artworks', value: artworksData.length.toString(), color: '#8b5cf6' },
                    { icon: Heart, title: 'Total Likes', value: totalLikes.toString(), color: '#ec4899' },
                    { icon: DollarSign, title: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}`, color: '#eab308' },
                    { icon: ShoppingBag, title: 'Sales', value: salesData.length.toString(), color: '#22c55e' }
                ]);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };
        fetchDashboardData();
    }, [user]);

    return (
        <div className="container" style={{ paddingTop: '100px' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Artist <span className="text-gradient">Dashboard</span></h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Welcome back, manage your creative empire.</p>
                </div>
                <Link to="/artist/artworks/new" className="btn-primary">
                    Upload Artwork
                </Link>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <StatCard {...stat} />
                    </motion.div>
                ))}
            </div>

            {/* Earnings Breakdown */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Earnings Breakdown</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Print Sales</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>
                            ${sales.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                            {sales.length} {sales.length === 1 ? 'sale' : 'sales'}
                        </p>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Commissions</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                            ${commissions.filter(c => c.status === 'completed' && c.price).reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                            {commissions.filter(c => c.status === 'completed').length} completed
                        </p>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Total Income</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#eab308' }}>
                            ${(
                                sales.reduce((acc, curr) => acc + curr.amount, 0) +
                                commissions.filter(c => c.status === 'completed' && c.price).reduce((acc, curr) => acc + curr.price, 0)
                            ).toFixed(2)}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                            All sources
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Recent Artworks</h2>
                    {artworks.length === 0 ? (
                        <p style={{ color: 'var(--color-text-muted)' }}>No artworks uploaded yet.</p>
                    ) : (
                        <ul style={{ listStyle: 'none' }}>
                            {artworks.slice(0, 5).map((artwork) => (
                                <li key={artwork._id} style={{ padding: '1rem 0', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden' }}>
                                        <img src={artwork.imageUrl} alt={artwork.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '600' }}>{artwork.title}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                            {new Date(artwork.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span style={{ marginLeft: 'auto', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                        ${artwork.price}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Recent Sales</h2>
                    {sales.length === 0 ? (
                        <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>
                            <p>No sales yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {sales.slice(0, 5).map(sale => (
                                <div key={sale._id} style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontWeight: '500' }}>{sale.artwork?.title || 'Artwork'}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Buyer: {sale.buyer?.username || 'Unknown'}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ color: '#22c55e', fontWeight: 'bold' }}>+${sale.amount}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(sale.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtistDashboard;
