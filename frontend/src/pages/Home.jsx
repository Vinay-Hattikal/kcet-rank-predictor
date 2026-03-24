import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import axios from 'axios';
import AdPlacement from '../components/AdPlacement';
import CollegeSearch from '../components/CollegeSearch';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  ChevronRight, 
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  BarChart,
  CheckCircle2,
  Instagram
} from 'lucide-react';

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
    const cleanData = {
      ...formData,
      rank: formData.rank ? Math.round(Number(formData.rank)) : ''
    };
    navigate('/results', { state: { formData: cleanData } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="home-page fade-in">
      <SEO
        title="KCET & COMEDK Rank Predictor 2024"
        description="Predict your dream engineering college in Karnataka with Rank2College. Get accurate admission chances based on KCET & COMEDK 2024-25 historical cutoff trends."
      />

      {/* Hero Section */}
      <section className="hero-premium" style={{ padding: 'clamp(5rem, 10vw, 8rem) 0 4rem', position: 'relative' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '2rem', gap: '0.5rem', padding: '0.5rem 1.25rem' }}>
              <Sparkles size={16} /> Updated for 2026 KCET & COMEDK
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', lineHeight: '1.1', marginBottom: '1.5rem', fontWeight: '900', letterSpacing: '-0.04em' }}>
              KCET &amp; COMEDK <span className="gradient-text">College Predictor 2026</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 3rem', fontWeight: 500, lineHeight: 1.5 }}>
              Precision predictions powered by official KCET & COMEDK historical data. Start your engineering journey with confidence.
            </p>

            <motion.div 
              className="glass-card"
              style={{ maxWidth: '800px', margin: '0 auto 1.5rem', padding: '0.75rem', borderRadius: 'var(--radius-xl)', position: 'relative', zIndex: 100 }}
              whileHover={{ scale: 1.01 }}
            >
              <CollegeSearch />
            </motion.div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Search any college to check specific round-wise cutoffs instantly.
            </p>

            {/* Trust Badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              {[{ icon: '✅', label: '100% Free' }, { icon: '🔒', label: 'No Signup Required' }, { icon: '📊', label: 'Official Cutoff Data' }, { icon: '⚡', label: 'Instant Results' }].map(badge => (
                <span key={badge.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '50px', padding: '0.4rem 1rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', boxShadow: 'var(--shadow-sm)' }}>
                  {badge.icon} {badge.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <div className="container" style={{ marginTop: '-4rem', marginBottom: '4rem', position: 'relative', zIndex: 10 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card" 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.5rem', lineHeight: 1 }}>50K+</div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Predictions Made</div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }} className="stat-border">
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--secondary-dark)', marginBottom: '0.5rem', lineHeight: 1 }}>200+</div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Colleges Tracked</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1 }}>98%</div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accuracy Rate</div>
          </div>
        </motion.div>
      </div>

      <div className="container" style={{ maxWidth: '1100px', paddingTop: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem' }}>

          {/* Main Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            
            {/* Predictor Form Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card glass-card"
              style={{ padding: '1rem', border: 'none', boxShadow: 'var(--shadow-lg)' }}
            >
              <div className="card-body">
                <div style={{ marginBottom: '2.5rem' }}>
                  <div className="icon-box" style={{ marginBottom: '1.25rem' }}><Target size={20} /></div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Smart Predictor</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>Enter your exam details to get personalized recommendations.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.6rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Entrance Exam</label>
                      <select name="examType" value={formData.examType} onChange={handleChange} className="form-select" required style={{ borderRadius: 'var(--radius-md)' }}>
                        <option value="KCET">KCET (Karnataka CET)</option>
                        <option value="COMEDK">COMEDK UGET</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.6rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Rank</label>
                      <input type="number" name="rank" value={formData.rank} onChange={handleChange} className="form-input" placeholder="e.g. 15000" min="1" required style={{ borderRadius: 'var(--radius-md)' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.6rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Caste Category</label>
                      <select name="category" value={formData.category} onChange={handleChange} className="form-select" required style={{ borderRadius: 'var(--radius-md)' }}>
                        {formData.examType === 'COMEDK' ? (
                          <>
                            <option value="GM">GM (General Merit)</option>
                            <option value="KKR">KKR (Kalyana-Karnataka)</option>
                          </>
                        ) : (
                          <>
                            <option value="GM">GM (General Merit)</option>
                            <option value="SCG">SCG (SC General)</option>
                            <option value="STG">STG (ST General)</option>
                            <option value="KKR">KKR (Kalyana Karnataka)</option>
                            {/* Shortened for brevity in Home view - complete list remains in state logic */}
                            <option value="2AG">2AG (Category 2A)</option>
                            <option value="3AG">3AG (Category 3A)</option>
                            <option value="1G">1G (Category 1)</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.6rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preferred Branch</label>
                      <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="form-input" placeholder="e.g. Computer Science" required style={{ borderRadius: 'var(--radius-md)' }} />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', marginTop: '1rem', borderRadius: 'var(--radius-md)' }}
                  >
                    Analyze My Chances <ArrowRight size={20} />
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Premium Expert Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card hero-premium"
              style={{ border: 'none', color: 'var(--text-main)', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}
            >
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="badge" style={{ backgroundColor: 'black', color: 'gold', border: 'none', marginBottom: '1.5rem' }}>
                  Premium Counseling 2024
                </span>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                  Don’t Guess. <br /><span className="gradient-text">Secure Your Future.</span>
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.5, opacity: 0.9, fontWeight: 500, marginBottom: '2.5rem' }}>
                  Get a personalized 1-on-1 strategy report and choice entry guidance from Karnataka's admission specialists.
                </p>

                <ul style={{ padding: 0, margin: '0 0 3rem 0', listStyle: 'none', display: 'grid', gap: '1rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 700 }}>
                    <div className="icon-box" style={{ width: '28px', height: '28px', background: 'rgba(0,0,0,0.05)', color: 'black' }}><ShieldCheck size={16} /></div>
                    Custom Choice Entry List
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 700 }}>
                    <div className="icon-box" style={{ width: '28px', height: '28px', background: 'rgba(0,0,0,0.05)', color: 'black' }}><Users size={16} /></div>
                    Personalized Rank Analysis
                  </li>
                </ul>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '2rem' }}>
                  <div>
                    <span style={{ fontSize: '2rem', fontWeight: 900 }}>₹500</span>
                    <span style={{ fontSize: '0.85rem', opacity: 0.7, marginLeft: '6px', fontWeight: 700 }}>FULL PERIOD</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate('/premium-counseling')}
                    className="btn btn-primary"
                    style={{ borderRadius: 'var(--radius-md)', padding: '1rem 2rem' }}
                  >
                    Apply Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          <AdPlacement id="home-mid" />

          {/* How It Works Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '5rem', textAlign: 'center' }}
          >
            <div className="badge" style={{ margin: '0 auto 1.5rem', background: 'var(--primary-light)', color: 'var(--primary)', display: 'inline-flex' }}>Simple Process</div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '3rem' }}>How It Works</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', position: 'relative' }}>
               <div className="glass-card" style={{ padding: '2.5rem 2rem', position: 'relative', zIndex: 1, borderTop: '4px solid var(--primary)' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.25rem', fontWeight: 900 }}>1</div>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Enter Details</h3>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5 }}>Provide your expected rank, category, and preferred exam board securely.</p>
               </div>
               <div className="glass-card" style={{ padding: '2.5rem 2rem', position: 'relative', zIndex: 1, borderTop: '4px solid var(--secondary)' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--secondary-light)', color: 'var(--secondary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.25rem', fontWeight: 900 }}>2</div>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>AI Analysis</h3>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5 }}>Our system matches your profile against thousands of official historical cutoffs.</p>
               </div>
               <div className="glass-card" style={{ padding: '2.5rem 2rem', position: 'relative', zIndex: 1, borderTop: '4px solid var(--text-main)' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.25rem', fontWeight: 900 }}>3</div>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Get Results</h3>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5 }}>Receive a customized list of target, reach, and safe colleges instantly.</p>
               </div>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}
          >
            <motion.div variants={itemVariants} className="card glass-card" style={{ padding: '2rem', border: 'none' }}>
              <div className="icon-box" style={{ marginBottom: '1.5rem', width: '48px', height: '48px' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Verified Accuracy</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>Powered by official 2024-2025 counseling data for maximum reliability.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="card glass-card" style={{ padding: '2rem', border: 'none' }}>
              <div className="icon-box" style={{ marginBottom: '1.5rem', width: '48px', height: '48px', background: 'var(--secondary-light)', color: 'var(--secondary-dark)' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Instant Analysis</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>Get recursive round-wise predictions in milliseconds. Fast & lightweight.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="card glass-card" style={{ padding: '2rem', border: 'none' }}>
              <div className="icon-box" style={{ marginBottom: '1.5rem', width: '48px', height: '48px' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Student Centric</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>Designed by alumni of top institutes to simplify the counseling maze.</p>
            </motion.div>
          </motion.div>
        </div>
          {/* Instagram Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 2rem',
              textAlign: 'center',
              color: '#fff',
              marginBottom: '4rem'
            }}
          >
            <Instagram size={40} style={{ marginBottom: '1rem', opacity: 0.9 }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>Follow Us on Instagram</h2>
            <p style={{ opacity: 0.9, fontSize: '1.05rem', fontWeight: 500, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
              Get daily KCET & COMEDK tips, cutoff updates, and counseling advice straight to your feed.
            </p>
            <motion.a
              href="https://www.instagram.com/mycetguide"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: '#fff',
                color: '#833ab4',
                padding: '0.85rem 2rem',
                borderRadius: '50px',
                fontWeight: '800',
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}
            >
              <Instagram size={20} /> @mycetguide
            </motion.a>
          </motion.div>

      </div>
      
      {/* Sticky Mobile CTA */}
      <div className="sticky-mobile-cta">
        <a href="#predictor-form"
          onClick={(e) => { e.preventDefault(); document.querySelector('.card.glass-card')?.scrollIntoView({ behavior: 'smooth' }); }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '1rem', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer', textDecoration: 'none', borderRadius: '0' }}
        >
          ⚡ Predict My College — Free
        </a>
      </div>

      <style>{`
        .home-page { min-height: 100vh; background: var(--bg-color); }
        .hero-premium { position: relative; }
        @media (max-width: 768px) {
          .stat-border { border-left: none !important; border-right: none !important; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 1.5rem 0; }
          .sticky-mobile-cta { display: block; position: fixed; bottom: 0; left: 0; right: 0; z-index: 999; box-shadow: 0 -4px 20px rgba(0,0,0,0.15); }
        }
        @media (min-width: 769px) {
          .sticky-mobile-cta { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Home;
