import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <Link to="/" className="logo">PackLM</Link>
      <ul className="nav-links">
        <li><NavLink to="/" end>How it works</NavLink></li>
        <li><NavLink to="/converter">Converter</NavLink></li>
        <li><NavLink to="/docs">Docs</NavLink></li>
        <li><NavLink to="/changelog">Changelog</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span className="nav-badge">v2.1</span>
        <a href="https://github.com/vivekisadev/packlm" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--txt)', opacity: 0.7, transition: 'opacity 0.2s', display: 'flex', marginTop: '2px' }} onMouseOver={(e) => e.currentTarget.style.opacity = 1} onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}>
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>
      </div>
    </nav>
  );
}
