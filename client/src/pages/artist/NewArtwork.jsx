import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { UploadCloud, Image, DollarSign, Tag, FileText, ArrowLeft, Sparkles, Check, X } from 'lucide-react';

const NewArtwork = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Digital');
    const [tags, setTags] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const categories = [
        'Digital', 'Traditional', 'Photography', 'Abstract', 'Landscape', 'Portrait', 'Fantasy', 'Illustration'
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('tags', tags);
        if (image) {
            formData.append('image', image);
        }

        try {
            const res = await fetch('/api/artworks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData
            });
            if (res.ok) {
                navigate('/artist/dashboard');
            } else {
                const error = await res.json();
                alert('Upload failed: ' + error.message);
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred while uploading');
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearImage = () => {
        setImage(null);
        setPreviewUrl('');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="container"
            style={{ maxWidth: '900px', paddingTop: '120px', paddingBottom: '60px' }}
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: '32px' }}
            >
                <Link
                    to="/artist/dashboard"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--color-text-muted)',
                        marginBottom: '16px',
                        padding: '8px 16px',
                        background: 'var(--glass-bg)',
                        borderRadius: '10px',
                        border: '1px solid var(--glass-border)',
                        transition: 'all 0.2s'
                    }}
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>
                <h1 style={{
                    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <Sparkles color="var(--color-primary-glow)" />
                    Upload <span className="text-gradient">Artwork</span>
                </h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>
                    Share your masterpiece with the world
                </p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                onSubmit={handleSubmit}
                className="glass-panel"
                style={{
                    padding: '36px',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '28px'
                }}
            >
                {/* Image Upload */}
                <div>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        fontWeight: '600'
                    }}>
                        <Image size={20} color="var(--color-primary-glow)" />
                        Artwork Image
                    </label>
                    <motion.div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        animate={{
                            borderColor: isDragging ? 'var(--color-primary)' : 'var(--glass-border)',
                            background: isDragging ? 'rgba(124, 58, 237, 0.1)' : 'rgba(0,0,0,0.2)'
                        }}
                        style={{
                            border: '2px dashed var(--glass-border)',
                            borderRadius: '16px',
                            padding: previewUrl ? '16px' : '48px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.3s ease',
                            minHeight: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{
                                position: 'absolute',
                                top: 0, left: 0, width: '100%', height: '100%',
                                opacity: 0, cursor: 'pointer'
                            }}
                            required={!previewUrl}
                        />

                        <AnimatePresence mode="wait">
                            {previewUrl ? (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    style={{ position: 'relative' }}
                                >
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        style={{
                                            maxHeight: '300px',
                                            maxWidth: '100%',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                        }}
                                    />
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clearImage();
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '-10px',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: '#ef4444',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            cursor: 'pointer',
                                            zIndex: 10
                                        }}
                                    >
                                        <X size={18} />
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <UploadCloud size={56} style={{ marginBottom: '16px', opacity: 0.6 }} />
                                    </motion.div>
                                    <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
                                        Drag & drop your artwork here
                                    </p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-subtle)' }}>
                                        or click to browse files
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Title */}
                <div>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '10px',
                        fontWeight: '600'
                    }}>
                        <FileText size={20} color="var(--color-primary-glow)" />
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        placeholder="Give your artwork a name"
                        className="input-field"
                    />
                </div>

                {/* Price & Category Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '10px',
                            fontWeight: '600'
                        }}>
                            <DollarSign size={20} color="#22c55e" />
                            Price ($)
                        </label>
                        <input
                            type="number"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder="99.00"
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '10px',
                            fontWeight: '600'
                        }}>
                            <Tag size={20} color="#f59e0b" />
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="input-field"
                            style={{ cursor: 'pointer' }}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat} style={{ background: 'var(--color-surface)' }}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '10px',
                        fontWeight: '600'
                    }}>
                        <Tag size={20} color="var(--color-secondary)" />
                        Tags
                    </label>
                    <input
                        type="text"
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                        placeholder="cyberpunk, neon, portrait (comma separated)"
                        className="input-field"
                    />
                    <p style={{
                        fontSize: '0.8rem',
                        color: 'var(--color-text-subtle)',
                        marginTop: '8px'
                    }}>
                        Add tags to help people discover your artwork
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '10px',
                        fontWeight: '600'
                    }}>
                        <FileText size={20} color="var(--color-accent)" />
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Tell the story behind your artwork..."
                        className="input-field"
                        style={{ resize: 'vertical', minHeight: '120px' }}
                    />
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary"
                    style={{
                        alignSelf: 'flex-end',
                        padding: '16px 32px',
                        fontSize: '1rem',
                        borderRadius: '14px',
                        opacity: isSubmitting ? 0.7 : 1
                    }}
                >
                    {isSubmitting ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderTopColor: 'white',
                                borderRadius: '50%'
                            }}
                        />
                    ) : (
                        <>
                            <Check size={20} />
                            Publish Artwork
                        </>
                    )}
                </motion.button>
            </motion.form>
        </motion.div>
    );
};

export default NewArtwork;
