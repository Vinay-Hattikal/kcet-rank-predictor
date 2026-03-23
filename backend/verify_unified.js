const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const College = require('./models/College');

dotenv.config();

const verifyUnified = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Test Case: Combined Format (Starts with College:)
    const combinedData = `College: E001 University of Visvesvaraya College of Engineering
City:Bangalore-Urban | NIRF Rank (2024-25): 68 | Avg Placement (LPA): 9.0 | Highest Pkg (LPA): 18.0 | Govt/KCET Fees (Rs. Lakhs, 4yr): 1.1 | Mgmt/COMEDK Fees (Rs. Lakhs, 4yr): DNA
Course,1G,1K,1R,2AG,2AK,2AR,2BG,2BK,2BR,3AG,3AK,3AR,3BG,3BK,3BR,GM,GMK,GMR,GMP,SCG,SCK,SCR,STG,STK,STR,KKR,NRI,OPN,OTH
ARTIFIC,7703, , , , , , , , , , , , , , ,5109, , , ,25425, , , , , ,27201, , , `;

    const testFile = 'c:/Users/Dell/kcet-rank/test_unified.csv';
    fs.writeFileSync(testFile, combinedData);

    let totalUpdated = 0;
    let insideCollegeBlock = false;
    let currentCollegeId = null;

    const stream = fs.createReadStream(testFile).pipe(csv({ headers: false }));

    for await (const row of stream) {
      const columns = Object.values(row).map(c => c?.trim() || '');
      const firstCol = columns[0] || '';

      if (firstCol.toLowerCase().startsWith('college:')) {
        insideCollegeBlock = true;
        const rawName = firstCol.replace(/college:/gi, '').trim();
        const normalize = (text) => text.replace(/^[A-Z]\d{3}\s+/i, '').split(',')[0].replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim();
        const cleanName = normalize(rawName);
        
        const collegeObj = await College.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\./g, '\\.?')}$`, 'i') } },
          { name: cleanName, location: 'Karnataka' },
          { upsert: true, new: true }
        );
        currentCollegeId = collegeObj._id;
        totalUpdated++;
        console.log('Found College Block:', cleanName);
      } 
      else if (insideCollegeBlock && columns.some(c => c && (c.includes('Avg Placement') || c.includes('NIRF Rank'))) && currentCollegeId) {
        console.log('Found Metadata Row');
        const fullRow = columns.join(' | ');
        const getMatch = (regex, text) => { const m = text.match(regex); return m ? m[1] : null; };
        const nirf = getMatch(/NIRF Rank.*?:\s*(\d+)/i, fullRow);
        const avgPl = getMatch(/Avg Placement.*?:\s*([\d.]+)/i, fullRow);
        
        if (nirf || avgPl) {
          await College.findByIdAndUpdate(currentCollegeId, {
            ranking: nirf ? parseInt(nirf) : 0,
            'placements.averagePackage': avgPl ? parseFloat(avgPl) * 100000 : 0
          });
          console.log('Updated Metadata: NIRF', nirf, 'AvgPl', avgPl);
        }
      }
    }

    console.log('Total Colleges Updated:', totalUpdated);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

verifyUnified();
