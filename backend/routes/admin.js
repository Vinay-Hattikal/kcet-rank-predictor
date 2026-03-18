const express = require('express');
const multer = require('multer');
const College = require('../models/College');
const Cutoff = require('../models/Cutoff');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');
const csv = require('csv-parser');

const router = express.Router();

const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.role === 'admin') {
        req.user = user;
        next();
      } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
      }
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const upload = multer({ dest: 'uploads/' });

// @route POST /api/admin/colleges/:id
// @route POST /api/admin/colleges/upload
// @route DELETE /api/admin/colleges
router.delete('/colleges', protectAdmin, async (req, res) => {
  try {
    await College.deleteMany({});
    // Also clear cutoffs because they are invalid without colleges
    await Cutoff.deleteMany({});
    res.json({ message: 'All college and cutoff data cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/admin/colleges/upload
router.post('/colleges/upload', protectAdmin, upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    let totalUpdated = 0;

    for (const file of req.files) {
      await new Promise((resolve, reject) => {
        let headersMapped = false;
        let columnMap = {};

        const stream = fs.createReadStream(file.path)
          .pipe(csv({ headers: false }));

        stream.on('data', async (row) => {
          stream.pause();
          try {
            const columns = Object.values(row).map(c => c?.trim() || '');
            // console.log('DEBUG ROW:', columns);
            
            // 1. Detect Header Row
            if (!headersMapped) {
              const hasCollegeName = columns.some(c => c.toLowerCase().includes('college name') || c.toLowerCase().includes('institute name'));
              if (hasCollegeName) {
                console.log('FOUND HEADER ROW:', columns);
                columns.forEach((col, idx) => {
                  const cl = col.toLowerCase();
                  if (cl.includes('college name') || cl.includes('institute name')) columnMap.name = idx;
                  if (cl.includes('city') || cl.includes('location') || cl.includes('district')) columnMap.location = idx;
                  if (cl.includes('nirf') || cl.includes('rank')) columnMap.ranking = idx;
                  if (cl.includes('avg') && cl.includes('place')) columnMap.avgPlacement = idx;
                  if (cl.includes('highest') && cl.includes('pkg') || cl.includes('highest package')) columnMap.highestPlacement = idx;
                  if (cl.includes('cet') || cl.includes('govt')) columnMap.govtFee = idx;
                  if (cl.includes('comedk') || cl.includes('mgmt') || cl.includes('management')) columnMap.mgmtFee = idx;
                });
                headersMapped = true;
                console.log('Mapped College Headers:', columnMap);
              }
            } 
            // 2. Process Data Row
            else {
              const name = columns[columnMap.name];
              if (name && name.length > 3 && !name.toLowerCase().includes('college name') && !name.toLowerCase().includes('institute name')) {
                // Parse rank: "1(Research)\n3(Engg)" -> extract digits
                const rawRank = columns[columnMap.ranking] || '0';
                const ranking = parseInt(rawRank.replace(/[^0-9]/g, '')) || 0;

                // Parse Placements (LPA)
                const avgPl = parseFloat(columns[columnMap.avgPlacement]) || 0;
                const highPl = parseFloat(columns[columnMap.highestPlacement]) || 0;

                // Parse Fees (Lakhs -> Rupees)
                // Note: "8.36" Lakhs -> 836000
                const gFeeRaw = (columns[columnMap.govtFee] || '').replace(/[^0-9.]/g, '');
                const mFeeRaw = (columns[columnMap.mgmtFee] || '').replace(/[^0-9.]/g, '');
                
                // Detection: if it's less than 100, assume it's in Lakhs; otherwise assume it's in Rupees
                const parseFeeValue = (raw) => {
                   const val = parseFloat(raw) || 0;
                   return val > 0 && val < 500 ? val * 100000 : val;
                };

                const govtFee = parseFeeValue(gFeeRaw);
                const mgmtFee = parseFeeValue(mFeeRaw);

                await College.findOneAndUpdate(
                  { name: { $regex: new RegExp(`^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
                  {
                    name: name.trim(),
                    location: columns[columnMap.location] || 'Karnataka',
                    ranking: ranking,
                    placements: {
                      averagePackage: avgPl > 0 && avgPl < 100 ? avgPl * 100000 : avgPl, // Handle LPA vs Rupees
                      highestPackage: highPl > 0 && highPl < 500 ? highPl * 100000 : highPl
                    },
                    fees: {
                      government: govtFee,
                      management: mgmtFee
                    }
                  },
                  { upsert: true, returnDocument: 'after' }
                );
                totalUpdated++;
              }
            }
          } catch (err) {
            console.error('Error updating college row:', err);
          }
          stream.resume();
        });

        stream.on('end', () => {
          try {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          } catch (e) { console.error('Unlink error:', e); }
          resolve();
        });
        stream.on('error', reject);
      });
    }

    res.json({ message: `Successfully updated ${totalUpdated} college detail records.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/colleges/:id', protectAdmin, async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/cutoffs/upload', protectAdmin, upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one file' });
    }

    const examType = req.body.examType || 'KCET';
    const year = Number(req.body.year) || new Date().getFullYear();
    const roundNumber = Number(req.body.roundNumber) || 1;
    
    let totalCutoffsParsed = 0;

    for (const file of req.files) {
      console.log(`Processing file: ${file.originalname}`);
      
      await new Promise((resolve, reject) => {
        let currentCollegeId = null;
        let categoriesList = []; // For KCET format: { name, index }
        let courseHeaders = [];   // For COMEDK/Transposed format: { name, index }
        let isTransposed = false;
        let currentFileCutoffs = 0;

        const stream = fs.createReadStream(file.path)
          .pipe(csv({ headers: false }));

        stream.on('data', async (row) => {
          stream.pause();
          try {
            const columns = Object.values(row).map(c => c?.trim() || '');
            if (columns.length < 3) {
              stream.resume();
              return;
            }

            // 1. Detect Header Row
            const isKCETHeader = columns.some(c => c.toLowerCase().includes('course') && !c.toLowerCase().includes('code'));
            const isCOMEDKHeader = columns[2] && columns[2].toLowerCase().includes('category');

            if (isCOMEDKHeader) {
               isTransposed = true;
               courseHeaders = [];
               for (let j = 3; j < columns.length; j++) {
                 if (columns[j]) courseHeaders.push({ name: columns[j], index: j });
               }
               console.log(`Detected COMEDK Matrix layout with ${courseHeaders.length} courses`);
            } else if (isKCETHeader) {
               isTransposed = false;
               categoriesList = [];
               const targetCats = ['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 'GM', 'GMK', 'GMR', 'SCG', 'SCK', 'SCR', 'STG', 'STK', 'STR', 'KKR'];
               columns.forEach((col, idx) => {
                 const cleaned = col.trim().toUpperCase();
                 if (targetCats.includes(cleaned)) categoriesList.push({ name: cleaned, index: idx });
               });
               console.log(`Detected KCET Tabular layout with ${categoriesList.length} categories`);
            }
            // 2. Detect College Information Row (Block format)
            else if (columns[0].toLowerCase().startsWith('college:')) {
               const collegeText = columns[0].replace(/college:/gi, '').trim();
               const collegeObj = await College.findOneAndUpdate(
                 { name: collegeText },
                 { name: collegeText, location: 'Karnataka' },
                 { upsert: true, new: true }
               );
               currentCollegeId = collegeObj._id;
            }
            // 3. Process Data Row
            else {
              const cutoffs = [];
              
              if (isTransposed && courseHeaders.length > 0) {
                // COMEDK Format: [Code, CollegeName, Category, Rank1, Rank2...]
                const collegeName = columns[1];
                const category = columns[2];
                if (collegeName && (category === 'GM' || category === 'KKR')) {
                  const collegeObj = await College.findOneAndUpdate(
                    { name: collegeName },
                    { name: collegeName, location: 'Karnataka' },
                    { upsert: true, returnDocument: 'after' }
                  );
                  
                  for (const course of courseHeaders) {
                    const rankVal = columns[course.index];
                    if (rankVal && !isNaN(parseFloat(rankVal)) && parseFloat(rankVal) > 0) {
                      cutoffs.push({
                        collegeId: collegeObj._id,
                        examType, year, roundNumber,
                        courseName: course.name,
                        category: category,
                        closingRank: parseFloat(rankVal)
                      });
                    }
                  }
                }
              } else if (!isTransposed && categoriesList.length > 0) {
                // KCET Format: [CourseName, RankGM, RankSC...]
                let activeCollegeId = currentCollegeId;
                if (!activeCollegeId) {
                  const potentialCollege = columns[0] || columns[1];
                  if (potentialCollege && potentialCollege.length > 10) {
                    const collegeObj = await College.findOneAndUpdate(
                      { name: potentialCollege },
                      { name: potentialCollege, location: 'Karnataka' },
                      { upsert: true, returnDocument: 'after' }
                    );
                    activeCollegeId = collegeObj._id;
                  }
                }
                
                if (activeCollegeId) {
                  for (const cat of categoriesList) {
                    const rankVal = columns[cat.index];
                    if (rankVal && !isNaN(parseFloat(rankVal)) && parseFloat(rankVal) > 0) {
                      cutoffs.push({
                        collegeId: activeCollegeId,
                        examType, year, roundNumber,
                        courseName: columns[0],
                        category: cat.name,
                        closingRank: parseFloat(rankVal)
                      });
                    }
                  }
                }
              }

              if (cutoffs.length > 0) {
                await Cutoff.insertMany(cutoffs);
                currentFileCutoffs += cutoffs.length;
              }
            }
          } catch (err) {
            console.error('Row error:', err);
          }
          stream.resume();
        });

        stream.on('end', () => {
          totalCutoffsParsed += currentFileCutoffs;
          console.log(`Finished file. Records created: ${currentFileCutoffs}`);
          try {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          } catch (e) { console.error('Unlink error:', e); }
          resolve();
        });

        stream.on('error', (err) => {
          console.error('Stream error:', err);
          reject(err);
        });
      });
    }

    res.status(200).json({ 
      success: true,
      message: `Successfully parsed ${totalCutoffsParsed} cutoff records across ${req.files.length} files.` 
    });
  } catch (error) {
    console.error('Fatal upload error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Internal Server Error during file process' 
    });
  }
});

module.exports = router;
