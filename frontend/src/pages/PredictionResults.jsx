import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { 
  Download, 
  ChevronLeft, 
  Trophy, 
  MapPin, 
  Sparkles,
  Search,
  AlertCircle,
  FileText
} from 'lucide-react';
import AdPlacement from '../components/AdPlacement';

const PredictionResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ predictedRank: null, recommendations: [] });
  const [filterLimit, setFilterLimit] = useState('all');

  useEffect(() => {
    if (!location.state || !location.state.formData) {
      navigate('/');
      return;
    }

    const fetchPrediction = async () => {
      try {
        const res = await axios.post('/predict', location.state.formData);
        const sortedRecs = (res.data.recommendations || []).sort((a, b) => a.closingRank - b.closingRank);
        setData({ ...res.data, recommendations: sortedRecs });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch predictions');
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [location.state, navigate]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('My_College_Report.pdf');
    } catch (err) {
      console.error('Error generating PDF', err);
    }
  };

  const formatPackage = (pkg) => {
    if (!pkg || isNaN(pkg) || pkg === 0) return 'TBA';
    return `₹${(pkg / 100000).toFixed(1)}L`;
  };

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', padding: '8rem 1.5rem' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="spinner" style={{ margin: '0 auto 2rem', width: '56px', height: '56px', borderWidth: '4px' }} />
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>Analyzing Options...</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Finding the best college matches for your rank.</p>
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="container" style={{ maxWidth: '600px', padding: '4rem 1rem' }}>
       <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ color: '#EF4444', marginBottom: '1.5rem' }}>
            <AlertCircle size={64} />
          </div>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem', fontWeight: 800 }}>Search Failed</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: 1.6 }}>{error}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ minWidth: '200px' }}>
            <ChevronLeft size={18} /> Try Different Criteria
          </button>
       </motion.div>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="results-page" style={{ paddingBottom: '5rem' }}>
      <SEO 
        title={`Your Prediction | ${location.state?.formData?.examType} 2024`}
        description={`Personalized college admission predictions for ${location.state?.formData?.examType} 2024 based on your rank ${data.predictedRank}.`}
      />
      
      <div id="report-content" className="container" style={{ maxWidth: '1100px', paddingTop: '2rem' }}>
        
        {/* Header Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '1 1 400px' }}>
            <div className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '1rem', gap: '0.4rem' }}>
              <Sparkles size={14} /> AI-Powered Report
            </div>
            <h1 style={{ fontSize: 'clamp(2.25rem, 6vw, 3.5rem)', fontWeight: 900, marginBottom: '0.5rem', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              Your <span className="gradient-text">Matches</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>
              Based on {data.yearUsed || '2024'} Round {data.roundUsed || '1'} {location.state.formData.examType} Trends
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="glass-card" 
            style={{ padding: '1.5rem 2.5rem', borderRadius: 'var(--radius-xl)', flex: '0 1 auto', display: 'flex', gap: '3rem', alignItems: 'center' }}
          >
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Rank</div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)' }}>{data.predictedRank}</div>
             </div>
             <div style={{ width: '1px', height: '40px', background: 'var(--border-color)' }} />
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Category</div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--secondary-dark)' }}>{location.state.formData.category}</div>
             </div>
          </motion.div>
        </div>

        <AdPlacement type="horizontal" id="results-top" />

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={20} color="var(--primary)" /> Top Recommendations
            </h3>
            <select 
              value={filterLimit} 
              onChange={(e) => setFilterLimit(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '160px', padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: 'var(--radius-md)' }}
            >
              <option value="all">All Available</option>
              <option value="10">Top 10 Matches</option>
              <option value="20">Top 20 Matches</option>
            </select>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={handleDownloadPDF} 
            data-html2canvas-ignore 
            style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem', width: 'auto' }}
          >
            <Download size={18} /> Download PDF Report
          </button>
        </div>

        {/* Results Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}
        >
          {data.recommendations.length > 0 ? (
            data.recommendations
              .slice(0, filterLimit === 'all' ? data.recommendations.length : parseInt(filterLimit))
              .map((rec) => (
              <motion.div 
                key={rec._id}
                variants={itemVariants}
                className="card college-card"
                whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
              >
                <div className="card-header" style={{ padding: '1.5rem', border: 'none', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                     <span className="badge" style={{ background: 'var(--bg-color)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                       NIRF #{rec.collegeId?.ranking || 'Unranked'}
                     </span>
                     <span className="badge" style={{ 
                        fontSize: '0.65rem',
                        backgroundColor: rec.chance === 'High' ? 'var(--secondary-light)' : rec.chance === 'Medium' ? 'hsl(35, 100%, 95%)' : 'hsl(0, 72%, 95%)',
                        color: rec.chance === 'High' ? 'var(--secondary-dark)' : rec.chance === 'Medium' ? 'hsl(35, 100%, 40%)' : '#EF4444'
                     }}>
                        {rec.chance} Chance
                     </span>
                  </div>
                  <h3 className="text-truncate-2" style={{ fontSize: '1.15rem', fontWeight: '800', lineHeight: 1.3 }}>{rec.collegeId?.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.75rem', fontWeight: 500 }}>
                    <MapPin size={14} /> {rec.collegeId?.location}
                  </div>
                </div>
                
                <div className="card-body" style={{ padding: '1rem 1.5rem 2rem' }}>
                  <div className="res-stat">
                    <span>Course Intent</span>
                    <strong>{rec.courseName}</strong>
                  </div>
                  <div className="res-stat">
                    <span>Closing Rank</span>
                    <strong>{rec.closingRank.toLocaleString()}</strong>
                  </div>
                  <div className="res-stat" style={{ border: 'none' }}>
                    <span>Avg. Placement</span>
                    <strong style={{ color: 'var(--secondary-dark)', fontSize: '1.1rem' }}>{formatPackage(rec.collegeId?.placements?.averagePackage)}</strong>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/college/${rec.collegeId?.slug}`)}
                    className="btn" 
                    style={{ width: '100%', marginTop: '1.5rem', background: 'var(--bg-color)', color: 'var(--primary)', fontWeight: 700, borderRadius: 'var(--radius-md)', padding: '0.6rem' }}
                    data-html2canvas-ignore
                  >
                    View Cutoffs <ChevronLeft size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="card glass-card w-full" style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center' }}>
              <Search size={48} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 500 }}>No matching colleges found. Try adjusting your rank or category.</p>
            </div>
          )}
        </motion.div>

        {/* Premium Banner */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="card hero-premium"
           style={{ padding: '3rem', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: 'none' }}
        >
          <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div className="badge" style={{ background: 'var(--primary)', color: 'white', marginBottom: '1.5rem' }}>Limited Slot Release</div>
              <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                Secure your seat with <br /><span className="gradient-text">Expert Counseling</span>
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6 }}>
                Our counselors will help you build the perfect choice list to maximize your chances of getting into the best possible college.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, fontSize: '0.95rem' }}><Sparkles size={18} color="var(--primary)" /> Personalized Choice Entry</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, fontSize: '0.95rem' }}><FileText size={18} color="var(--primary)" /> Document Support</div>
              </div>
            </div>
            
            <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'rgba(255,255,255,0.8)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Counseling Package</div>
              <div style={{ fontSize: '3.5rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '1.5rem', letterSpacing: '-0.05em' }}>₹500</div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/premium-counseling')}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontSize: '1.1rem' }}
              >
                Apply for Counseling
              </motion.button>
              <p style={{ fontSize: '0.75rem', marginTop: '1.25rem', color: 'var(--text-muted)', fontWeight: 600 }}>Zero hidden charges. Complete guidance.</p>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .res-stat { display: flex; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid var(--border-color); font-size: 0.95rem; }
        .res-stat span { color: var(--text-muted); font-weight: 500; }
        .res-stat strong { color: var(--text-main); font-weight: 700; text-align: right; }
        .college-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @media (max-width: 768px) {
          #report-content { padding-top: 1rem; }
          .results-page h1 { text-align: center; }
          .results-page p { text-align: center; }
          .results-page .badge { margin-left: auto; margin-right: auto; }
          .glass-card { margin: 0 auto; width: 100%; justify-content: center !important; }
        }
      `}</style>
    </div>
  );
};

export default PredictionResults;
