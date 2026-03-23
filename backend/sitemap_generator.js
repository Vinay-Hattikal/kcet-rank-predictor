const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const College = require('./models/College');

async function generateSitemap() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const colleges = await College.find({}, 'slug');
        
        const domain = 'https://yourdomain.com'; // User should change this
        const date = new Date().toISOString().split('T')[0];

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Static Pages
        const staticPages = ['', '/compare', '/predict', '/premium'];
        staticPages.forEach(page => {
            xml += `  <url>\n    <loc>${domain}${page}</loc>\n    <lastmod>${date}</lastmod>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
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
