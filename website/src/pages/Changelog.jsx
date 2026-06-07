import React from 'react';

export default function Changelog() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 2rem', minHeight: '80vh' }}>
      <div style={{ marginBottom: '100px' }}>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: '800', fontFamily: "'Syne', sans-serif", letterSpacing: '-1.5px', marginBottom: '24px', color: 'var(--txt)' }}>Changelog</h1>
        <p style={{ fontSize: '18px', maxWidth: '600px', color: 'var(--muted)', lineHeight: '1.6' }}>
          "PackLM is not just a compression trick. It is a step toward a world where AI systems communicate structured data efficiently."
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>

        {/* V2.1 Split */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Left Column (Date & Version) */}
          <div style={{ width: '200px', flexShrink: 0, position: 'sticky', top: '100px' }}>
            <span style={{ fontSize: '13px', color: 'var(--dim)', fontFamily: "'JetBrains Mono', monospace", display: 'block', marginBottom: '8px' }}>June 2026</span>
            <h2 style={{ fontSize: '28px', margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: '700', color: 'var(--txt)' }}>v2.1.0</h2>
            <div style={{ marginTop: '12px', display: 'inline-block', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--acc)', border: '1px solid rgba(46,255,164,0.2)', padding: '4px 10px', borderRadius: '4px' }}>The Complete Format</div>
          </div>

          {/* Right Column (Content) */}
          <div style={{ flex: 1, minWidth: '300px', borderLeft: '1px solid var(--bord)', paddingLeft: '40px' }}>
            <p style={{ color: 'var(--txt)', fontSize: '16px', lineHeight: '1.8', marginBottom: '40px' }}>
              <strong style={{ color: 'white' }}>The Core Principle:</strong> "No data should ever be silently lost during encoding." Every field in the input — nested or flat, object or array or primitive list — must appear in the PackLM output and decode back identically.
            </p>

            <h3 style={{ fontSize: '18px', fontFamily: "'Syne', sans-serif", color: 'white', marginBottom: '24px' }}>Four Encoding Strategies</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '60px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '4px', height: '100%', background: 'var(--bord2)', alignSelf: 'stretch', borderRadius: '4px' }}></div>
                <div>
                  <h4 style={{ color: 'white', fontFamily: "'Syne', sans-serif", fontSize: '15px', marginBottom: '4px' }}>1. META Blocks</h4>
                  <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginBottom: '8px', lineHeight: '1.6' }}>Top-level plain dicts are declared with a <code># meta:name</code> tag and encoded as a single-row schema. No context is lost.</p>
                  <code style={{ fontSize: '11.5px', color: 'var(--acc)', background: 'transparent', padding: 0 }}>@CO task location</code>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '4px', height: '100%', background: 'var(--bord2)', alignSelf: 'stretch', borderRadius: '4px' }}></div>
                <div>
                  <h4 style={{ color: 'white', fontFamily: "'Syne', sans-serif", fontSize: '15px', marginBottom: '4px' }}>2. Inline Lists</h4>
                  <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginBottom: '8px', lineHeight: '1.6' }}>Primitive arrays are compacted into a single space-separated line using lowercase schemas. No table overhead!</p>
                  <code style={{ fontSize: '11.5px', color: 'var(--acc)', background: 'transparent', padding: 0 }}>@friends ana luis sam</code>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '4px', height: '100%', background: 'var(--bord2)', alignSelf: 'stretch', borderRadius: '4px' }}></div>
                <div>
                  <h4 style={{ color: 'white', fontFamily: "'Syne', sans-serif", fontSize: '15px', marginBottom: '4px' }}>3. Dot Flattening</h4>
                  <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginBottom: '8px', lineHeight: '1.6' }}>Deeply nested dicts are safely flattened using dot notation, preserving the exact hierarchy.</p>
                  <code style={{ fontSize: '11.5px', color: 'var(--acc)', background: 'transparent', padding: 0 }}>@R address.city address.geo.lat</code>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '4px', height: '100%', background: 'var(--bord2)', alignSelf: 'stretch', borderRadius: '4px' }}></div>
                <div>
                  <h4 style={{ color: 'white', fontFamily: "'Syne', sans-serif", fontSize: '15px', marginBottom: '4px' }}>4. Child Tables</h4>
                  <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginBottom: '8px', lineHeight: '1.6' }}>Nested arrays of objects are extracted into separate schemas linked by a <code>_ref</code> index.</p>
                  <code style={{ fontSize: '11.5px', color: 'var(--acc)', background: 'transparent', padding: 0 }}>@SC _ref subject marks</code>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontFamily: "'Syne', sans-serif", color: 'white', marginBottom: '20px' }}>Token Savings</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left', marginBottom: '60px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 0', color: 'var(--dim)', borderBottom: '1px solid var(--bord)', fontWeight: '400' }}>Shape</th>
                  <th style={{ padding: '12px 0', color: 'var(--dim)', borderBottom: '1px solid var(--bord)', fontWeight: '400' }}>JSON</th>
                  <th style={{ padding: '12px 0', color: 'var(--dim)', borderBottom: '1px solid var(--bord)', fontWeight: '400' }}>v2</th>
                  <th style={{ padding: '12px 0', color: 'var(--dim)', borderBottom: '1px solid var(--bord)', fontWeight: '400' }}>Savings</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--muted)' }}>
                <tr style={{ transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 10px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Flat list, 3 rows</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>~60</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>~22</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'white' }}>63%</td>
                </tr>
                <tr style={{ transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 10px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Primitive list</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>~19</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>~4</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'white' }}>79%</td>
                </tr>
                <tr style={{ transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 10px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Nested obj (deep)</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>~40</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>~18</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'white' }}>55%</td>
                </tr>
                <tr style={{ transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 10px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Nested arr of obj</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>~80</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>~35</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'white' }}>56%</td>
                </tr>
                <tr style={{ transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 10px 12px 0' }}>Real-world mixed</td>
                  <td style={{ padding: '12px 10px' }}>~202</td>
                  <td style={{ padding: '12px 10px' }}>~59</td>
                  <td style={{ padding: '12px 10px', color: 'white' }}>71%</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ fontSize: '18px', fontFamily: "'Syne', sans-serif", color: 'white', marginBottom: '16px' }}>All Achievements</h3>
            <ul style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: '1.8', paddingLeft: '20px', listStyleType: 'circle' }}>
              <li>Full nested object support via dot flattening.</li>
              <li>Full nested array support via child tables.</li>
              <li>Top-level plain dict support via <code># meta:</code>.</li>
              <li>Primitive list inline encoding without table overhead.</li>
              <li>Accurate BPE-style Token Estimator.</li>
              <li>Backward compatible with v1 files.</li>
            </ul>
          </div>
        </div>

        {/* V1.0 Split */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: '200px', flexShrink: 0 }}>
            <span style={{ fontSize: '13px', color: 'var(--dim)', fontFamily: "'JetBrains Mono', monospace", display: 'block', marginBottom: '8px' }}>Early 2025</span>
            <h2 style={{ fontSize: '24px', margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: '500', color: 'var(--muted)' }}>v1.0.0</h2>
            <div style={{ marginTop: '12px', display: 'inline-block', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--dim)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '4px' }}>The Foundation</div>
          </div>

          <div style={{ flex: 1, minWidth: '300px', borderLeft: '1px solid var(--bord)', paddingLeft: '40px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '15.5px', lineHeight: '1.7', marginBottom: '32px' }}>
              Version 1 proved the core concept worked. It tackled flat lists of objects and delivered immediate token savings. However, it had clear gaps when processing real-world data.
            </p>

            <h3 style={{ fontSize: '16px', fontFamily: "'Syne', sans-serif", color: 'white', marginBottom: '16px' }}>The 5 Fatal Flaws</h3>
            <ul style={{ color: 'rgba(255,107,107,0.8)', fontSize: '14.5px', lineHeight: '1.8', paddingLeft: '20px', listStyleType: 'circle', marginBottom: '32px' }}>
              <li>No Nested Object Support: Silently dropped.</li>
              <li>No Nested Array Support: Silently dropped.</li>
              <li>No Top-Level Plain Dict Support: Silently dropped.</li>
              <li>Wasteful Primitive Lists: Encoded as full tables.</li>
              <li>Inaccurate Token Estimator: Space counting was wrong.</li>
            </ul>
          </div>
        </div>

        {/* What's Next Split */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '60px' }}>
          <div style={{ width: '200px', flexShrink: 0 }}>
            <span style={{ fontSize: '13px', color: 'var(--dim)', fontFamily: "'JetBrains Mono', monospace", display: 'block', marginBottom: '8px' }}>Future</span>
            <h2 style={{ fontSize: '24px', margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: '500', color: 'var(--muted)' }}>What's Next</h2>
          </div>

          <div style={{ flex: 1, minWidth: '300px', borderLeft: '1px solid var(--bord)', paddingLeft: '40px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '15.5px', lineHeight: '1.7', marginBottom: '24px' }}>
              PackLM v2.1 is stable. New features will be additive only. We are actively looking for contributors for:
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--txt)', border: '1px solid var(--bord)', padding: '6px 14px', borderRadius: '30px' }}>BPE tokenizer integration</span>
              <span style={{ fontSize: '12.5px', color: 'var(--txt)', border: '1px solid var(--bord)', padding: '6px 14px', borderRadius: '30px' }}>JavaScript / Rust ports</span>
              <span style={{ fontSize: '12.5px', color: 'var(--txt)', border: '1px solid var(--bord)', padding: '6px 14px', borderRadius: '30px' }}>Streaming decoder</span>
              <span style={{ fontSize: '12.5px', color: 'var(--txt)', border: '1px solid var(--bord)', padding: '6px 14px', borderRadius: '30px' }}>VS Code extension</span>
            </div>

            <div style={{ marginTop: '60px' }}>
              <a href="https://github.com/vivekisadev/packlm/issues" target="_blank" rel="noreferrer" style={{ color: 'var(--acc)', textDecoration: 'none', borderBottom: '1px solid rgba(46,255,164,0.4)', paddingBottom: '2px', fontSize: '14px', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.target.style.opacity = 0.8} onMouseOut={(e) => e.target.style.opacity = 1}>
                Got an idea? Raise an issue →
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
