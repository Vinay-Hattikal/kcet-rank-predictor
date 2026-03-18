import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import AdPlacement from '../components/AdPlacement';

const PredictionResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ predictedRank: null, recommendations: [] });

  useEffect(() => {
    if (!location.state || !location.state.formData) {
      navigate('/');
      return;
    }

    const fetchPrediction = async () => {
      try {
        const res = await axios.post('/api/predict', location.state.formData);
        
        // Sort recommendations: High > Medium > Low
        const chanceOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        const sortedRecs = (res.data.recommendations || []).sort((a, b) => 
          (chanceOrder[a.chance] || 99) - (chanceOrder[b.chance] || 99)
        );
        
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
      const canvas = await html2canvas(element, { scale: 2 });
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
    <div className="text-center" style={{ padding: '6rem 1.5rem' }}>
      <div className="spinner" style={{ margin: '0 auto 1.5rem', width: '40px', height: '40px' }} />
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Analyzing Final Rounds...</h2>
      <p style={{ color: 'var(--text-muted)' }}>Calculating your best matches across all colleges.</p>
    </div>
  );

  if (error) return (
    <div className="container" style={{ maxWidth: '600px', padding: '4rem 1rem' }}>
       <div className="card glass" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ color: '#EF4444', marginBottom: '1.5rem' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Ops! Something went wrong</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>{error}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">Go Back Home</button>
       </div>
    </div>
  );

  return (
    <div className="results-page fade-in">
      <Helmet>
        <title>Your College Prediction Results | {location.state?.formData?.examType} 2024</title>
        <meta name="description" content="Personalized engineering college recommendations based on your rank. Discover your best matches for KCET and COMEDK counseling." />
      </Helmet>
      <div id="report-content" className="container" style={{ maxWidth: '1000px' }}>

        
        {/* Header Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <div className="container mobile-center-text" style={{ padding: 0 }}>
            <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '0.75rem', display: 'inline-block' }}>Personalized Report</span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: '800', marginBottom: '0.5rem' }}>Prediction Results</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Based on your <strong style={{color: 'var(--text-main)'}}>{location.state.formData.examType}</strong> performance.
            </p>
          </div>
          <div className="glass" style={{ padding: '1.25rem', borderRadius: '16px', flex: '1 1 300px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
             <div className="text-center">
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>Analyzed Rank</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{location.state.formData.rank}</div>
             </div>
             <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }} />
             <div className="text-center">
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>Category</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)' }}>{location.state.formData.category}</div>
             </div>
          </div>
        </div>

        <AdPlacement type="horizontal" />

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Top Recommended Colleges</h3>
          <button className="btn btn-secondary" onClick={handleDownloadPDF} data-html2canvas-ignore style={{ gap: '0.5rem', width: 'auto', padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Save as PDF
          </button>
        </div>

        {/* Results Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {data.recommendations.length > 0 ? (
            data.recommendations.map((rec, index) => (
              <motion.div 
                key={rec._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="card glass college-card"
                whileHover={{ y: -5 }}
              >
                <div className="card-header" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                     <span className="badge" style={{ backgroundColor: 'hsl(215, 20%, 95%)', color: 'var(--text-muted)', fontSize: '0.65rem' }}>#{rec.collegeId?.ranking || 'Unranked'}</span>
                     <span className="badge" style={{ 
                        fontSize: '0.65rem',
                        backgroundColor: rec.chance === 'High' ? 'hsl(162, 72%, 95%)' : rec.chance === 'Medium' ? 'hsl(35, 100%, 95%)' : 'hsl(0, 72%, 95%)',
                        color: rec.chance === 'High' ? 'var(--secondary-dark)' : rec.chance === 'Medium' ? 'hsl(35, 100%, 40%)' : '#EF4444'
                     }}>
                        {rec.chance} Chance
                     </span>
                  </div>
                  <h3 className="text-truncate-2" style={{ fontSize: '1.05rem', fontWeight: '700' }}>{rec.collegeId?.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {rec.collegeId?.location}
                  </div>
                </div>
                <div className="card-body" style={{ padding: '0 1.25rem 1.25rem' }}>
                  <div className="res-detail">
                    <span>Course</span>
                    <strong>{rec.courseName}</strong>
                  </div>
                  <div className="res-detail">
                    <span>Closing Rank</span>
                    <strong>{rec.closingRank}</strong>
                  </div>
                  <div className="res-detail border-none">
                    <span>Avg. Placement</span>
                    <strong style={{ color: 'var(--secondary-dark)' }}>{formatPackage(rec.collegeId?.placements?.averagePackage)}</strong>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="card glass w-full" style={{ gridColumn: '1 / -1', padding: '3rem 1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>No matches found. Try expanding your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .res-detail { display: flex; justify-content: space-between; padding: 0.875rem 0; border-bottom: 1px solid var(--border-color); font-size: 0.95rem; }
        .res-detail.border-none { border: none; }
        .res-detail strong { color: var(--text-main); font-weight: 600; text-align: right; }
        .college-card { transition: transform 0.3s; }
        .college-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
        .spinner { width: 40px; height: 40px; border: 4px solid var(--primary-light); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default PredictionResults;
