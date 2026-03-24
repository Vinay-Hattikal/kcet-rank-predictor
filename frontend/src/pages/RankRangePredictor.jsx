import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { Trophy, MapPin, Sparkles, AlertCircle, Search, ChevronRight } from 'lucide-react';
import AdPlacement from '../components/AdPlacement';

const RankRangePredictor = () => {
  const { exam, minRank, maxRank } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ recommendations: [] });

  const formattedExam = exam?.toUpperCase() === 'COMEDK' ? 'COMEDK' : 'KCET';
  const min = parseInt(minRank) || 10000;
  const max = parseInt(maxRank) || 20000;
  const medianRank = Math.floor((min + max) / 2);

  useEffect(() => {
    // Validate params
    if (isNaN(min) || isNaN(max) || min >= max || !exam) {
      setError('Invalid rank range specified in url.');
      setLoading(false);
      return;
    }

    const fetchRankData = async () => {
      try {
        setLoading(true);
        // We use the median rank of the range to get a representative set of colleges
        const res = await axios.post('/predict', {
          examType: formattedExam,
          rank: medianRank,
          category: 'GM', // Defaulting to General Merit for SEO pages
          branch: ''
        });
        
        // Let's filter slightly to ensure we show results that actually fall in this range conceptually
        // Actually, the backend returns colleges you can get WITH this median rank, which perfectly represents the "range"
        const sortedRecs = (res.data.recommendations || []).sort((a, b) => a.closingRank - b.closingRank);
        setData({ ...res.data, recommendations: sortedRecs });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch colleges for this rank range. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRankData();
  }, [exam, minRank, maxRank, medianRank, formattedExam, min, max]);

  const formatPackage = (pkg) => {
    if (!pkg || isNaN(pkg) || pkg === 0) return 'TBA';
    return `₹${(pkg / 100000).toFixed(1)}L`;
  };

  const title = `Top Engineering Colleges for ${min.toLocaleString()} to ${max.toLocaleString()} Rank in ${formattedExam} 2026`;
  const description = `Find out which engineering colleges in Karnataka accept ${formattedExam} ranks between ${min.toLocaleString()} and ${max.toLocaleString()}. Get cutoff, placement, and fee details.`;

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', padding: '8rem 1.5rem', minHeight: '80vh' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="spinner" style={{ margin: '0 auto 2rem', width: '56px', height: '56px', borderWidth: '4px' }} />
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>Analyzing Cutoff Databases...</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Compiling colleges for {formattedExam} rank {min.toLocaleString()} - {max.toLocaleString()}</p>
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="container" style={{ maxWidth: '600px', padding: '4rem 1rem', minHeight: '60vh' }}>
       <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ color: '#EF4444', marginBottom: '1.5rem' }}>
            <AlertCircle size={64} />
          </div>
          <h1 style={{ marginBottom: '1rem', fontSize: '1.75rem', fontWeight: 800 }}>Page Not Found</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: 1.6 }}>{error}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ minWidth: '200px' }}>
            Go to Predictor
          </button>
       </motion.div>
    </div>
  );

  return (
    <div className="results-page fade-in" style={{ paddingBottom: '5rem' }}>
      <SEO 
        title={title}
        description={description}
        keywords={`${formattedExam} college predictor, engineering colleges for ${min} rank in ${formattedExam}, ${formattedExam} cutoff 2026`}
      />
      
      <div className="container" style={{ maxWidth: '1100px', paddingTop: '2rem' }}>
        
        {/* SEO Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
          <div className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', margin: '0 auto 1rem', gap: '0.4rem', display: 'inline-flex' }}>
            <Sparkles size={14} /> Official 2024-25 Cutoff Data
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            <span className="gradient-text">{formattedExam} Rank</span> {min.toLocaleString()} to {max.toLocaleString()}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', fontWeight: 500, lineHeight: 1.6 }}>
            Based on historical data, candidates falling in the <strong>{min.toLocaleString()} - {max.toLocaleString()}</strong> rank bracket (General Merit) in {formattedExam} typically secure admissions in the following engineering colleges in Karnataka.
          </p>
        </div>

        <AdPlacement type="horizontal" id="rank-range-top" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
           <h2 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Trophy size={22} color="var(--primary)" /> Recommended Colleges
           </h2>
           <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Check Custom Rank
           </Link>
        </div>

        {/* Results Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {data.recommendations.length > 0 ? (
            data.recommendations.slice(0, 30).map((rec) => (
              <motion.div 
                key={rec._id}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="card college-card"
                whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
              >
                <div className="card-header" style={{ padding: '1.5rem', border: 'none', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                     <span className="badge" style={{ background: 'var(--bg-color)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontSize: '0.7rem' }}>
                       NIRF #{rec.collegeId?.ranking || 'Unranked'}
                     </span>
                     <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                        Rank ~{rec.closingRank.toLocaleString()}
                     </span>
                  </div>
                  <h3 className="text-truncate-2" style={{ fontSize: '1.15rem', fontWeight: '800', lineHeight: 1.3 }}>
                    <Link to={`/college/${rec.collegeId?.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                       {rec.collegeId?.name}
                    </Link>
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.75rem', fontWeight: 500 }}>
                    <MapPin size={14} /> {rec.collegeId?.location}
                  </div>
                </div>
                
                <div className="card-body" style={{ padding: '1rem 1.5rem 1.5rem' }}>
                  <div className="res-stat">
                    <span>Course</span>
                    <strong>{rec.courseName}</strong>
                  </div>
                  <div className="res-stat" style={{ border: 'none' }}>
                    <span>Avg. Placement</span>
                    <strong style={{ color: 'var(--secondary-dark)' }}>{formatPackage(rec.collegeId?.placements?.averagePackage)}</strong>
                  </div>
                  
                  <Link 
                    to={`/college/${rec.collegeId?.slug}`}
                    className="btn" 
                    style={{ width: '100%', marginTop: '1.5rem', background: 'var(--bg-color)', color: 'var(--primary)', fontWeight: 700, borderRadius: 'var(--radius-md)', padding: '0.6rem', textDecoration: 'none' }}
                  >
                    View Full Cutoffs <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
             <div className="card glass-card" style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center' }}>
                <Search size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>No direct matches</h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500 }}>We couldn't find exact matches for this specific range. Try our main predictor to get exact results for your criteria.</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Go to Predictor</Link>
             </div>
          )}
        </div>

        {/* SEO Context Section */}
        <section className="card glass-card" style={{ padding: '3rem', marginBottom: '4rem', borderRadius: 'var(--radius-xl)' }}>
           <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Understanding {formattedExam} Ranks Between {min.toLocaleString()} and {max.toLocaleString()}</h2>
           <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: 1.7, marginBottom: '1.5rem', opacity: 0.9 }}>
              Students securing a rank in the {min.toLocaleString()} to {max.toLocaleString()} bracket in {formattedExam} have a solid chance of getting into reputed engineering colleges in Karnataka. While top-tier computer science branches at the very top colleges might be highly competitive, excellent opportunities exist in core branches like ECE, Mechanical, and Civil at top institutions, or CS/IT branches at rapidly growing Tier-2 universities in Bangalore, Mysore, and Hubli.
           </p>
           <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: 1.7, opacity: 0.9 }}>
              <strong>Pro Tip:</strong> Cutoffs vary significantly based on your specific reservation category (like 2AG, SCG, SNQ, or Rural quota). The list above shows General Merit (GM) cutoffs. To see exactly which colleges YOU will get based on your specific category and exact rank, use our custom <Link to="/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>AI College Predictor</Link>.
           </p>
        </section>

      </div>
      <style>{`
        .res-stat { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color); font-size: 0.9rem; }
        .res-stat span { color: var(--text-muted); font-weight: 500; }
        .res-stat strong { color: var(--text-main); font-weight: 700; text-align: right; }
        .college-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
      `}</style>
    </div>
  );
};

export default RankRangePredictor;
