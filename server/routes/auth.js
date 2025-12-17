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
const { verifyToken } = require('../middleware/auth');

// Middleware imported from ../middleware/auth.js

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

        // Input validation
        if (!username || username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters' });
        }
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user with this email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken' });
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

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if user is banned
        if (user.banned) {
            return res.status(403).json({ message: 'Your account has been banned. Contact support for assistance.' });
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
