import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Public Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import ArtistProfile from './pages/ArtistProfile';
import ArtworkDetail from './pages/ArtworkDetail';
import PublicCommissions from './pages/Commissions'; // Renamed to avoid confusion with ArtistCommissions
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/artists" element={<Explore />} />
            <Route path="/commissions" element={<PublicCommissions />} />
            <Route path="/artist/:id" element={<ArtistProfile />} />
            <Route path="/artwork/:id" element={<ArtworkDetail />} />
            <Route path="/profile" element={<VisitorProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

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
              <Route path="/admin/sales" element={<AdminDashboard />} /> {/* Placeholder */}
              <Route path="/admin/artworks" element={<AdminDashboard />} /> {/* Placeholder */}
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
