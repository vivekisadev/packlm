import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      {/* ═══════════════════════════════ HERO ══════════════════════════════ */}
      <div className="hero">
        <div className="hero-tag">⬡ Token-Efficient Structured Data for LLMs</div>
        <h1>PackLM</h1>
        <p className="hero-sub">
          <strong>PackLM (Packaged Language Model Format)</strong> is a brutally efficient plain-text format for feeding structured data to LLMs. Define fields once, list values. 60–80% fewer tokens than JSON. 100% open-source and completely free to use.
        </p>
        <div className="hero-btns">
          <Link to="/converter" className="btn-acc">↓ Try the Converter</Link>
          <Link to="/docs" className="btn-out">View Spec →</Link>
        </div>
      </div>

      {/* ══════════════════════════ COMPARISON ═════════════════════════════ */}
      <section className="wrap" style={{ paddingBottom: '80px' }}>
        <div className="hero-cmp">
          {/* JSON side */}
          <div className="cmp-panel">
            <div className="cmp-head">
              <span className="cmp-label">JSON</span>
              <span className="tag-bad">~55 tokens</span>
            </div>
            <div 
              className="cmp-body" 
              dangerouslySetInnerHTML={{ __html: `<span class="cp">[</span>\n  <span class="cp">{</span>\n    <span class="ck">"student_name"</span><span class="cp">:</span> <span class="cs">"Alice"</span><span class="cp">,</span>\n    <span class="ck">"age"</span><span class="cp">:</span> <span class="cn">20</span><span class="cp">,</span>\n    <span class="ck">"grade"</span><span class="cp">:</span> <span class="cs">"A"</span>\n  <span class="cp">},</span>\n  <span class="cp">{</span>\n    <span class="ck">"student_name"</span><span class="cp">:</span> <span class="cs">"Bob"</span><span class="cp">,</span>\n    <span class="ck">"age"</span><span class="cp">:</span> <span class="cn">19</span><span class="cp">,</span>\n    <span class="ck">"grade"</span><span class="cp">:</span> <span class="cs">"B"</span>\n  <span class="cp">}</span>\n<span class="cp">]</span>` }}
            />
          </div>

          <div className="arr-mid">→</div>

          {/* PackLM side */}
          <div className="cmp-panel">
            <div className="cmp-head">
              <span className="cmp-label">PackLM</span>
              <span className="tag-good">~23 tokens</span>
            </div>
            <div 
              className="cmp-body"
              dangerouslySetInnerHTML={{ __html: `<span class="cc"># schema — defined once</span>\n<span class="ca">@ST</span> student_name age grade\n\n<span class="cc"># data rows — values only</span>\n<span class="ca">ST</span>  Alice  20  A\n<span class="ca">ST</span>  Bob    19  B` }}
            />
          </div>
        </div>

        <div className="stats">
          <div className="stat"><div className="stat-n">~75%</div><div className="stat-l">fewer tokens</div></div>
          <div className="stat"><div className="stat-n">0</div><div className="stat-l">dependencies</div></div>
          <div className="stat"><div className="stat-n">LLM</div><div className="stat-l">native readable</div></div>
          <div className="stat"><div className="stat-n">2-way</div><div className="stat-l">encode / decode</div></div>
        </div>
      </section>

      <hr className="div" />

      {/* ═══════════════════════════ HOW IT WORKS ═════════════════════════ */}
      <section className="sec" id="how-it-works">
        <div className="stag">// HOW IT WORKS</div>
        <h2 className="sh">Schema once. Values only.</h2>
        <p className="sd">
          JSON wastes tokens by repeating key names on every single row. PackLM separates the schema from the data — like a database table header — so keys are declared once regardless of how many rows follow.
        </p>

        <div className="how-grid">
          <div className="how-card" data-n="01">
            <div className="how-ico">🔍</div>
            <div className="how-t">The JSON problem</div>
            <div className="how-d">JSON repeats every key name per object. With 5 fields and 100 rows, you spend 500 key-tokens (plus 500 colons, 500 commas, 1000 quotes) on structure alone — wasted context window.</div>
          </div>
          <div className="how-card" data-n="02">
            <div className="how-ico">📋</div>
            <div className="how-t">Declare schema once</div>
            <div className="how-d">A line beginning with <code>@ALIAS</code> declares the fields for that entity type. <code>@ST name age grade</code> — appears once, no matter how many student rows follow.</div>
          </div>
          <div className="how-card" data-n="03">
            <div className="how-ico">⚡</div>
            <div className="how-t">Values-only rows</div>
            <div className="how-d">Each data row is just the alias plus values in schema order — no keys, brackets or colons. <code>ST Alice 20 A</code>. Multi-word values use quotes. Null is <code>~</code>.</div>
          </div>
          <div className="how-card" data-n="04">
            <div className="how-ico">🧠</div>
            <div className="how-t">LLMs understand it</div>
            <div className="how-d">Add one sentence to your system prompt. LLMs grasp column-oriented tabular data natively — the pattern matches CSV, SQL tables, and spreadsheets in their training data.</div>
          </div>
        </div>

        <div className="stag">// TOKEN BREAKDOWN</div>
        <h3 style={{fontFamily:"'Syne',sans-serif", fontSize:"22px", fontWeight:"700", letterSpacing:"-0.5px", marginBottom:"16px"}}>Where the savings come from</h3>

        <div className="cb">
          <div className="cb-head"><span className="cb-lang">JSON — token cost per row</span></div>
          <pre 
            className="cc2" 
            dangerouslySetInnerHTML={{ __html: `<span style="color:var(--red)">{"student_name": "Alice Smith", "age": 20, "grade": "A"}</span>\n\n  "student_name"    → 4 tokens   (quote + student + _ + name + quote)\n  :                 → 1 token\n  "Alice Smith"     → 3 tokens\n  ,                 → 1 token    (repeated between every field)\n  {  }  [  ]        → structural overhead on every row\n\n  Per-row cost:  ~18 tokens for just 3 fields\n  100 rows:      ~1,800 tokens  (most of it structural noise)` }} 
          />
        </div>

        <div className="cb">
          <div className="cb-head"><span className="cb-lang">PackLM — token cost</span></div>
          <pre 
            className="cc2" 
            dangerouslySetInnerHTML={{ __html: `<span style="color:var(--acc)">@ST student_name age grade</span>   ← schema: ~5 tokens, paid ONCE\n\n<span style="color:var(--acc)">ST "Alice Smith" 20 A</span>         ← row:    ~5 tokens\n\n  100 rows:  5 + (100 × 5) = <span style="color:var(--acc)">~505 tokens</span>\n  Saving vs JSON: ~1,295 tokens  (~72% reduction)\n  Saving grows linearly with row count` }} 
          />
        </div>
      </section>
    </>
  );
}
