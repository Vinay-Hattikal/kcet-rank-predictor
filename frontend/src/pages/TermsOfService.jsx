import SEO from '../components/SEO';

const TermsOfService = () => {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Read the Terms of Service for Rank2College to understand the rules and guidelines for using our platform."
        canonical="https://rank2college.in/terms-of-service"
      />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem', color: 'var(--text-primary)', lineHeight: '1.8' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Last updated: March 2025</p>

        <p>Please read these Terms of Service ("Terms") carefully before using <strong>rank2college.in</strong> operated by <strong>Rank2College</strong>.</p>

        <h2 style={h2Style}>1. Acceptance of Terms</h2>
        <p>By accessing and using our website, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.</p>

        <h2 style={h2Style}>2. Description of Services</h2>
        <p>Rank2College provides a <strong>KCET & COMEDK college rank prediction tool</strong> based on historical cutoff data. Our predictions are for informational purposes only and do not guarantee admission to any college.</p>

        <h2 style={h2Style}>3. Disclaimer of Warranties</h2>
        <p>The prediction results provided by Rank2College are based on historical data and statistical analysis. We do <strong>not guarantee</strong> the accuracy of predictions. Actual cutoffs and admissions may vary based on the current year's data released by KEA or COMEDK.</p>

        <h2 style={h2Style}>4. User Responsibilities</h2>
        <ul style={ulStyle}>
          <li>You agree to use our services only for lawful purposes.</li>
          <li>You must not misuse, reverse-engineer, or attempt to copy our platform.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials (if applicable).</li>
        </ul>

        <h2 style={h2Style}>5. Intellectual Property</h2>
        <p>All content on Rank2College, including text, graphics, logos, and data, is the property of Rank2College and is protected by applicable intellectual property laws.</p>

        <h2 style={h2Style}>6. Advertising</h2>
        <p>Our website may display advertisements provided by Google AdSense and other advertising networks. We are not responsible for the content of third-party advertisements.</p>

        <h2 style={h2Style}>7. Limitation of Liability</h2>
        <p>Rank2College shall not be liable for any indirect, incidental, or consequential damages arising out of or in connection with your use of our services.</p>

        <h2 style={h2Style}>8. Changes to Terms</h2>
        <p>We reserve the right to modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new Terms.</p>

        <h2 style={h2Style}>9. Governing Law</h2>
        <p>These Terms shall be governed by the laws of <strong>India</strong>. Any disputes shall be subject to the jurisdiction of the courts in Karnataka, India.</p>

        <h2 style={h2Style}>10. Contact Us</h2>
        <p>If you have questions about these Terms, please contact us at: <a href="mailto:debugspheres@gmail.com" style={{ color: 'var(--primary)' }}>debugspheres@gmail.com</a></p>
      </div>
    </>
  );
};

const h2Style = { fontSize: '1.3rem', fontWeight: '600', marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' };
const ulStyle = { paddingLeft: '1.5rem', marginBottom: '1rem' };

export default TermsOfService;
