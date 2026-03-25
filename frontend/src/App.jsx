import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ChevronUp } from 'lucide-react';

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Floating Back to Top button
const BackToTop = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisible = () => {
      if (window.scrollY > 400) setVisible(true);
      else setVisible(false);
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <ChevronUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Lazy load pages for better performance (Code Splitting)
const Home = lazy(() => import('./pages/Home'));
const PredictionResults = lazy(() => import('./pages/PredictionResults'));
const Compare = lazy(() => import('./pages/Compare'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const PremiumCounseling = lazy(() => import('./pages/PremiumCounseling'));
const CollegeDetails = lazy(() => import('./pages/CollegeDetails'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const RankRangePredictor = lazy(() => import('./pages/RankRangePredictor'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/kcet-college-predictor" element={<PageWrapper><Home initialExam="KCET" /></PageWrapper>} />
          <Route path="/comedk-college-predictor" element={<PageWrapper><Home initialExam="COMEDK" /></PageWrapper>} />
          <Route path="/results" element={<PageWrapper><PredictionResults /></PageWrapper>} />
          <Route path="/compare" element={<PageWrapper><Compare /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
          <Route path="/premium-counseling" element={<PageWrapper><PremiumCounseling /></PageWrapper>} />
          <Route path="/college/:slug" element={<PageWrapper><CollegeDetails /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><AboutUs /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><ContactUs /></PageWrapper>} />
          <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
          <Route path="/terms-of-service" element={<PageWrapper><TermsOfService /></PageWrapper>} />
          <Route path="/disclaimer" element={<PageWrapper><Disclaimer /></PageWrapper>} />
          <Route path="/colleges-for-:exam-rank-:minRank-to-:maxRank" element={<PageWrapper><RankRangePredictor /></PageWrapper>} />
          <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
          <Route path="/blog/:slug" element={<PageWrapper><BlogPost /></PageWrapper>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};


const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
          <Navbar />
          <main style={{ flex: 1, paddingTop: '2rem' }}>
            <AnimatedRoutes />
          </main>
          <Footer />
          <BackToTop />
        </div>
      </Router>
    </HelmetProvider>
  );
}


export default App;
