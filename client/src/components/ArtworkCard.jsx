import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Eye, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArtworkCard = ({ artwork, index = 0 }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'var(--color-surface)',
                boxShadow: isHovered
                    ? '0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(124, 58, 237, 0.1)'
                    : '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'box-shadow 0.4s ease'
            }}
        >
            <Link to={`/artwork/${artwork._id}`} style={{ display: 'block' }}>
                {/* Image Container */}
                <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'var(--glass-bg)'
                }}>
                    {/* Loading Skeleton */}
                    {!imageLoaded && (
                        <div
                            className="skeleton"
                            style={{
                                position: 'absolute',
                                inset: 0,
                                minHeight: '250px'
                            }}
                        />
                    )}

                    {/* Artwork Image */}
                    <motion.img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        animate={{
                            scale: isHovered ? 1.08 : 1,
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            opacity: imageLoaded ? 1 : 0,
                            transition: 'opacity 0.3s ease'
                        }}
                    />

                    {/* Price Tag */}
                    {artwork.price && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'rgba(0,0,0,0.7)',
                                backdropFilter: 'blur(10px)',
                                padding: '8px 14px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <ShoppingBag size={14} color="#22c55e" />
                            <span style={{
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                color: '#22c55e'
                            }}>
                                ${artwork.price}
                            </span>
                        </motion.div>
                    )}

                    {/* Hover Overlay */}
                    <motion.div
                        initial={false}
                        animate={{
                            opacity: isHovered ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: '24px',
                            pointerEvents: isHovered ? 'auto' : 'none'
                        }}
                    >
                        {/* Title & Artist */}
                        <motion.div
                            animate={{
                                y: isHovered ? 0 : 20,
                                opacity: isHovered ? 1 : 0
                            }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                marginBottom: '6px',
                                lineHeight: '1.3'
                            }}>
                                {artwork.title}
                            </h3>
                            <p style={{
                                fontSize: '0.9rem',
                                color: 'var(--color-text-muted)',
                                marginBottom: '16px'
                            }}>
                                by <span style={{ color: 'var(--color-primary-glow)' }}>
                                    {artwork.artist?.username || 'Unknown Artist'}
                                </span>
                            </p>
                        </motion.div>

                        {/* Stats Row */}
                        <motion.div
                            animate={{
                                y: isHovered ? 0 : 20,
                                opacity: isHovered ? 1 : 0
                            }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                gap: '16px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: 'white'
                                }}>
                                    <Heart
                                        size={16}
                                        fill={artwork.likes?.length > 0 ? "#ec4899" : "none"}
                                        color={artwork.likes?.length > 0 ? "#ec4899" : "white"}
                                    />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                        {artwork.likes?.length || 0}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: 'white'
                                }}>
                                    <MessageCircle size={16} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                        {artwork.comments?.length || 0}
                                    </span>
                                </div>
                            </div>

                            {/* View Button */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '10px 18px',
                                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600'
                                }}
                            >
                                <Eye size={16} />
                                View
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Card Footer - Always Visible on Mobile */}
                <div style={{
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--color-surface)',
                    borderTop: '1px solid var(--glass-border)'
                }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginBottom: '2px'
                        }}>
                            {artwork.title}
                        </h4>
                        <p style={{
                            fontSize: '0.8rem',
                            color: 'var(--color-text-muted)'
                        }}>
                            {artwork.artist?.username || 'Unknown'}
                        </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.8rem'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Heart size={14} color={artwork.likes?.length > 0 ? "#ec4899" : "currentColor"} />
                            {artwork.likes?.length || 0}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MessageCircle size={14} />
                            {artwork.comments?.length || 0}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Category Badge */}
            {artwork.category && (
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'rgba(124, 58, 237, 0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {artwork.category}
                </div>
            )}
        </motion.div>
    );
};

export default ArtworkCard;
