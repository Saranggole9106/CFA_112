/**
 * User Model - Mongoose Schema
 * 
 * Defines the structure and behavior of User documents in MongoDB.
 * Handles three types of users: artists, visitors, and admins.
 * 
 * Features:
 * - Password hashing before saving (security)
 * - Password comparison method for login
 * - Role-based access control
 * - Profile information (bio, image)
 * - Commission availability toggle
 * - Ban functionality for admins
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Library for password hashing

/**
 * User Schema Definition
 * Defines the structure of user documents in the 'users' collection
 */
const userSchema = new mongoose.Schema({
    // ========================================================================
    // AUTHENTICATION FIELDS
    // ========================================================================

    /**
     * Username - Unique identifier for the user
     * Used for display purposes and mentions
     */
    username: {
        type: String,
        required: true,  // Must be provided during registration
        unique: true     // No two users can have the same username
    },

    /**
     * Email - Used for login and communication
     * Must be unique across all users
     */
    email: {
        type: String,
        required: true,
        unique: true
    },

    /**
     * Password - Hashed password for security
     * Never stored in plain text
     * Automatically hashed before saving (see pre-save hook below)
     */
    password: {
        type: String,
        required: true
    },

    // ========================================================================
    // ROLE & PERMISSIONS
    // ========================================================================

    /**
     * Role - Determines user permissions and access
     * - 'artist': Can upload artworks, receive commissions, track sales
     * - 'visitor': Can browse, like, comment, purchase, request commissions
     * - 'admin': Can moderate content, manage users, view all analytics
     * 
     * Default: 'visitor' (most restrictive role)
     */
    role: {
        type: String,
        enum: ['artist', 'visitor', 'admin'], // Only these values are allowed
        default: 'visitor'
    },

    // ========================================================================
    // PROFILE INFORMATION
    // ========================================================================

    /**
     * Bio - User's biography or description
     * Displayed on profile pages
     */
    bio: {
        type: String,
        default: ''
    },

    /**
     * Profile Image - URL to user's profile picture
     * Can be uploaded or use default avatar
     */
    profileImage: {
        type: String,
        default: ''
    },

    // ========================================================================
    // ARTIST-SPECIFIC FIELDS
    // ========================================================================

    /**
     * Commission Open - Whether artist is accepting commission requests
     * Only relevant for users with role 'artist'
     * Visitors can see this before sending a request
     */
    commissionOpen: {
        type: Boolean,
        default: false
    },

    // ========================================================================
    // MODERATION FIELDS
    // ========================================================================

    /**
     * Banned - Whether user has been banned by admin
     * Banned users cannot login or perform actions
     * Only admins can ban/unban users
     */
    banned: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// ============================================================================
// PRE-SAVE HOOK - PASSWORD HASHING
// ============================================================================

/**
 * Middleware that runs before saving a user document
 * Hashes the password if it has been modified
 * 
 * Security: Passwords are never stored in plain text
 * Uses bcrypt with 10 salt rounds for strong hashing
 * 
 * When it runs:
 * - During user registration (new password)
 * - When user changes their password
 * 
 * When it doesn't run:
 * - When updating other fields (bio, profileImage, etc.)
 */
userSchema.pre('save', async function () {
    // Check if password field was modified
    // If not modified, skip hashing (prevents re-hashing on every save)
    if (!this.isModified('password')) return;

    // Hash the password with bcrypt
    // Salt rounds = 10 (good balance between security and performance)
    this.password = await bcrypt.hash(this.password, 10);
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Compare Password Method
 * 
 * Used during login to verify if entered password matches stored hash
 * 
 * @param {string} enteredPassword - Plain text password from login form
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 * 
 * Usage:
 *   const user = await User.findOne({ email });
 *   const isMatch = await user.comparePassword(password);
 *   if (isMatch) { // Login successful }
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
    // bcrypt.compare() hashes the entered password and compares with stored hash
    return await bcrypt.compare(enteredPassword, this.password);
};

// ============================================================================
// MODEL EXPORT
// ============================================================================

/**
 * Export the User model
 * 
 * This creates a 'User' model based on the userSchema
 * MongoDB will create a 'users' collection (lowercase, pluralized)
 * 
 * Usage in other files:
 *   const User = require('./models/User');
 *   const user = await User.findOne({ email: 'test@example.com' });
 */
module.exports = mongoose.model('User', userSchema);
