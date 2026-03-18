import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import AdPlacement from '../components/AdPlacement';

const Compare = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchTerm.length < 1) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/colleges?search=${searchTerm}`);
        setSearchResults(res.data);
        setError('');
      } catch (err) {
        console.error('Search error', err);
        setError('Connection failed. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const addCollege = (college) => {
    if (selectedColleges.length >= 4) {
      alert('You can compare up to 4 colleges at a time.');
      return;
    }
    if (selectedColleges.find(c => c._id === college._id)) {
      alert('This college is already selected.');
      return;
    }
    setSelectedColleges([...selectedColleges, college]);
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeCollege = (id) => {
    setSelectedColleges(selectedColleges.filter(c => c._id !== id));
  };

  return (
    <div className="compare-page fade-in">
      <div className="container mobile-center-text" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: '800', marginBottom: '0.5rem' }}>
          Compare <span className="gradient-text">Top Colleges</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Search and select up to 4 colleges to compare side-by-side.</p>
      </div>

      {error && (
        <div className="container" style={{ maxWidth: '600px', marginBottom: '1.5rem' }}>
          <div style={{ color: '#991B1B', backgroundColor: '#FEE2E2', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #EF4444', fontSize: '0.875rem' }}>
            {error}
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="container" style={{ maxWidth: '700px', marginBottom: '2rem' }}>
        <div className="card glass" style={{ overflow: 'visible' }}>
          <div className="card-body" style={{ padding: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-input"
                placeholder="Search college name (e.g. RV College, PES)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: '14px', border: '2px solid var(--border-color)', paddingLeft: '3rem', fontSize: '0.95rem' }}
              />
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              </div>
              
              {loading && (
                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                   <div className="spinner" />
                </div>
              )}

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                      background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)',
                      boxShadow: '0 15px 50px -10px rgba(0,0,0,0.25)', zIndex: 1000, overflow: 'hidden'
                    }}
                  >
                    {searchResults.map(college => (
                      <div 
                        key={college._id} 
                        className="suggestion-item"
                        onClick={() => addCollege(college)}
                        style={{ padding: '0.875rem 1.25rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                      >
                        <div style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '2px' }}>{college.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{college.location}</div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Display */}
      <div className="container" style={{ maxWidth: '1200px' }}>
        {selectedColleges.length === 0 ? (
          <div className="text-center" style={{ padding: '4rem 0', opacity: 0.5 }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem' }}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <p>Your comparison list is empty. Start by searching for a college above.</p>
          </div>
        ) : (
          <div className="comparison-grid">
             {/* Mobile View: Cards */}
             <div className="mobile-only">
               {selectedColleges.map(college => (
                 <div key={college._id} className="card glass mb-4" style={{ padding: '1.25rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                     <h3 style={{ fontSize: '1.1rem' }}>{college.name}</h3>
                     <button onClick={() => removeCollege(college._id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>Remove</button>
                   </div>
                   <div className="comparison-details">
                      <div className="detail-row"><span>Ranking:</span> <strong>#{college.ranking || 'N/A'}</strong></div>
                      <div className="detail-row"><span>Avg. Placement:</span> <strong>₹{(college.placements?.averagePackage / 100000).toFixed(1)}L</strong></div>
                      <div className="detail-row"><span>Highest Pkg:</span> <strong>₹{(college.placements?.highestPackage / 100000).toFixed(1)}L</strong></div>
                      <div className="detail-row"><span>Annual Fees:</span> <strong>₹{(college.fees?.management / 100000).toFixed(1)}L</strong></div>
                   </div>
                 </div>
               ))}
             </div>

             {/* Desktop View: Table */}
             <div className="desktop-only card glass" style={{ overflow: 'hidden' }}>
               <table className="compare-table">
                 <thead>
                   <tr>
                     <th className="feature-col">Features</th>
                     {selectedColleges.map(college => (
                       <th key={college._id} style={{ textAlign: 'center' }}>
                         <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <button className="remove-btn" onClick={() => removeCollege(college._id)}>×</button>
                            <span style={{ fontSize: '0.9rem' }}>{college.name}</span>
                         </div>
                       </th>
                     ))}
                   </tr>
                 </thead>
                 <tbody>
                   <tr><td>NIRF Ranking</td>{selectedColleges.map(c => <td key={c._id} className="text-center">#{c.ranking || 'N/A'}</td>)}</tr>
                   <tr><td>Location</td>{selectedColleges.map(c => <td key={c._id} className="text-center">{c.location}</td>)}</tr>
                   <tr><td>Avg. Placement</td>{selectedColleges.map(c => <td key={c._id} className="text-center">₹{(c.placements?.averagePackage / 100000).toFixed(2)}L</td>)}</tr>
                   <tr><td>Highest Package</td>{selectedColleges.map(c => <td key={c._id} className="text-center highlight">₹{(c.placements?.highestPackage / 100000).toFixed(2)}L</td>)}</tr>
                   <tr><td>Management Fees</td>{selectedColleges.map(c => <td key={c._id} className="text-center">₹{(c.fees?.management / 100000).toFixed(2)}L</td>)}</tr>
                   <tr><td>Govt Fees</td>{selectedColleges.map(c => <td key={c._id} className="text-center">₹{(c.fees?.government / 100000).toFixed(2)}L</td>)}</tr>
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </div>

      <AdPlacement type="horizontal" />

      <style dangerouslySetInnerHTML={{ __html: `
        .spinner { width: 24px; height: 24px; border: 3px solid var(--border-color); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .suggestion-item:hover { background: var(--primary-light); }
        .compare-table { width: 100%; border-collapse: collapse; }
        .compare-table th, .compare-table td { padding: 1.25rem; border: 1px solid var(--border-color); }
        .feature-col { background: var(--bg-color); font-weight: 700; width: 220px; }
        .text-center { text-align: center; }
        .highlight { color: var(--secondary-dark); font-weight: 800; }
        .remove-btn { position: absolute; top: -12px; right: -12px; background: #EF4444; color: white; border: none; width: 24px; height: 24px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); z-index: 10; }
        .mobile-only { display: block; }
        .desktop-only { display: none; }
        .detail-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px dashed var(--border-color); font-size: 0.9rem; }
        @media (min-width: 900px) {
          .mobile-only { display: none; }
          .desktop-only { display: block; }
        }
      `}} />
    </div>
  );
};

export default Compare;
