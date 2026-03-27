import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';

const PremiumLeadForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        rank: '',
        coupon: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            await axios.post('/leads', formData);
            setIsSubmitted(true);
        } catch (err) {
            setError('Something went wrong. Please try again later.');
            console.error('Lead Capture Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="lead-form-container" style={{ marginBottom: '3rem' }}>
            <AnimatePresence mode="wait">
                {!isSubmitted ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass"
                        style={{ padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255, 215, 0, 0.2)' }}
                    >
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', textAlign: 'center' }}>
                            Express Your Interest
                        </h3>
                        {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input" 
                                    placeholder="Enter your name" 
                                    required 
                                />
                            </div>

                            <div className="grid-2-col-responsive">
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-input" 
                                        placeholder="WhatsApp Number" 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>City</label>
                                    <input 
                                        type="text" 
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="form-input" 
                                        placeholder="Your City" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="grid-2-col-responsive">
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>KCET Rank (Optional)</label>
                                    <input 
                                        type="text" 
                                        name="rank"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={formData.rank}
                                        onChange={(e) => {
                                          const val = e.target.value.replace(/\D/g, '');
                                          handleChange({ target: { name: 'rank', value: val }});
                                        }}
                                        className="form-input" 
                                        placeholder="Enter your rank" 
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Coupon / Referral Code</label>
                                    <input 
                                        type="text" 
                                        name="coupon"
                                        value={formData.coupon}
                                        onChange={handleChange}
                                        className="form-input" 
                                        placeholder="Optional code" 
                                    />
                                </div>
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                disabled={isLoading}
                                className="btn btn-primary"
                                style={{ padding: '1rem', fontWeight: '800', backgroundColor: '#FFD700', color: '#000', border: 'none' }}
                            >
                                {isLoading ? 'Sending...' : 'Submit Request'}
                            </motion.button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass"
                        style={{ padding: '3rem 2rem', borderRadius: '24px', textAlign: 'center', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid #10b981' }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#10b981' }}>Request Received!</h3>
                        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Thank you, <strong>{formData.name}</strong>! <br />
                            Our expert team will reach out to you on <strong>{formData.phone}</strong> shortly to discuss your personalized strategy.
                        </p>
                        <motion.button
                            onClick={() => setIsSubmitted(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginTop: '1.5rem', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'underline' }}
                        >
                            Submit another request
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PremiumLeadForm;
