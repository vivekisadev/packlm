import React from 'react';
import CodeBlock from '../components/CodeBlock';

const EXAMPLE_PACKLM = `# PackLM v1.0 — School database example

@SC school_name city country founded

SC  "Delhi Public School"       Delhi    India  1949
SC  "St. Xavier's High School"  Mumbai   India  1869
SC  "The Doon School"           Dehradun India  1935

@ST student_name age grade gpa city

ST  "Alice Sharma"   20  A   3.9  Delhi
ST  "Bob Kumar"      19  B   3.2  Mumbai
ST  "Charlie Singh"  21  A+  3.8  Dehradun
ST  "Diana Mehta"    20  B+  3.5  Delhi
ST  "Ethan Patel"    22  A   4.0  Mumbai

# To add cross-references, use alias:row-index notation:
# @ST student_name age grade school_ref
# ST  "Alice Sharma"  20  A  SC:1`;

const PYTHON_SRC = `import shlex
import json


class PackLM:
    """
    PackLM — Token-efficient structured data format for LLMs.
    Zero dependencies. Python 3.8+.

    Format:
      @ALIAS field1 field2 ...   ← schema (once per entity type)
      ALIAS  val1   val2   ...   ← data rows
      ~                          ← null value
      "multi word"               ← quoted value with spaces

    Usage:
      packed = PackLM.encode(list_of_dicts)
      original = PackLM.decode(packed)
    """

    @staticmethod
    def encode(data) -> str:
        """Convert a Python list-of-dicts or dict-of-lists to PackLM format."""
        lines = []

        def fmt(v):
            if v is None:
                return '~'
            s = str(v)
            if s == '':
                return '""'
            return f'"s"' if ' ' in s else s

        def process(arr, alias):
            objs = [o for o in arr if isinstance(o, dict)]
            if not objs:
                return
            keys = list(dict.fromkeys(k for obj in objs for k in obj.keys()))
            lines.append(f"@{alias} {' '.join(keys)}")
            for obj in objs:
                row = ' '.join(fmt(obj.get(k)) for k in keys)
                lines.append(f"{alias} {row}")

        if isinstance(data, list):
            process(data, 'R')

        elif isinstance(data, dict):
            used = set()
            for key, val in data.items():
                if not isinstance(val, list):
                    continue
                alias = key[:2].upper() or 'R'
                n = 2
                while alias in used:
                    alias = key[0].upper() + str(n)
                    n += 1
                used.add(alias)
                lines.extend(['', f'# {key}'])
                process(val, alias)

        return '\\n'.join(lines).strip()

    @staticmethod
    def decode(text: str):
        """
        Convert PackLM text back to Python objects.
        Returns a list if there's a single 'R' schema,
        otherwise a dict keyed by alias.
        """
        schemas = {}
        result = {}

        for line in text.strip().splitlines():
            line = line.strip()
            if not line or line.startswith('#'):
                continue

            if line.startswith('@'):
                parts = line[1:].split()
                alias, fields = parts[0], parts[1:]
                schemas[alias] = fields
                result[alias] = []

            else:
                try:
                    parts = shlex.split(line)
                except ValueError:
                    parts = line.split()

                if not parts:
                    continue

                alias, vals = parts[0], parts[1:]
                if alias not in schemas:
                    continue

                obj = {
                    k: (None if v == '~' else v)
                    for k, v in zip(schemas[alias], vals)
                }
                result[alias].append(obj)

        if list(result.keys()) == ['R']:
            return result['R']
        return result


# ── LLM Integration Example ──────────────────────────────────────────

import anthropic

SYSTEM_PROMPT = """You receive data in PackLM format.
Lines starting with @ define the schema: @ALIAS field1 field2 ...
Other lines are data rows: ALIAS val1 val2 ... (values match schema order).
~ means null. Multi-word values are double-quoted."""

students = [
    {"name": "Alice",    "age": 20, "grade": "A",  "city": "Delhi"},
    {"name": "Bob",      "age": 19, "grade": "B",  "city": "Mumbai"},
]

packed = PackLM.encode(students)

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    system=SYSTEM_PROMPT,
    messages=[{
        "role": "user",
        "content": f"Analyze this student data:\\n\\n{packed}"
    }]
)`;

