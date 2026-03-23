
const csv = require('csv-parser');
const fs = require('fs');
const stream = require('stream');

const testCsv = `College: E001 University of Visvesvaraya College of Engineering (A State Autonomous Public University on IIT Model) K R Circle, Bangalore
Course Name,1G,1K,1R,2AG,2AK,2AR,2BG,2BK,2BR,3AG,3AK,3AR,3BG,3BK,3BR,GM,GMK,GMR,GMP,SCG,SCK,SCR,STG,STK,STR
ARTIFICIAL INTELLIGENCE AN,7802,--,--,8424,--,--,9558,11781,--,--,--,--,6904,--,--,6889,9379,--,7574,--,--,26425,41199,33087,25226,--,27201
CIVIL ENGINEERING,77408,--,96372,78404,94879,89482,74579,--,79602,63732,--,--,63278,80218,--,71645,88840.5,61622,--,69924,--,--,84098,119598,93876,112510,--,127611
COMPUTER SCIENCE AND ENG,6520,9347,7462,7544,9881,8120,10476,--,--,5200,--,--,5005,--,--,5723,7871,--,5713,--,--,24490,39060,29024,17552,--,19055
College: E002 Govt.S K S J T Institute of Engineering, Bangalore AMBEDKAR VEEDHI, K.R. CIRCLE, BANGALORE-01
Course Name,1G,1K,1R,2AG,2AK,2AR,2BG,2BK,2BR,3AG,3AK,3AR,3BG,3BK,3BR,GM,GMK,GMR,GMP,SCG,SCK,SCR,STG,STK,STR
CIVIL ENGINEERING,143668,--,--,136248,145540,151931,103223,--,--,108642,--,--,97522,--,--,112853,89550,94744,--,--,--,131895,139264,138771,162948,--,205515`;

fs.writeFileSync('test.csv', testCsv);

const processCsv = () => {
    return new Promise((resolve, reject) => {
        let isTransposed = false;
        let courseHeaders = [];
        let categoriesList = [];
        let insideCollegeBlock = false;
        let currentCollegeId = "MOCK_COLLEGE_ID";
        
        fs.createReadStream('test.csv')
          .pipe(csv({ headers: false }))
          .on('data', async (row) => {
            try {
              let columns = Object.values(row).map(c => c?.trim() || '');
              
              if (columns.length === 1 && columns[0].includes(';') && !columns[0].includes(',')) {
                columns = columns[0].split(';').map(c => c.trim());
              }
              const isCOMEDKHeader = columns[2] && columns[2].toLowerCase().includes('category');
              const isKCETHeader = columns.some(c => ['1G', '2AG', 'GM', 'SCG'].includes(c.trim().toUpperCase()));

              if (isCOMEDKHeader) {
                 isTransposed = true;
              } else if (isKCETHeader) {
                 isTransposed = false;
                 categoriesList = [];
                 const targetCats = ['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 'GM', 'GMK', 'GMR', 'GMP', 'SCG', 'SCK', 'SCR', 'STG', 'STK', 'STR', 'KKR', 'NRI', 'OPN', 'OTH'];
                 columns.forEach((col, idx) => {
                   const cleaned = col.trim().toUpperCase();
                   if (targetCats.includes(cleaned)) categoriesList.push({ name: cleaned, index: idx });
                 });
                 console.log('Detected KCET categories:', categoriesList.length);
              } else if (columns.some(c => c && c.trim().toLowerCase().includes('college:'))) {
                 insideCollegeBlock = true;
                 const targetCol = columns.find(c => c && c.trim().toLowerCase().includes('college:'));
                 let rawText = targetCol.split(/college:/i)[1]?.trim();
                 if (!rawText) return;

                 const normalize = (text) => {
                   return text.replace(/^[A-Z]\d{3}\s+/i, '').split(',')[0].replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim();
                 };
                 const cleanName = normalize(rawText);
                 console.log('Detected College:', cleanName);
                 currentCollegeId = "MOCK_" + cleanName.substring(0, 5);
              }
              else {
                 const firstCol = columns[0]?.trim();
                 const isHeaderRow = firstCol && firstCol.toLowerCase().includes('course');
                 const isValidDataRow = firstCol && firstCol.length > 3 && !isHeaderRow && !firstCol.toLowerCase().includes('college:');
                 
                 if (isValidDataRow) {
                   const courseName = firstCol.replace(/\s+/g, ' ').trim();
                   if (!isTransposed && categoriesList.length > 0 && currentCollegeId) {
                      for (const cat of categoriesList) {
                        const rankVal = columns[cat.index];
                        if (rankVal && !isNaN(parseFloat(rankVal)) && parseFloat(rankVal) > 0) {
                          // mock batchOps push
                        }
                      }
                   }
                   console.log('Processed row for:', courseName);
                 }
              }
            } catch (e) {
              console.error('Error on row:', row, e);
            }
          })
          .on('end', () => resolve())
          .on('error', reject);
    });
};

processCsv().then(() => console.log('Done')).catch(console.error);
