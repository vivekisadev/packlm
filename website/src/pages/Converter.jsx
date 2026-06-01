import React, { useState, useEffect } from 'react';
import { estTok, toPackLM, EXAMPLE_JSON } from '../utils/converter';

export default function Converter() {
  const [jsonIn, setJsonIn] = useState(EXAMPLE_JSON);
  const [plmOut, setPlmOut] = useState('');
  const [inTok, setInTok] = useState(0);
  const [outTok, setOutTok] = useState(0);
  const [baseline, setBaseline] = useState('2');

  // Live conversion
  useEffect(() => {
    const val = jsonIn.trim();
    if (!val) {
      setInTok(0);
      setOutTok(0);
      setPlmOut('');
      return;
    }
    
    setInTok(estTok(val));
    try {
      const output = toPackLM(val);
      setPlmOut(output);
      setOutTok(estTok(output));
    } catch (e) {
      setPlmOut('Error parsing JSON...');
      setOutTok(0);
    }
  }, [jsonIn]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('URL copied to clipboard!');
    });
  };

  const handleBaselineChange = (e) => {
    const val = e.target.value;
    setBaseline(val);
    try {
      const parsed = JSON.parse(jsonIn);
      const space = val === '0' ? 0 : Number(val);
      setJsonIn(JSON.stringify(parsed, null, space));
    } catch (err) {
      // ignore if invalid JSON
    }
  };

  const pct = inTok > 0 ? Math.round((outTok / inTok) * 100) : 100;
  const savingPct = Math.max(0, 100 - pct);

  return (
    <div className="converter-wrap">
      <div className="wrap" style={{ maxWidth: '1400px', width: '95%' }}>
        
        <div style={{ marginBottom: '32px' }}>
          <div className="stag">// LIVE CONVERTER</div>
          <h1 className="sh" style={{ fontSize: '32px', marginBottom: '8px' }}>PackLM Converter</h1>
          <p className="sd" style={{ maxWidth: '600px' }}>Paste your JSON data below. The converter will automatically compress it into PackLM format and calculate your token savings.</p>
        </div>

        {/* Top Control Bar */}
        <div className="conv-top-bar">
          <div className="conv-top-acts">
            <div className="ctrl-group">
              <span className="ctrl-label">JSON Baseline</span>
              <select className="ctrl-select" value={baseline} onChange={handleBaselineChange}>
                <option value="2">Pretty (2 spaces)</option>
                <option value="4">Pretty (4 spaces)</option>
                <option value="0">Minified</option>
              </select>
            </div>
          </div>
          
          <div className="conv-top-acts" style={{ alignItems: 'flex-end' }}>
            <button className="btn-icon" onClick={handleShare}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
              Share
            </button>
          </div>
        </div>

        <div className="conv-grid">
          {/* JSON Panel */}
          <div className="ed-panel">
            <div className="ed-head">
              <span className="ed-title">JSON INPUT</span>
              <span className="tok"><strong>{inTok}</strong> tokens &nbsp; {jsonIn.length} chars</span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea 
                className="ed" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                spellCheck="false" 
                value={jsonIn}
                onChange={(e) => setJsonIn(e.target.value)}
                placeholder="Paste JSON here..."
              />
            </div>
          </div>

          {/* PackLM Panel */}
          <div className="ed-panel">
            <div className="ed-head">
              <span className="ed-title">
                PACKLM OUTPUT
                {savingPct > 0 && <span className="badge-green">-{savingPct}%</span>}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className="tok"><strong>{outTok}</strong> tokens &nbsp; {plmOut.length} chars</span>
                <button 
                  className="btn-icon" 
                  onClick={() => {
                    navigator.clipboard.writeText(plmOut);
                    const btn = document.getElementById('copy-out-btn');
                    if (btn) {
                      btn.innerHTML = 'Copied!';
                      setTimeout(() => {
                        btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
                      }, 2000);
                    }
                  }} 
                  id="copy-out-btn"
                  style={{ padding: '4px 10px', fontSize: '11px', background: 'var(--bg)', border: '1px solid var(--bord)', borderRadius: '6px' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  Copy
                </button>
              </div>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea 
                className="ed" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                readOnly 
                value={plmOut}
                placeholder="Output appears here…"
              />
            </div>
          </div>
        </div>
        
        {/* ════════════════════════ EXPLANATION ════════════════════════════ */}
        <div style={{ margin: '80px auto 0', paddingBottom: '60px', maxWidth: '1200px' }}>
          <div className="stag">// HOW IT WORKS UNDER THE HOOD</div>
          <h2 className="sh" style={{ fontSize: '32px', marginBottom: '32px' }}>The Conversion Technique</h2>
          
          <div className="bento-grid">
            
            <div className="bento-card bento-1">
              <div className="bento-num">01</div>
              <h3 className="bento-title">Array Detection & Schema Extraction</h3>
              <p className="bento-desc">
                The algorithm recursively scans your JSON to find homogenous arrays of objects. Once located, it extracts a union of all unique keys found across every object in that array. It then declares a single schema header at the top of the file starting with <code>@ALIAS</code>. 
                <br/><br/>
                By declaring these keys exactly once, PackLM completely eliminates the incredibly repetitive structural overhead of JSON.
              </p>
            </div>
            
            <div className="bento-card bento-2">
              <div className="bento-num">02</div>
              <h3 className="bento-title">Dynamic Aliasing</h3>
              <p className="bento-desc">
                If you pass a complex JSON object containing multiple nested arrays (e.g., <code>{"{"}"users": [...], "posts": [...]{"}"}</code>), the converter automatically generates distinct, optimized 2-letter aliases based on the dictionary keys (e.g., <code>@US</code> for users, <code>@PO</code> for posts) to keep the payload tight and readable.
              </p>
            </div>

            <div className="bento-card bento-3">
              <div className="bento-num">03</div>
              <h3 className="bento-title">Value Normalization</h3>
              <p className="bento-desc">
                As the converter processes the rows, it maps values strictly to the defined schema order, applying special normalization rules:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ background: 'var(--bg)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--bord)' }}>
                  <strong style={{ color: 'var(--acc)' }}>Nulls & Missing Keys:</strong><br/>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Mapped to the tilde character (<code>~</code>).</span>
                </li>
                <li style={{ background: 'var(--bg)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--bord)' }}>
                  <strong style={{ color: 'var(--acc)' }}>Strings with spaces:</strong><br/>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Wrapped in standard double quotes (<code>"like this"</code>) so the parser knows it's a single value.</span>
                </li>
                <li style={{ background: 'var(--bg)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--bord)' }}>
                  <strong style={{ color: 'var(--acc)' }}>Nested Objects:</strong><br/>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Stringified into minified JSON and wrapped in quotes as a fallback.</span>
                </li>
              </ul>
            </div>

            <div className="bento-card bento-4">
              <div className="bento-num">04</div>
              <h3 className="bento-title">Token Math & Compression</h3>
              <p className="bento-desc">
                Standard LLM tokenizers (like OpenAI's Tiktoken or Anthropic's Claude tokenizer) charge heavily for syntax. <code>"name": "Alice",</code> costs roughly 5 tokens just for one field. In PackLM, the same data is simply <code>Alice</code> (1 token). 
                <br/><br/>
                When you scale this across 1,000 rows, JSON wastes thousands of context-window tokens on quotes, colons, and braces, while PackLM achieves up to an 80% reduction.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
