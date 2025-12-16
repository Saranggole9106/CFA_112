import React from 'react';
import { Link } from 'react-router-dom';
import MasonryGrid from '../components/MasonryGrid';

const Home = () => {
    const [featuredArtworks, setFeaturedArtworks] = React.useState([]);

    React.useEffect(() => {
        const fetchArtworks = async () => {
            try {
                const res = await fetch('/api/artworks');
                if (res.ok) {
                    const data = await res.json();
                    setFeaturedArtworks(data.slice(0, 6));
                }
            } catch (err) {
                console.error('Failed to fetch featured artworks', err);
            }
        };
        fetchArtworks();
    }, []);

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '60px' }}>
            {/* Hero Section */}
            <section className="container" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '100px 0',
                position: 'relative'
            }}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(109, 40, 217, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    zIndex: -1,
                    pointerEvents: 'none'
                }}></div>

                <h1 className="animate-fade-in" style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                    Discover Digital <br />
                    <span className="text-gradient">Masterpieces</span>
                </h1>

                <p className="animate-fade-in" style={{
                    fontSize: '1.2rem',
                    color: 'var(--color-text-muted)',
                    maxWidth: '600px',
                    marginBottom: '2.5rem',
                    animationDelay: '0.2s'
                }}>
                    The premier platform for artists to showcase work, manage commissions, and connect with art lovers worldwide.
                </p>

                <div className="animate-fade-in" style={{ display: 'flex', gap: '1rem', animationDelay: '0.4s' }}>
                    <Link to="/explore" className="btn-primary">Start Exploring</Link>
                    <Link to="/register" className="glass-panel" style={{
                        padding: '12px 24px',
                        borderRadius: '50px',
                        color: 'white',
                        fontWeight: '600',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>Join as Artist</Link>
                </div>
            </section>

            {/* Featured Gallery */}
            <section className="container" style={{ padding: '0 0 50px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Featured Artworks</h2>
                    <Link to="/explore" style={{ color: 'var(--color-primary-glow)', fontWeight: '600' }}>View All &rarr;</Link>
                </div>

                <MasonryGrid artworks={featuredArtworks} />
            </section>
        </div>
    );
};

export default Home;
