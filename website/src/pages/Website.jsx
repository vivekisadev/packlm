import React from 'react';

export default function Website() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 2rem', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>My Website</h1>
      <p style={{ color: 'var(--muted)', fontSize: '17px', lineHeight: '1.8' }}>
        Visit my personal site for projects, notes, and portfolio.
      </p>
      <a href="https://thisisvivek.vercel.app" target="_blank" rel="noopener noreferrer" style={{ marginTop: '20px', display: 'inline-block', padding: '12px 20px', background: 'var(--txt)', color: 'var(--bg)', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>Open thisisvivek.vercel.app →</a>
    </div>
  );
}
