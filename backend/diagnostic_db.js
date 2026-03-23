const mongoose = require('mongoose');
require('dotenv').config();
const Cutoff = require('./models/Cutoff');

async function diagnostic() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- Diagnostic Start ---');
        
        const count = await Cutoff.countDocuments();
        console.log(`Total Cutoff records: ${count}`);
        
        const exams = await Cutoff.distinct('examType');
        console.log('Exams found:', exams);
        
        const years = await Cutoff.distinct('year');
        console.log('Years found:', years);
        
        const latestRounds = await Cutoff.aggregate([
            { $group: { _id: { examType: "$examType", year: "$year" }, maxRound: { $max: "$roundNumber" } } },
            { $sort: { "_id.year": -1 } }
        ]);
        console.log('Latest Rounds summary:', JSON.stringify(latestRounds, null, 2));

        const categories = await Cutoff.distinct('category');
        console.log('Categories found:', categories.slice(0, 10), '...');

        mongoose.connection.close();
    } catch (err) {
        console.error('Diagnostic failed:', err);
    }
}

diagnostic();
