const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Fixed admin credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '890098';
const ADMIN_USERNAME = 'admin';

async function seedAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log('✅ Admin account already exists!');
            console.log('Email:', ADMIN_EMAIL);
            console.log('Password: 890098');
            console.log('Role:', existingAdmin.role);
        } else {
            // Create admin user
            const adminUser = new User({
                username: ADMIN_USERNAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD, // Will be hashed by pre-save hook
                role: 'admin',
                bio: 'Platform Administrator',
                profileImage: '',
                commissionOpen: false,
                banned: false
            });

            await adminUser.save();
            console.log('✅ Admin account created successfully!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📧 Email: admin@gmail.com');
            console.log('🔑 Password: 890098');
            console.log('👤 Username: admin');
            console.log('🛡️  Role: admin');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }

        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
