import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UploadCloud } from 'lucide-react';

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                    // 'Content-Type': 'multipart/form-data' // Do NOT set this manually with fetch + FormData
                },
                body: formData
            });
            if (res.ok) {
                navigate('/artist/dashboard');
            } else {
                const error = await res.json();
                console.error('Upload failed:', error);
                alert('Upload failed: ' + error.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', paddingTop: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Upload New Artwork</h1>

            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                    <input
                        type="text" value={title} onChange={e => setTitle(e.target.value)} required
                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Artwork File</label>
                    <div style={{
                        border: '2px dashed var(--glass-border)',
                        borderRadius: '8px',
                        padding: '2rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        background: 'rgba(0,0,0,0.2)'
                    }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{
                                position: 'absolute',
                                top: 0, left: 0, width: '100%', height: '100%',
                                opacity: 0, cursor: 'pointer'
                            }}
                            required
                        />
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '4px' }} />
                        ) : (
                            <div style={{ color: 'var(--color-text-muted)' }}>
                                <UploadCloud size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p>Click or drag image here to upload</p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Price ($)</label>
                        <input
                            type="number" value={price} onChange={e => setPrice(e.target.value)}
                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                        >
                            <option value="Digital">Digital</option>
                            <option value="Traditional">Traditional</option>
                            <option value="Photography">Photography</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tags (comma separated)</label>
                    <input
                        type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="cyberpunk, neon, portrait"
                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                    <textarea
                        value={description} onChange={e => setDescription(e.target.value)} rows={4}
                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                    />
                </div>

                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end', minWidth: '150px' }}>Upload Artwork</button>
            </form>
        </div>
    );
};

export default NewArtwork;
