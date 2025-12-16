/**
 * Artwork Model - Mongoose Schema
 * 
 * Defines the structure of artwork documents in MongoDB.
 * Handles artwork uploads, metadata, social interactions, and e-commerce.
 * 
 * Features:
 * - Artwork metadata (title, description, tags, category)
 * - Artist reference (who created it)
 * - Pricing and sales status
 * - Social features (likes, comments)
 * - Admin moderation (flagged status)
 * - Embedded comment schema
 */

const mongoose = require('mongoose');

// ============================================================================
// COMMENT SUB-SCHEMA
// ============================================================================

/**
 * Comment Schema - Embedded within Artwork
 * 
 * Stores comments made by users on artworks
 * Comments are embedded in the artwork document (not a separate collection)
 * 
 * Why embedded?
 * - Comments are always accessed with their artwork
 * - Faster queries (no joins needed)
 * - Comments don't exist independently
 */
const commentSchema = new mongoose.Schema({
    /**
     * User - Reference to the user who made the comment
     * Populated when fetching to show username and profile image
     */
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // References the User model
        required: true
    },

    /**
     * Text - The actual comment content
     * What the user wrote
     */
    text: {
        type: String,
        required: true
    },

    /**
     * Created At - When the comment was posted
     * Automatically set to current time
     */
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ============================================================================
// ARTWORK SCHEMA
// ============================================================================

/**
 * Artwork Schema Definition
 * Main schema for storing artwork information
 */
const artworkSchema = new mongoose.Schema({
    // ========================================================================
    // BASIC INFORMATION
    // ========================================================================

    /**
     * Title - Name of the artwork
     * Required field, displayed prominently
     */
    title: {
        type: String,
        required: true
    },

    /**
     * Description - Detailed description of the artwork
     * Artist's notes, inspiration, techniques used, etc.
     * Optional field
     */
    description: {
        type: String
    },

    /**
     * Image URL - Path to the uploaded image file
     * Format: http://localhost:5001/uploads/filename.jpg
     * Required - every artwork must have an image
     */
    imageUrl: {
        type: String,
        required: true
    },

    // ========================================================================
    // ARTIST REFERENCE
    // ========================================================================

    /**
     * Artist - Reference to the user who created this artwork
     * Links to User model
     * Used to:
     * - Display artist info on artwork page
     * - Filter artworks by artist
     * - Track sales for the artist
     */
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // References User model
        required: true
    },

    // ========================================================================
    // CATEGORIZATION & DISCOVERY
    // ========================================================================

    /**
     * Tags - Array of keywords for searchability
     * Example: ['portrait', 'digital', 'fantasy']
     * Helps users discover artwork
     * Used for filtering and search
     */
    tags: [String],  // Array of strings

    /**
     * Category - Main category of the artwork
     * Examples: 'Digital', 'Oil', 'Sketch', 'Photography'
     * Used for filtering in gallery
     */
    category: {
        type: String
    },

    // ========================================================================
    // E-COMMERCE FIELDS
    // ========================================================================

    /**
     * Price - Price for print sales
     * In dollars (or your currency)
     * Only relevant if isForSale is true
     */
    price: {
        type: Number
    },

    /**
     * Is For Sale - Whether this artwork is available for purchase
     * If true, "Buy Now" button is shown
     * If false, artwork is display-only
     */
    isForSale: {
        type: Boolean,
        default: false
    },

    // ========================================================================
    // SOCIAL FEATURES
    // ========================================================================

    /**
     * Likes - Array of user IDs who liked this artwork
     * Stores ObjectIds referencing User model
     * 
     * Why array?
     * - Can check if specific user liked it
     * - Can count total likes (array.length)
     * - Can populate to show who liked it
     * 
     * Usage:
     * - Check if user liked: artwork.likes.includes(userId)
     * - Add like: artwork.likes.push(userId)
     * - Remove like: artwork.likes.splice(index, 1)
     */
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    /**
     * Comments - Array of comment objects
     * Uses the commentSchema defined above
     * Embedded documents (not separate collection)
     * 
     * Each comment has: user, text, createdAt
     */
    comments: [commentSchema],

    // ========================================================================
    // MODERATION FIELDS
    // ========================================================================

    /**
     * Flagged - Whether admin has flagged this for review
     * Used for content moderation
     * Flagged artworks appear in admin's review queue
     * 
     * Workflow:
     * 1. Admin sees inappropriate content
     * 2. Admin flags it (flagged = true)
     * 3. Appears in "Flagged Content" tab
     * 4. Admin can unflag or delete
     */
    flagged: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt automatically
});

// ============================================================================
// MODEL EXPORT
// ============================================================================

/**
 * Export the Artwork model
 * 
 * Creates 'Artwork' model from artworkSchema
 * MongoDB collection will be 'artworks' (lowercase, plural)
 * 
 * Usage:
 *   const Artwork = require('./models/Artwork');
 *   const artwork = await Artwork.findById(id).populate('artist');
 */
module.exports = mongoose.model('Artwork', artworkSchema);
