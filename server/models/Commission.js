/**
 * Commission Model - Mongoose Schema
 * 
 * Manages commission requests between visitors and artists.
 * Tracks the entire commission workflow from request to completion.
 * 
 * Features:
 * - Request tracking (who requested, which artist)
 * - Status management (pending, accepted, completed, rejected)
 * - Price negotiation
 * - Deadline tracking
 * - Internal notes for artists
 * 
 * Commission Flow:
 * 1. Visitor sends request → status: 'pending'
 * 2. Artist reviews → accepts or rejects
 * 3. If accepted → artist sets price and deadline
 * 4. Artist works on commission
 * 5. Artist marks as completed → status: 'completed'
 * 6. Artist earns the commission price
 */

const mongoose = require('mongoose');

/**
 * Commission Schema Definition
 * Stores all commission request information
 */
const commissionSchema = new mongoose.Schema({
    // ========================================================================
    // PARTIES INVOLVED
    // ========================================================================

    /**
     * Requester - The visitor who requested the commission
     * Reference to User model (role: visitor)
     * 
     * Used to:
     * - Show who made the request
     * - Notify requester of status updates
     * - Track commission history for visitor
     */
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Links to User model
        required: true
    },

    /**
     * Artist - The artist who will create the commissioned work
     * Reference to User model (role: artist)
     * 
     * Used to:
     * - Route request to correct artist
     * - Show in artist's commission inbox
     * - Track earnings for artist
     */
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Links to User model
        required: true
    },

    // ========================================================================
    // REQUEST DETAILS
    // ========================================================================

    /**
     * Brief - Description of what the requester wants
     * 
     * Should include:
     * - What they want created
     * - Style preferences
     * - Size/dimensions
     * - Any specific requirements
     * 
     * Example: "I want a digital portrait of my cat in anime style,
     *           1920x1080 resolution, with a space background"
     */
    brief: {
        type: String,
        required: true  // Must provide details
    },

    // ========================================================================
    // STATUS TRACKING
    // ========================================================================

    /**
     * Status - Current state of the commission
     * 
     * Possible values:
     * - 'pending': Just submitted, waiting for artist review
     * - 'accepted': Artist agreed to do it, work in progress
     * - 'completed': Artist finished and delivered the work
     * - 'rejected': Artist declined the request
     * 
     * Workflow:
     * pending → accepted → completed
     *        ↘ rejected
     */
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'rejected'],  // Only these values allowed
        default: 'pending'  // New requests start as pending
    },

    // ========================================================================
    // ARTIST MANAGEMENT FIELDS
    // ========================================================================

    /**
     * Notes - Internal notes for the artist
     * 
     * Artist can write:
     * - Progress updates
     * - Questions for requester
     * - Technical notes
     * - Reminders
     * 
     * Not visible to requester (private to artist)
     */
    notes: {
        type: String
    },

    /**
     * Price - Agreed price for the commission
     * 
     * Set by artist when accepting the request
     * Used to:
     * - Show cost to requester
     * - Calculate artist earnings when completed
     * - Track commission revenue
     * 
     * Optional: Artist may accept without setting price initially
     */
    price: {
        type: Number
    },

    /**
     * Deadline - When the commission should be completed
     * 
     * Can be:
     * - Requested by visitor
     * - Set/modified by artist
     * - Used for time management
     * 
     * Optional field
     */
    deadline: {
        type: Date
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt
    // createdAt: When request was submitted
    // updatedAt: Last time status/price/notes were changed
});

// ============================================================================
// MODEL EXPORT
// ============================================================================

/**
 * Export the Commission model
 * 
 * Creates 'Commission' model from commissionSchema
 * MongoDB collection will be 'commissions'
 * 
 * Usage Examples:
 * 
 * // Create new commission request
 * const commission = new Commission({
 *     requester: visitorId,
 *     artist: artistId,
 *     brief: "I want a portrait...",
 *     deadline: new Date('2024-12-31')
 * });
 * await commission.save();
 * 
 * // Get artist's commissions
 * const commissions = await Commission.find({ artist: artistId })
 *     .populate('requester', 'username email');
 * 
 * // Update status
 * commission.status = 'accepted';
 * commission.price = 500;
 * await commission.save();
 * 
 * // Calculate earnings from completed commissions
 * const completed = await Commission.find({ 
 *     artist: artistId, 
 *     status: 'completed' 
 * });
 * const totalEarnings = completed.reduce((sum, c) => sum + (c.price || 0), 0);
 */
module.exports = mongoose.model('Commission', commissionSchema);
