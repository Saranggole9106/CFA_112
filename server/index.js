/**
 * ArtFolio Backend Server - Main Entry Point
 * 
 * This is the main server file that sets up the Express application,
 * configures middleware, connects to MongoDB, and registers all API routes.
 * 
 * Tech Stack:
 * - Express.js: Web framework for Node.js
 * - MongoDB: NoSQL database for storing users, artworks, orders, etc.
 * - Mongoose: ODM (Object Data Modeling) library for MongoDB
 * - CORS: Enable cross-origin requests from frontend
 * - dotenv: Load environment variables from .env file
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 * Allows the frontend (running on port 5173) to make requests to this backend
 * 
 * - origin: Frontend URL that's allowed to access this API
 * - methods: HTTP methods that are permitted
 * - allowedHeaders: Headers that can be sent in requests
 * - credentials: Allow cookies and authentication headers
 */
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

/**
 * JSON Body Parser
 * Parses incoming requests with JSON payloads
 * Makes req.body available in route handlers
 */
app.use(express.json());

/**
 * Request Logger Middleware
 * Logs every incoming request to the console for debugging
 * Format: "METHOD /path"
 * Example: "GET /api/artworks"
 */
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // Pass control to the next middleware
});

/**
 * Static File Serving
 * Serves uploaded artwork images from the 'uploads' directory
 * Images are accessible at: http://localhost:5001/uploads/filename.jpg
 */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

/**
 * MongoDB Connection
 * Connects to MongoDB using the connection string from .env file
 * Falls back to local MongoDB if MONGO_URI is not set
 * 
 * MONGO_URI format: mongodb://localhost:27017/artfolio
 * or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname
 */
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/artfolio';
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connection Successful -', MONGO_URI.includes('localhost') ? 'Local' : 'Atlas'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        // Server continues running even if DB connection fails
        // This allows for easier debugging during development
    });

// ============================================================================
// ROOT ROUTE
// ============================================================================

/**
 * Health Check Endpoint
 * Simple route to verify the server is running
 * Access at: http://localhost:5001/
 */
/**
 * Health Check Endpoint
 * Simple route to verify the server is running
 * Access at: http://localhost:5001/api/health
 */
app.get('/api/health', (req, res) => {
    res.send('ArtFolio API Running');
});

// ============================================================================
// API ROUTES REGISTRATION
// ============================================================================

/**
 * Import all route modules
 * Each module handles a specific domain of the application
 */
const authRoutes = require('./routes/auth');           // User authentication (login, register)
const artworkRoutes = require('./routes/artworks');     // Artwork CRUD, likes, comments
const commissionRoutes = require('./routes/commissions'); // Commission requests management
const orderRoutes = require('./routes/orders');         // Purchase orders and sales
const adminRoutes = require('./routes/admin');          // Admin moderation and analytics

/**
 * Mount routes at their respective base paths
 * All routes in authRoutes will be prefixed with /api/auth
 * Example: POST /api/auth/login, POST /api/auth/register
 */
app.use('/api/auth', authRoutes);           // Authentication routes
app.use('/api/artworks', artworkRoutes);     // Artwork routes
app.use('/api/commissions', commissionRoutes); // Commission routes
app.use('/api/orders', orderRoutes);         // Order/sales routes
app.use('/api/admin', adminRoutes);          // Admin routes

// ============================================================================
// SERVER STARTUP
// ============================================================================

/**
 * Start the Express server
 * PORT is read from .env file, defaults to 5000 if not specified
 * Server will listen for incoming HTTP requests on this port
 */
// ============================================================================
// STATIC ASSET HANDLING (PRODUCTION)
// ============================================================================

// Serve static files from the React frontend app
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// API routes are already defined above...

// The "catch-all" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    // Check if the file exists to avoid ENOENT errors
    const indexPath = path.join(clientBuildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Not Found: Client build not found. Run "npm run build" in client directory.');
    }
});

/**
 * Start the Express server
 * PORT is read from .env file, defaults to 5000 if not specified
 * Server will listen for incoming HTTP requests on this port
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
