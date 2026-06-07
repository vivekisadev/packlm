import React from 'react';

export default function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 2rem', minHeight: '80vh' }}>
      <div className="stag" style={{ marginBottom: '16px' }}>// ABOUT THE CREATOR</div>
      <h1 className="sh" style={{ fontSize: '48px', marginBottom: '32px' }}>Hey, I'm Vivek 👋</h1>
      
      <p className="sd" style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '24px' }}>
        I'm an independent developer and the creator of PackLM. I came up with the idea for this format while building LLM-powered applications and watching my API bills skyrocket. I realized that feeding raw JSON arrays to an LLM was wildly inefficient—why was I paying the LLM to read the key <code>"student_name"</code> 500 times?
      </p>

      <p className="sd" style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '24px' }}>
        That frustration sparked a late-night idea: what if we just separate the schema from the data? After a lot of prototyping, testing with different models (like Claude and GPT-4), and iterating through edge cases (which is how the massive v2.1 nested-JSON upgrade came to life), PackLM was born. I managed to achieve this much by simply obsessing over token optimization and listening closely to the pain points of other AI builders.
      </p>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
        <a href="https://github.com/vivekisadev" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--acc)', textDecoration: 'none', fontWeight: 'bold' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          @vivekisadev
        </a>
        <a href="https://twitter.com/vivekisadev" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--acc)', textDecoration: 'none', fontWeight: 'bold' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          @vivekisadev
        </a>
      </div>

      <h2 className="sh" style={{ fontSize: '32px', marginBottom: '24px' }}>Let's Build Together</h2>
      <p className="sd" style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px' }}>
        While I've laid the groundwork, I am warmly welcoming people to help me make PackLM more convenient for developers everywhere. Whether it's building SDKs in new languages, creating LangChain integrations, or simply fixing a bug, I want your help!
      </p>

      <div style={{ background: 'var(--acc-dim)', border: '1px solid var(--acc-mid)', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ fontSize: '20px', fontFamily: "'Syne', sans-serif", color: 'var(--acc)', marginBottom: '12px' }}>How to become a contributor:</h3>
        <ol style={{ paddingLeft: '20px', margin: 0, color: 'var(--txt)', lineHeight: '1.7' }}>
          <li style={{ marginBottom: '8px' }}>Have an idea for a feature or an integration?</li>
          <li style={{ marginBottom: '8px' }}>Head over to our GitHub and <strong>raise an issue</strong> detailing your idea.</li>
          <li style={{ marginBottom: '8px' }}>I will personally preview your proposal and discuss the technical approach with you.</li>
          <li>Once we align, I will grant you <strong>contributor permissions</strong> to push your code directly to the repository!</li>
        </ol>
        <div style={{ marginTop: '24px' }}>
          <a href="https://github.com/vivekisadev/packlm/issues" target="_blank" rel="noreferrer" style={{ background: 'var(--acc)', color: 'white', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>
            Raise an Idea
          </a>
        </div>
      </div>
    </div>
  );
}
