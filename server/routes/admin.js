/**
 * Admin Routes
 * 
 * Handles all administrative functions for platform moderation and management.
 * Only accessible by users with 'admin' role.
 * 
 * Endpoints:
 * - GET /api/admin/stats - Platform statistics and analytics
 * - GET /api/admin/users - All registered users
 * - GET /api/admin/artworks - All artworks for moderation
 * - GET /api/admin/sales - All sales transactions
 * - GET /api/admin/flagged - Flagged content queue
 * - DELETE /api/admin/artworks/:id - Delete artwork
 * - DELETE /api/admin/artworks/:aid/comments/:cid - Delete comment
 * - PATCH /api/admin/users/:id/ban - Ban/unban user
 * - PATCH /api/admin/artworks/:id/flag - Flag/unflag artwork
 * 
 * Features:
 * - Content moderation (delete artworks, comments)
 * - User management (ban/unban)
 * - Platform analytics
 * - Flagging system
 * - Sales tracking
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Artwork = require('../models/Artwork');
const Order = require('../models/Order');
const Commission = require('../models/Commission');

// ============================================================================
// MIDDLEWARE - ADMIN VERIFICATION
// ============================================================================

/**
 * Verify Admin Middleware
 * 
 * Checks if user has admin role before allowing access.
 * More restrictive than regular verifyToken - requires admin role.
 * 
 * Process:
 * 1. Check if Authorization header exists
 * 2. Verify JWT token is valid
 * 3. Check if user role is 'admin'
 * 4. If all checks pass, allow access
 * 5. Otherwise, deny access
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
const verifyAdmin = (req, res, next) => {
    // Get token from Authorization header
    const token = req.header('Authorization');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        // Verify and decode token
        const verified = jwt.verify(
            token.split(" ")[1],
            process.env.JWT_SECRET || 'secretKey'
        );

        // Check if user role is admin
        if (verified.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        // Add user info to request
        req.user = verified;

        // Continue to route handler
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// ============================================================================
// ROUTE: GET PLATFORM STATISTICS
// ============================================================================

/**
 * GET /api/admin/stats
 * 
 * Returns comprehensive platform statistics and analytics.
 * Used for admin dashboard overview.
 * 
 * Headers:
 * Authorization: Bearer <admin-token>
 * 
 * Response (Success - 200):
 * {
 *   totalUsers: number,
 *   totalArtists: number,
 *   totalVisitors: number,
 *   totalArtworks: number,
 *   totalOrders: number,
 *   totalCommissions: number,
 *   totalVolume: number (total sales revenue),
 *   flaggedItems: number
 * }
 * 
 * Calculations:
 * - User counts by role
 * - Total artworks uploaded
 * - Total orders placed
 * - Total commissions requested
 * - Total revenue from sales
 * - Count of flagged content
 */
