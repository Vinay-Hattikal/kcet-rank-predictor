import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import axios from '../api/axios';
import { 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  IndianRupee, 
  Star, 
  ChevronRight, 
  AlertCircle,
  Loader2,
  Building2,
  Calendar
} from 'lucide-react';


const CollegeDetails = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedExam, setSelectedExam] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/colleges/slug/${slug}`);
        setData(response.data);
        
        if (response.data.cutoffs.length > 0) {
          const sortedYears = [...new Set(response.data.cutoffs.map(c => c.year))].sort((a,b) => b - a);
          setSelectedYear(sortedYears[0].toString());
          setSelectedExam(response.data.cutoffs[0].examType);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load college details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center' }}
        >
          <Loader2 className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Fetching college data...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Oops!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error || 'College not found'}</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </motion.div>
      </div>
    );
  }

  const { college, cutoffs } = data;
  const years = [...new Set(cutoffs.map(c => c.year))].sort((a,b) => b - a);
  const exams = [...new Set(cutoffs.map(c => c.examType))];

  const filteredCutoffs = cutoffs.filter(c => 
    (selectedYear === '' || c.year.toString() === selectedYear) &&
    (selectedExam === '' || c.examType === selectedExam)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="college-details-page">
      <SEO 
        title={`${college.name} Cutoff ${new Date().getFullYear()} | KCET, COMEDK Rankings`}
        description={`Get latest ${college.name} cutoff ranks for all categories (GM, SC, ST, etc.), fees structure, placements, and courses offered. Check your admission chances now.`}
        keywords={`${college.name} cutoff, ${college.name} kcet cutoff, ${college.name} comedk cutoff`}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": college.name,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": college.location || "Karnataka",
              "addressRegion": "Karnataka",
              "addressCountry": "IN"
            },
            "url": `https://rank2college.in/college/${college.slug}`,
            "logo": "https://rank2college.in/og-image.png"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://rank2college.in"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Colleges",
                "item": "https://rank2college.in/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": college.name,
                "item": `https://rank2college.in/college/${college.slug}`
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `What is the KCET cutoff for ${college.name}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `The KCET cutoff for ${college.name} varies by branch and category. For example, popular branches like Computer Science typically have higher closing ranks compared to core branches. You can check the detailed round-wise cutoffs for all categories on our platform.`
                }
              },
              {
                "@type": "Question",
                "name": `Does ${college.name} accept COMEDK scores?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `${college.name} is one of the premier engineering colleges in Karnataka. Admission is typically through both KCET (for Karnataka candidates) and COMEDK UGET (for non-Karnataka and management quota candidates).`
                }
              }
            ]
          }
        ]}
      />

      {/* Hero Section */}
      <section className="hero-premium" style={{ color: 'var(--text-main)', padding: 'clamp(2rem, 8vw, 4rem) 0', marginBottom: '2.5rem' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', opacity: 0.7, fontSize: '0.875rem', fontWeight: 500 }}
          >
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link to="/colleges" style={{ color: 'inherit', textDecoration: 'none' }}>Colleges</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{college.name}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            {college.name}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '1rem', fontWeight: 500 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <div className="icon-box" style={{ width: '32px', height: '32px' }}><MapPin size={16} /></div> 
              {college.location || 'Karnataka'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <div className="icon-box" style={{ width: '32px', height: '32px' }}><Building2 size={16} /></div> 
              NIRF Rank: #{college.ranking || 'N/A'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <div className="icon-box" style={{ width: '32px', height: '32px' }}><Star size={16} /></div> 
              Infras: {college.infrastructureRating}/10
            </span>
          </motion.div>
        </div>
      </section>

      <div className="container">
        <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
            
            {/* Main Content Area */}
            <main>
              {/* Quick Stats */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}
              >
                <motion.div variants={itemVariants} className="card glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <GraduationCap size={18} /> Courses Offered
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{college.coursesOffered.length}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Available Departments</div>
                </motion.div>
              </motion.div>

              {/* Cutoff Section */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card" 
                style={{ marginBottom: '2.5rem', border: 'none', boxShadow: 'var(--shadow-md)' }}
              >
                <div className="card-header" style={{ padding: '1.5rem', background: 'var(--surface)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="icon-box"><Calendar size={18} /></div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Admission Cutoffs</h2>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <select 
                      className="form-select" 
                      value={selectedExam} 
                      onChange={(e) => setSelectedExam(e.target.value)}
                      style={{ width: 'auto', minWidth: '120px', padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: 'var(--radius-md)' }}
                    >
                      {exams.map(exam => <option key={exam} value={exam}>{exam}</option>)}
                    </select>
                    <select 
                      className="form-select" 
                      value={selectedYear} 
                      onChange={(e) => setSelectedYear(e.target.value)}
                      style={{ width: 'auto', minWidth: '100px', padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: 'var(--radius-md)' }}
                    >
                      {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                </div>

                {/* Table for Desktop */}
                <div className="mobile-hide" style={{ padding: 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'var(--bg-color)', textAlign: 'left' }}>
                      <tr>
                        <th style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course</th>
                        <th style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                        <th style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Round</th>
                        <th style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Closing Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence mode="popLayout">
                        {filteredCutoffs.length > 0 ? (
                          filteredCutoffs.map((item, idx) => (
                            <motion.tr 
                              key={`${item.courseName}-${item.category}-${item.roundNumber}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ delay: idx * 0.02 }}
                              style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                              className="table-row-hover"
                            >
                              <td style={{ padding: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.courseName}</td>
                              <td style={{ padding: '1.25rem' }}>
                                <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 }}>
                                  {item.category}
                                </span>
                              </td>
                              <td style={{ padding: '1.25rem', color: 'var(--text-muted)', fontWeight: 500 }}>Round {item.roundNumber}</td>
                              <td style={{ padding: '1.25rem', fontWeight: 800, color: 'var(--primary)', textAlign: 'right', fontSize: '1.1rem' }}>
                                {item.closingRank.toLocaleString()}
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                              No cutoff data found for the selected filters.
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Cards for Mobile */}
                <div className="mobile-only" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredCutoffs.length > 0 ? (
                      filteredCutoffs.map((item, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="glass-card"
                          style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.65rem' }}>{item.category}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Round {item.roundNumber}</span>
                          </div>
                          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3 }}>{item.courseName}</h3>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Closing Rank</span>
                            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary)' }}>{item.closingRank.toLocaleString()}</span>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No data found.</div>
                    )}
                  </div>
                </div>
              </motion.div>
            </main>

            {/* Sidebar */}
            <aside>
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="card glass-card" 
                style={{ padding: '1.75rem', border: 'none', boxShadow: 'var(--shadow-lg)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div className="icon-box" style={{ background: 'var(--secondary-light)', color: 'var(--secondary-dark)' }}><GraduationCap size={20} /></div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Courses Offered</h3>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {college.coursesOffered?.map((course, idx) => (
                    <motion.li 
                      key={idx} 
                      initial={{ opacity: 0, x: -5 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)' }}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)', marginTop: '0.4rem', flexShrink: 0 }}></div>
                      {course}
                    </motion.li>
                  ))}
                </ul>
                
                <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px dashed var(--border-color)' }} />
                
                <div style={{ background: 'var(--primary-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>Personalized Prediction</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', fontWeight: 500, lineHeight: 1.4 }}>
                      Check your actual admission chances based on your current rank.
                    </p>
                    <Link to="/" className="btn btn-primary" style={{ width: '100%', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
                      Predict My Chances
                    </Link>
                  </div>
                  <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '80px', height: '80px', background: 'var(--primary)', opacity: 0.1, borderRadius: '50%' }}></div>
                </div>
              </motion.div>
            </aside>

          </div>
        </div>
      </div>
      
      <style>{`
        .table-row-hover:hover { background: var(--bg-color); }
        @media (max-width: 1024px) {
          .content-grid > div { grid-template-columns: 1fr !important; }
          aside { position: static !important; }
        }
      `}</style>
    </div>
  );
};

export default CollegeDetails;
