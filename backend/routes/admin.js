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

// @route DELETE /api/admin/colleges
router.delete('/colleges', protectAdmin, async (req, res) => {
  try {
    await College.deleteMany({});
    await Cutoff.deleteMany({});
    res.json({ message: 'All college and cutoff data cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/admin/cutoffs
router.delete('/cutoffs', protectAdmin, async (req, res) => {
  try {
    await Cutoff.deleteMany({});
    res.json({ message: 'All cutoff data cleared successfully' });
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
        let insideCollegeBlock = false;
        let currentCollegeId = null;

        const stream = fs.createReadStream(file.path)
          .pipe(csv({ headers: false }));

        stream.on('data', async (row) => {
          stream.pause();
          try {
            const columns = Object.values(row).map(c => c?.trim() || '');
            
            // Log for forensics
            console.log(`[CSV Data] Row: ${columns.slice(0, 2).join(' | ')}...`);

            // Detect Combined Format "College:" header - search ANY column
            const collegeCol = columns.find(c => c && c.toLowerCase().includes('college:'));
            
            if (collegeCol) {
              console.log('Detection: Found College Header ->', collegeCol);
              insideCollegeBlock = true;
              const rawName = collegeCol.split(/college:/i)[1]?.trim();
              if (rawName) {
                const normalize = (text) => text.replace(/^[A-Z]\d{3}\s+/i, '').split(',')[0].replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim();
                const cleanName = normalize(rawName);
                
                const collegeObj = await College.findOneAndUpdate(
                  { name: { $regex: new RegExp(`^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\./g, '\\.?')}$`, 'i') } },
                  { 
                    name: cleanName, 
                    location: 'Karnataka',
                    slug: cleanName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
                  },
                  { upsert: true, new: true }
                );
                currentCollegeId = collegeObj._id;
                totalUpdated++;
              }
            } 
            // Detect Combined Format "Metadata Row"
            else if (insideCollegeBlock && columns.some(c => c && (c.toLowerCase().includes('placement') || c.toLowerCase().includes('nirf'))) && currentCollegeId) {
                const fullText = columns.join(' | ');
                const segments = fullText.split(/[|]|\t/).map(s => s.trim());
                console.log('Detection: Metadata Segments ->', JSON.stringify(segments));
                
                const getMatch = (regex, text) => { const m = text.match(regex); return m ? m[1] : null; };
                
                let nirf = null, avgPl = null, highPl = null, gFee = null, mFee = null, location = null;

                segments.forEach(seg => {
                    const s = seg.toLowerCase();
                    if (s.includes('nirf') || (s.includes('rank') && !s.includes('pkg'))) nirf = nirf || getMatch(/:\s*(\d+)/, seg);
                    if (s.includes('avg') && s.includes('place')) avgPl = avgPl || getMatch(/:\s*([\d.]+)/, seg);
                    if (s.includes('highest') && (s.includes('pkg') || s.includes('place'))) highPl = highPl || getMatch(/:\s*([\d.]+)/, seg);
                    if (s.includes('govt') || s.includes('cet')) gFee = gFee || getMatch(/:\s*([\d.]+)/, seg);
                    if (s.includes('mgmt') || s.includes('comedk')) mFee = mFee || getMatch(/:\s*([\d.]+)/, seg);
                    if (s.includes('city')) location = location || getMatch(/:\s*([^|]+)/, seg);
                });

                console.log('Extracted Values (Segmented):', { nirf, avgPl, highPl, gFee, mFee, location });

                const updateObj = {};
                if (nirf) updateObj.ranking = parseInt(nirf);
                if (location) updateObj.location = location.trim();
                
                if (avgPl && !isNaN(parseFloat(avgPl))) updateObj['placements.averagePackage'] = parseFloat(avgPl) * 100000;
                if (highPl && !isNaN(parseFloat(highPl))) updateObj['placements.highestPackage'] = parseFloat(highPl) * 100000;
                if (gFee && !isNaN(parseFloat(gFee))) updateObj['fees.government'] = parseFloat(gFee) * 100000;
                if (mFee && !isNaN(parseFloat(mFee))) updateObj['fees.management'] = parseFloat(mFee) * 100000;

                if (Object.keys(updateObj).length > 0) {
                  await College.findByIdAndUpdate(currentCollegeId, updateObj);
                }
            }
            // Traditional Column-based format
            else {
              if (!headersMapped) {
                const hasCollegeName = columns.some(c => c.toLowerCase().includes('college name') || c.toLowerCase().includes('institute name'));
                if (hasCollegeName) {
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
                }
              } 
              else {
                const name = columns[columnMap.name];
                if (name && name.length > 3 && !name.toLowerCase().includes('college name') && !name.toLowerCase().includes('institute name')) {
                  const rawRank = (columns[columnMap.ranking] || '0').toString();
                  const rankingMatch = rawRank.match(/^(\d+)/);
                  const ranking = rankingMatch ? parseInt(rankingMatch[1]) : 0;
                  const avgPl = parseFloat(columns[columnMap.avgPlacement]) || 0;
                  const highPl = parseFloat(columns[columnMap.highestPlacement]) || 0;
                  const gFeeRaw = (columns[columnMap.govtFee] || '').replace(/[^0-9.]/g, '');
                  const mFeeRaw = (columns[columnMap.mgmtFee] || '').replace(/[^0-9.]/g, '');
                  
                  const parseFeeValue = (raw) => {
                     const val = parseFloat(raw) || 0;
                     return val > 0 && val < 500 ? val * 100000 : val;
                  };

                  const govtFee = parseFeeValue(gFeeRaw);
                  const mgmtFee = parseFeeValue(mFeeRaw);
                  const normalizedName = name.trim().replace(/\s+/g, ' ');

                  await College.findOneAndUpdate(
                    { name: { $regex: new RegExp(`^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\./g, '\\.?')}$`, 'i') } },
                    {
                      name: normalizedName,
                      location: columns[columnMap.location] || 'Karnataka',
                      ranking: ranking,
                      placements: {
                        averagePackage: avgPl > 0 && avgPl < 100 ? avgPl * 100000 : avgPl,
                        highestPackage: highPl > 0 && highPl < 500 ? highPl * 100000 : highPl
                      },
                      fees: {
                        government: govtFee,
                        management: mgmtFee
                      },
                      slug: normalizedName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
                    },
                    { upsert: true, returnDocument: 'after' }
                  );
                  totalUpdated++;
                }
              }
            }
          } catch (err) {
            console.error('Error updating college row:', err);
          }
          stream.resume();
        });

        stream.on('end', () => {
          try { if (fs.existsSync(file.path)) fs.unlinkSync(file.path); } catch (e) {}
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
      await new Promise((resolve, reject) => {
        let isTransposed = false;
        let categoriesList = [];
        let courseHeaders = [];
        let currentCollegeId = null;
        let currentFileCutoffs = 0;
        let batchOps = [];
        const BATCH_SIZE = 500;

        const stream = fs.createReadStream(file.path).pipe(csv({ headers: false }));

        stream.on('data', async (row) => {
          stream.pause();
          try {
            const columns = Object.values(row).map(c => c?.trim() || '');
            const isCOMEDKHeader = columns[2] && columns[2].toLowerCase().includes('category');
            const isKCETHeader = columns.some(c => ['1G', '2AG', 'GM', 'SCG'].includes(c.trim().toUpperCase()));

            if (isCOMEDKHeader) {
               isTransposed = true;
               courseHeaders = [];
               columns.forEach((col, idx) => { if (idx > 2 && col.trim()) courseHeaders.push({ name: col.trim(), index: idx }); });
            } else if (isKCETHeader) {
               isTransposed = false;
               categoriesList = [];
               const targetCats = ['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 'GM', 'GMK', 'GMR', 'GMP', 'SCG', 'SCK', 'SCR', 'STG', 'STK', 'STR', 'KKR', 'NRI', 'OPN', 'OTH'];
               columns.forEach((col, idx) => {
                 const cleaned = col.trim().toUpperCase();
                 if (targetCats.includes(cleaned)) categoriesList.push({ name: cleaned, index: idx });
               });
            } else if (columns.some(c => c && c.trim().toLowerCase().includes('college:'))) {
               insideCollegeBlock = true;
               const targetCol = columns.find(c => c && c.trim().toLowerCase().includes('college:'));
               let rawText = targetCol.split(/college:/i)[1]?.trim();
               if (!rawText) return;

               // Robust Normalization: Remove "E003 ", "B.M.S", addresses after comma, etc.
               const normalize = (text) => {
                 return text
                   .replace(/^[A-Z]\d{3}\s+/i, '') // Remove "E003 "
                   .split(',')[0]                 // Take before first comma
                   .replace(/\[.*?\]/g, '')       // Remove [AUTONOMOUS]
                   .replace(/\s+/g, ' ')
                   .trim();
               };
               
               const cleanName = normalize(rawText);
               console.log('Detection (Cutoffs): Found College ->', cleanName);
               const collegeObj = await College.findOneAndUpdate(
                 { name: { $regex: new RegExp(`^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\./g, '\\.?')}$`, 'i') } },
                 { 
                   name: cleanName, 
                   location: 'Karnataka',
                   slug: cleanName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
                 },
                 { upsert: true, new: true }
               );
               currentCollegeId = collegeObj._id;
            }
            else if (insideCollegeBlock && columns.some(c => c && (c.toLowerCase().includes('placement') || c.toLowerCase().includes('nirf'))) && currentCollegeId) {
                const fullText = columns.join(' | ');
                const segments = fullText.split(/[|]|\t/).map(s => s.trim());
                console.log('Detection (Cutoffs): Metadata Segments ->', JSON.stringify(segments));
                
                const getMatch = (regex, text) => { const m = text.match(regex); return m ? m[1] : null; };
                
                let nirf = null, avgPl = null, highPl = null, gFee = null, mFee = null, location = null;

                segments.forEach(seg => {
                    const s = seg.toLowerCase();
                    if (s.includes('nirf') || (s.includes('rank') && !s.includes('pkg'))) nirf = nirf || getMatch(/:\s*(\d+)/, seg);
                    if (s.includes('avg') && s.includes('place')) avgPl = avgPl || getMatch(/:\s*([\d.]+)/, seg);
                    if (s.includes('highest') && (s.includes('pkg') || s.includes('place'))) highPl = highPl || getMatch(/:\s*([\d.]+)/, seg);
                    if (s.includes('govt') || s.includes('cet')) gFee = gFee || getMatch(/:\s*([\d.]+)/, seg);
                    if (s.includes('mgmt') || s.includes('comedk')) mFee = mFee || getMatch(/:\s*([\d.]+)/, seg);
                    if (s.includes('city')) location = location || getMatch(/:\s*([^|]+)/, seg);
                });

                console.log('Extracted Values (Cutoffs Segmented):', { nirf, avgPl, highPl, gFee, mFee, location });

                const updateObj = {};
                if (nirf) updateObj.ranking = parseInt(nirf);
                if (location) updateObj.location = location.trim();
                
                if (avgPl && !isNaN(parseFloat(avgPl))) updateObj['placements.averagePackage'] = parseFloat(avgPl) * 100000;
                if (highPl && !isNaN(parseFloat(highPl))) updateObj['placements.highestPackage'] = parseFloat(highPl) * 100000;
                if (gFee && !isNaN(parseFloat(gFee))) updateObj['fees.government'] = parseFloat(gFee) * 100000;
                if (mFee && !isNaN(parseFloat(mFee))) updateObj['fees.management'] = parseFloat(mFee) * 100000;

                if (Object.keys(updateObj).length > 0) {
                    await College.findByIdAndUpdate(currentCollegeId, updateObj);
                }
            }
            else {
               const firstCol = columns[0]?.trim();
               const isHeaderRow = firstCol && firstCol.toLowerCase().includes('course');
               const isValidDataRow = firstCol && firstCol.length > 3 && !isHeaderRow && !firstCol.toLowerCase().includes('college:');
               
               if (isValidDataRow) {
                 const courseName = firstCol.replace(/\s+/g, ' ').trim();
                 
                 // Auto-populate coursesOffered in the College model
                 if (currentCollegeId) {
                   await College.findByIdAndUpdate(currentCollegeId, { $addToSet: { coursesOffered: courseName } });
                 }

                 if (isTransposed && courseHeaders.length > 0) {
                   const rawName = columns[1];
                   const category = columns[2];
                   if (rawName && (category === 'GM' || category === 'KKR')) {
                     const normalize = (text) => text.replace(/^[A-Z]\d{3}\s+/i, '').split(',')[0].replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim();
                     const cleanName = normalize(rawName);

                     const collegeObj = await College.findOneAndUpdate(
                       { name: { $regex: new RegExp(`^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\./g, '\\.?')}$`, 'i') } },
                       { 
                         name: cleanName, 
                         location: 'Karnataka',
                         slug: cleanName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
                       },
                       { upsert: true, returnDocument: 'after' }
                     );
                     
                     // Auto-populate coursesOffered for transposed too
                     const courseNameTransposed = columns[0].trim(); // Actually in transposed, course might be different? Wait.
                     // In transposed, columns[0] is usually the row identifier or something.
                     // Let's stick to the current logic for transposed headers.

                     for (const course of courseHeaders) {
                       const rankVal = columns[course.index];
                       if (rankVal && !isNaN(parseFloat(rankVal)) && parseFloat(rankVal) > 0) {
                         const filter = { collegeId: collegeObj._id, examType, year, roundNumber, courseName: course.name.trim(), category };
                         batchOps.push({ updateOne: { filter, update: { ...filter, closingRank: parseFloat(rankVal) }, upsert: true } });
                       }
                     }
                   }
                 } else if (!isTransposed && categoriesList.length > 0 && currentCollegeId) {
                   for (const cat of categoriesList) {
                     const rankVal = columns[cat.index];
                     if (rankVal && !isNaN(parseFloat(rankVal)) && parseFloat(rankVal) > 0) {
                       const filter = { collegeId: currentCollegeId, examType, year, roundNumber, courseName, category: cat.name };
                       batchOps.push({ updateOne: { filter, update: { ...filter, closingRank: parseFloat(rankVal) }, upsert: true } });
                     }
                   }
                 }
               }
               if (batchOps.length >= BATCH_SIZE) {
                 await Cutoff.bulkWrite(batchOps);
                 currentFileCutoffs += batchOps.length;
                 batchOps = [];
               }
            }
          } catch (err) { console.error('Row error:', err); }
          stream.resume();
        });

        stream.on('end', async () => {
          try {
            if (batchOps.length > 0) { await Cutoff.bulkWrite(batchOps); currentFileCutoffs += batchOps.length; }
            totalCutoffsParsed += currentFileCutoffs;
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            resolve();
          } catch (err) { reject(err); }
        });
        stream.on('error', reject);
      });
    }
    res.status(200).json({ success: true, message: `Successfully parsed ${totalCutoffsParsed} cutoff records.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
