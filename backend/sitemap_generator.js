const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const College = require('./models/College');

async function generateSitemap() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const colleges = await College.find({}, 'slug');
        
        const domain = 'https://rank2college.in'; 
        const date = new Date().toISOString().split('T')[0];

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Static Pages
        const staticPages = ['', '/kcet-college-predictor', '/comedk-college-predictor', '/compare', '/premium-counseling', '/blog', '/about', '/contact'];
        staticPages.forEach(page => {
            xml += `  <url>\n    <loc>${domain}${page}</loc>\n    <lastmod>${date}</lastmod>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
        });

        // Dynamic Blog Posts
        const blogSlugs = [
            'kcet-2026-counseling-step-by-step-guide',
            'understanding-snq-quota-kcet-2026',
            'top-10-engineering-colleges-bangalore-placements'
        ];
        blogSlugs.forEach(slug => {
            xml += `  <url>\n    <loc>${domain}/blog/${slug}</loc>\n    <lastmod>${date}</lastmod>\n    <priority>0.7</priority>\n  </url>\n`;
        });

        // Programmatic Rank Range Pages
        const exams = ['kcet', 'comedk'];
        const ranges = [
            { min: 1, max: 10000 },
            { min: 10000, max: 20000 },
            { min: 20000, max: 40000 },
            { min: 40000, max: 60000 },
            { min: 60000, max: 80000 },
            { min: 80000, max: 120000 }
        ];

        exams.forEach(exam => {
            ranges.forEach(range => {
                xml += `  <url>\n    <loc>${domain}/colleges-for-${exam}-rank-${range.min}-to-${range.max}</loc>\n    <lastmod>${date}</lastmod>\n    <priority>0.6</priority>\n  </url>\n`;
            });
        });

        // Dynamic College Pages
        colleges.forEach(college => {
            xml += `  <url>\n    <loc>${domain}/college/${college.slug}</loc>\n    <lastmod>${date}</lastmod>\n    <priority>0.7</priority>\n  </url>\n`;
        });

        xml += '</urlset>';

        const publicDir = path.join(__dirname, '../frontend/public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
        console.log(`Sitemap generated successfully in ${publicDir}/sitemap.xml`);
        
        mongoose.connection.close();
    } catch (err) {
        console.error('Sitemap generation failed:', err);
        process.exit(1);
    }
}

generateSitemap();
