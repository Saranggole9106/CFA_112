import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '40px' }}>
                <Outlet />
            </main>
            <footer style={{
                textAlign: 'center',
                padding: '2rem',
                borderTop: '1px solid var(--glass-border)',
                marginTop: 'auto',
                color: 'var(--color-text-muted)'
            }}>
                <p>&copy; {new Date().getFullYear()} ArtFolio. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
