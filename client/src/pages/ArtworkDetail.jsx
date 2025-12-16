import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ArtworkDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

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
        if (!user) return alert("Please login to like artworks");
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
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) return alert("Please login to comment");
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

    if (loading) return <div className="container" style={{ paddingTop: '100px' }}>Loading...</div>;
    if (!artwork) return <div className="container" style={{ paddingTop: '100px' }}>Artwork not found</div>;

    const handleBuyNow = async () => {
        if (!user) return alert("Please login to purchase");

        if (!window.confirm(`Confirm purchase of "${artwork.title}" for $${artwork.price}?`)) {
            return;
        }

        const originalText = document.getElementById('buy-btn').innerText;
        document.getElementById('buy-btn').innerText = 'Processing...';
        document.getElementById('buy-btn').disabled = true;

        try {
            console.log("Sending order request for artwork:", artwork._id);
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ artworkId: artwork._id })
            });

            console.log("Order response status:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("Purchase success data:", data);
                alert("Purchase successful! Thank you for your order.");
            } else {
                const error = await res.json();
                console.error("Purchase error details:", error);
                alert(`Purchase failed: ${error.message}`);
            }
        } catch (err) {
            console.error("Buy Now exception:", err);
            alert("An error occurred during purchase. Check console for details.");
        } finally {
            if (document.getElementById('buy-btn')) {
                document.getElementById('buy-btn').innerText = originalText;
                document.getElementById('buy-btn').disabled = false;
            }
        }
    };

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', paddingBottom: '40px' }} className="container">
            <Link to="/explore" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--color-text-muted)' }}>
                <ArrowLeft size={20} /> Back to Explore
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '40px' }}>
                {/* Left: Image */}
                <div style={{ position: 'relative' }}>
                    <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        style={{
                            width: '100%',
                            borderRadius: '16px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                            display: 'block'
                        }}
                    />
                </div>

                {/* Right: Details */}
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '10px' }}>{artwork.title}</h1>
                    <Link to={`/artist/${artwork.artist?._id}`} style={{ fontSize: '1.2rem', color: 'var(--color-primary-glow)', marginBottom: '24px', display: 'inline-block' }}>
                        by {artwork.artist?.username || 'Unknown Artist'}
                    </Link>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <button
                            onClick={handleLike}
                            className="glass-panel"
                            style={{
                                padding: '10px 20px',
                                borderRadius: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                color: isLiked ? '#ec4899' : 'white',
                                cursor: 'pointer'
                            }}
                        >
                            <Heart size={20} fill={isLiked ? "currentColor" : "none"} /> {likes}
                        </button>
                        <button className="glass-panel" style={{ padding: '10px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                            <MessageCircle size={20} /> {comments.length}
                        </button>
                        <button className="glass-panel" style={{ padding: '10px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                            <Share2 size={20} /> Share
                        </button>
                    </div>

                    <div className="glass-panel" style={{ padding: '24px', marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Print Options</h3>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>High-quality archival prints available.</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <span>Standard Print</span>
                            <strong style={{ fontSize: '1.2rem' }}>${artwork.price}</strong>
                        </div>
                        <button id="buy-btn" onClick={handleBuyNow} className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <ShoppingBag size={20} /> Buy Now
                        </button>
                    </div>

                    {/* Comments Section */}
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Comments</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                            {comments.length === 0 ? <p style={{ color: 'gray' }}>No comments yet.</p> : comments.map((comment, idx) => (
                                <div key={idx} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-glow)' }}>{comment.user?.username || 'User'}</strong>
                                    <p style={{ fontSize: '0.95rem' }}>{comment.text}</p>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleComment} style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid var(--glass-border)',
                                    padding: '10px 16px',
                                    borderRadius: '30px',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                            <button type="submit" className="glass-panel" style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ArrowLeft size={16} style={{ rotate: '180deg' }} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtworkDetail;
