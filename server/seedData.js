/**
 * Seed Script for ArtFolio
 * Run this to populate the database with mock data
 * Usage: node seedData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('./models/User');
const Artwork = require('./models/Artwork');

// Mock Data
const mockUsers = [
    {
        username: 'admin',
        email: 'admin@gmail.com',
        password: '890098',
        role: 'admin'
    },
    {
        username: 'ArtistSarah',
        email: 'sarah@artfolio.com',
        password: 'password123',
        role: 'artist',
        bio: 'Digital artist specializing in fantasy landscapes and character design',
        commissionOpen: true
    },
    {
        username: 'DigitalDave',
        email: 'dave@artfolio.com',
        password: 'password123',
        role: 'artist',
        bio: 'Cyberpunk and sci-fi illustrator with 10 years of experience',
        commissionOpen: true
    },
    {
        username: 'PixelPainter',
        email: 'pixel@artfolio.com',
        password: 'password123',
        role: 'artist',
        bio: 'Retro pixel art and game asset creator',
        commissionOpen: true
    },
    {
        username: 'ArtLover101',
        email: 'visitor@artfolio.com',
        password: 'password123',
        role: 'visitor'
    }
];

const mockArtworks = [
    {
        title: 'Neon Dreams',
        description: 'A cyberpunk cityscape bathed in neon lights. This piece explores the intersection of technology and humanity in a dystopian future.',
        price: 299,
        category: 'Digital',
        tags: ['cyberpunk', 'neon', 'cityscape', 'sci-fi'],
        imageUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800'
    },
    {
        title: 'Forest Spirit',
        description: 'An enchanted forest guardian emerges from the ancient woods. Inspired by Japanese mythology and Studio Ghibli aesthetics.',
        price: 450,
        category: 'Fantasy',
        tags: ['fantasy', 'nature', 'spirit', 'magical'],
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800'
    },
    {
        title: 'Ocean Sunset',
        description: 'Golden hour over the Pacific Ocean. A serene landscape capturing the beauty of nature in its purest form.',
        price: 175,
        category: 'Landscape',
        tags: ['landscape', 'sunset', 'ocean', 'peaceful'],
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
    },
    {
        title: 'Abstract Flow',
        description: 'Fluid dynamics visualized through vibrant colors and organic shapes. A meditation on the nature of movement.',
        price: 320,
        category: 'Abstract',
        tags: ['abstract', 'colorful', 'fluid', 'modern'],
        imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800'
    },
    {
        title: 'Portrait Study',
        description: 'A digital portrait exploring light, shadow, and emotion. Created using advanced digital painting techniques.',
        price: 550,
        category: 'Portrait',
        tags: ['portrait', 'realistic', 'digital-painting', 'emotional'],
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800'
    },
    {
        title: 'Space Explorer',
        description: 'An astronaut floating through the cosmos, surrounded by nebulae and distant galaxies.',
        price: 399,
        category: 'Digital',
        tags: ['space', 'astronaut', 'cosmos', 'sci-fi'],
        imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800'
    },
    {
        title: 'Mountain Dawn',
        description: 'First light breaks over snow-capped peaks. A tribute to the majesty of alpine landscapes.',
        price: 225,
        category: 'Landscape',
        tags: ['mountains', 'sunrise', 'nature', 'peaceful'],
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
    },
    {
        title: 'Tokyo Nights',
        description: 'The vibrant energy of Tokyo after dark. Capturing the essence of Japanese urban culture.',
        price: 375,
        category: 'Photography',
        tags: ['tokyo', 'japan', 'urban', 'night'],
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'
    },
    {
        title: 'Geometric Dreams',
        description: 'Sacred geometry meets digital art. Intricate patterns that reveal hidden mathematical beauty.',
        price: 280,
        category: 'Abstract',
        tags: ['geometric', 'patterns', 'sacred-geometry', 'digital'],
        imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800'
    },
    {
        title: 'Cherry Blossom',
        description: 'A serene Japanese garden during sakura season. Celebrating the fleeting beauty of spring.',
        price: 195,
        category: 'Traditional',
        tags: ['japan', 'cherry-blossom', 'spring', 'peaceful'],
        imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800'
    },
    {
        title: 'Dragon\'s Lair',
        description: 'A majestic dragon guards its treasure hoard. Epic fantasy art with rich details and dramatic lighting.',
        price: 650,
        category: 'Fantasy',
        tags: ['dragon', 'fantasy', 'epic', 'creature'],
        imageUrl: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?w=800'
    },
    {
        title: 'Retro Arcade',
        description: 'Nostalgic pixel art celebrating the golden age of arcade gaming.',
        price: 150,
        category: 'Digital',
        tags: ['retro', 'pixel-art', 'gaming', 'nostalgic'],
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Artwork.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create users (password will be hashed by User model's pre-save hook)
        const createdUsers = [];
        for (const userData of mockUsers) {
            const user = await User.create(userData);
            createdUsers.push(user);
            console.log(`👤 Created user: ${user.username} (${user.role})`);
        }

        // Get artist users for artworks
        const artists = createdUsers.filter(u => u.role === 'artist');

        // Create artworks
        for (let i = 0; i < mockArtworks.length; i++) {
            const artworkData = mockArtworks[i];
            const artist = artists[i % artists.length]; // Distribute artworks among artists

            await Artwork.create({
                ...artworkData,
                artist: artist._id,
                isForSale: true,  // Enable purchasing
                likes: [],
                comments: []
            });
            console.log(`🎨 Created artwork: "${artworkData.title}" by ${artist.username}`);
        }

        console.log('\n✨ Database seeded successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('─────────────────────────────────');
        console.log('Admin:    admin@gmail.com / 890098');
        console.log('Artist:   sarah@artfolio.com / password123');
        console.log('Visitor:  visitor@artfolio.com / password123');
        console.log('─────────────────────────────────\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
