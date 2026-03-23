const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'admin@collegepredictor.com' });
        if (user) {
            console.log('Admin user found:', {
                email: user.email,
                role: user.role,
                _id: user._id
            });
        } else {
            console.log('Admin user NOT found');
        }
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}
checkUser();
