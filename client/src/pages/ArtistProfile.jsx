import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MasonryGrid from '../components/MasonryGrid';
import { MapPin, Link as LinkIcon, Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const ArtistProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [artist, setArtist] = useState(null);
    const [artistArtworks, setArtistArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showCommission, setShowCommission] = useState(false);
    const [commissionBrief, setCommissionBrief] = useState('');
    const [commissionDeadline, setCommissionDeadline] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    // Fetch artist data
    useEffect(() => {
        const fetchArtist = async () => {
            try {
                setLoading(true);
                // Fetch artworks to find the artist
                const res = await fetch('/api/artworks');
                const artworks = await res.json();

                // Find artworks by this artist
                const artistWorks = artworks.filter(a => a.artist?._id === id);
                setArtistArtworks(artistWorks);

                // Get artist info from the first artwork
                if (artistWorks.length > 0 && artistWorks[0].artist) {
                    setArtist(artistWorks[0].artist);
                } else {
                    // If no artworks, try to get from all users (admin only) or show placeholder
                    setArtist({
                        _id: id,
                        username: 'Artist',
                        bio: 'Artist profile',
                        profileImage: 'https://placehold.co/140x140/1a1a2e/ffffff?text=A',
                        commissionOpen: false
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching artist:', err);
                setError('Failed to load artist profile');
                setLoading(false);
            }
        };

        fetchArtist();
    }, [id]);

    // Handle commission submission
    const handleCommissionSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setSubmitMessage({ type: 'error', text: 'Please login to send a commission request' });
            return;
        }

        if (commissionBrief.trim().length < 10) {
            setSubmitMessage({ type: 'error', text: 'Please provide a detailed brief (at least 10 characters)' });
            return;
        }

        // Get token from user object or localStorage as fallback
        const token = user.token || localStorage.getItem('token');

        if (!token) {
            setSubmitMessage({ type: 'error', text: 'Please login again to submit a commission request' });
            return;
        }

        setSubmitting(true);
        setSubmitMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/commissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    artistId: id,
                    brief: commissionBrief,
                    deadline: commissionDeadline || undefined
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to send commission request');
            }

            setSubmitMessage({ type: 'success', text: 'Commission request sent successfully!' });
            setCommissionBrief('');
            setCommissionDeadline('');
            setTimeout(() => setShowCommission(false), 2000);
        } catch (err) {
            setSubmitMessage({ type: 'error', text: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loader size={48} className="animate-spin" />
            </div>
        );
    }

    if (error || !artist) {
        return (
            <div style={{ paddingTop: '100px', minHeight: '100vh', textAlign: 'center' }}>
                <h2>Artist not found</h2>
                <Link to="/explore" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                    Browse Artists
                </Link>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', paddingBottom: '40px' }}>
            {/* Cover Image */}
            <div style={{
                height: '300px',
                width: '100%',
                backgroundImage: `linear-gradient(to top, var(--color-bg), transparent), url(${artist.coverImage || 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=1200'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }} />

            <div className="container" style={{ position: 'relative', marginTop: '-80px' }}>
                {/* Profile Header */}
                <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', width: '100%', flexWrap: 'wrap' }}>
                        <img
                            src={artist.profileImage || 'https://placehold.co/140x140/1a1a2e/ffffff?text=A'}
                            alt={artist.username}
                            style={{
                                width: '140px',
                                height: '140px',
                                borderRadius: '50%',
                                border: '4px solid var(--color-surface)',
                                objectFit: 'cover'
                            }}
                        />

                        <div style={{ flex: 1, marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1 }}>{artist.username}</h1>
                                <CheckCircle size={24} color="var(--color-primary-glow)" fill="none" />
                            </div>
                            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>{artist.bio || 'Digital artist'}</p>

                            <div style={{ display: 'flex', gap: '20px', marginTop: '16px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: artist.commissionOpen ? 'var(--color-success, #22c55e)' : 'var(--color-text-muted)'
                                }}>
                                    {artist.commissionOpen ? '✅ Accepting Commissions' : '❌ Commissions Closed'}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                            <button className="glass-panel" style={{ padding: '12px 24px', borderRadius: '50px', color: 'white', fontWeight: '600' }}>Follow</button>
                            {artist.commissionOpen && (
                                <button
                                    className="btn-primary"
                                    onClick={() => setShowCommission(!showCommission)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Mail size={18} /> Request Commission
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div style={{
                        display: 'flex',
                        gap: '40px',
                        paddingTop: '20px',
                        borderTop: '1px solid var(--glass-border)',
                        width: '100%'
                    }}>
                        <div><strong style={{ fontSize: '1.2rem', color: 'white' }}>{artistArtworks.length}</strong> <span style={{ color: 'var(--color-text-muted)' }}>Artworks</span></div>
                    </div>
                </div>

                {/* Commission Form (Toggle) */}
                {showCommission && (
                    <div className="glass-panel animate-fade-in" style={{ marginTop: '20px', padding: '30px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Commission Request</h2>

                        {submitMessage.text && (
                            <div style={{
                                padding: '12px 16px',
                                marginBottom: '16px',
                                borderRadius: '8px',
                                background: submitMessage.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                border: `1px solid ${submitMessage.type === 'error' ? '#ef4444' : '#22c55e'}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <AlertCircle size={18} />
                                {submitMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleCommissionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <textarea
                                placeholder="Describe your vision in detail (at least 10 characters)..."
                                rows="4"
                                style={inputStyle}
                                value={commissionBrief}
                                onChange={(e) => setCommissionBrief(e.target.value)}
                                required
                                minLength={10}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <input
                                    type="date"
                                    placeholder="Deadline (optional)"
                                    style={inputStyle}
                                    value={commissionDeadline}
                                    onChange={(e) => setCommissionDeadline(e.target.value)}
                                />
                                <div></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button
                                    type="button"
                                    className="glass-panel"
                                    style={{ padding: '12px 24px', borderRadius: '8px' }}
                                    onClick={() => setShowCommission(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Sending...' : 'Send Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Artworks Gallery */}
                <div style={{ marginTop: '50px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Portfolio</h2>
                    {artistArtworks.length > 0 ? (
                        <MasonryGrid artworks={artistArtworks} />
                    ) : (
                        <p style={{ color: 'var(--color-text-muted)' }}>No artworks yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1rem',
    fontFamily: 'inherit',
    outline: 'none'
};

export default ArtistProfile;

