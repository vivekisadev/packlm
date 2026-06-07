import React from 'react';

export default function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 2rem', minHeight: '80vh' }}>
      
      <div style={{ marginBottom: '80px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(40px, 7vw, 64px)', fontWeight: '800', fontFamily: "'Syne', sans-serif", letterSpacing: '-2px', color: 'var(--txt)', marginBottom: '24px' }}>Hey, I'm Vivek 👋</h1>
        <p style={{ fontSize: '20px', color: 'var(--muted)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
          I build open-source tools to solve bottlenecks in modern AI development.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '14px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>The Origin</h2>
        <p style={{ color: 'var(--txt)', fontSize: '17px', lineHeight: '1.8', maxWidth: '650px' }}>
          I came up with the idea for this format while building LLM-powered applications and watching my API bills skyrocket. I realized that feeding raw JSON arrays to an LLM was wildly inefficient—why was I paying the LLM to read the key <code>"student_name"</code> 500 times?
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '17px', lineHeight: '1.8', maxWidth: '650px' }}>
          That frustration sparked a late-night idea: what if we just separate the schema from the data? After prototyping and iterating through complex edge cases (which is how the massive v2.1 nested-JSON upgrade came to life), PackLM was born.
        </p>
      </div>

      <div style={{ maxWidth: '650px', margin: '0 auto 100px' }}>
        <h2 style={{ fontSize: '14px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>Connect</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          <a href="https://github.com/vivekisadev" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--txt)', border: '1px solid var(--bord)', padding: '10px 20px', borderRadius: '40px', textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--bord)'; e.currentTarget.style.background = 'transparent' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
          <a href="https://x.com/justvivek79030" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1DA1F2', border: '1px solid rgba(29, 161, 242, 0.3)', padding: '10px 20px', borderRadius: '40px', textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(29, 161, 242, 0.8)'; e.currentTarget.style.background = 'rgba(29, 161, 242, 0.05)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(29, 161, 242, 0.3)'; e.currentTarget.style.background = 'transparent' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            X
          </a>
          <a href="https://thisisvivek.vercel.app" target="_blank" rel="noreferrer" title="thisisvivek.vercel.app" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--txt)', border: '1px solid var(--bord)', padding: '10px 20px', borderRadius: '40px', textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--bord)'; e.currentTarget.style.background = 'transparent' }}>
            <img src="https://thisisvivek.vercel.app/favicon.ico" alt="Website favicon" style={{ width: 16, height: 16, objectFit: 'contain', display: 'inline-block' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
            Website
          </a>
          <a href="https://blogsbyvivek.vercel.app" target="_blank" rel="noreferrer" title="blogsbyvivek.vercel.app" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--txt)', border: '1px solid var(--bord)', padding: '10px 20px', borderRadius: '40px', textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--bord)'; e.currentTarget.style.background = 'transparent' }}>
            <img src="https://blogsbyvivek.vercel.app/favicon.ico" alt="Blogs favicon" style={{ width: 16, height: 16, objectFit: 'contain', display: 'inline-block' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
            Blogs
          </a>

        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--bord)', paddingTop: '60px' }}>
        <h2 style={{ fontSize: '24px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: 'white', marginBottom: '20px' }}>Let's Build Together</h2>
        <p style={{ color: 'var(--muted)', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px', maxWidth: '600px' }}>
          Whether it's building SDKs in new languages, creating LangChain integrations, or simply fixing a bug, I want your help!
        </p>
        
        <ol style={{ paddingLeft: '20px', margin: '0 0 40px 0', color: 'var(--muted)', lineHeight: '2.2', fontSize: '15px' }}>
          <li>Have an idea? Head over to GitHub and <strong style={{ color: 'white' }}>raise an issue</strong>.</li>
          <li>I will personally preview your proposal and discuss the technical approach.</li>
          <li>Once we align, I will grant you <strong style={{ color: 'var(--acc)' }}>contributor permissions</strong> to push your code!</li>
        </ol>

        <a href="https://github.com/vivekisadev/packlm/issues" target="_blank" rel="noreferrer" style={{ color: 'var(--bg)', background: 'var(--txt)', padding: '12px 28px', borderRadius: '4px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.target.style.opacity = 0.8} onMouseOut={(e) => e.target.style.opacity = 1}>
          Open an Issue →
        </a>
      </div>
      
    </div>
  );
}
