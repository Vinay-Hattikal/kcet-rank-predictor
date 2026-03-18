import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import AdPlacement from '../components/AdPlacement';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    examType: 'KCET',
    rank: '',
    category: 'GM',
    branch: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/results', { state: { formData } });
  };

  return (
    <div className="home-page fade-in">
      <Helmet>
        <title>KCET & COMEDK Rank Predictor 2024 | Engineering College Prediction</title>
        <meta name="description" content="Predict your dream engineering college in Karnataka with our advanced KCET & COMEDK Rank Predictor. Specialized for KCET and COMEDK 2024-25 admissions." />
        <meta name="keywords" content="KCET rank predictor, COMEDK college predictor, Karnataka engineering admissions, KCET cutoff 2024, COMEDK rank list, college comparison" />
      </Helmet>

      {/* Hero Section */}
      <section className="hero" style={{ padding: 'clamp(2rem, 10vw, 4rem) 0 3rem' }}>
        <div className="container mobile-center-text">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '1.5rem', display: 'inline-block' }}>
              Updated for 2024-25 Rankings
            </span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.1', marginBottom: '1.5rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
              Find Your <span className="gradient-text">Dream College</span> <br />
              in Karnataka & Beyond
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              Predict your engineering future with precision. Our advanced algorithm uses years of KCET & COMEDK data to find your perfect match.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          {/* Main Predictor Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card glass"
            style={{ padding: '0.5rem' }}
          >
            <div className="card-body">
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Start Your Prediction</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Enter your details below to see where you stand.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Entrance Exam</label>
                    <select name="examType" value={formData.examType} onChange={handleChange} className="form-select" required>
                      <option value="KCET">KCET (Karnataka CET)</option>
                      <option value="COMEDK">COMEDK UGET</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Your Rank</label>
                    <input type="number" name="rank" value={formData.rank} onChange={handleChange} className="form-input" placeholder="Enter Actual Rank" min="1" required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Caste Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="form-select" required>
                      {formData.examType === 'COMEDK' ? (
                        <>
                          <option value="GM">GM (General Merit)</option>
                          <option value="KKR">KKR (Kalyana-Karnataka)</option>
                        </>
                      ) : (
                        <>
                          <option value="GM">GM (General Merit)</option>
                          <option value="GMK">GMK (Kannada Medium)</option>
                          <option value="GMR">GMR (Rural)</option>
                          <option value="SCG">SCG (SC General)</option>
                          <option value="STG">STG (ST General)</option>
                          <option value="1G">Category 1</option>
                          <option value="2AG">Category 2A</option>
                          <option value="3AG">Category 3A</option>
                          <option value="3BG">Category 3B</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Preferred Branch</label>
                    <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="form-input" placeholder="e.g. CS, AI, Mech" />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="btn btn-primary w-full" 
                  style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}
                >
                  Analyze My Chances
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Ad Placement */}
          <AdPlacement type="horizontal" />

          {/* Feature Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            <div className="card glass" style={{ padding: '1.5rem' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Data Driven</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Powered by official 2023 and 2024 cutoff data for maximum accuracy.</p>
            </div>
            
            <div className="card glass" style={{ padding: '1.5rem' }}>
              <div style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Secure & Fast</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Instant reports generated in milliseconds. Your data privacy is our priority.</p>
            </div>
            
            <div className="card glass" style={{ padding: '1.5rem' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Community First</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Built by students, for students. Helping thousands find their path every year.</p>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .home-page { min-height: 100vh; }
        .hero { background: radial-gradient(circle at top right, var(--primary-light), transparent 60%); }
      `}} />
    </div>
  );
};

export default Home;
