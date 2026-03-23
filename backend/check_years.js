const mongoose = require('mongoose');
require('dotenv').config();
const Cutoff = require('./models/Cutoff');

async function years() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const stats = await Cutoff.aggregate([
            { $group: { _id: "$year", count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);
        console.log('Records per year:', stats);
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}
years();
