const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const College = require('./models/College');
const Cutoff = require('./models/Cutoff');

dotenv.config();

const verifyLogic = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const filePath = 'c:/Users/Dell/kcet-rank/test_combined.csv';
    let currentCollegeId = null;
    let metadataFound = false;
    let cutoffsFound = 0;

    const stream = fs.createReadStream(filePath).pipe(csv({ headers: false }));

    for await (const row of stream) {
      const columns = Object.values(row).map(c => c?.trim() || '');
      
      // LOGIC FROM admin.js
      if (columns[0]?.toLowerCase().startsWith('college:')) {
        const rawText = columns[0].replace(/college:/gi, '').trim();
        const normalize = (text) => text.replace(/^[A-Z]\d{3}\s+/i, '').split(',')[0].replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim();
        const cleanName = normalize(rawText);
        
        const collegeObj = await College.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\./g, '\\.?')}$`, 'i') } },
          { name: cleanName, location: 'Karnataka' },
          { upsert: true, new: true }
        );
        currentCollegeId = collegeObj._id;
        console.log('Found College:', cleanName);
      } 
      else if (columns.some(c => c && (c.includes('Avg Placement') || c.includes('NIRF Rank'))) && currentCollegeId) {
        const fullRow = columns.join(' | ');
        const getMatch = (regex, text) => { const m = text.match(regex); return m ? m[1] : null; };

        const nirf = getMatch(/NIRF Rank.*?:\s*(\d+)/i, fullRow);
        const avgPl = getMatch(/Avg Placement.*?:\s*([\d.]+)/i, fullRow);
        const highPl = getMatch(/Highest Pkg.*?:\s*([\d.]+)/i, fullRow);
        const gFee = getMatch(/Govt\/KCET Fees.*?:\s*([\d.]+)/i, fullRow);
        const location = getMatch(/City:\s*([^|]+)/i, fullRow);

        const updateObj = {};
        if (nirf) updateObj.ranking = parseInt(nirf);
        if (location) updateObj.location = location.trim();
        if (avgPl || highPl) {
          updateObj.placements = {
            averagePackage: avgPl ? parseFloat(avgPl) * 100000 : 0,
            highestPackage: highPl ? parseFloat(highPl) * 100000 : 0
          };
        }
        if (gFee) {
          updateObj.fees = {
            government: gFee ? parseFloat(gFee) * 100000 : 0,
            management: 0
          };
        }

        if (Object.keys(updateObj).length > 0) {
          await College.findByIdAndUpdate(currentCollegeId, updateObj);
          metadataFound = true;
          console.log('Updated Metadata:', updateObj);
        }
      }
      else {
        const firstCol = columns[0]?.trim();
        if (firstCol && firstCol.length > 3 && !firstCol.toLowerCase().includes('course') && currentCollegeId) {
          cutoffsFound++;
        }
      }
    }

    console.log('Verification Summary:');
    console.log('- Metadata Found & Updated:', metadataFound);
    console.log('- Cutoff Rows Detected:', cutoffsFound);

    // Final Check
    const finalCollege = await College.findOne({ name: /University of Visvesvaraya/i });
    console.log('Final DB State:', JSON.stringify(finalCollege, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Verification Failed:', error);
    process.exit(1);
  }
};

verifyLogic();
