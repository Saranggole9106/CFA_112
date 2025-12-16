import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const ArtistArtworks = () => {
    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>My Artworks</h1>
                <Link to="/artist/artworks/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Upload New
                </Link>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <p>You haven't uploaded any artworks yet.</p>
            </div>
        </div>
    );
};

export default ArtistArtworks;
