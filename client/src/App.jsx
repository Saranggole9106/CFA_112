import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';

// Public Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Artists from './pages/Artists';
import ArtistProfile from './pages/ArtistProfile';
import ArtworkDetail from './pages/ArtworkDetail';
import PublicCommissions from './pages/Commissions';
import Login from './pages/Login';
import Register from './pages/Register';
import VisitorProfile from './pages/VisitorProfile';

// Artist Pages
import ArtistDashboard from './pages/artist/Dashboard';
import ArtistArtworks from './pages/artist/Artworks';
import NewArtwork from './pages/artist/NewArtwork';
import ArtistCommissions from './pages/artist/Commissions';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';

// Main App Content with Splash Screen
const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if user has seen splash this session
    const seenSplash = sessionStorage.getItem('hasSeenSplash');
    if (seenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes - Anyone can access */}
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/commissions" element={<PublicCommissions />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Visitor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['visitor', 'artist', 'admin']} />}>
            <Route path="/profile" element={<VisitorProfile />} />
          </Route>

          {/* Protected Artist Routes */}
          <Route element={<ProtectedRoute allowedRoles={['artist']} />}>
            <Route path="/artist/dashboard" element={<ArtistDashboard />} />
            <Route path="/artist/artworks" element={<ArtistArtworks />} />
            <Route path="/artist/artworks/new" element={<NewArtwork />} />
            <Route path="/artist/commissions" element={<ArtistCommissions />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
