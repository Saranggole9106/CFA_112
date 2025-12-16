/**
 * Artwork Routes
 * 
 * Handles all artwork-related operations including CRUD, social features, and file uploads.
 * This is the largest and most complex route file in the application.
 * 
 * Endpoints:
 * - GET /api/artworks - Get all artworks (with filters)
 * - GET /api/artworks/user/liked - Get user's liked artworks
 * - GET /api/artworks/user/uploaded - Get artist's uploaded artworks
 * - GET /api/artworks/:id - Get single artwork details
 * - POST /api/artworks - Create new artwork (with image upload)
 * - PATCH /api/artworks/:id/like - Like/unlike artwork
 * - POST /api/artworks/:id/comments - Add comment to artwork
 * 
 * Features:
 * - File upload with Multer
 * - Image storage in /uploads directory
 * - Social interactions (likes, comments)
 * - Filtering and search
 * - Artist-specific queries
 */

const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');
const jwt = require('jsonwebtoken');
const multer = require('multer');  // File upload middleware
const path = require('path');      // Path utilities

// ============================================================================
// MIDDLEWARE - TOKEN VERIFICATION
// ============================================================================

/**
 * Verify Token Middleware
 * 
 * Authenticates user by checking JWT token.
 * Used by protected routes (upload, like, comment).
 */
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(
            token.split(" ")[1],
            process.env.JWT_SECRET || 'secretKey'
        );
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// ============================================================================
// FILE UPLOAD CONFIGURATION (MULTER)
// ============================================================================

/**
 * Multer Storage Configuration
 * 
 * Defines how and where uploaded files are stored.
 * 
 * Storage Strategy:
 * - Disk storage (files saved to server filesystem)
 * - Destination: /uploads directory
 * - Filename: timestamp + original extension
 * 
 * Example filename: 1703251234567.jpg
 * (timestamp ensures uniqueness)
 */
