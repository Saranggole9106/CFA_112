/**
 * Order Model - Mongoose Schema
 * 
 * Manages print sales and purchase orders.
 * Tracks when visitors buy artwork prints from artists.
 * 
 * Features:
 * - Purchase tracking (who bought what)
 * - Sales history for artists
 * - Revenue tracking
 * - Order status management
 * 
 * E-Commerce Flow:
 * 1. Visitor clicks "Buy Now" on artwork
 * 2. Order created with artwork price
 * 3. Payment simulated (no real gateway)
 * 4. Order marked as 'completed'
 * 5. Artist sees sale in dashboard
 * 6. Artist earns the artwork price
 * 
 * Note: This is a SIMULATED e-commerce system
 * No real payment processing (for learning purposes)
 */

const mongoose = require('mongoose');

/**
 * Order Schema Definition
 * Stores purchase order information
 */
const orderSchema = new mongoose.Schema({
    // ========================================================================
    // TRANSACTION PARTIES
    // ========================================================================

    /**
     * Buyer - The user who purchased the artwork
     * Reference to User model (typically a visitor)
     * 
     * Used to:
     * - Show purchase history to buyer
     * - Track who bought what
     * - Send order confirmations
     * 
     * Required: Every order must have a buyer
     */
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Links to User model
        required: true
    },

    /**
     * Artwork - The artwork that was purchased
     * Reference to Artwork model
     * 
     * Used to:
     * - Show what was bought
     * - Get artwork details (title, image, artist)
     * - Link to original artwork page
     * 
     * Important: We reference the artwork, not copy its data
     * This way if artwork is updated, order still shows current info
     */
    artwork: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork',  // Links to Artwork model
        required: true
    },

    // ========================================================================
    // PAYMENT INFORMATION
    // ========================================================================

    /**
     * Amount - Price paid for the artwork
     * In dollars (or your currency)
     * 
     * Copied from artwork.price at time of purchase
     * Stored separately so we have historical record
     * (even if artwork price changes later)
     * 
     * Used to:
     * - Calculate artist earnings
     * - Show purchase amount to buyer
     * - Track platform revenue
     */
    amount: {
        type: Number,
        required: true
    },

    // ========================================================================
    // ORDER STATUS
    // ========================================================================

    /**
     * Status - Current state of the order
     * 
     * Possible values:
     * - 'pending': Order created, payment processing (simulated)
     * - 'completed': Payment successful, order fulfilled
     * 
     * In a real system, you might have more statuses:
     * - 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
     * 
     * For this simulated system:
     * - Most orders go straight to 'completed'
     * - 'pending' could be used for testing or future features
     */
    status: {
        type: String,
        default: 'completed',  // Default to completed (instant purchase)
        enum: ['pending', 'completed']  // Only these values allowed
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt
    // createdAt: When purchase was made (order date)
    // updatedAt: Last status change
});

// ============================================================================
// MODEL EXPORT
// ============================================================================

/**
 * Export the Order model
 * 
 * Creates 'Order' model from orderSchema
 * MongoDB collection will be 'orders'
 * 
 * Usage Examples:
 * 
 * // Create new order (purchase)
 * const artwork = await Artwork.findById(artworkId);
 * const order = new Order({
 *     buyer: userId,
 *     artwork: artworkId,
 *     amount: artwork.price,
 *     status: 'completed'
 * });
 * await order.save();
 * 
 * // Get buyer's purchase history
 * const myOrders = await Order.find({ buyer: userId })
 *     .populate('artwork')
 *     .sort({ createdAt: -1 });  // Newest first
 * 
 * // Get artist's sales
 * // First find artist's artworks
 * const artistArtworks = await Artwork.find({ artist: artistId });
 * const artworkIds = artistArtworks.map(a => a._id);
 * // Then find orders for those artworks
 * const sales = await Order.find({ artwork: { $in: artworkIds } })
 *     .populate('artwork')
 *     .populate('buyer', 'username');
 * 
 * // Calculate total earnings
 * const totalEarnings = sales.reduce((sum, order) => sum + order.amount, 0);
 * 
 * // Get platform statistics
 * const totalOrders = await Order.countDocuments();
 * const totalRevenue = await Order.aggregate([
 *     { $group: { _id: null, total: { $sum: '$amount' } } }
 * ]);
 */
module.exports = mongoose.model('Order', orderSchema);
