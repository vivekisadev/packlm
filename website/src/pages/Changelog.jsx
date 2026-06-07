import React from 'react';

export default function Changelog() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 2rem', minHeight: '80vh' }}>
      <div className="stag" style={{ marginBottom: '16px' }}>// VERSION HISTORY</div>
      <h1 className="sh" style={{ fontSize: '48px', marginBottom: '16px' }}>Changelog</h1>
      <p className="sd" style={{ fontSize: '18px', maxWidth: '600px', marginBottom: '60px' }}>
        Track all updates, fixes, and improvements to the PackLM format and ecosystem.
      </p>

      {/* V2.1 */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '28px', margin: 0, fontFamily: "'Syne', sans-serif" }}>v2.1.0</h2>
          <span className="badge-green" style={{ fontSize: '12px', padding: '4px 10px' }}>Massive Upgrade</span>
        </div>
        <p className="sd" style={{ marginBottom: '24px' }}>
          <strong>The v2.1.0 Solution:</strong> We rewrote the engine from scratch. V2 handles complex, heterogeneous nested JSON structures flawlessly without dropping data, while maintaining extreme ~80% token savings using four new strategies:
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '20px', color: 'var(--txt)', lineHeight: '1.6' }}>
          <li><strong>Meta Blocks:</strong> Top-level dictionaries are securely encoded using a <code># meta:name</code> tag followed by a 1-row schema.</li>
          <li><strong>Inline Primitive Lists:</strong> Simple arrays are compacted into a single space-separated line using lowercase schemas: <code>@friends ana luis sam</code>. No JSON arrays or pipes needed!</li>
          <li><strong>Dot Flattening:</strong> Deeply nested dicts are safely flattened using dot notation (e.g., <code>address.city</code>).</li>
          <li><strong>Child Tables:</strong> Nested arrays of objects are extracted into separate schemas (e.g., <code># child:posts</code>) and intelligently linked back to their parents using an automatic <code>_ref</code> index.</li>
        </ul>
      </div>

      <hr className="div" style={{ margin: '40px 0' }} />

      {/* V1.0 */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '24px', margin: 0, fontFamily: "'Syne', sans-serif", color: 'var(--muted)', marginBottom: '16px' }}>v1.0.0</h2>
        <p className="sd" style={{ marginBottom: '16px' }}>
          <strong>The Problem with v1.0:</strong> Version 1.0 was fundamentally limited because it only knew how to process homogenous arrays of dictionaries. If you passed it a single nested dictionary, or a primitive array like <code>["apple", "banana"]</code>, it would completely drop the data! 
        </p>
        <p className="sd">
          It did, however, introduce the core PackLM concept: extracting schemas using <code>@ALIAS</code> and structuring data in space-separated rows.
        </p>
      </div>

      {/* Call to Action */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--bord)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '24px', fontFamily: "'Syne', sans-serif", marginBottom: '12px' }}>Got an idea for the next version?</h3>
        <p className="sd" style={{ marginBottom: '24px', marginInline: 'auto', maxWidth: '600px' }}>
          PackLM is open-source and community-driven. If you have any new ideas or feature requests, make sure to raise an issue on GitHub. Our maintainers will preview the idea and grant you permission as a contributor so you can build it!
        </p>
        <a href="https://github.com/vivekisadev/packlm/issues" target="_blank" rel="noreferrer" style={{ background: 'var(--acc)', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>
          Raise an Issue
        </a>
      </div>
    </div>
  );
}
