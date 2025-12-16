import React from 'react';
import { Link } from 'react-router-dom';

const Commissions = () => {
    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh' }} className="container">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Commission <span className="text-gradient">Custom Art</span></h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto' }}>
                    Bring your vision to life by collaborating directly with your favorite digital artists.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {[
                    { title: "Find an Artist", desc: "Browse portfolios and find the style that matches your vision.", step: "01" },
                    { title: "Send a Request", desc: "Use the commission form on their profile to describe your project.", step: "02" },
                    { title: "Collaborate", desc: "Chat, review sketches, and approve the final masterpiece.", step: "03" }
                ].map((item, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
                        <span style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            fontSize: '8rem',
                            fontWeight: 'bold',
                            color: 'rgba(255,255,255,0.03)',
                            lineHeight: 1
                        }}>{item.step}</span>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', position: 'relative' }}>{item.title}</h3>
                        <p style={{ color: 'var(--color-text-muted)', position: 'relative' }}>{item.desc}</p>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '60px' }}>
                <Link to="/explore" className="btn-primary">Find Artists Now</Link>
            </div>
        </div>
    );
};

export default Commissions;
