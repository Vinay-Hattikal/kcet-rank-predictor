import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Admin = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState(null);
  const [collegeFiles, setCollegeFiles] = useState(null);
  const [message, setMessage] = useState('');
  const [colleges, setColleges] = useState([]);
  const [editingCollege, setEditingCollege] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    examType: 'KCET',
    year: new Date().getFullYear().toString(),
    roundNumber: '1'
  });

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
    }
    fetchColleges();
  }, [navigate]);

  const fetchColleges = async () => {
    try {
      const res = await axios.get('/api/colleges');
      setColleges(res.data);
    } catch (err) {
      console.error('Error fetching colleges', err);
    }
  };

  const handleClearData = async (type) => {
    const confirmMsg = type === 'cutoffs' 
      ? 'Delete ALL cutoff data? This cannot be undone.'
      : 'CRITICAL: Delete ALL colleges AND cutoffs?';
    
    if (!window.confirm(confirmMsg)) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const endpoint = type === 'cutoffs' ? '/api/admin/cutoffs' : '/api/admin/colleges';
      await axios.delete(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      setMessage(`${type === 'cutoffs' ? 'Cutoff' : 'College'} data cleared successfully!`);
      if (type === 'colleges') fetchColleges();
    } catch (err) {
      setMessage('Error clearing data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e, type) => {
    e.preventDefault();
    const targetFiles = type === 'cutoffs' ? files : collegeFiles;
    
    if (!targetFiles || targetFiles.length === 0) {
      setMessage('Please select a file first.');
      return;
    }
    
    const data = new FormData();
    for (let i = 0; i < targetFiles.length; i++) {
        data.append('files', targetFiles[i]);
    }
    
    if (type === 'cutoffs') {
      data.append('examType', formData.examType);
      data.append('year', formData.year);
      data.append('roundNumber', formData.roundNumber);
    }

    try {
      setLoading(true);
      setMessage('Processing... This may take a moment.');
      const token = localStorage.getItem('token');
      const endpoint = type === 'cutoffs' ? '/api/admin/cutoffs/upload' : '/api/admin/colleges/upload';
      const res = await axios.post(endpoint, data, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });
      setMessage(res.data.message || 'Upload successful!');
      if (type === 'colleges') fetchColleges();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page fade-in">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Admin <span className="gradient-text">Dashboard</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your college data and entrance exam cutoffs.</p>
          </div>
          <button className="btn btn-secondary" onClick={() => { localStorage.clear(); navigate('/login'); }}>Sign Out</button>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              marginBottom: '2rem', padding: '1.25rem', borderRadius: '16px', borderLeft: '5px solid var(--primary)',
              background: 'var(--primary-light)', color: 'var(--primary-dark)', fontWeight: '600'
            }}
          >
            {message}
          </motion.div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {/* Section: Cutoffs */}
          <div className="card glass">
            <div className="card-header">
              <h2 style={{ fontSize: '1.25rem' }}>Cutoff Management</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Upload historical rank data by exam and round.</p>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => handleUpload(e, 'cutoffs')}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Exam</label>
                    <select value={formData.examType} onChange={(e) => setFormData({...formData, examType: e.target.value})} className="form-select">
                      <option value="KCET">KCET</option>
                      <option value="COMEDK">COMEDK</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Round</label>
                    <select value={formData.roundNumber} onChange={(e) => setFormData({...formData, roundNumber: e.target.value})} className="form-select">
                      <option value="1">Round 1</option>
                      <option value="2">Round 2</option>
                      <option value="3">Round 3</option>
                    </select>
                  </div>
                </div>
                <div className="form-group mb-8">
                  <label className="form-label">CSV Files</label>
                  <input type="file" multiple onChange={(e) => setFiles(e.target.files)} className="form-input" accept=".csv" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Processing...' : 'Upload Data'}</button>
                  <button type="button" onClick={() => handleClearData('cutoffs')} className="btn btn-secondary" style={{ color: '#EF4444' }}>Clear</button>
                </div>
              </form>
            </div>
          </div>

          {/* Section: Colleges */}
          <div className="card glass">
            <div className="card-header">
              <h2 style={{ fontSize: '1.25rem' }}>College Infrastructure</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Update fees, placements, and ranking metadata.</p>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => handleUpload(e, 'colleges')}>
                <div className="form-group mb-8">
                  <label className="form-label">Details CSV</label>
                  <input type="file" onChange={(e) => setCollegeFiles(e.target.files)} className="form-input" accept=".csv" />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Required headers: Name, Location, Ranking, Fees...</p>
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Processing...' : 'Bulk Update'}</button>
                  <button type="button" onClick={() => handleClearData('colleges')} className="btn btn-secondary" style={{ color: '#EF4444' }}>Reset ALL</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Management Table */}
        <div className="card glass">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Registered Colleges ({colleges.length})</h2>
            <div className="badge" style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>Live Data</div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
             <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                 <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-color)', zIndex: 10 }}>
                   <tr>
                     <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem' }}>College Name</th>
                     <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem' }}>Location</th>
                     <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.875rem' }}>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {colleges.map((c, i) => (
                     <tr key={c._id} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'white' : 'transparent' }}>
                       <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{c.name}</td>
                       <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{c.location}</td>
                       <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                         <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Edit Details</button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
