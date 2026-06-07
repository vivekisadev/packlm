import React, { useState, useEffect } from 'react';
import { estTok, toPackLM_v1, toPackLM_v2, EXAMPLE_JSON } from '../utils/converter';

export default function Converter() {
  const [jsonIn, setJsonIn] = useState(EXAMPLE_JSON);
  const [plmOut, setPlmOut] = useState('');
  const [inTok, setInTok] = useState(0);
  const [outTok, setOutTok] = useState(0);
  const [baseline, setBaseline] = useState('2');
  const [engineVersion, setEngineVersion] = useState('v2');

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
      const output = engineVersion === 'v2' ? toPackLM_v2(val) : toPackLM_v1(val);
      setPlmOut(output);
      setOutTok(estTok(output));
    } catch (e) {
      setPlmOut('Error parsing JSON...');
      setOutTok(0);
    }
  }, [jsonIn, engineVersion]);

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
        <div className="conv-top-bar" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div className="conv-top-acts">
            <div className="ctrl-group">
              <span className="ctrl-label">Engine Version</span>
              <select className="ctrl-select" style={{ fontWeight: '600', color: 'var(--acc)' }} value={engineVersion} onChange={(e) => setEngineVersion(e.target.value)}>
                <option value="v2">v2.1 (Recommended)</option>
                <option value="v1">v1.0 (Legacy - Drops nested data)</option>
              </select>
            </div>
            
            <div className="ctrl-group">
              <span className="ctrl-label">JSON Baseline</span>
              <select className="ctrl-select" value={baseline} onChange={handleBaselineChange}>
                <option value="2">Pretty (2 spaces)</option>
                <option value="4">Pretty (4 spaces)</option>
                <option value="0">Minified</option>
              </select>
            </div>
          </div>
          
          <div className="conv-top-acts" style={{ flex: 1, justifyContent: 'flex-end' }}>
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
                {engineVersion === 'v1' && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#ff6b6b', background: '#ff6b6b22', padding: '2px 6px', borderRadius: '4px' }}>WARNING: V1 drops nested data</span>}
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
          <div className="stag">// PACKLM V2 UPGRADES</div>
          <h2 className="sh" style={{ fontSize: '32px', marginBottom: '32px' }}>V2 Encoding Strategies</h2>
          
          <div className="bento-grid">
            
            <div className="bento-card bento-1">
              <div className="bento-num">01</div>
              <h3 className="bento-title">Array Detection & Schema Extraction</h3>
              <p className="bento-desc">
                The algorithm scans your JSON to find homogenous arrays of objects. It extracts a union of all unique keys found across every object in that array. It then declares a single schema header at the top starting with <code>@ALIAS</code>, eliminating the structural overhead of JSON.
              </p>
            </div>
            
            <div className="bento-card bento-2">
              <div className="bento-num">02</div>
              <h3 className="bento-title">Meta Blocks & Inline Lists (New in V2)</h3>
              <p className="bento-desc">
                V2 safely handles complex JSON. Top-level dictionaries are encoded using a <code># meta:name</code> block followed by a single row schema. Simple primitive arrays (like lists of strings) are instantly compacted using an inline schema: <code>@friends ana luis sam</code> without pipes or brackets!
              </p>
            </div>

            <div className="bento-card bento-3">
              <div className="bento-num">03</div>
              <h3 className="bento-title">Dot Flattening & Child Refs (New in V2)</h3>
              <p className="bento-desc">
                Deeply nested dictionaries are safely flattened using dot notation (e.g. <code>user.address.city</code>). Furthermore, if a dictionary contains nested arrays of objects, V2 extracts them into standalone <code># child:name</code> tables and intelligently links them back to their parents using an automatic <code>_ref</code> index!
              </p>
            </div>

            <div className="bento-card bento-4">
              <div className="bento-num">04</div>
              <h3 className="bento-title">Token Math & Compression</h3>
              <p className="bento-desc">
                Standard LLM tokenizers charge heavily for syntax. <code>"name": "Alice",</code> costs roughly 5 tokens just for one field. In PackLM, the same data is simply <code>Alice</code> (1 token). When scaling across 1,000 rows, JSON wastes thousands of tokens, while PackLM V2 achieves up to an 80% reduction without losing any nested data.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
