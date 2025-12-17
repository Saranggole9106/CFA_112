/**
 * Authentication Middleware
 * 
 * Centralized middleware for JWT token verification.
 * Used across all protected routes.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify Token Middleware
 * 
 * Checks if request has a valid JWT token in the Authorization header.
 * If valid, adds user info to req.user for use in route handlers.
 * 
 * Header format: "Authorization: Bearer <token>"
 */
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const tokenValue = token.split(" ")[1];
        const verified = jwt.verify(
            tokenValue,
            process.env.JWT_SECRET || 'secretKey'
        );
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

/**
 * Verify Admin Middleware
 * 
 * Checks if user has admin role before allowing access.
 * More restrictive than verifyToken - requires admin role.
 */
const verifyAdmin = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const verified = jwt.verify(
            token.split(" ")[1],
            process.env.JWT_SECRET || 'secretKey'
        );

        if (verified.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

/**
 * Verify Artist Middleware
 * 
 * Checks if user has artist role.
 * Used for artist-specific endpoints.
 */
const verifyArtist = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const verified = jwt.verify(
            token.split(" ")[1],
            process.env.JWT_SECRET || 'secretKey'
        );

        if (verified.role !== 'artist' && verified.role !== 'admin') {
            return res.status(403).json({ message: 'Artist access required' });
        }

        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

module.exports = { verifyToken, verifyAdmin, verifyArtist };
