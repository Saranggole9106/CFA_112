/**
 * Authentication Routes
 * 
 * Handles user authentication and authorization.
 * Provides endpoints for registration, login, and user verification.
 * 
 * Endpoints:
 * - POST /api/auth/register - Create new user account
 * - POST /api/auth/login - Authenticate user and get token
 * - GET /api/auth/me - Get current logged-in user info
 * 
 * Security:
 * - Passwords are hashed with bcryptjs before storage
 * - JWT tokens used for authentication
 * - Tokens expire after 1 day
 * - Protected routes require valid token
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');  // For creating and verifying tokens
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ============================================================================
// MIDDLEWARE - TOKEN VERIFICATION
// ============================================================================

/**
 * Verify Token Middleware
 * 
 * Checks if request has a valid JWT token in the Authorization header.
 * If valid, adds user info to req.user for use in route handlers.
 * If invalid or missing, returns error.
 * 
 * Used by protected routes that require authentication.
 * 
 * Header format: "Authorization: Bearer <token>"
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyToken = (req, res, next) => {
    // Get the Authorization header
    const token = req.header('Authorization');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        // Extract token from "Bearer <token>" format
        // Split by space and take second part
        const tokenValue = token.split(" ")[1];

        // Verify token with secret key
        // If valid, returns decoded payload (user id and role)
        const verified = jwt.verify(
            tokenValue,
            process.env.JWT_SECRET || 'secretKey'  // Use env variable or fallback
        );

        // Add user info to request object
        // Now route handlers can access req.user
        req.user = verified;

        // Continue to next middleware/route handler
        next();
    } catch (err) {
        // Token is invalid, expired, or malformed
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// ============================================================================
// ROUTE: REGISTER NEW USER
// ============================================================================

/**
 * POST /api/auth/register
 * 
 * Creates a new user account.
 * 
 * Request Body:
 * {
 *   username: string (required, unique),
 *   email: string (required, unique),
 *   password: string (required),
 *   role: 'artist' | 'visitor' | 'admin' (optional, defaults to 'visitor')
 * }
 * 
 * Response (Success - 201):
 * {
 *   token: string (JWT token),
 *   user: {
 *     _id: string,
 *     username: string,
 *     role: string
 *   }
 * }
 * 
 * Response (Error - 400):
 * { message: 'Email already exists' }
 * 
 * Process:
 * 1. Check if email already exists
 * 2. Create new user (password auto-hashed by User model)
 * 3. Generate JWT token
 * 4. Return token and user info
 */
router.post('/register', async (req, res) => {
    try {
        // Extract data from request body
        const { username, email, password, role } = req.body;

        // Check if user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create new user document
        // Password will be automatically hashed by User model's pre-save hook
        const newUser = new User({
            username,
            email,
            password,  // Plain text here, hashed before saving
            role       // artist, visitor, or admin
        });

        // Save to database
        await newUser.save();

        // Generate JWT token
        // Payload includes user ID and role for authorization
        // Token expires in 1 day
        const token = jwt.sign(
            {
                _id: newUser._id,   // User's MongoDB ID
                role: newUser.role  // User's role for permission checks
            },
            process.env.JWT_SECRET || 'secretKey',  // Secret key for signing
            { expiresIn: '1d' }  // Token valid for 1 day
        );

        // Return success response
        // Client stores token and uses it for future requests
        res.status(201).json({
            token,  // JWT token
            user: {
                _id: newUser._id,
                username: newUser.username,
                role: newUser.role
            }
        });
    } catch (err) {
        // Log error for debugging
        console.error('Registration Error:', err);

        // Return error response
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: LOGIN USER
// ============================================================================

/**
 * POST /api/auth/login
 * 
 * Authenticates a user and returns a JWT token.
 * 
 * Request Body:
 * {
 *   email: string (required),
 *   password: string (required)
 * }
 * 
 * Response (Success - 200):
 * {
 *   token: string (JWT token),
 *   user: {
 *     _id: string,
 *     username: string,
 *     role: string,
 *     profileImage: string
 *   }
 * }
 * 
 * Response (Error - 400):
 * { message: 'User not found' }
 * { message: 'Invalid password' }
 * 
 * Process:
 * 1. Find user by email
 * 2. Verify password using bcrypt
 * 3. Generate JWT token
 * 4. Return token and user info
 */
router.post('/login', async (req, res) => {
    try {
        // Extract credentials from request body
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Verify password
        // comparePassword is a method defined in User model
        // It uses bcrypt to compare plain text with hashed password
        const validPass = await user.comparePassword(password);

        // Check if password is correct
        if (!validPass) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        // Same process as registration
        const token = jwt.sign(
            {
                _id: user._id,   // User's ID
                role: user.role  // User's role
            },
            process.env.JWT_SECRET || 'secretKey',
            { expiresIn: '1d' }
        );

        // Return success response
        // Include profile image for immediate display
        res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (err) {
        // Return error response
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// ROUTE: GET CURRENT USER
// ============================================================================

/**
 * GET /api/auth/me
 * 
 * Returns information about the currently logged-in user.
 * Requires valid JWT token in Authorization header.
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response (Success - 200):
 * {
 *   _id: string,
 *   username: string,
 *   email: string,
 *   role: string,
 *   bio: string,
 *   profileImage: string,
 *   commissionOpen: boolean,
 *   banned: boolean,
 *   createdAt: date,
 *   updatedAt: date
 * }
 * 
 * Response (Error - 401):
 * { message: 'Access Denied' }
 * 
 * Response (Error - 400):
 * { message: 'Invalid Token' }
 * 
 * Use Cases:
 * - Verify user is still logged in
 * - Get updated user info
 * - Check if user was banned
 * - Refresh user data in frontend
 */
router.get('/me', verifyToken, async (req, res) => {
    try {
        // req.user._id comes from verifyToken middleware
        // It was decoded from the JWT token

        // Find user by ID and exclude password field
        // .select('-password') means "get all fields except password"
        const user = await User.findById(req.user._id).select('-password');

        // Return user data (without password for security)
        res.json(user);
    } catch (err) {
        // Return error response
        res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// EXPORT ROUTER
// ============================================================================

/**
 * Export the router
 * 
 * This router will be mounted at /api/auth in server/index.js
 * 
 * Available endpoints:
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - GET /api/auth/me
 */
module.exports = router;
