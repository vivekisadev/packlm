import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Converter from './pages/Converter';
import Docs from './pages/Docs';
import Changelog from './pages/Changelog';
import About from './pages/About';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/converter" element={<Converter />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
      {showToast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--acc)', color: 'white', padding: '16px 20px', borderRadius: '12px', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', display: 'flex', gap: '16px', alignItems: 'flex-start', maxWidth: '350px' }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>🚀 PackLM v2.1 is here!</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', lineHeight: '1.4', color: 'rgba(255,255,255,0.9)' }}>Massive upgrade: support for nested JSON, inline arrays, and better token savings.</p>
            <Link to="/changelog" onClick={() => setShowToast(false)} style={{ color: 'white', textDecoration: 'underline', fontSize: '13px', display: 'inline-block', marginTop: '8px', fontWeight: '700' }}>View Changelog →</Link>
          </div>
          <button onClick={() => setShowToast(false)} style={{ background: 'rgba(0,0,0,0.15)', border: 'none', color: 'white', padding: '6px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}
    </Router>
  );
}

export default App;
