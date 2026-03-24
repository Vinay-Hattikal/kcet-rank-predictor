import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Search, Loader2, MapPin, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const CollegeSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        try {
          const res = await axios.get(`/colleges?search=${query}`);
          setResults(res.data);
          setShowResults(true);
        } catch (err) {
          console.error('Search error:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (slug) => {
    if (!slug) {
        console.error('Missing slug for college');
        return;
    }
    setShowResults(false);
    setQuery('');
    navigate(`/college/${slug}`);
  };

  return (
    <div className="college-search-container" ref={searchRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search for a college (e.g. RV College, PESIT...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 1 && setShowResults(true)}
          style={{ paddingLeft: '2.75rem', height: '3.5rem', fontSize: '1.1rem', borderRadius: 'var(--radius-lg)' }}
        />
        <Search 
          size={20} 
          style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
        />
        {loading && (
          <Loader2 
            size={20} 
            className="spinner" 
            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }} 
          />
        )}
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              right: 0,
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 1000,
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid var(--border-color)',
              padding: '0.5rem'
            }}
          >
            {results.length > 0 ? (
              results.map((college) => (
                <div
                  key={college._id}
                  onClick={() => handleSelect(college.slug)}
                  style={{
                    padding: '1rem',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s ease',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                  className="search-item"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', fontSize: '1.05rem' }}>{college.name}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <MapPin size={14} style={{ color: 'var(--primary)' }} /> {college.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <GraduationCap size={14} style={{ color: 'var(--secondary)' }} /> NIRF: #{college.ranking || 'N/A'}
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    padding: '0.6rem 0.75rem', 
                    background: 'var(--bg-color)', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem'
                  }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>Avg Package</div>
                        <div style={{ color: 'var(--primary-dark)', fontWeight: 800 }}>
                            {college.placements?.averagePackage ? `₹${(college.placements.averagePackage / 100000).toFixed(1)} LPA` : 'N/A'}
                        </div>
                    </div>
                    <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }}></div>
                    <div style={{ flex: 1 }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>Annual Fee</div>
                        <div style={{ color: 'var(--secondary-dark)', fontWeight: 800 }}>
                            {college.fees?.government ? `₹${(college.fees.government / 100000).toFixed(2)}L` : 'N/A'}
                        </div>
                    </div>
                    <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }}></div>
                    <div style={{ flex: 1 }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>ROI Score</div>
                        <div style={{ color: 'var(--success)', fontWeight: 800 }}>
                            {college.placements?.averagePackage && college.fees?.government 
                                ? (college.placements.averagePackage / college.fees.government).toFixed(1) 
                                : 'N/A'}
                        </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No colleges found matching "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollegeSearch;
