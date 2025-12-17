import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Image, Heart, Star, ArrowRight, Palette } from 'lucide-react';

const Artists = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                // Fetch artworks and extract unique artists
                const res = await fetch('/api/artworks');
                if (res.ok) {
                    const artworks = await res.json();

                    // Group artworks by artist
                    const artistMap = new Map();
                    artworks.forEach(artwork => {
                        if (artwork.artist) {
                            const artistId = artwork.artist._id;
                            if (!artistMap.has(artistId)) {
                                artistMap.set(artistId, {
                                    ...artwork.artist,
                                    artworks: [],
                                    totalLikes: 0
                                });
                            }
                            const artist = artistMap.get(artistId);
                            artist.artworks.push(artwork);
                            artist.totalLikes += artwork.likes?.length || 0;
                        }
                    });

                    setArtists(Array.from(artistMap.values()));
                }
            } catch (err) {
                console.error('Failed to fetch artists:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchArtists();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '60px' }}
        >
            {/* Hero Section */}
            <section className="container" style={{ marginBottom: '60px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center', marginBottom: '60px' }}
                >
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
                            margin: '0 auto 28px',
                            boxShadow: 'var(--shadow-glow-primary)'
                        }}
                    >
                        <Users size={40} color="white" />
                    </motion.div>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        fontWeight: '800',
                        marginBottom: '20px',
                        lineHeight: 1.1
                    }}>
                        Featured <span className="text-gradient">Artists</span>
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                        color: 'var(--color-text-muted)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: 1.7
                    }}>
                        Discover talented digital artists and explore their incredible portfolios
                    </p>
                </motion.div>

                {/* Artists Grid */}
                {loading ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '24px'
                    }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="skeleton" style={{ height: '400px', borderRadius: '24px' }} />
                        ))}
                    </div>
                ) : artists.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel"
                        style={{
                            textAlign: 'center',
                            padding: '80px 40px',
                            borderRadius: '24px'
                        }}
                    >
                        <Palette size={64} color="var(--color-text-subtle)" style={{ marginBottom: '24px' }} />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No artists yet</h3>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                            Be the first to join our community of artists
                        </p>
                        <Link to="/register" className="btn-primary">
                            Join as Artist
                        </Link>
                    </motion.div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '28px'
                    }}>
                        {artists.map((artist, index) => (
                            <motion.div
                                key={artist._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="glass-panel"
                                style={{
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    padding: 0
                                }}
                            >
                                {/* Cover Image - Use first artwork or gradient */}
                                <div style={{
                                    height: '160px',
                                    background: artist.artworks[0]
                                        ? `url(${artist.artworks[0].imageUrl}) center/cover`
                                        : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(13,13,18,1) 0%, transparent 100%)'
                                    }} />
                                </div>

                                {/* Profile Content */}
                                <div style={{ padding: '0 24px 24px', marginTop: '-50px', position: 'relative' }}>
                                    {/* Avatar */}
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        style={{
                                            width: '90px',
                                            height: '90px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                            padding: '4px',
                                            marginBottom: '16px',
                                            boxShadow: 'var(--shadow-glow-primary)'
                                        }}
                                    >
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            background: 'var(--color-surface)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2rem',
                                            fontWeight: '700'
                                        }}>
                                            {artist.username?.charAt(0).toUpperCase()}
                                        </div>
                                    </motion.div>

                                    {/* Name & Bio */}
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        marginBottom: '8px'
                                    }}>
                                        {artist.username}
                                    </h3>
                                    <p style={{
                                        color: 'var(--color-text-muted)',
                                        marginBottom: '20px',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.6,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {artist.bio || 'Digital artist creating unique visual experiences'}
                                    </p>

                                    {/* Stats */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '24px',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Image size={18} color="var(--color-primary-glow)" />
                                            <span style={{ fontWeight: '600' }}>{artist.artworks.length}</span>
                                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Works</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Heart size={18} color="#ec4899" />
                                            <span style={{ fontWeight: '600' }}>{artist.totalLikes}</span>
                                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Likes</span>
                                        </div>
                                    </div>

                                    {/* Artwork Preview */}
                                    {artist.artworks.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            gap: '8px',
                                            marginBottom: '20px'
                                        }}>
                                            {artist.artworks.slice(0, 4).map((artwork, i) => (
                                                <div
                                                    key={artwork._id}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '10px',
                                                        overflow: 'hidden',
                                                        border: '2px solid var(--color-surface-elevated)'
                                                    }}
                                                >
                                                    <img
                                                        src={artwork.imageUrl}
                                                        alt=""
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                            ))}
                                            {artist.artworks.length > 4 && (
                                                <div style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '10px',
                                                    background: 'var(--glass-bg)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    color: 'var(--color-text-muted)'
                                                }}>
                                                    +{artist.artworks.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* View Profile Button */}
                                    <Link
                                        to={`/artist/${artist._id}`}
                                        className="btn-primary"
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            borderRadius: '14px',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        View Portfolio
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-panel"
                    style={{
                        padding: 'clamp(40px, 8vw, 80px)',
                        borderRadius: '28px',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '-80px',
                        left: '-80px',
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%'
                    }} />

                    <h2 style={{
                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                        fontWeight: '800',
                        marginBottom: '16px',
                        position: 'relative'
                    }}>
                        Are You an <span className="text-gradient">Artist</span>?
                    </h2>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        marginBottom: '32px',
                        fontSize: '1.1rem',
                        maxWidth: '500px',
                        margin: '0 auto 32px',
                        position: 'relative'
                    }}>
                        Join ArtFolio to showcase your work, connect with collectors, and earn from your art.
                    </p>
                    <Link
                        to="/register"
                        className="btn-primary"
                        style={{
                            display: 'inline-flex',
                            padding: '18px 36px',
                            fontSize: '1.1rem',
                            borderRadius: '16px'
                        }}
                    >
                        <Star size={20} />
                        Join as Artist
                    </Link>
                </motion.div>
            </section>
        </motion.div>
    );
};

export default Artists;
