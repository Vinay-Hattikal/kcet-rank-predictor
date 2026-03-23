# 🎓 Smart College Predictor (KCET & COMEDK)

A premium, data-driven college prediction platform designed specifically for students in Karnataka and beyond. This project features a modern, responsive UI with Glassmorphism, staggered animations, and a robust admin dashboard for data management.

## 🚀 Key Features
- **Precise Predictions**: Uses historical KCET & COMEDK cutoff data to predict admission chances.
- **Side-by-Side Comparison**: Compare up to 4 colleges based on placements, fees, and location.
- **Premium UI/UX**: Built with HSL color palettes, Glassmorphism, and smooth Framer Motion animations.
- **Mobile First**: Fully responsive design verified on various viewports.
- **Admin Portal**: Secure dashboard for uploading CSV data and managing college metadata.
- **PDF Reports**: Stamped prediction reports ready for student download.
- **Monetization Ready**: Integrated Google AdSense placeholders.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Framer Motion, Axios, HSL CSS Layers.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT-based secure admin access.
- **PDF Generation**: html2canvas & jsPDF.

---

## 🏗️ Building From Scratch

### 1. Project Initialization
```bash
# Initialize Vite Frontend
npx create-vite frontend --template react
# Initialize Backend
mkdir backend && cd backend && npm init -y
```

### 2. Dependency Setup
**Frontend**: `npm install axios framer-motion react-router-dom html2canvas jspdf`
**Backend**: `npm install express mongoose dotenv cors jsonwebtoken bcryptjs`

### 3. Database Schema
Defined models for `College`, `Cutoff`, and `User` in MongoDB.
- **College**: Stores metadata like placements (average/highest), fees, and ranking.
- **Cutoff**: Stores round-wise ranks for various categories (GM, 2AG, etc.) and branches.

### 4. Admin Seeding
A custom script `seedAdmin.js` was created to initialize the first administrator:
- **Email**: `admin@collegepredictor.com`
- **Password**: `admin123`

### 5. Frontend Architecture
- **Navbar**: Responsive component with mobile triggers.
- **Glassmorphism Logic**: Defined in `index.css` via custom utility classes.
- **Prediction Logic**: Front-to-back communication with categoric filters for KCET/COMEDK.

---

## 📦 Deployment Guide

### Backend (e.g., Render or DigitalOcean)
1. Set up a MongoDB Atlas cluster.
2. In your deployment platform, add environment variables:
   - `MONGO_URI`: Your Atlas connection string.
   - `JWT_SECRET`: A secure random string for tokens.
   - `PORT`: 5000 (usually default).
3. Connect your GitHub repository and point to the `backend/server.js`.

### Frontend (e.g., Vercel or Netlify)
1. Import the `frontend` directory.
2. Configure **Vite Proxy** or set `BASE_URL` for API calls in production.
3. Build Command: `npm run build`
4. Output Directory: `dist`

---

## 🔒 Security & Best Practices
- **Environment Variables**: Never commit your `.env` file. Use the `.env.example` as a template.
- **Data Integrity**: Admin-only routes are protected by JWT middleware.
- **Responsive Audit**: All pages were audited using simulated mobile devices to ensure zero alignment issues.

---

## 📝 Disclaimer
These prediction results are generated based on historical cutoff trends and should be used for reference purposes only. College rankings and admission thresholds are subject to significant year-on-year variations. We strongly recommend verifying all information with official counseling authorities.