export default function Docs() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '60px', maxWidth: '1100px', margin: '0 auto', padding: '60px 2rem', alignItems: 'start' }}>
      
      {/* ════════════════════════ SIDE NAV ═════════════════════════════ */}
      <aside style={{ position: 'sticky', top: '120px' }}>
        <div className="stag" style={{ marginBottom: '16px' }}>// CONTENTS</div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li>
            <a href="#specification" style={{ color: 'var(--txt)', textDecoration: 'none', fontWeight: '500', fontSize: '14px', transition: 'color 0.2s' }}>
              Format Specification
            </a>
          </li>
          <li>
            <a href="#library" style={{ color: 'var(--txt)', textDecoration: 'none', fontWeight: '500', fontSize: '14px', transition: 'color 0.2s' }}>
              Python Library
            </a>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px', marginTop: '8px' }}>
              <li><a href="#installation" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px' }}>Installation</a></li>
              <li><a href="#quick-start" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px' }}>Quick Start</a></li>
              <li><a href="#using-with-llms" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px' }}>Using with LLMs</a></li>
            </ul>
          </li>
        </ul>
      </aside>

      {/* ════════════════════════ MAIN CONTENT ═════════════════════════════ */}
      <div style={{ paddingBottom: '100px' }}>
        
        <div style={{ paddingBottom: '40px', borderBottom: '1px solid var(--bord2)', marginBottom: '60px' }}>
          <div className="stag">// OFFICIAL DOCUMENTATION</div>
          <h1 style={{ fontSize: '48px', fontFamily: "'Syne', sans-serif", letterSpacing: '-1px', marginBottom: '16px', color: 'var(--txt)' }}>PackLM Spec & Guides</h1>
          <p className="sd" style={{ fontSize: '18px', maxWidth: '600px', lineHeight: '1.6' }}>Everything you need to know about integrating and parsing the PackLM structured data format in your own tools and LLM workflows.</p>
        </div>

        <section id="specification">
          <div className="stag">// FORMAT SPECIFICATION</div>
          <h2 className="sh">PackLM v1.0</h2>
          <p className="sd">A plain-text, line-oriented format. UTF-8 encoded. Files use the <code>.packlm</code> extension. Designed to be human-readable and LLM-friendly simultaneously.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
            
            <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid var(--bord2)', borderRadius: '16px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--acc)', fontSize: '16px', fontWeight: '700' }}>@ALIAS f1 f2 f3</div>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginTop: '12px', lineHeight: '1.6' }}>Schema definition. Declares field names for entity type ALIAS. Must appear before any data rows for that alias. One schema per entity type.</p>
              <div style={{ background: 'var(--bg)', padding: '12px 16px', borderRadius: '8px', marginTop: '16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--txt)', border: '1px solid var(--bord)' }}>Example: @ST name age grade</div>
            </div>

            <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid var(--bord2)', borderRadius: '16px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--acc)', fontSize: '16px', fontWeight: '700' }}>ALIAS v1 v2 v3</div>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginTop: '12px', lineHeight: '1.6' }}>Data row. Values in the exact same order as the declared schema. Alias must match a previously declared schema.</p>
              <div style={{ background: 'var(--bg)', padding: '12px 16px', borderRadius: '8px', marginTop: '16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--txt)', border: '1px solid var(--bord)' }}>Example: ST Alice 20 A</div>
            </div>

            <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid var(--bord2)', borderRadius: '16px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--acc)', fontSize: '16px', fontWeight: '700' }}>~</div>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginTop: '12px', lineHeight: '1.6' }}>Null / missing value. Decoded as None in Python, null in JSON.</p>
              <div style={{ background: 'var(--bg)', padding: '12px 16px', borderRadius: '8px', marginTop: '16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--txt)', border: '1px solid var(--bord)' }}>Example: ST Bob ~ B</div>
            </div>

            <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid var(--bord2)', borderRadius: '16px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--acc)', fontSize: '16px', fontWeight: '700' }}>""</div>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginTop: '12px', lineHeight: '1.6' }}>Explicitly empty string. Strictly different from the ~ (null) character.</p>
              <div style={{ background: 'var(--bg)', padding: '12px 16px', borderRadius: '8px', marginTop: '16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--txt)', border: '1px solid var(--bord)' }}>Example: ST Charlie "" A</div>
            </div>

            <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid var(--bord2)', borderRadius: '16px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--acc)', fontSize: '16px', fontWeight: '700' }}>"value with spaces"</div>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginTop: '12px', lineHeight: '1.6' }}>Multi-word string. Required when value contains whitespace. Use \" to escape a literal quote inside.</p>
              <div style={{ background: 'var(--bg)', padding: '12px 16px', borderRadius: '8px', marginTop: '16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--txt)', border: '1px solid var(--bord)' }}>Example: ST "Alice Smith" 20 A</div>
            </div>

            <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid var(--bord2)', borderRadius: '16px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--acc)', fontSize: '16px', fontWeight: '700' }}># comment text</div>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginTop: '12px', lineHeight: '1.6' }}>Line comment. Entire line is ignored by the parser. Useful for labelling entity sections.</p>
              <div style={{ background: 'var(--bg)', padding: '12px 16px', borderRadius: '8px', marginTop: '16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--txt)', border: '1px solid var(--bord)' }}>Example: # student records</div>
            </div>

          </div>

          <div className="stag" style={{ marginTop: '40px' }}>// FULL EXAMPLE</div>
          <CodeBlock title="school-database.packlm" code={EXAMPLE_PACKLM} />

            <div style={{ background: 'var(--acc-dim)', border: '1px solid var(--acc-mid)', borderRadius: '10px', padding: '16px 20px', marginTop: '20px' }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '15px', fontWeight: '600', color: 'var(--acc)', marginBottom: '8px' }}>System prompt to add to your LLM calls</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: 'var(--txt)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
{`You receive data in PackLM v2 format.
@ lines define schemas: @ALIAS field1 field2 ...
Data rows: ALIAS val1 val2 ... (values match schema order).
~ = null | "" = empty | a|b|c = array | a.b = nested key
# meta:name  -> single plain dict (one-row schema, not a list)
@key v1 v2 v3 -> inline primitive list (@lowercase = list, @UPPERCASE = schema)
# child:name -> child table linked to parent by _ref index`}
              </div>
            </div>
          </section>

        <hr className="div" style={{ margin: '60px 0' }} />

        <section id="library">
          <div className="stag">// PYTHON LIBRARY</div>
          <h2 className="sh">Usage & Installation</h2>
          <p className="sd">Zero dependencies — standard library only. You can install it via pip or just drop <code>packlm.py</code> into your project. Below is a guide on how to use it.</p>

          <h3 id="installation" style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '16px', marginTop: '32px' }}>Installation</h3>
          <p className="sd" style={{ marginBottom: '12px' }}>For new users, simply install via pip:</p>
          <CodeBlock title="bash" code="pip install packlm" />
          <p className="sd" style={{ marginTop: '16px', marginBottom: '12px' }}>If you previously used version 1.0, you must explicitly upgrade to get v2.1 nested JSON support:</p>
          <CodeBlock title="bash" code="pip install --upgrade packlm" />

          <h3 id="quick-start" style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '16px', marginTop: '40px' }}>Quick Start</h3>
          <CodeBlock title="python" code={`from packlm import PackLM

students = [
    {"name": "Alice",   "age": 20, "grade": "A",  "city": "Delhi"},
    {"name": "Bob",     "age": 19, "grade": "B",  "city": "Mumbai"},
]

# Encode
packed = PackLM.encode(students)
print(packed)
# @R name age grade city
# R Alice 20 A Delhi
# R Bob 19 B Mumbai

# Decode back to Python objects
restored = PackLM.decode(packed)`} />

          <h3 id="using-with-llms" style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '16px', marginTop: '40px' }}>Using with LLMs</h3>
          <p className="sd" style={{ marginBottom: '16px' }}>Add the PackLM system prompt to your LLM call and send the encoded data instead of JSON.</p>
          <CodeBlock title="python" code={`import anthropic
from packlm import PackLM, SYSTEM_PROMPT

client = anthropic.Anthropic()
packed = PackLM.encode(my_data)

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    system=SYSTEM_PROMPT,   # tells the LLM how to read PackLM
    messages=[{"role": "user", "content": f"Analyse this data:\\n\\n{packed}"}]
)`} />

          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '16px', marginTop: '40px' }}>packlm.py source</h3>
          <p className="sd" style={{ marginBottom: '16px' }}>If you don't want to use pip, just copy the latest v2 script directly from our GitHub repository.</p>
          <a href="https://github.com/vivekisadev/packlm" target="_blank" rel="noreferrer" style={{ color: 'var(--acc)', textDecoration: 'underline' }}>View source on GitHub</a>
        </section>
      </div>
    </div>
  );
}
