import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { artists, artworks } from '../data/mockData';
import MasonryGrid from '../components/MasonryGrid';
import { MapPin, Link as LinkIcon, Mail, CheckCircle } from 'lucide-react';

const ArtistProfile = () => {
    const { id } = useParams();
    const artist = artists.find(a => a.id === parseInt(id)) || artists[0]; // Fallback to first artist
    const artistArtworks = artworks.filter(art => art.artist === artist.name); // Simple match by name for mock

    const [showCommission, setShowCommission] = useState(false);

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', paddingBottom: '40px' }}>
            {/* Cover Image */}
            <div style={{
                height: '300px',
                width: '100%',
                backgroundImage: `linear-gradient(to top, var(--color-bg), transparent), url(${artist.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }} />

            <div className="container" style={{ position: 'relative', marginTop: '-80px' }}>
                {/* Profile Header */}
                <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', width: '100%', flexWrap: 'wrap' }}>
                        <img
                            src={artist.profileImage}
                            alt={artist.name}
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
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1 }}>{artist.name}</h1>
                                <CheckCircle size={24} color="var(--color-primary-glow)" fill="none" />
                            </div>
                            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>{artist.bio}</p>

                            <div style={{ display: 'flex', gap: '20px', marginTop: '16px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> New York, USA</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><LinkIcon size={16} /> portfolio.com</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                            <button className="glass-panel" style={{ padding: '12px 24px', borderRadius: '50px', color: 'white', fontWeight: '600' }}>Follow</button>
                            <button
                                className="btn-primary"
                                onClick={() => setShowCommission(!showCommission)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Mail size={18} /> Request Commission
                            </button>
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
                        <div><strong style={{ fontSize: '1.2rem', color: 'white' }}>12.5k</strong> <span style={{ color: 'var(--color-text-muted)' }}>Followers</span></div>
                        <div><strong style={{ fontSize: '1.2rem', color: 'white' }}>4.9</strong> <span style={{ color: 'var(--color-text-muted)' }}>Rating</span></div>
                    </div>
                </div>

                {/* Commission Form (Toggle) */}
                {showCommission && (
                    <div className="glass-panel animate-fade-in" style={{ marginTop: '20px', padding: '30px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Commission Request</h2>
                        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <input type="text" placeholder="Project Title" style={inputStyle} />
                                <select style={inputStyle}>
                                    <option>Digital Illustration</option>
                                    <option>Character Design</option>
                                    <option>Logo/Branding</option>
                                </select>
                            </div>
                            <textarea placeholder="Describe your vision..." rows="4" style={inputStyle}></textarea>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn-primary">Send Request</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Artworks Gallery */}
                <div style={{ marginTop: '50px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Portfolio</h2>
                    <MasonryGrid artworks={artistArtworks} />
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
