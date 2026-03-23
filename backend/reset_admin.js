const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

async function resetAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'admin@collegepredictor.com';
        let user = await User.findOne({ email });
        
        if (user) {
            console.log('Resetting password for existing admin...');
            user.password = 'admin123';
            await user.save();
        } else {
            console.log('Creating new admin...');
            await User.create({
                name: 'Site Admin',
                email: email,
                password: 'admin123',
                role: 'admin'
            });
        }
        console.log('Admin login: admin@collegepredictor.com / admin123');
        mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
resetAdmin();
