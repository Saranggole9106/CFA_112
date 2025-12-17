/**
 * Seed Script - Populate Local MongoDB with Demo Data
 * 
 * Run with: node seedDemo.js
 * 
 * Creates demo users, artworks, commissions, and orders
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Use local MongoDB
const MONGO_URI = 'mongodb://localhost:27017/artfolio';

// Import models
const User = require('./models/User');
const Artwork = require('./models/Artwork');
const Commission = require('./models/Commission');
const Order = require('./models/Order');

// Demo artwork images (placeholder URLs)
const demoImages = [
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
    'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800',
    'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'
];

async function seedDatabase() {
    try {
        // Connect to local MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to Local MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Artwork.deleteMany({});
        await Commission.deleteMany({});
        await Order.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create demo users (password will be hashed by User model's pre-save hook)
        const plainPassword = 'password123';

        const admin = await User.create({
            username: 'admin',
            email: 'admin@artfolio.com',
            password: plainPassword,  // Will be hashed by the model
            role: 'admin',
            bio: 'Platform administrator'
        });

        const artist1 = await User.create({
            username: 'maya_artist',
            email: 'maya@artfolio.com',
            password: plainPassword,
            role: 'artist',
            bio: 'Digital artist specializing in fantasy and sci-fi illustrations',
            commissionOpen: true
        });

        const artist2 = await User.create({
            username: 'alex_painter',
            email: 'alex@artfolio.com',
            password: plainPassword,
            role: 'artist',
            bio: 'Traditional oil painter with a focus on landscapes',
            commissionOpen: true
        });

        const visitor1 = await User.create({
            username: 'john_collector',
            email: 'john@example.com',
            password: plainPassword,
            role: 'visitor',
            bio: 'Art enthusiast and collector'
        });

        const visitor2 = await User.create({
            username: 'sarah_fan',
            email: 'sarah@example.com',
            password: plainPassword,
            role: 'visitor',
            bio: 'Love discovering new artists!'
        });

        console.log('👤 Created 5 demo users');

        // Create demo artworks
        const artworks = await Artwork.insertMany([
            {
                title: 'Cosmic Dreams',
                description: 'A surreal journey through space and imagination',
                imageUrl: demoImages[0],
                artist: artist1._id,
                category: 'Digital',
                tags: ['fantasy', 'space', 'surreal'],
                price: 150,
                isForSale: true,
                likes: [visitor1._id, visitor2._id]
            },
            {
                title: 'Forest Whispers',
                description: 'Morning mist in an ancient forest',
                imageUrl: demoImages[1],
                artist: artist2._id,
                category: 'Oil',
                tags: ['landscape', 'nature', 'forest'],
                price: 350,
                isForSale: true,
                likes: [visitor1._id]
            },
            {
                title: 'Neon City',
                description: 'Cyberpunk cityscape at night',
                imageUrl: demoImages[2],
                artist: artist1._id,
                category: 'Digital',
                tags: ['cyberpunk', 'city', 'neon'],
                price: 200,
                isForSale: true,
                likes: [visitor2._id]
            },
            {
                title: 'Ocean Serenity',
                description: 'Peaceful ocean waves at sunset',
                imageUrl: demoImages[3],
                artist: artist2._id,
                category: 'Oil',
                tags: ['ocean', 'sunset', 'peaceful'],
                price: 400,
                isForSale: true
            },
            {
                title: 'Abstract Emotions',
                description: 'Expression of feelings through color',
                imageUrl: demoImages[4],
                artist: artist1._id,
                category: 'Digital',
                tags: ['abstract', 'colorful', 'emotional'],
                price: 175,
                isForSale: true,
                likes: [visitor1._id, visitor2._id, artist2._id]
            },
            {
                title: 'Mountain Majesty',
                description: 'Towering peaks touching the clouds',
                imageUrl: demoImages[5],
                artist: artist2._id,
                category: 'Oil',
                tags: ['mountain', 'landscape', 'majestic'],
                price: 500,
                isForSale: true
            }
        ]);

        console.log('🎨 Created 6 demo artworks');

        // Create demo commissions
        await Commission.insertMany([
            {
                requester: visitor1._id,
                artist: artist1._id,
                brief: 'I would like a custom portrait in your fantasy style',
                status: 'pending',
                deadline: new Date('2025-01-15')
            },
            {
                requester: visitor2._id,
                artist: artist1._id,
                brief: 'Need a logo design for my gaming channel',
                status: 'accepted',
                price: 300,
                notes: 'Working on initial sketches'
            },
            {
                requester: visitor1._id,
                artist: artist2._id,
                brief: 'Commission for a landscape painting of my hometown',
                status: 'completed',
                price: 450
            }
        ]);

        console.log('📋 Created 3 demo commissions');

        // Create demo orders
        await Order.insertMany([
            {
                buyer: visitor1._id,
                artwork: artworks[0]._id,
                amount: 150,
                status: 'completed'
            },
            {
                buyer: visitor2._id,
                artwork: artworks[1]._id,
                amount: 350,
                status: 'completed'
            },
            {
                buyer: visitor1._id,
                artwork: artworks[4]._id,
                amount: 175,
                status: 'completed'
            }
        ]);

        console.log('🛒 Created 3 demo orders');

        console.log('\n========================================');
        console.log('🎉 Database seeded successfully!');
        console.log('========================================');
        console.log('\n📝 Demo Login Credentials:');
        console.log('----------------------------------------');
        console.log('Admin:   admin@artfolio.com / password123');
        console.log('Artist:  maya@artfolio.com / password123');
        console.log('Artist:  alex@artfolio.com / password123');
        console.log('Visitor: john@example.com / password123');
        console.log('Visitor: sarah@example.com / password123');
        console.log('----------------------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();
