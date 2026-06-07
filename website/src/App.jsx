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
        <div className="anim-slide-up" style={{ position: 'fixed', bottom: '24px', right: '24px', padding: '16px 20px', borderRadius: '8px', zIndex: 1000, boxShadow: '0 10px 40px rgba(0,0,0,0.5)', background: 'var(--bg2)', border: '1px solid var(--bord)', display: 'flex', gap: '16px', alignItems: 'center', maxWidth: '340px' }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--txt)' }}><span style={{ color: 'var(--acc)', marginRight: '6px' }}>v2.1</span> Nested JSON Support</h4>
            <Link to="/changelog" onClick={() => setShowToast(false)} style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px', display: 'inline-block', marginTop: '4px', borderBottom: '1px solid var(--bord)', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--txt)'} onMouseOut={(e) => e.target.style.color = 'var(--muted)'}>Read the release notes</Link>
          </div>
          <button onClick={() => setShowToast(false)} style={{ background: 'transparent', border: 'none', color: 'var(--dim)', padding: '4px', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--txt)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--dim)'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}
    </Router>
  );
}

export default App;
