import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import PremiumLeadForm from '../components/PremiumLeadForm';

const PremiumCounseling = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="premium-page fade-in" style={{ padding: '4rem 0' }}>
      <Helmet>
        <title>Premium Expert Counseling | Smart College Predictor</title>
        <meta name="description" content="Get 1-to-1 personalized expert guidance for your KCET and COMEDK counseling. Secure your seat with a custom strategy for only ₹500." />
      </Helmet>

      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card glass"
          style={{ padding: '3rem', border: '2px solid #FFD700' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="badge" style={{ backgroundColor: '#FFD700', color: '#000', marginBottom: '1rem', fontWeight: '800' }}>
              EXPERT ADMISSION SERVICE
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', marginBottom: '1rem', lineHeight: '1.2' }}>
              Personalised <span className="gradient-text">1-to-1 Strategy</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              One wrong choice can waste years of hard work. Our experts guide you through every step of the KCET/COMEDK counseling process.
            </p>
          </div>

          {/* Lead Capturing Form */}
          <PremiumLeadForm />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '800' }}>What You Get:</h3>
              <ul style={{ padding: 0, listStyle: 'none', display: 'grid', gap: '1rem' }}>
                {[
                  'Custom Choice Entry List for all 3 rounds',
                  'Dedicated Rank-wise Analysis of Top 20 Colleges',
                  'Branch-wise Placement & Fee comparison',
                  'Priority Email/WhatsApp Support during counseling',
                  'Direct strategy to avoid common filling mistakes',
                  'Valid until your seat is locked in final round'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', fontWeight: '500' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', alignSelf: 'start', backgroundColor: 'rgba(255, 215, 0, 0.05)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>One-Time Service Fee</div>
              <div style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>₹500</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Inclusive of support for all counseling rounds.</p>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <a 
                  href="mailto:debugspheres@gmail.com?subject=Enrolling for Personalised Expert Counseling" 
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: '800' }}
                >
                  Book My Report via Email
                </a>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  or DM us on Instagram: 
                  <strong> @debugspheres</strong>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '800' }}>Terms & Conditions:</h3>
            <ul style={{ padding: 0, listStyle: 'none', display: 'grid', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li>• The ₹500 fee is a one-time payment and is non-refundable once the personalized report is shared.</li>
              <li>• Our analysis is based on historical cutoff data and current year trends. It is intended to be a strategic guide.</li>
              <li>• We do not "guarantee" admission to specific colleges, as actual seat allocation depends entirely on KEA/COMEDK's official process.</li>
              <li>• Support is valid until the completion of the final round of the 2024-25 counseling cycle.</li>
              <li>• Personalized reports will be delivered within 24-48 hours of rank and category verification.</li>
            </ul>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .premium-page { min-height: 80vh; background: radial-gradient(circle at center, hsla(45, 100%, 96%, 0.5), transparent 70%); }
      `}} />
    </div>
  );
};

export default PremiumCounseling;
