export function estTok(txt) {
  if (!txt || !txt.trim()) return 0;
  const punct = (txt.match(/[{}\[\]",:]/g) || []).length;
  const words = txt.split(/\s+/).filter(Boolean).length;
  return punct + words;
}

function fmtVal(v) {
  if (v === null || v === undefined) return '~';
  if (typeof v === 'boolean') return String(v);
  if (typeof v === 'object') return '"' + JSON.stringify(v).replace(/"/g, '\\"') + '"';
  const s = String(v);
  if (s === '') return '""';
  if (/\s/.test(s)) return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  return s;
}

function mkAlias(name, used) {
  const c = name.replace(/[^a-zA-Z]/g, '');
  let a = (c.slice(0, 2) || 'R').toUpperCase();
  let n = 2;
  while (used.has(a)) {
    a = (c[0] || 'R').toUpperCase() + (n++);
  }
  return a;
}

export function toPackLM(str) {
  try {
    const data = JSON.parse(str);
    const lines = [];
    const used = new Set();
    
    function procArr(arr, alias) {
      const objs = arr.filter((v) => v && typeof v === 'object' && !Array.isArray(v));
      if (!objs.length) return;
      const keys = [...new Set(objs.flatMap((o) => Object.keys(o)))];
      lines.push('@' + alias + ' ' + keys.join(' '));
      objs.forEach((obj) => {
        lines.push(alias + ' ' + keys.map((k) => fmtVal(obj[k])).join(' '));
      });
    }

    if (Array.isArray(data)) {
      procArr(data, 'R');
    } else if (data && typeof data === 'object') {
      for (const [key, val] of Object.entries(data)) {
        if (Array.isArray(val)) {
          const alias = mkAlias(key, used);
          used.add(alias);
          if (lines.length) lines.push('');
          lines.push('# ' + key);
          procArr(val, alias);
        }
      }
    }
    return lines.join('\n');
  } catch (e) {
    return '# Error: ' + e.message;
  }
}

export const EXAMPLE_JSON = `[
  {"student_name": "Alice Smith",  "age": 20, "grade": "A",  "gpa": 3.9, "city": "Delhi"},
  {"student_name": "Bob Kumar",    "age": 19, "grade": "B",  "gpa": 3.2, "city": "Mumbai"},
  {"student_name": "Charlie Roy",  "age": 21, "grade": "A",  "gpa": 3.8, "city": "Delhi"},
  {"student_name": "Diana Mehta",  "age": 20, "grade": "B+", "gpa": 3.5, "city": "Bangalore"},
  {"student_name": "Ethan Patel",  "age": 22, "grade": "A+", "gpa": 4.0, "city": "Chennai"}
]`;
