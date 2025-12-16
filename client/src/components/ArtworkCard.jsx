import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArtworkCard = ({ artwork }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '24px',
                breakInside: 'avoid',
                backgroundColor: '#1a1a1a',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}
            className="card-container"
        >
            <Link to={`/artwork/${artwork._id}`}>
                <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    loading="lazy"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                    }}
                />

                {/* Hover Overlay */}
                <div className="card-overlay" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    padding: '20px',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    height: '100%'
                }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' }}>{artwork.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '12px' }}>by {artwork.artist?.username || 'Unknown'}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: 'var(--color-primary-glow)' }}>${artwork.price}</span>
                        <div style={{ display: 'flex', gap: '12px', color: '#fff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Heart size={16} /> <span style={{ fontSize: '0.8rem' }}>{artwork.likes ? artwork.likes.length : 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <style>{`
        .card-container:hover img {
          transform: scale(1.05) !important;
        }
        .card-container:hover .card-overlay {
          opacity: 1 !important;
        }
      `}</style>
        </motion.div>
    );
};

export default ArtworkCard;
