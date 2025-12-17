import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, TrendingUp, Shield, Trash2, Flag, XCircle, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalArtists: 0,
        totalVisitors: 0,
        totalArtworks: 0,
        totalOrders: 0,
        totalCommissions: 0,
        totalVolume: 0,
        flaggedItems: 0
    });
    const [activeTab, setActiveTab] = useState('overview');
    const [artworks, setArtworks] = useState([]);
    const [users, setUsers] = useState([]);
    const [sales, setSales] = useState([]);
    const [flaggedArtworks, setFlaggedArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = '/api';

    useEffect(() => {
        fetchStats();
        if (activeTab === 'artworks') fetchArtworks();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'sales') fetchSales();
        if (activeTab === 'flagged') fetchFlagged();
    }, [activeTab]);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` };
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/stats`, {
                headers: getAuthHeader()
            });
            const data = await response.json();
            setStats(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    const fetchArtworks = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/artworks`, {
                headers: getAuthHeader()
            });
            const data = await response.json();
            setArtworks(data);
        } catch (error) {
            console.error('Error fetching artworks:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/users`, {
                headers: getAuthHeader()
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchSales = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/sales`, {
                headers: getAuthHeader()
            });
            const data = await response.json();
            setSales(data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    const fetchFlagged = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/flagged`, {
                headers: getAuthHeader()
            });
            const data = await response.json();
            setFlaggedArtworks(data);
        } catch (error) {
            console.error('Error fetching flagged artworks:', error);
        }
    };

    const deleteArtwork = async (id) => {
        if (!confirm('Are you sure you want to delete this artwork?')) return;

        try {
            const response = await fetch(`${API_URL}/admin/artworks/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });

            if (response.ok) {
                alert('Artwork deleted successfully');
                fetchArtworks();
                fetchStats();
            }
        } catch (error) {
            console.error('Error deleting artwork:', error);
            alert('Failed to delete artwork');
        }
    };

    const toggleBanUser = async (userId, currentBanStatus) => {
        const action = currentBanStatus ? 'unban' : 'ban';
        if (!confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}/ban`, {
                method: 'PATCH',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ banned: !currentBanStatus })
            });

            if (response.ok) {
                alert(`User ${action}ned successfully`);
                fetchUsers();
            }
        } catch (error) {
            console.error('Error toggling user ban:', error);
            alert('Failed to update user status');
        }
    };

    const toggleFlagArtwork = async (artworkId, currentFlagStatus) => {
        try {
            const response = await fetch(`${API_URL}/admin/artworks/${artworkId}/flag`, {
                method: 'PATCH',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ flagged: !currentFlagStatus })
            });

            if (response.ok) {
                alert(currentFlagStatus ? 'Artwork unflagged' : 'Artwork flagged');
                fetchArtworks();
                fetchFlagged();
                fetchStats();
            }
        } catch (error) {
            console.error('Error toggling flag:', error);
            alert('Failed to update flag status');
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
                <p>Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>
                    Admin <span className="text-gradient">Panel</span>
                </h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                    Manage users, content, and monitor platform activity
                </p>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <motion.div
                    className="glass-panel"
                    style={{ padding: '2rem' }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <Users color="#3b82f6" />
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalUsers}</span>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)' }}>Total Users</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                        {stats.totalArtists} Artists • {stats.totalVisitors} Visitors
                    </p>
                </motion.div>

                <motion.div
                    className="glass-panel"
                    style={{ padding: '2rem' }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <Shield color="#6d28d9" />
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalArtworks}</span>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)' }}>Total Artworks</p>
                </motion.div>

                <motion.div
                    className="glass-panel"
                    style={{ padding: '2rem' }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <AlertTriangle color="#ef4444" />
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.flaggedItems}</span>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)' }}>Flagged Items</p>
                </motion.div>

                <motion.div
                    className="glass-panel"
                    style={{ padding: '2rem' }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <TrendingUp color="#22c55e" />
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${stats.totalVolume.toLocaleString()}</span>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)' }}>Total Sales Volume</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                        {stats.totalOrders} Orders
                    </p>
                </motion.div>
            </div>

            {/* Tabs */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {['overview', 'artworks', 'users', 'sales', 'flagged'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="btn-primary"
                        style={{
                            background: activeTab === tab ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                            color: activeTab === tab ? 'white' : 'var(--color-text-muted)'
                        }}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content based on active tab */}
            {activeTab === 'overview' && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Platform Overview</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Total Commissions</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalCommissions}</p>
                        </div>
                        <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Average Order Value</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                ${stats.totalOrders > 0 ? (stats.totalVolume / stats.totalOrders).toFixed(2) : '0.00'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'artworks' && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>All Artworks</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Image</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Title</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Artist</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Price</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Likes</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {artworks.map(artwork => (
                                    <tr key={artwork._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <img
                                                src={artwork.imageUrl}
                                                alt={artwork.title}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        </td>
                                        <td style={{ padding: '1rem' }}>{artwork.title}</td>
                                        <td style={{ padding: '1rem' }}>{artwork.artist?.username || 'Unknown'}</td>
                                        <td style={{ padding: '1rem' }}>${artwork.price || 'N/A'}</td>
                                        <td style={{ padding: '1rem' }}>{artwork.likes?.length || 0}</td>
                                        <td style={{ padding: '1rem' }}>
                                            {artwork.flagged ? (
                                                <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Flag size={16} /> Flagged
                                                </span>
                                            ) : (
                                                <span style={{ color: '#22c55e' }}>Active</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => toggleFlagArtwork(artwork._id, artwork.flagged)}
                                                    className="btn-primary"
                                                    style={{
                                                        padding: '0.5rem',
                                                        background: artwork.flagged ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                        fontSize: '0.875rem'
                                                    }}
                                                    title={artwork.flagged ? 'Unflag' : 'Flag'}
                                                >
                                                    <Flag size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteArtwork(artwork._id)}
                                                    className="btn-primary"
                                                    style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', fontSize: '0.875rem' }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {artworks.length === 0 && (
                            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                                No artworks found
                            </p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>User Management</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Username</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{user.username}</td>
                                        <td style={{ padding: '1rem' }}>{user.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                background: user.role === 'artist' ? 'rgba(109, 40, 217, 0.2)' :
                                                    user.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' :
                                                        'rgba(59, 130, 246, 0.2)',
                                                fontSize: '0.875rem'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {user.banned ? (
                                                <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <XCircle size={16} /> Banned
                                                </span>
                                            ) : (
                                                <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <CheckCircle size={16} /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => toggleBanUser(user._id, user.banned)}
                                                    className="btn-primary"
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        background: user.banned ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {user.banned ? 'Unban' : 'Ban'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && (
                            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                                No users found
                            </p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'sales' && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Sales History</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Artwork</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Artist</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Buyer</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map(sale => (
                                    <tr key={sale._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            {new Date(sale.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem' }}>{sale.artwork?.title || 'N/A'}</td>
                                        <td style={{ padding: '1rem' }}>{sale.artwork?.artist?.username || 'N/A'}</td>
                                        <td style={{ padding: '1rem' }}>{sale.buyer?.username || 'N/A'}</td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>${sale.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {sales.length === 0 && (
                            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                                No sales found
                            </p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'flagged' && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Flagged Content</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {flaggedArtworks.map(artwork => (
                            <div key={artwork._id} className="glass-panel" style={{ padding: '1rem' }}>
                                <img
                                    src={artwork.imageUrl}
                                    alt={artwork.title}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                                />
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{artwork.title}</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                                    by {artwork.artist?.username || 'Unknown'}
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => toggleFlagArtwork(artwork._id, true)}
                                        className="btn-primary"
                                        style={{ flex: 1, background: 'rgba(34, 197, 94, 0.2)', fontSize: '0.875rem' }}
                                    >
                                        Unflag
                                    </button>
                                    <button
                                        onClick={() => deleteArtwork(artwork._id)}
                                        className="btn-primary"
                                        style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', fontSize: '0.875rem' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {flaggedArtworks.length === 0 && (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                            No flagged content
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