const storage = multer.diskStorage({
    /**
     * Destination Function
     * Determines where to save uploaded files
     * 
     * @param {Object} req - Express request
     * @param {Object} file - Uploaded file info
     * @param {Function} cb - Callback(error, destination)
     */
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Save to uploads/ directory
    },

    /**
     * Filename Function
     * Determines the filename for uploaded files
     * 
     * @param {Object} req - Express request
     * @param {Object} file - Uploaded file info
     * @param {Function} cb - Callback(error, filename)
     * 
     * Format: timestamp + original file extension
     * Example: 1703251234567.jpg
     */
    filename: (req, file, cb) => {
        // Date.now() gives current timestamp in milliseconds
        // path.extname() extracts file extension (.jpg, .png, etc.)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

/**
 * Multer Upload Instance
 * 
 * Configured with our storage settings.
 * Used in POST route for artwork creation.
 * 
 * Usage: upload.single('image')
 * - 'single' means one file at a time
 * - 'image' is the form field name
 */
const upload = multer({ storage: storage });

// ============================================================================
// ROUTE: GET ALL ARTWORKS (PUBLIC)
// ============================================================================

/**
 * GET /api/artworks
 * 
 * Returns all artworks with optional filtering.
 * Public route - no authentication required.
 * 
 * Query Parameters (all optional):
 * - category: Filter by category (e.g., 'Digital', 'Oil')
 * - artist: Filter by artist ID
 * - featured: Filter featured artworks (not implemented yet)
 * 
 * Response (Success - 200):
 * [
 *   {
 *     _id: string,
 *     title: string,
 *     description: string,
 *     imageUrl: string,
 *     artist: {
 *       _id: string,
 *       username: string,
 *       profileImage: string
 *     },
 *     tags: [string],
 *     category: string,
 *     price: number,
 *     isForSale: boolean,
 *     likes: [string],
 *     comments: [object],
 *     flagged: boolean,
 *     createdAt: date,
 *     updatedAt: date
 *   },
 *   ...
 * ]
 * 
 * Examples:
 * GET /api/artworks - All artworks
 * GET /api/artworks?category=Digital - Only digital art
 * GET /api/artworks?artist=123abc - Artworks by specific artist
 */
router.get('/', async (req, res) => {
    try {
        // Extract query parameters
        const { category, artist, featured } = req.query;

        // Build query object dynamically
        let query = {};

        // Add filters if provided
        if (category) query.category = category;
        if (artist) query.artist = artist;
        // Featured filter (for future use)
        // if (featured) query.isFeatured = true;

        // Find artworks matching query
        // Populate artist info (username, profileImage)
        const artworks = await Artwork.find(query)
            .populate('artist', 'username profileImage');

        // Return artworks array
        res.json(artworks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: GET USER'S LIKED ARTWORKS
// ============================================================================

/**
 * GET /api/artworks/user/liked
 * 
 * Returns all artworks liked by the current user.
 * Requires authentication.
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response (Success - 200):
 * Array of artworks that user has liked
 * 
 * Use Cases:
 * - User's favorites page
 * - "My Likes" collection
 * - Personalized recommendations
 */
router.get('/user/liked', verifyToken, async (req, res) => {
    try {
        // Find artworks where user's ID is in the likes array
        // likes is an array of user IDs who liked the artwork
        const likedArtworks = await Artwork.find({ likes: req.user._id })
            .populate('artist', 'username profileImage');

        res.json(likedArtworks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: GET ARTIST'S UPLOADED ARTWORKS
// ============================================================================

/**
 * GET /api/artworks/user/uploaded
 * 
 * Returns all artworks uploaded by the current user (artist).
 * Requires authentication.
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response (Success - 200):
 * Array of artworks created by this artist
 * 
 * Use Cases:
 * - Artist dashboard
 * - Portfolio management
 * - Edit/delete own artworks
 */
router.get('/user/uploaded', verifyToken, async (req, res) => {
    try {
        // Find artworks where artist field matches current user's ID
        const uploadedArtworks = await Artwork.find({ artist: req.user._id });

        res.json(uploadedArtworks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: GET SINGLE ARTWORK
// ============================================================================

/**
 * GET /api/artworks/:id
 * 
 * Returns detailed information about a single artwork.
 * Public route - no authentication required.
 * 
 * URL Parameters:
 * - id: Artwork ID
 * 
 * Response (Success - 200):
 * {
 *   _id: string,
 *   title: string,
 *   description: string,
 *   imageUrl: string,
 *   artist: {
 *     _id: string,
 *     username: string,
 *     profileImage: string,
 *     bio: string
 *   },
 *   tags: [string],
 *   category: string,
 *   price: number,
 *   isForSale: boolean,
 *   likes: [string],
 *   comments: [object],
 *   createdAt: date,
 *   updatedAt: date
 * }
 * 
 * Response (Error - 404):
 * { message: 'Artwork not found' }
 * 
 * Use Cases:
 * - Artwork detail page
 * - Lightbox view
 * - Share artwork link
 */
router.get('/:id', async (req, res) => {
    try {
        // Find artwork by ID
        // Populate artist with username, profileImage, and bio
        const artwork = await Artwork.findById(req.params.id)
            .populate('artist', 'username profileImage bio');

        // Check if artwork exists
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }

        res.json(artwork);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: CREATE NEW ARTWORK
// ============================================================================

/**
 * POST /api/artworks
 * 
 * Creates a new artwork with image upload.
 * Only artists and admins can upload artworks.
 * 
 * Headers:
 * Authorization: Bearer <token>
 * Content-Type: multipart/form-data
 * 
 * Form Data:
 * - image: File (required) - Image file to upload
 * - title: string (required) - Artwork title
 * - description: string (optional) - Artwork description
 * - price: number (optional) - Price for prints
 * - category: string (optional) - Category (Digital, Oil, etc.)
 * - tags: string (optional) - Comma-separated tags
 * 
 * Response (Success - 201):
 * {
 *   _id: string,
 *   title: string,
 *   description: string,
 *   imageUrl: string,
 *   artist: string,
 *   tags: [string],
 *   category: string,
 *   price: number,
 *   createdAt: date,
 *   updatedAt: date
 * }
 * 
 * Response (Error - 403):
 * { message: 'Only artists can post artworks' }
 * 
 * Response (Error - 400):
 * { message: 'Detailed image is required' }
 * 
 * Process:
 * 1. Verify user is artist or admin
 * 2. Check if image file was uploaded
 * 3. Generate image URL
 * 4. Parse tags from comma-separated string
 * 5. Create artwork document
 * 6. Save to database
 * 7. Return created artwork
 */
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
    // Authorization check: Only artists and admins can upload
    if (req.user.role !== 'artist' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only artists can post artworks' });
    }

    // Check if file was uploaded
    // req.file is populated by multer middleware
    if (!req.file) {
        return res.status(400).json({ message: 'Detailed image is required' });
    }

    try {
        // Construct image URL
        // Format: http://localhost:5001/uploads/1703251234567.jpg
        const imageUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;

        // Create new artwork document
        const newArtwork = new Artwork({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,

            // Parse tags from comma-separated string
            // "portrait, digital, fantasy" → ["portrait", "digital", "fantasy"]
            // .trim() removes extra spaces
            tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],

            imageUrl: imageUrl,
            artist: req.user._id  // Current user is the artist
        });

        // Save to database
        const savedArtwork = await newArtwork.save();

        // Return created artwork
        res.status(201).json(savedArtwork);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: LIKE/UNLIKE ARTWORK
// ============================================================================

/**
 * PATCH /api/artworks/:id/like
 * 
 * Toggles like status for an artwork.
 * If user hasn't liked it, adds like.
 * If user has liked it, removes like.
 * 
 * URL Parameters:
 * - id: Artwork ID
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response (Success - 200):
 * Updated artwork object with new likes array
 * 
 * Response (Error - 400):
 * { message: 'Invalid ID format' }
 * 
 * Response (Error - 404):
 * { message: 'Artwork not found' }
 * 
 * Process:
 * 1. Validate artwork ID format
 * 2. Find artwork
 * 3. Check if user already liked it
 * 4. If not liked: Add user ID to likes array
 * 5. If already liked: Remove user ID from likes array
 * 6. Save and return updated artwork
 */
router.patch('/:id/like', verifyToken, async (req, res) => {
    try {
        // Validate MongoDB ObjectId format
        // MongoDB IDs are 24 character hex strings
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        console.log(`Liking artwork ID: ${req.params.id}`);

        // Find artwork by ID
        const artwork = await Artwork.findById(req.params.id);

        // Check if artwork exists
        if (!artwork) {
            console.log(`Artwork not found for ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Artwork not found' });
        }

        // Check if user already liked this artwork
        // indexOf returns -1 if not found
        const index = artwork.likes.indexOf(req.user._id);

        if (index === -1) {
            // User hasn't liked it yet - add like
            artwork.likes.push(req.user._id);
        } else {
            // User already liked it - remove like
            artwork.likes.splice(index, 1);
        }

        // Save updated artwork
        await artwork.save();

        // Return updated artwork
        res.json(artwork);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: ADD COMMENT
// ============================================================================

/**
 * POST /api/artworks/:id/comments
 * 
 * Adds a comment to an artwork.
 * Requires authentication.
 * 
 * URL Parameters:
 * - id: Artwork ID
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Request Body:
 * {
 *   text: string (required) - Comment text
 * }
 * 
 * Response (Success - 200):
 * Array of all comments (with user info populated)
 * 
 * Response (Error - 400):
 * { message: 'Comment text is required' }
 * 
 * Response (Error - 404):
 * { message: 'Artwork not found' }
 * 
 * Process:
 * 1. Validate comment text exists
 * 2. Find artwork
 * 3. Create comment object
 * 4. Add to artwork's comments array
 * 5. Save artwork
 * 6. Re-fetch with populated user info
 * 7. Return all comments
 */
router.post('/:id/comments', verifyToken, async (req, res) => {
    try {
        // Extract comment text from request body
        const { text } = req.body;

        // Validate comment text
        if (!text) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        console.log(`Adding comment to artwork ID: ${req.params.id}`);

        // Find artwork
        const artwork = await Artwork.findById(req.params.id);

        // Check if artwork exists
        if (!artwork) {
            console.log(`Artwork not found for comment, ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Artwork not found' });
        }

        // Create new comment object
        const newComment = {
            user: req.user._id,      // Current user's ID
            text: text,              // Comment text
            createdAt: new Date()    // Current timestamp
        };

        // Add comment to artwork's comments array
        artwork.comments.push(newComment);

        // Save artwork with new comment
        await artwork.save();

        // Re-fetch artwork with populated user info for comments
        // This gives us username and profileImage for each commenter
        const populatedArtwork = await Artwork.findById(req.params.id)
            .populate('comments.user', 'username profileImage');

        // Return all comments (with user info)
        res.json(populatedArtwork.comments);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ============================================================================
// EXPORT ROUTER
// ============================================================================

/**
 * Export the router
 * 
 * Mounted at /api/artworks in server/index.js
 * 
 * Available endpoints:
 * - GET /api/artworks
 * - GET /api/artworks/user/liked
 * - GET /api/artworks/user/uploaded
 * - GET /api/artworks/:id
 * - POST /api/artworks
 * - PATCH /api/artworks/:id/like
 * - POST /api/artworks/:id/comments
 */
module.exports = router;
