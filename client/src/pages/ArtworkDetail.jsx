import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, ShoppingBag, ArrowLeft, Send, User, Calendar, Tag, DollarSign, Maximize2, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ArtworkDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        const fetchArtwork = async () => {
            try {
                const res = await fetch(`/api/artworks/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setArtwork(data);
                    setLikes(data.likes ? data.likes.length : 0);
                    setComments(data.comments || []);
                    if (user && data.likes && data.likes.includes(user._id)) {
                        setIsLiked(true);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchArtwork();
    }, [id, user]);

    const handleLike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setIsLiking(true);
        try {
            const res = await fetch(`/api/artworks/${id}/like`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                const updatedData = await res.json();
                setLikes(updatedData.likes.length);
                setIsLiked(updatedData.likes.includes(user._id));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLiking(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (newComment.trim()) {
            try {
                const res = await fetch(`/api/artworks/${id}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ text: newComment })
                });
                if (res.ok) {
                    const updatedComments = await res.json();
                    setComments(updatedComments);
                    setNewComment("");
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleBuyNow = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        console.log('User object:', user);
        console.log('User token:', user.token);

        if (!window.confirm(`Confirm purchase of "${artwork.title}" for $${artwork.price}?`)) {
            return;
        }

        setIsPurchasing(true);

        // Get token from user object or localStorage as fallback
        const token = user.token || localStorage.getItem('token');

        if (!token) {
            alert('Please login again to make a purchase');
            navigate('/login');
            return;
        }

        try {
            console.log('Sending order request with artworkId:', artwork._id);

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ artworkId: artwork._id })
            });

            const data = await res.json();
            console.log('Order response:', res.status, data);

            if (res.ok) {
                setPurchaseSuccess(true);
                setTimeout(() => setPurchaseSuccess(false), 3000);
            } else {
                alert(`Purchase failed: ${data.message}`);
            }
        } catch (err) {
            console.error('Purchase error:', err);
            alert("An error occurred during purchase.");
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: artwork.title,
                    text: `Check out this artwork: ${artwork.title}`,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="container" style={{
                paddingTop: '120px',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                        width: '50px',
                        height: '50px',
                        border: '3px solid var(--glass-border)',
                        borderTopColor: 'var(--color-primary)',
                        borderRadius: '50%'
                    }}
                />
            </div>
        );
    }

    if (!artwork) {
        return (
            <div className="container" style={{
                paddingTop: '120px',
                minHeight: '100vh',
                textAlign: 'center'
            }}>
                <h2>Artwork not found</h2>
                <Link to="/explore" className="btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
                    Back to Gallery
                </Link>
            </div>
        );
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    paddingTop: '100px',
                    minHeight: '100vh',
                    paddingBottom: '60px'
                }}
            >
                <div className="container">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link
                            to="/explore"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '24px',
                                color: 'var(--color-text-muted)',
                                padding: '10px 16px',
                                borderRadius: '12px',
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--color-text-muted)';
                                e.currentTarget.style.borderColor = 'var(--glass-border)';
                            }}
                        >
                            <ArrowLeft size={18} />
                            Back to Gallery
                        </Link>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
                        gap: '48px',
                        alignItems: 'start'
                    }}>
                        {/* Left: Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            style={{ position: 'relative' }}
                        >
                            <div
                                style={{
                                    position: 'relative',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                    cursor: 'zoom-in'
                                }}
                                onClick={() => setIsFullscreen(true)}
                            >
                                <img
                                    src={artwork.imageUrl}
                                    alt={artwork.title}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '16px',
                                    right: '16px',
                                    padding: '12px',
                                    background: 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.85rem'
                                }}>
                                    <Maximize2 size={16} />
                                    Click to expand
                                </div>
                            </div>

                            {/* Tags */}
                            {artwork.tags && artwork.tags.length > 0 && (
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '10px',
                                    marginTop: '20px'
                                }}>
                                    {artwork.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                padding: '8px 16px',
                                                background: 'var(--glass-bg)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                color: 'var(--color-text-muted)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <Tag size={14} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Right: Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {/* Title & Artist */}
                            <div style={{ marginBottom: '24px' }}>
                                {artwork.category && (
                                    <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
                                        {artwork.category}
                                    </span>
                                )}
                                <h1 style={{
                                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                                    fontWeight: '800',
                                    lineHeight: 1.1,
                                    marginBottom: '12px'
                                }}>
                                    {artwork.title}
                                </h1>
                                <Link
                                    to={`/artist/${artwork.artist?._id}`}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 16px',
                                        background: 'var(--glass-bg)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                                    }}
                                >
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <User size={18} color="white" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                                            {artwork.artist?.username || 'Unknown Artist'}
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                            View Profile
                                        </p>
                                    </div>
                                </Link>
                            </div>

                            {/* Description */}
                            {artwork.description && (
                                <p style={{
                                    color: 'var(--color-text-muted)',
                                    lineHeight: '1.7',
                                    marginBottom: '28px',
                                    fontSize: '1rem'
                                }}>
                                    {artwork.description}
                                </p>
                            )}

                            {/* Action Buttons */}
                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                marginBottom: '28px',
                                flexWrap: 'wrap'
                            }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLike}
                                    disabled={isLiking}
                                    style={{
                                        padding: '14px 24px',
                                        borderRadius: '14px',
                                        background: isLiked ? 'rgba(236, 72, 153, 0.2)' : 'var(--glass-bg)',
                                        border: isLiked ? '1px solid #ec4899' : '1px solid var(--glass-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: isLiked ? '#ec4899' : 'white',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                                    {likes}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        padding: '14px 24px',
                                        borderRadius: '14px',
                                        background: 'var(--glass-bg)',
                                        border: '1px solid var(--glass-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    <MessageCircle size={20} />
                                    {comments.length}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleShare}
                                    style={{
                                        padding: '14px 24px',
                                        borderRadius: '14px',
                                        background: 'var(--glass-bg)',
                                        border: '1px solid var(--glass-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    <Share2 size={20} />
                                    Share
                                </motion.button>
                            </div>

                            {/* Purchase Card */}
                            <div
                                className="glass-panel"
                                style={{
                                    padding: '28px',
                                    marginBottom: '28px',
                                    borderRadius: '20px'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '20px'
                                }}>
                                    <div>
                                        <p style={{
                                            fontSize: '0.9rem',
                                            color: 'var(--color-text-muted)',
                                            marginBottom: '4px'
                                        }}>
                                            Print Price
                                        </p>
                                        <p style={{
                                            fontSize: '2.5rem',
                                            fontWeight: '800',
                                            color: 'var(--color-success)'
                                        }}>
                                            ${artwork.price}
                                        </p>
                                    </div>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '16px',
                                        background: 'rgba(34, 197, 94, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <DollarSign size={28} color="#22c55e" />
                                    </div>
                                </div>

                                <p style={{
                                    color: 'var(--color-text-muted)',
                                    marginBottom: '20px',
                                    fontSize: '0.9rem'
                                }}>
                                    High-quality archival print available for purchase. Ships worldwide.
                                </p>

                                <AnimatePresence mode="wait">
                                    {purchaseSuccess ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            style={{
                                                width: '100%',
                                                padding: '16px',
                                                borderRadius: '14px',
                                                background: 'rgba(34, 197, 94, 0.2)',
                                                border: '1px solid #22c55e',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                color: '#22c55e',
                                                fontWeight: '600'
                                            }}
                                        >
                                            <Check size={20} />
                                            Purchase Successful!
                                        </motion.div>
                                    ) : (
                                        <motion.button
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleBuyNow}
                                            disabled={isPurchasing}
                                            className="btn-primary"
                                            style={{
                                                width: '100%',
                                                padding: '18px',
                                                fontSize: '1.1rem',
                                                borderRadius: '14px',
                                                opacity: isPurchasing ? 0.7 : 1
                                            }}
                                        >
                                            {isPurchasing ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        border: '2px solid rgba(255,255,255,0.3)',
                                                        borderTopColor: 'white',
                                                        borderRadius: '50%'
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    <ShoppingBag size={22} />
                                                    Buy Now
                                                </>
                                            )}
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Comments Section */}
                            <div
                                className="glass-panel"
                                style={{
                                    padding: '28px',
                                    borderRadius: '20px'
                                }}
                            >
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <MessageCircle size={22} />
                                    Comments
                                    <span style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--color-text-muted)',
                                        fontWeight: '400'
                                    }}>
                                        ({comments.length})
                                    </span>
                                </h3>

                                {/* Comment Form */}
                                <form
                                    onSubmit={handleComment}
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        marginBottom: '24px'
                                    }}
                                >
                                    <input
                                        type="text"
                                        placeholder={user ? "Add a comment..." : "Login to comment..."}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        disabled={!user}
                                        className="input-field"
                                        style={{ flex: 1 }}
                                    />
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={!user || !newComment.trim()}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '14px',
                                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            cursor: 'pointer',
                                            opacity: (!user || !newComment.trim()) ? 0.5 : 1
                                        }}
                                    >
                                        <Send size={20} />
                                    </motion.button>
                                </form>

                                {/* Comments List */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    maxHeight: '400px',
                                    overflowY: 'auto'
                                }}>
                                    {comments.length === 0 ? (
                                        <p style={{
                                            color: 'var(--color-text-subtle)',
                                            textAlign: 'center',
                                            padding: '20px'
                                        }}>
                                            No comments yet. Be the first to share your thoughts!
                                        </p>
                                    ) : (
                                        comments.map((comment, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                style={{
                                                    padding: '16px',
                                                    background: 'rgba(0,0,0,0.2)',
                                                    borderRadius: '14px',
                                                    border: '1px solid var(--glass-border)'
                                                }}
                                            >
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    marginBottom: '10px'
                                                }}>
                                                    <div style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '600'
                                                    }}>
                                                        {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <p style={{
                                                            fontWeight: '600',
                                                            fontSize: '0.9rem',
                                                            color: 'var(--color-primary-glow)'
                                                        }}>
                                                            {comment.user?.username || 'User'}
                                                        </p>
                                                        <p style={{
                                                            fontSize: '0.75rem',
                                                            color: 'var(--color-text-subtle)'
                                                        }}>
                                                            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p style={{
                                                    fontSize: '0.95rem',
                                                    lineHeight: '1.5',
                                                    color: 'var(--color-text)'
                                                }}>
                                                    {comment.text}
                                                </p>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Fullscreen Image Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsFullscreen(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.95)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2000,
                            padding: '40px',
                            cursor: 'zoom-out'
                        }}
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setIsFullscreen(false)}
                            style={{
                                position: 'absolute',
                                top: '24px',
                                right: '24px',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={24} />
                        </motion.button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media (max-width: 900px) {
                    .container > div:last-of-type {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </>
    );
};

export default ArtworkDetail;
