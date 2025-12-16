import React, { useState, useEffect } from 'react';
import MasonryGrid from '../components/MasonryGrid';

const Explore = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = ["All", "Digital", "Traditional", "Photography", "Abstract", "Landscape"];

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                let url = '/api/artworks';
                if (activeCategory !== "All") {
                    url += `?category=${activeCategory}`;
                }
                const res = await fetch(url);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setArtworks(data);
                }
            } catch (error) {
                console.error("Failed to fetch artworks", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtworks();
    }, [activeCategory]);

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '40px' }} className="container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Explore <span className="text-gradient">Gallery</span></h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Curated collections from the world's best digital artists.</p>
            </div>

            {/* Category Filter */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '40px',
                flexWrap: 'wrap'
            }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: '8px 24px',
                            borderRadius: '30px',
                            background: activeCategory === cat ? 'linear-gradient(135deg, var(--color-primary), #4c1d95)' : 'var(--glass-bg)',
                            border: activeCategory === cat ? 'none' : '1px solid var(--glass-border)',
                            color: 'white',
                            fontSize: '0.9rem',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading artworks...</p>
            ) : (
                <MasonryGrid artworks={artworks} />
            )}

            {!loading && artworks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                    No artworks found in this category.
                </div>
            )}
        </div>
    );
};

export default Explore;
