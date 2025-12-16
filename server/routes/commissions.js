/**
 * Commission Routes
 * 
 * Handles commission request management between visitors and artists.
 * Manages the entire commission workflow from request to completion.
 * 
 * Endpoints:
 * - POST /api/commissions - Create new commission request
 * - GET /api/commissions/artist - Get artist's commission requests
 * - PATCH /api/commissions/:id - Update commission status/price
 * 
 * Commission Workflow:
 * 1. Visitor sends request (POST /)
 * 2. Artist views requests (GET /artist)
 * 3. Artist accepts/rejects and sets price (PATCH /:id)
 * 4. Artist marks as completed (PATCH /:id)
 * 5. Commission price added to artist earnings
 */

const express = require('express');
const router = express.Router();
const Commission = require('../models/Commission');
const jwt = require('jsonwebtoken');

// ============================================================================
// MIDDLEWARE - TOKEN VERIFICATION
// ============================================================================

/**
 * Verify Token Middleware
 * 
 * Authenticates user by checking JWT token.
 * Required for all commission routes (must be logged in).
 * 
 * Adds req.user with { _id, role } from token payload.
 */
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        // Extract and verify token
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
// ROUTE: CREATE COMMISSION REQUEST
// ============================================================================

/**
 * POST /api/commissions
 * 
 * Creates a new commission request from visitor to artist.
 * Requires authentication (visitor must be logged in).
 * 
 * Request Body:
 * {
 *   artistId: string (required) - ID of artist to commission,
 *   brief: string (required) - Description of what visitor wants,
 *   deadline: date (optional) - When visitor needs it by
 * }
 * 
 * Response (Success - 201):
 * {
 *   _id: string,
 *   requester: string (visitor's ID),
 *   artist: string (artist's ID),
 *   brief: string,
 *   status: 'pending',
 *   deadline: date,
 *   createdAt: date,
 *   updatedAt: date
 * }
 * 
 * Response (Error - 400):
 * { message: error message }
 * 
 * Process:
 * 1. Extract artistId, brief, deadline from request
 * 2. Create commission with requester = current user
 * 3. Status automatically set to 'pending'
 * 4. Save to database
 * 5. Return created commission
 */
router.post('/', verifyToken, async (req, res) => {
    try {
        // Extract data from request body
        const { artistId, brief, deadline } = req.body;

        // Create new commission document
        const commission = new Commission({
            requester: req.user._id,  // Current logged-in user (from token)
            artist: artistId,          // Artist being commissioned
            brief,                     // What the visitor wants
            deadline                   // Optional deadline
            // status defaults to 'pending' (from model)
        });

        // Save to database
        await commission.save();

        // Return created commission
        res.status(201).json(commission);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: GET ARTIST'S COMMISSIONS
// ============================================================================

/**
 * GET /api/commissions/artist
 * 
 * Returns all commission requests for the logged-in artist.
 * Only accessible by users with role 'artist'.
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response (Success - 200):
 * [
 *   {
 *     _id: string,
 *     requester: {
 *       _id: string,
 *       username: string,
 *       email: string
 *     },
 *     artist: string,
 *     brief: string,
 *     status: 'pending' | 'accepted' | 'completed' | 'rejected',
 *     notes: string,
 *     price: number,
 *     deadline: date,
 *     createdAt: date,
 *     updatedAt: date
 *   },
 *   ...
 * ]
 * 
 * Response (Error - 403):
 * { message: 'Access denied' }
 * 
 * Use Cases:
 * - Artist dashboard showing pending requests
 * - Commission inbox
 * - Track accepted/completed commissions
 * - Calculate commission earnings
 */
router.get('/artist', verifyToken, async (req, res) => {
    // Check if user is an artist
    // Only artists should see commission requests
    if (req.user.role !== 'artist') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        // Find all commissions where this user is the artist
        // Populate requester info (username, email) for display
        const commissions = await Commission.find({ artist: req.user._id })
            .populate('requester', 'username email');  // Get requester details

        // Return array of commissions
        res.json(commissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: UPDATE COMMISSION
// ============================================================================

/**
 * PATCH /api/commissions/:id
 * 
 * Updates a commission's status, notes, or price.
 * Only the artist who received the commission can update it.
 * 
 * URL Parameters:
 * - id: Commission ID
 * 
 * Request Body (all optional):
 * {
 *   status: 'pending' | 'accepted' | 'completed' | 'rejected',
 *   notes: string (artist's internal notes),
 *   price: number (agreed price for the commission)
 * }
 * 
 * Response (Success - 200):
 * {
 *   _id: string,
 *   requester: string,
 *   artist: string,
 *   brief: string,
 *   status: string (updated),
 *   notes: string (updated),
 *   price: number (updated),
 *   deadline: date,
 *   createdAt: date,
 *   updatedAt: date
 * }
 * 
 * Response (Error - 404):
 * { message: 'Commission not found' }
 * 
 * Response (Error - 403):
 * { message: 'Unauthorized' }
 * 
 * Common Update Scenarios:
 * 
 * 1. Accept commission:
 *    { status: 'accepted', price: 500 }
 * 
 * 2. Reject commission:
 *    { status: 'rejected' }
 * 
 * 3. Mark as completed:
 *    { status: 'completed' }
 *    (Price is used to calculate artist earnings)
 * 
 * 4. Add notes:
 *    { notes: 'Started working on sketch' }
 */
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        // Extract update data from request body
        const { status, notes, price } = req.body;

        // Find the commission by ID
        const commission = await Commission.findById(req.params.id);

        // Check if commission exists
        if (!commission) {
            return res.status(404).json({ message: 'Commission not found' });
        }

        // Authorization check: Only the artist can update their commission
        // Convert ObjectId to string for comparison
        if (commission.artist.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Update fields if provided
        // Only updates fields that were sent in request body
        if (status) commission.status = status;
        if (notes) commission.notes = notes;
        if (price) commission.price = price;

        // Save updated commission
        // updatedAt timestamp automatically updated
        await commission.save();

        // Return updated commission
        res.json(commission);
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
 * Mounted at /api/commissions in server/index.js
 * 
 * Available endpoints:
 * - POST /api/commissions
 * - GET /api/commissions/artist
 * - PATCH /api/commissions/:id
 * 
 * Usage Examples:
 * 
 * // Visitor sends commission request
 * POST /api/commissions
 * Body: { artistId: '123', brief: 'I want a portrait...', deadline: '2024-12-31' }
 * 
 * // Artist views their requests
 * GET /api/commissions/artist
 * Headers: { Authorization: 'Bearer <token>' }
 * 
 * // Artist accepts and sets price
 * PATCH /api/commissions/456
 * Body: { status: 'accepted', price: 500 }
 * 
 * // Artist marks as completed
 * PATCH /api/commissions/456
 * Body: { status: 'completed' }
 */
module.exports = router;
