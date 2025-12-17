import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Grid, LayoutGrid, Sparkles, TrendingUp, Clock, Palette } from 'lucide-react';
import MasonryGrid from '../components/MasonryGrid';

const Explore = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeSort, setActiveSort] = useState("latest");
    const [artworks, setArtworks] = useState([]);
    const [filteredArtworks, setFilteredArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("grid");

    const categories = [
        { name: "All", icon: Sparkles },
        { name: "Digital", icon: Palette },
        { name: "Traditional", icon: Palette },
        { name: "Photography", icon: Palette },
        { name: "Abstract", icon: Palette },
        { name: "Landscape", icon: Palette },
        { name: "Portrait", icon: Palette },
        { name: "Fantasy", icon: Palette }
    ];

    const sortOptions = [
        { value: "latest", label: "Latest", icon: Clock },
        { value: "popular", label: "Most Liked", icon: TrendingUp },
        { value: "price-low", label: "Price: Low to High", icon: null },
        { value: "price-high", label: "Price: High to Low", icon: null }
    ];

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                const res = await fetch('/api/artworks');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setArtworks(data);
                    setFilteredArtworks(data);
                }
            } catch (error) {
                console.error("Failed to fetch artworks", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtworks();
    }, []);

    useEffect(() => {
        let result = [...artworks];

        // Filter by category
        if (activeCategory !== "All") {
            result = result.filter(artwork =>
                artwork.category?.toLowerCase() === activeCategory.toLowerCase()
            );
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(artwork =>
                artwork.title?.toLowerCase().includes(query) ||
                artwork.description?.toLowerCase().includes(query) ||
                artwork.artist?.username?.toLowerCase().includes(query) ||
                artwork.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Sort
        switch (activeSort) {
            case "latest":
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "popular":
                result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
                break;
            case "price-low":
                result.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case "price-high":
                result.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            default:
                break;
        }

        setFilteredArtworks(result);
    }, [activeCategory, searchQuery, activeSort, artworks]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '60px' }}>
            {/* Hero Header */}
            <section className="container" style={{ marginBottom: '40px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center', marginBottom: '40px' }}
                >
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: '800',
                        marginBottom: '16px'
                    }}>
                        Explore <span className="text-gradient">Gallery</span>
                    </h1>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '1.1rem',
                        maxWidth: '500px',
                        margin: '0 auto'
                    }}>
                        Discover curated collections from the world's most talented digital artists
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        position: 'relative'
                    }}
                >
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Search
                            size={20}
                            color="var(--color-text-subtle)"
                            style={{
                                position: 'absolute',
                                left: '20px',
                                pointerEvents: 'none'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search artworks, artists, or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field"
                            style={{
                                paddingLeft: '52px',
                                paddingRight: '52px',
                                height: '56px',
                                fontSize: '1rem',
                                borderRadius: '28px'
                            }}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                style={{
                                    position: 'absolute',
                                    right: '16px',
                                    background: 'transparent',
                                    color: 'var(--color-text-muted)',
                                    padding: '8px'
                                }}
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* Filters Section */}
            <section className="container" style={{ marginBottom: '40px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {/* Category Pills */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '24px',
                        flexWrap: 'wrap',
                        padding: '0 20px'
                    }}>
                        {categories.map((cat, index) => (
                            <motion.button
                                key={cat.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveCategory(cat.name)}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '30px',
                                    background: activeCategory === cat.name
                                        ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))'
                                        : 'var(--glass-bg)',
                                    border: activeCategory === cat.name
                                        ? 'none'
                                        : '1px solid var(--glass-border)',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    fontWeight: activeCategory === cat.name ? '600' : '400',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: activeCategory === cat.name
                                        ? 'var(--shadow-glow-primary)'
                                        : 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {cat.name}
                            </motion.button>
                        ))}
                    </div>

                    {/* Sort & View Controls */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 24px',
                        background: 'var(--glass-bg)',
                        borderRadius: 'var(--border-radius-lg)',
                        border: '1px solid var(--glass-border)',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}>
                        {/* Results Count */}
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--color-primary-glow)', fontWeight: '600' }}>
                                {filteredArtworks.length}
                            </span> {filteredArtworks.length === 1 ? 'artwork' : 'artworks'} found
                        </div>

                        {/* Sort Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Sort by:</span>
                                <select
                                    value={activeSort}
                                    onChange={(e) => setActiveSort(e.target.value)}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '8px',
                                        padding: '8px 12px',
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    {sortOptions.map(option => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                            style={{ background: 'var(--color-surface)' }}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* View Mode Toggle */}
                            <div style={{
                                display: 'flex',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '8px',
                                padding: '4px'
                            }}>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        background: viewMode === 'grid' ? 'var(--color-primary)' : 'transparent',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('masonry')}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        background: viewMode === 'masonry' ? 'var(--color-primary)' : 'transparent',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <LayoutGrid size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Artworks Grid */}
            <section className="container">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '24px'
                            }}
                        >
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="skeleton"
                                    style={{
                                        height: `${250 + Math.random() * 100}px`,
                                        borderRadius: 'var(--border-radius-lg)'
                                    }}
                                />
                            ))}
                        </motion.div>
                    ) : filteredArtworks.length > 0 ? (
                        <motion.div
                            key="content"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <MasonryGrid artworks={filteredArtworks} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{
                                textAlign: 'center',
                                padding: '80px 20px',
                                background: 'var(--glass-bg)',
                                borderRadius: 'var(--border-radius-xl)',
                                border: '1px solid var(--glass-border)'
                            }}
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Search size={64} color="var(--color-text-subtle)" style={{ marginBottom: '24px' }} />
                            </motion.div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No Artworks Found</h3>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                                {searchQuery
                                    ? `No results for "${searchQuery}". Try different keywords or browse all artworks.`
                                    : "No artworks in this category yet. Check back later!"}
                            </p>
                            {(searchQuery || activeCategory !== "All") && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setActiveCategory("All");
                                    }}
                                    className="btn-secondary"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
};

export default Explore;
