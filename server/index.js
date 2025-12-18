/**
 * ArtFolio Backend Server - Main Entry Point
 * 
 * This is the central server configuration file.
 * It initializes the Express application, sets up middleware, establishes database connections,
 * and defines the primary API routes.
 * 
 * Core Responsibilities:
 * 1. Server Initialization (Express)
 * 2. Database Connection (MongoDB)
 * 3. Middleware Configuration (CORS, Parsing, Logging)
 * 4. Route Registration (Auth, Artworks, Orders, etc.)
 * 5. Static Asset Serving (Uploads & Frontend Build)
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize Express App
const app = express();

// ============================================================================
// 1. INITIAL SETUP & CONFIGURATION
// ============================================================================

// Ensure 'uploads' directory exists for storing user content
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Created local uploads directory at:', uploadsDir);
}

// ============================================================================
// 2. MIDDLEWARE
// ============================================================================

/**
 * CORS (Cross-Origin Resource Sharing)
 * Allows the React frontend to communicate with this backend API.
 * Configured to allow requests from the CLIENT_URL defined in .env
 */
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Body Parsing: Enable JSON payload support
app.use(express.json());

// Request Logging: Logs method and URL for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Static File Serving: Serve uploaded images publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================================
// 3. DATABASE CONNECTION
// ============================================================================

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/artfolio';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connection Successful'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ============================================================================
// 4. API ROUTES
// ============================================================================

// Health Check
app.get('/api/health', (req, res) => res.send('ArtFolio API Running'));

// Feature Routes
app.use('/api/auth', require('./routes/auth'));           // Authentication
app.use('/api/artworks', require('./routes/artworks'));     // Artworks & Likes
app.use('/api/commissions', require('./routes/commissions')); // Commission Requests
app.use('/api/orders', require('./routes/orders'));         // Commerce & Orders
app.use('/api/admin', require('./routes/admin'));          // Administrative Tools

// ============================================================================
// 5. PRODUCTION ASSET SERVING
// ============================================================================

// Serve static files from the React frontend app when in production
// This allows the entire app (Frontend + Backend) to run from a single node process
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// "Catch-all" handler: sends index.html for any request that doesn't match an API route
// This supports client-side routing (e.g., /artist/dashboard)
app.get(/(.*)/, (req, res) => {
    const indexPath = path.join(clientBuildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        // Fallback for dev mode where build might not exist
        res.status(404).send('API Route not found and Client build missing.');
    }
});

// ============================================================================
// 6. SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📂 Uploads serving at http://localhost:${PORT}/uploads`);
});
