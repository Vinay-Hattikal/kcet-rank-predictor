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
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('data'); // 'data' or 'leads'
  const [editingCollege, setEditingCollege] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    day: 'all',
    month: 'all',
    year: 'all'
  });
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
    fetchLeads();
  }, [navigate]);

  const fetchColleges = async () => {
    try {
      const res = await axios.get('/api/colleges');
      setColleges(res.data);
    } catch (err) {
      console.error('Error fetching colleges', err);
    }
  };

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(res.data);
      setFilteredLeads(res.data);
    } catch (err) {
      console.error('Error fetching leads', err);
    }
  };

  useEffect(() => {
    let result = [...leads];
    
    if (filter.year !== 'all') {
      result = result.filter(l => new Date(l.createdAt).getFullYear().toString() === filter.year);
    }
    if (filter.month !== 'all') {
      result = result.filter(l => (new Date(l.createdAt).getMonth() + 1).toString() === filter.month);
    }
    if (filter.day !== 'all') {
      result = result.filter(l => new Date(l.createdAt).getDate().toString() === filter.day);
    }
    
    setFilteredLeads(result);
  }, [filter, leads]);

  const downloadLeadsPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Premium Counseling Leads', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Leads: ${filteredLeads.length}`, 14, 35);
    
    let y = 45;
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text('Name', 14, y);
    doc.text('Phone', 60, y);
    doc.text('City', 100, y);
    doc.text('Rank', 140, y);
    doc.text('Date', 170, y);
    
    doc.setLineWidth(0.5);
    doc.line(14, y + 2, 200, y + 2);
    y += 10;
    
    doc.setTextColor(0);
    filteredLeads.forEach((lead, i) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      const dateStr = new Date(lead.createdAt).toLocaleDateString();
      doc.text(lead.name.substring(0, 20), 14, y);
      doc.text(lead.phone, 60, y);
      doc.text(lead.city.substring(0, 15), 100, y);
      doc.text(lead.rank ? lead.rank.toString() : 'N/A', 140, y);
      doc.text(dateStr, 170, y);
      y += 8;
    });
    
    doc.save(`Leads_Export_${new Date().toISOString().split('T')[0]}.pdf`);
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

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('data')}
            className={`btn ${activeTab === 'data' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '12px' }}
          >
            College Data
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`btn ${activeTab === 'leads' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '12px' }}
          >
            Premium Leads ({leads.length})
          </button>
        </div>

        {activeTab === 'data' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              {/* Section: Cutoffs */}
              <div className="card glass">
                <div className="card-header">
                  <h2 style={{ fontSize: '1.25rem' }}>Cutoff & Metadata Management</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Upload Combined CSV (Metadata + Ranks) or just ranks.</p>
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
                         <tr key={c._id} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'transparent' }}>
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
          </>
        ) : (
          <div className="card glass">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem' }}>Personalised Strategy Leads</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Students who expressed interest in expert services.</p>
              </div>
              <button onClick={downloadLeadsPDF} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4m4-10l4 4 4-4m-4 4V3"/></svg>
                Download PDF
              </button>
            </div>
            
            <div className="card-body">
              {/* Filters */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ minWidth: '120px' }}>
                  <label className="form-label">Day</label>
                  <select value={filter.day} onChange={(e) => setFilter({...filter, day: e.target.value})} className="form-select">
                    <option value="all">All Days</option>
                    {Array.from({length: 31}, (_, i) => (
                      <option key={i+1} value={(i+1).toString()}>{i+1}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ minWidth: '140px' }}>
                  <label className="form-label">Month</label>
                  <select value={filter.month} onChange={(e) => setFilter({...filter, month: e.target.value})} className="form-select">
                    <option value="all">All Months</option>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                      <option key={i+1} value={(i+1).toString()}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ minWidth: '120px' }}>
                  <label className="form-label">Year</label>
                  <select value={filter.year} onChange={(e) => setFilter({...filter, year: e.target.value})} className="form-select">
                    <option value="all">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
                <div style={{ alignSelf: 'flex-end' }}>
                  <button onClick={() => setFilter({day: 'all', month: 'all', year: 'all'})} className="btn btn-secondary">Reset</button>
                </div>
              </div>

              {/* Leads Table */}
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-color)', zIndex: 10 }}>
                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem' }}>Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem' }}>Contact</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem' }}>City / Rank</th>
                      <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem' }}>Date/Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.length > 0 ? filteredLeads.map((lead, i) => (
                      <tr key={lead._id} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'rgba(255,255,255,0.3)' : 'transparent' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '700' }}>{lead.name}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ color: 'var(--primary)', fontWeight: '600' }}>{lead.phone}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontSize: '0.9rem' }}>{lead.city}</div>
                          {lead.rank && <div className="badge" style={{ marginTop: '0.25rem', backgroundColor: '#e0f2fe', color: '#0369a1' }}>Rank: {lead.rank}</div>}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.85rem' }}>
                          <div>{new Date(lead.createdAt).toLocaleDateString()}</div>
                          <div style={{ color: 'var(--text-muted)' }}>{new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No leads found for the selected filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