router.get('/stats', verifyAdmin, async (req, res) => {
    try {
        // Count total users
        const totalUsers = await User.countDocuments();

        // Count users by role
        const totalArtists = await User.countDocuments({ role: 'artist' });
        const totalVisitors = await User.countDocuments({ role: 'visitor' });

        // Count content
        const totalArtworks = await Artwork.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalCommissions = await Commission.countDocuments();

        // Calculate total sales volume (revenue)
        // Get all orders and sum their amounts
        const orders = await Order.find();
        const totalVolume = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

        // Count flagged artworks
        const flaggedArtworks = await Artwork.countDocuments({ flagged: true });

        // Return statistics object
        res.json({
            totalUsers,
            totalArtists,
            totalVisitors,
            totalArtworks,
            totalOrders,
            totalCommissions,
            totalVolume,
            flaggedItems: flaggedArtworks
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: GET ALL USERS
// ============================================================================

/**
 * GET /api/admin/users
 * 
 * Returns all registered users for management.
 * Passwords are excluded for security.
 * 
 * Headers:
 * Authorization: Bearer <admin-token>
 * 
 * Response (Success - 200):
 * [
 *   {
 *     _id: string,
 *     username: string,
 *     email: string,
 *     role: string,
 *     bio: string,
 *     profileImage: string,
 *     commissionOpen: boolean,
 *     banned: boolean,
 *     createdAt: date,
 *     updatedAt: date
 *   },
 *   ...
 * ]
 * 
 * Use Cases:
 * - User management table
 * - Ban/unban users
 * - View user details
 * - Track user growth
 */
router.get('/users', verifyAdmin, async (req, res) => {
    try {
        // Find all users
        // .select('-password') excludes password field
        // .sort({ createdAt: -1 }) sorts newest first
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: GET ALL ARTWORKS
// ============================================================================

/**
 * GET /api/admin/artworks
 * 
 * Returns all artworks for content moderation.
 * Includes artist information.
 * 
 * Headers:
 * Authorization: Bearer <admin-token>
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
 *       email: string
 *     },
 *     tags: [string],
 *     category: string,
 *     price: number,
 *     likes: [string],
 *     comments: [object],
 *     flagged: boolean,
 *     createdAt: date,
 *     updatedAt: date
 *   },
 *   ...
 * ]
 * 
 * Use Cases:
 * - Content moderation
 * - Flag inappropriate content
 * - Delete artworks
 * - View all platform content
 */
router.get('/artworks', verifyAdmin, async (req, res) => {
    try {
        // Find all artworks
        // Populate artist with username and email
        // Sort newest first
        const artworks = await Artwork.find()
            .populate('artist', 'username email')
            .sort({ createdAt: -1 });

        res.json(artworks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: GET ALL SALES
// ============================================================================

/**
 * GET /api/admin/sales
 * 
 * Returns all sales transactions across the platform.
 * Includes buyer, artwork, and artist information.
 * 
 * Headers:
 * Authorization: Bearer <admin-token>
 * 
 * Response (Success - 200):
 * [
 *   {
 *     _id: string,
 *     buyer: {
 *       _id: string,
 *       username: string,
 *       email: string
 *     },
 *     artwork: {
 *       _id: string,
 *       title: string,
 *       imageUrl: string,
 *       artist: {
 *         _id: string,
 *         username: string,
 *         email: string
 *       }
 *     },
 *     amount: number,
 *     status: string,
 *     createdAt: date,
 *     updatedAt: date
 *   },
 *   ...
 * ]
 * 
 * Use Cases:
 * - Platform revenue tracking
 * - Sales analytics
 * - Transaction history
 * - Identify top sellers
 */
router.get('/sales', verifyAdmin, async (req, res) => {
    try {
        // Find all orders
        // Populate buyer info
        // Populate artwork AND its artist (nested populate)
        // Sort newest first
        const sales = await Order.find()
            .populate('buyer', 'username email')
            .populate({
                path: 'artwork',
                populate: { path: 'artist', select: 'username email' }
            })
            .sort({ createdAt: -1 });

        res.json(sales);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: DELETE ARTWORK
// ============================================================================

/**
 * DELETE /api/admin/artworks/:id
 * 
 * Permanently deletes an artwork from the platform.
 * Use for removing inappropriate or violating content.
 * 
 * URL Parameters:
 * - id: Artwork ID to delete
 * 
 * Headers:
 * Authorization: Bearer <admin-token>
 * 
 * Response (Success - 200):
 * {
 *   message: 'Artwork deleted successfully',
 *   artwork: { deleted artwork object }
 * }
 * 
 * Response (Error - 404):
 * { message: 'Artwork not found' }
 * 
 * Warning: This action is irreversible!
 * Consider implementing soft delete (flagged/hidden) instead.
 */
router.delete('/artworks/:id', verifyAdmin, async (req, res) => {
    try {
        // Find and delete artwork in one operation
        const artwork = await Artwork.findByIdAndDelete(req.params.id);

        // Check if artwork existed
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }

        // Return success message with deleted artwork
        res.json({
            message: 'Artwork deleted successfully',
            artwork
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: DELETE COMMENT
// ============================================================================

/**
 * DELETE /api/admin/artworks/:artworkId/comments/:commentId
 * 
 * Deletes a specific comment from an artwork.
 * Use for removing inappropriate or spam comments.
 * 
 * URL Parameters:
 * - artworkId: ID of artwork containing the comment
 * - commentId: ID of comment to delete
 * 
 * Headers:
 * Authorization: Bearer <admin-token>
 * 
 * Response (Success - 200):
 * {
 *   message: 'Comment deleted successfully',
 *   comments: [remaining comments array]
 * }
 * 
 * Response (Error - 404):
 * { message: 'Artwork not found' }
 * 
 * Process:
 * 1. Find artwork
 * 2. Filter out comment with matching ID
 * 3. Save artwork with updated comments
 * 4. Return remaining comments
 */
router.delete('/artworks/:artworkId/comments/:commentId', verifyAdmin, async (req, res) => {
    try {
        // Find artwork
        const artwork = await Artwork.findById(req.params.artworkId);

        // Check if artwork exists
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }

        // Filter out the comment to delete
        // Keep all comments except the one with matching ID
        artwork.comments = artwork.comments.filter(
            comment => comment._id.toString() !== req.params.commentId
        );

        // Save artwork with updated comments array
        await artwork.save();

        // Return success with remaining comments
        res.json({
            message: 'Comment deleted successfully',
            comments: artwork.comments
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: BAN/UNBAN USER
// ============================================================================

/**
 * PATCH /api/admin/users/:id/ban
 * 
 * Bans or unbans a user from the platform.
 * Banned users cannot login or perform actions.
 * 
 * URL Parameters:
 * - id: User ID to ban/unban
 * 
 * Headers:
 * Authorization: Bearer <admin-token>
 * 
 * Request Body:
 * {
 *   banned: boolean (true to ban, false to unban)
 * }
 * 
 * Response (Success - 200):
 * {
 *   message: 'User banned successfully' | 'User unbanned successfully',
 *   user: {
 *     _id: string,
 *     username: string,
 *     banned: boolean
 *   }
 * }
 * 
 * Response (Error - 404):
 * { message: 'User not found' }
 * 
 * Use Cases:
 * - Ban users violating terms
 * - Temporarily suspend accounts
 * - Unban after appeal
 * - Prevent spam/abuse
 */
router.patch('/users/:id/ban', verifyAdmin, async (req, res) => {
    try {
        // Extract ban status from request body
        const { banned } = req.body;

        // Find user by ID
        const user = await User.findById(req.params.id);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update banned status
        user.banned = banned;

        // Save updated user
        await user.save();

        // Return success message
        res.json({
            message: banned ? 'User banned successfully' : 'User unbanned successfully',
            user: {
                _id: user._id,
                username: user.username,
                banned: user.banned
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: FLAG/UNFLAG ARTWORK
// ============================================================================

/**
 * PATCH /api/admin/artworks/:id/flag
 * 
 * Flags or unflags an artwork for review.
 * Flagged artworks appear in the moderation queue.
 * 
 * URL Parameters:
 * - id: Artwork ID to flag/unflag
 * 
 * Headers:
 * Authorization: Bearer <admin-token>
 * 
 * Request Body:
 * {
 *   flagged: boolean (true to flag, false to unflag)
 * }
 * 
 * Response (Success - 200):
 * {
 *   message: 'Artwork flagged' | 'Artwork unflagged',
 *   artwork: { updated artwork object }
 * }
 * 
 * Response (Error - 404):
 * { message: 'Artwork not found' }
 * 
 * Workflow:
 * 1. Admin sees inappropriate content
 * 2. Admin flags it for review
 * 3. Artwork appears in "Flagged Content" tab
 * 4. Admin can unflag (if false positive) or delete
 */
router.patch('/artworks/:id/flag', verifyAdmin, async (req, res) => {
    try {
        // Extract flag status from request body
        const { flagged } = req.body;

        // Find artwork by ID
        const artwork = await Artwork.findById(req.params.id);

        // Check if artwork exists
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }

        // Update flagged status
        artwork.flagged = flagged;

        // Save updated artwork
        await artwork.save();

        // Return success message
        res.json({
            message: flagged ? 'Artwork flagged' : 'Artwork unflagged',
            artwork
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: GET FLAGGED ARTWORKS
// ============================================================================

/**
 * GET /api/admin/flagged
 * 
 * Returns all flagged artworks for review.
 * Content moderation queue.
 * 
 * Headers:
 * Authorization: Bearer <admin-token>
 * 
 * Response (Success - 200):
 * [
 *   {
 *     _id: string,
 *     title: string,
 *     imageUrl: string,
 *     artist: {
 *       _id: string,
 *       username: string,
 *       email: string
 *     },
 *     flagged: true,
 *     createdAt: date,
 *     ...
 *   },
 *   ...
 * ]
 * 
 * Use Cases:
 * - Review flagged content
 * - Decide to delete or unflag
 * - Track moderation queue
 * - Ensure platform quality
 */
router.get('/flagged', verifyAdmin, async (req, res) => {
    try {
        // Find artworks where flagged is true
        // Populate artist info
        // Sort newest first
        const flaggedArtworks = await Artwork.find({ flagged: true })
            .populate('artist', 'username email')
            .sort({ createdAt: -1 });

        res.json(flaggedArtworks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// EXPORT ROUTER
// ============================================================================

/**
 * Export the router
 * 
 * Mounted at /api/admin in server/index.js
 * 
 * All routes require admin role.
 * 
 * Available endpoints:
 * - GET /api/admin/stats
 * - GET /api/admin/users
 * - GET /api/admin/artworks
 * - GET /api/admin/sales
 * - GET /api/admin/flagged
 * - DELETE /api/admin/artworks/:id
 * - DELETE /api/admin/artworks/:aid/comments/:cid
 * - PATCH /api/admin/users/:id/ban
 * - PATCH /api/admin/artworks/:id/flag
 * 
 * Security:
 * - All routes protected by verifyAdmin middleware
 * - Only users with role='admin' can access
 * - JWT token required in Authorization header
 */
module.exports = router;
