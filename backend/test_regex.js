const testString = `City:Bengaluru | District:Bengaluru Urban | VTU Region:Bengaluru | Type:Autonomous Pvt | Tier:Tier 2 | Autonomy:DNA | NIRF Rank (2024-25): 101 | Avg Placement (LPA): 5.0 | Highest Pkg (LPA): 20.0 | Govt/KCET Fees (Rs. Lakhs, 4yr): 3.6 | Mgmt/COMEDK Fees (Rs. Lakhs, 4yr): DNA | Accreditation:NAAC A | NBA:Tier-1 | NAAC Grade:DNA | Established:1988 | University Affiliation:VTU`;

const getMatch = (regex, text) => { const m = text.match(regex); return m ? m[1] : null; };

const patterns = {
    nirf: [/NIRF.*?Rank.*?\b(\d+)/i, /NIRF.*?\b(\d+)/i, /Rank.*?\b(\d+)/i],
    avgPl: [/Avg.*?Placement.*?\b([\d.]+)/i, /Placement.*?\b([\d.]+)/i, /Avg.*?\b([\d.]+)/i],
    highPl: [/Highest.*?Pkg.*?\b([\d.]+)/i, /Highest.*?\b([\d.]+)/i, /Pkg.*?\b([\d.]+)/i],
    gFee: [/Govt.*?Fee.*?\b([\d.]+)/i, /Govt.*?\b([\d.]+)/i, /KCET.*?\b([\d.]+)/i],
    mFee: [/Mgmt.*?Fee.*?\b([\d.]+)/i, /Mgmt.*?\b([\d.]+)/i, /COMEDK.*?\b([\d.]+)/i]
};

console.log('--- Matching Tests ---');
for (const [key, list] of Object.entries(patterns)) {
    console.log(`\nField: ${key}`);
    list.forEach((p, i) => {
        const val = getMatch(p, testString);
        console.log(`  Regex ${i}: ${p} => ${val}`);
    });
}
