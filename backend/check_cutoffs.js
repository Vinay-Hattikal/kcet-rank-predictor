const mongoose = require('mongoose');
require('dotenv').config();
const Cutoff = require('./models/Cutoff');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const records = await Cutoff.find();
        console.log(records);
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}
check();
