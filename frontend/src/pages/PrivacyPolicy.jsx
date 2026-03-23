import SEO from '../components/SEO';

const PrivacyPolicy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Read Rank2College's Privacy Policy to understand how we collect, use, and protect your personal information."
        canonical="https://rank2college.in/privacy-policy"
      />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem', color: 'var(--text-primary)', lineHeight: '1.8' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Last updated: March 2025</p>

        <p>Welcome to <strong>Rank2College</strong> ("we", "our", or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://rank2college.in" style={{ color: 'var(--primary)' }}>rank2college.in</a>.</p>

        <h2 style={h2Style}>1. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul style={ulStyle}>
          <li><strong>Personal Information:</strong> Name, email address when you voluntarily submit forms.</li>
          <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, and IP address collected automatically.</li>
          <li><strong>Cookies:</strong> Small data files stored on your browser to improve your experience.</li>
        </ul>

        <h2 style={h2Style}>2. How We Use Your Information</h2>
        <ul style={ulStyle}>
          <li>To provide and personalize our college prediction services.</li>
          <li>To improve our platform and understand usage patterns.</li>
          <li>To serve relevant advertisements via Google AdSense.</li>
          <li>To communicate with you about updates and offers (only if you opted in).</li>
        </ul>

        <h2 style={h2Style}>3. Google AdSense & Third-Party Advertising</h2>
        <p>We use <strong>Google AdSense</strong> to display advertisements. Google may use cookies to show you ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" style={{ color: 'var(--primary)' }} target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>

        <h2 style={h2Style}>4. Cookies</h2>
        <p>We use cookies to enhance your browsing experience. You can disable cookies through your browser settings. Note that disabling cookies may affect the functionality of our website.</p>

        <h2 style={h2Style}>5. Data Security</h2>
        <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>

        <h2 style={h2Style}>6. Third-Party Links</h2>
        <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites.</p>

        <h2 style={h2Style}>7. Children's Privacy</h2>
        <p>Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children.</p>

        <h2 style={h2Style}>8. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date at the top of this page.</p>

        <h2 style={h2Style}>9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:debugspheres@gmail.com" style={{ color: 'var(--primary)' }}>debugspheres@gmail.com</a></p>
      </div>
    </>
  );
};

const h2Style = { fontSize: '1.3rem', fontWeight: '600', marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' };
const ulStyle = { paddingLeft: '1.5rem', marginBottom: '1rem' };

export default PrivacyPolicy;
