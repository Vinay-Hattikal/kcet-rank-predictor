import { useState } from 'react';
import SEO from '../components/SEO';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Using mailto as a simple no-backend solution
    const mailtoLink = `mailto:mail-debugspheres@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Rank2College for any queries, feedback, or support regarding KCET and COMEDK college predictions."
        canonical="https://rank2college.in/contact"
      />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem', color: 'var(--text-primary)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Contact Us</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Have questions or feedback? We're here to help.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <InfoCard icon="📧" label="Email" value="mail-debugspheres@gmail.com" href="mailto:mail-debugspheres@gmail.com" />
          <InfoCard icon="🌐" label="Website" value="rank2college.in" href="https://rank2college.in" />
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '2.5rem' }}>✅</span>
            <h2 style={{ marginTop: '1rem' }}>Message Sent!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Thank you for reaching out. We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={rowStyle}>
              <FormField label="Your Name" id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Ravi Kumar" />
              <FormField label="Your Email" id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="ravi@example.com" />
            </div>
            <FormField label="Subject" id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange} required placeholder="Prediction query for KCET 2025" />
            <div>
              <label htmlFor="message" style={labelStyle}>Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Describe your query or feedback here..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <button type="submit" style={{ padding: '0.85rem 2rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}>
              Send Message
            </button>
          </form>
        )}
      </div>
    </>
  );
};

const rowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' };
const labelStyle = { display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: 'var(--text-secondary)', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem', boxSizing: 'border-box' };

const FormField = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} style={labelStyle}>{label}</label>
    <input id={id} style={inputStyle} {...props} />
  </div>
);

const InfoCard = ({ icon, label, value, href }) => (
  <a href={href} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.2rem', background: 'var(--card-bg)', borderRadius: '10px', border: '1px solid var(--border-color)', textDecoration: 'none', color: 'var(--text-primary)' }}>
    <span style={{ fontSize: '1.5rem' }}>{icon}</span>
    <div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{value}</div>
    </div>
  </a>
);

export default ContactUs;
