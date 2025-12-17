/**
 * Order Routes
 * 
 * Manages print sales and purchase orders.
 * Handles the e-commerce functionality for buying artwork prints.
 * 
 * Endpoints:
 * - POST /api/orders - Create new order (purchase artwork)
 * - GET /api/orders/sales/history - Get artist's sales history
 * - GET /api/orders/my-orders - Get buyer's purchase history
 * 
 * E-Commerce Flow:
 * 1. Visitor clicks "Buy Now" on artwork
 * 2. Frontend sends POST request with artworkId
 * 3. Server creates order with artwork price
 * 4. Payment simulated (no real gateway)
 * 5. Order saved as 'completed'
 * 6. Artist sees sale in dashboard
 * 7. Buyer sees purchase in history
 * 
 * Note: This is SIMULATED e-commerce (for learning)
 * No real payment processing
 */

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Artwork = require('../models/Artwork');
const { verifyToken, verifyArtist } = require('../middleware/auth');

// Middleware imported from ../middleware/auth.js

// ============================================================================
// ROUTE: CREATE ORDER (PURCHASE ARTWORK)
// ============================================================================

/**
 * POST /api/orders
 * 
 * Creates a new order when a user purchases an artwork print.
 * Simulates the "Buy Now" functionality.
 * 
 * Request Body:
 * {
 *   artworkId: string (required) - ID of artwork to purchase
 * }
 * 
 * Response (Success - 201):
 * {
 *   _id: string,
 *   buyer: string (user's ID),
 *   artwork: string (artwork ID),
 *   amount: number (price paid),
 *   status: 'completed',
 *   createdAt: date,
 *   updatedAt: date
 * }
 * 
 * Response (Error - 404):
 * { message: 'Artwork not found' }
 * 
 * Response (Error - 400):
 * { message: error message }
 * 
 * Process:
 * 1. Find artwork by ID
 * 2. Get artwork price
 * 3. Create order with buyer, artwork, amount
 * 4. Save order (payment simulated)
 * 5. Return order confirmation
 * 
 * Real-world additions would include:
 * - Payment gateway integration (Stripe, PayPal)
 * - Inventory management
 * - Shipping address
 * - Email confirmation
 * - Invoice generation
 */
router.post('/', verifyToken, async (req, res) => {
    try {
        // Log for debugging
        console.log('Received purchase request:', req.body);

        // Extract artwork ID from request
        const { artworkId } = req.body;

        // Validate artworkId
        if (!artworkId) {
            return res.status(400).json({ message: 'Artwork ID is required' });
        }

        // Find the artwork to get its details and price
        const artwork = await Artwork.findById(artworkId);

        // Check if artwork exists
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }

        // Check if artwork is for sale
        if (!artwork.isForSale) {
            return res.status(400).json({ message: 'This artwork is not available for purchase' });
        }

        // Check if artwork has a price
        if (!artwork.price || artwork.price <= 0) {
            return res.status(400).json({ message: 'This artwork does not have a valid price' });
        }

        // Prevent buying own artwork
        if (artwork.artist.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot purchase your own artwork' });
        }

        // Create new order document
        const newOrder = new Order({
            buyer: req.user._id,      // Current logged-in user
            artwork: artworkId,        // Artwork being purchased
            amount: artwork.price      // Price from artwork (at time of purchase)
            // status defaults to 'completed' (instant purchase simulation)
        });

        // Save order to database
        const savedOrder = await newOrder.save();

        // Return order confirmation
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: GET ARTIST'S SALES HISTORY
// ============================================================================

/**
 * GET /api/orders/sales/history
 * 
 * Returns all sales (orders) for the logged-in artist's artworks.
 * Shows who bought what and when.
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response (Success - 200):
 * [
 *   {
 *     _id: string,
 *     buyer: {
 *       _id: string,
 *       username: string
 *     },
 *     artwork: {
 *       _id: string,
 *       title: string,
 *       imageUrl: string,
 *       price: number
 *     },
 *     amount: number,
 *     status: string,
 *     createdAt: date,
 *     updatedAt: date
 *   },
 *   ...
 * ]
 * 
 * Response (Error - 500):
 * { message: error message }
 * 
 * Process:
 * 1. Find all artworks by this artist
 * 2. Get IDs of those artworks
 * 3. Find all orders for those artworks
 * 4. Populate buyer and artwork details
 * 5. Sort by date (newest first)
 * 6. Return sales array
 * 
 * Use Cases:
 * - Artist dashboard showing sales
 * - Calculate total earnings
 * - Track which artworks sell best
 * - See who's buying
 */
router.get('/sales/history', verifyArtist, async (req, res) => {
    try {
        // Log for debugging
        console.log(`Fetching sales history for artist: ${req.user._id}`);

        // Step 1: Find all artworks created by this artist
        // Only get the _id field (we just need the IDs)
        const artistArtworks = await Artwork.find({ artist: req.user._id })
            .select('_id');

        console.log(`Found ${artistArtworks.length} artworks owned by artist.`);

        // Step 2: Extract artwork IDs into an array
        const artworkIds = artistArtworks.map(a => a._id);

        // Step 3: Find all orders where artwork is in our array
        // $in operator: matches any value in the array
        const sales = await Order.find({ artwork: { $in: artworkIds } })
            .populate('artwork')                    // Get full artwork details
            .populate('buyer', 'username')          // Get buyer's username
            .sort({ createdAt: -1 });               // Newest first

        console.log(`Found ${sales.length} sales orders.`);

        // Return sales array
        res.json(sales);
    } catch (err) {
        console.error("Error fetching sales history:", err);
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: GET USER'S PURCHASE HISTORY
// ============================================================================

/**
 * GET /api/orders/my-orders
 * 
 * Returns all orders (purchases) made by the logged-in user.
 * Shows what they bought and when.
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response (Success - 200):
 * [
 *   {
 *     _id: string,
 *     buyer: string,
 *     artwork: {
 *       _id: string,
 *       title: string,
 *       imageUrl: string,
 *       artist: {
 *         username: string
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
 * Response (Error - 500):
 * { message: error message }
 * 
 * Use Cases:
 * - User's purchase history page
 * - Track spending
 * - Re-view purchased artworks
 * - Download receipts
 */
router.get('/my-orders', verifyToken, async (req, res) => {
    try {
        // Find all orders where current user is the buyer
        const orders = await Order.find({ buyer: req.user._id })
            .populate('artwork')              // Get artwork details
            .sort({ createdAt: -1 });         // Newest first

        // Return orders array
        res.json(orders);
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
 * Mounted at /api/orders in server/index.js
 * 
 * Available endpoints:
 * - POST /api/orders
 * - GET /api/orders/sales/history
 * - GET /api/orders/my-orders
 * 
 * Usage Examples:
 * 
 * // Purchase artwork
 * POST /api/orders
 * Body: { artworkId: '123abc' }
 * Headers: { Authorization: 'Bearer <token>' }
 * 
 * // Artist views sales
 * GET /api/orders/sales/history
 * Headers: { Authorization: 'Bearer <artist-token>' }
 * 
 * // User views purchases
 * GET /api/orders/my-orders
 * Headers: { Authorization: 'Bearer <token>' }
 * 
 * Earnings Calculation:
 * const sales = await fetch('/api/orders/sales/history');
 * const totalEarnings = sales.reduce((sum, order) => sum + order.amount, 0);
 */
module.exports = router;
