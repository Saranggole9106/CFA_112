import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Image, Heart, Eye, Calendar, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ArtistArtworks = () => {
    const { user } = useAuth();
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtworks = async () => {
            if (!user) return;
            try {
                const res = await fetch('/api/artworks/user/uploaded', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setArtworks(data);
                }
            } catch (err) {
                console.error('Failed to fetch artworks:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchArtworks();
    }, [user]);

    const handleDelete = async (artworkId) => {
        if (!window.confirm('Are you sure you want to delete this artwork?')) return;

        try {
            const res = await fetch(`/api/artworks/${artworkId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                setArtworks(artworks.filter(a => a._id !== artworkId));
            } else {
                alert('Failed to delete artwork');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting artwork');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="container"
            style={{ paddingTop: '120px', paddingBottom: '60px' }}
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '32px',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}
            >
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>
                    My <span className="text-gradient">Artworks</span>
                </h1>
                <Link to="/artist/artworks/new" className="btn-primary" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '14px'
                }}>
                    <Plus size={20} />
                    Upload New
                </Link>
            </motion.div>

            {/* Content */}
            {loading ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '24px'
                }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="skeleton" style={{ height: '320px', borderRadius: '20px' }} />
                    ))}
                </div>
            ) : artworks.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel"
                    style={{
                        padding: '80px 40px',
                        textAlign: 'center',
                        borderRadius: '24px'
                    }}
                >
                    <Image size={64} color="var(--color-text-subtle)" style={{ marginBottom: '24px' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No artworks yet</h3>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                        Start showcasing your talent by uploading your first artwork
                    </p>
                    <Link to="/artist/artworks/new" className="btn-primary">
                        <Plus size={20} />
                        Upload Your First Artwork
                    </Link>
                </motion.div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {artworks.map((artwork, index) => (
                        <motion.div
                            key={artwork._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="glass-panel"
                            style={{
                                borderRadius: '20px',
                                overflow: 'hidden',
                                padding: 0
                            }}
                        >
                            {/* Image */}
                            <Link to={`/artwork/${artwork._id}`} style={{ display: 'block', position: 'relative' }}>
                                <img
                                    src={artwork.imageUrl}
                                    alt={artwork.title}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover'
                                    }}
                                />
                                {artwork.category && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        padding: '6px 12px',
                                        background: 'rgba(0,0,0,0.6)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem'
                                    }}>
                                        {artwork.category}
                                    </span>
                                )}
                                <span style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    padding: '8px 14px',
                                    background: 'rgba(34, 197, 94, 0.9)',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    fontWeight: '700'
                                }}>
                                    ${artwork.price}
                                </span>
                            </Link>

                            {/* Details */}
                            <div style={{ padding: '20px' }}>
                                <h3 style={{
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                    marginBottom: '12px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {artwork.title}
                                </h3>

                                {/* Stats */}
                                <div style={{
                                    display: 'flex',
                                    gap: '16px',
                                    marginBottom: '16px',
                                    fontSize: '0.9rem',
                                    color: 'var(--color-text-muted)'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Heart size={16} color="#ec4899" />
                                        {artwork.likes?.length || 0}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={16} />
                                        {new Date(artwork.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <Link
                                        to={`/artwork/${artwork._id}`}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            borderRadius: '10px',
                                            background: 'var(--glass-bg)',
                                            border: '1px solid var(--glass-border)',
                                            textAlign: 'center',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <Eye size={16} />
                                        View
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(artwork._id)}
                                        style={{
                                            padding: '10px 16px',
                                            borderRadius: '10px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            color: '#ef4444',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default ArtistArtworks;
