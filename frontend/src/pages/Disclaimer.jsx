import SEO from '../components/SEO';

const Disclaimer = () => {
  return (
    <>
      <SEO
        title="Disclaimer"
        description="Read the Rank2College disclaimer. Our predictions are based on historical data and should be used for informational purposes only."
        canonical="https://rank2college.in/disclaimer"
      />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem', color: 'var(--text-primary)', lineHeight: '1.8' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Disclaimer</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Last updated: March 2025</p>

        <p>
          The information provided by <strong>Rank2College</strong> ("we", "us", or "our") on <a href="https://rank2college.in" style={{ color: 'var(--primary)' }}>rank2college.in</a> is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
        </p>

        <h2 style={h2Style}>1. Prediction Accuracy</h2>
        <p>
          Our college rank prediction tool uses <strong>historical cutoff data</strong> from previous years (KEA/COMEDK) to provide an estimate of admission probability. These predictions are <strong>not guarantees</strong> of admission. Actual cutoffs change every year based on factors like:
        </p>
        <ul style={ulStyle}>
          <li>Number of students appearing for the exam.</li>
          <li>The difficulty level of the examination.</li>
          <li>The number of available seats in colleges.</li>
          <li>Changes in seat reservation policies.</li>
        </ul>

        <h2 style={h2Style}>2. Educational Advice</h2>
        <p>
          The content on this website does not constitute professional counseling or educational advice. Users are strongly encouraged to verify the information with official government portals such as the <strong>Karnataka Examinations Authority (KEA)</strong> and <strong>COMEDK</strong> before making any final decisions regarding their college admissions.
        </p>

        <h2 style={h2Style}>3. External Links Disclaimer</h2>
        <p>
          The Site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
        </p>

        <h2 style={h2Style}>4. No Liability</h2>
        <p>
          Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
        </p>

        <h2 style={h2Style}>5. Contact Us</h2>
        <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at: <a href="mailto:mail-debugspheres@gmail.com" style={{ color: 'var(--primary)' }}>mail-debugspheres@gmail.com</a></p>
      </div>
    </>
  );
};

const h2Style = { fontSize: '1.3rem', fontWeight: '600', marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' };
const ulStyle = { paddingLeft: '1.5rem', marginBottom: '1rem' };

export default Disclaimer;
