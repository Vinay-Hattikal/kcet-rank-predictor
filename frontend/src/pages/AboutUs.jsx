import SEO from '../components/SEO';

const AboutUs = () => {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Rank2College – Karnataka's most accurate KCET and COMEDK college rank predictor, helping students find their dream engineering college."
        canonical="https://rank2college.in/about"
      />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem', color: 'var(--text-primary)', lineHeight: '1.8' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>About Rank2College</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Helping Karnataka students make smarter college decisions.</p>

        <h2 style={h2Style}>Who We Are</h2>
        <p>
          <strong>Rank2College</strong> is a free-to-use college prediction platform specifically designed for students appearing in <strong>KCET</strong> and <strong>COMEDK</strong> examinations in Karnataka. We provide data-driven admission probability estimates to help students identify the best colleges based on their ranks.
        </p>

        <h2 style={h2Style}>Our Mission</h2>
        <p>
          Our mission is to <strong>simplify the college selection process</strong> for students and parents by providing accurate, historical cutoff-based predictions. We believe every student deserves access to transparent and data-backed guidance when choosing their engineering college.
        </p>

        <h2 style={h2Style}>What We Offer</h2>
        <ul style={ulStyle}>
          <li>✅ <strong>KCET Rank Predictor</strong> – Predict your college based on KCET rank and category.</li>
          <li>✅ <strong>COMEDK Rank Predictor</strong> – Find colleges matching your COMEDK score.</li>
          <li>✅ <strong>College Compare Tool</strong> – Side-by-side comparison of colleges.</li>
          <li>✅ <strong>College Browser</strong> – Browse all Karnataka engineering colleges with cutoff history.</li>
          <li>✅ <strong>Premium Counseling</strong> – Get personalized guidance from experts.</li>
        </ul>

        <h2 style={h2Style}>Our Data</h2>
        <p>
          All predictions are based on <strong>official historical cutoff data</strong> released by KEA (Karnataka Examinations Authority) and COMEDK. We update our database regularly to ensure accuracy.
        </p>

        <h2 style={h2Style}>Contact Us</h2>
        <p>Have questions or feedback? We'd love to hear from you.</p>
        <p>📧 Email: <a href="mailto:mail-debugspheres@gmail.com" style={{ color: 'var(--primary)' }}>mail-debugspheres@gmail.com</a></p>
        <p>🌐 Website: <a href="https://rank2college.in" style={{ color: 'var(--primary)' }}>rank2college.in</a></p>
      </div>
    </>
  );
};

const h2Style = { fontSize: '1.3rem', fontWeight: '600', marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' };
const ulStyle = { paddingLeft: '1.5rem', marginBottom: '1rem' };

export default AboutUs;
