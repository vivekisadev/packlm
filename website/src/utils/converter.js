export function estTok(txt) {
  if (!txt || !txt.trim()) return 0;
  const punct = (txt.match(/[{}\[\]",:]/g) || []).length;
  const words = txt.split(/\s+/).filter(Boolean).length;
  return punct + words;
}

function fmtVal_v1(v) {
  if (v === null || v === undefined) return '~';
  if (typeof v === 'boolean') return String(v);
  if (typeof v === 'object') return '"' + JSON.stringify(v).replace(/"/g, '\\"') + '"';
  const s = String(v);
  if (s === '') return '""';
  if (/\s/.test(s)) return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  return s;
}

function mkAlias_v1(name, used) {
  const c = name.replace(/[^a-zA-Z]/g, '');
  let a = (c.slice(0, 2) || 'R').toUpperCase();
  let n = 2;
  while (used.has(a)) {
    a = (c[0] || 'R').toUpperCase() + (n++);
  }
  return a;
}

export function toPackLM_v1(str) {
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
        lines.push(alias + ' ' + keys.map((k) => fmtVal_v1(obj[k])).join(' '));
      });
    }

    if (Array.isArray(data)) {
      procArr(data, 'R');
    } else if (data && typeof data === 'object') {
      for (const [key, val] of Object.entries(data)) {
        if (Array.isArray(val)) {
          const alias = mkAlias_v1(key, used);
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

// ================== PACKLM V2 LOGIC ==================

function isPrimitive(v) {
  return v === null || v === undefined || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';
}

function allPrimitive(arr) {
  return Array.isArray(arr) && arr.every(isPrimitive);
}

function fmtVal_v2(v) {
  if (v === null || v === undefined) return '~';
  let s = String(v);
  if (s === '') return '""';
  s = s.replace(/\|/g, '\\|');
  return /\s/.test(s) ? '"' + s + '"' : s;
}

function aliasFor(name, used) {
  const base = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  let alias = base.slice(0, 2) || 'R';
  let n = 2;
  while (used.has(alias)) {
    alias = (base[0] || 'R') + n++;
  }
  used.add(alias);
  return alias;
}

function flatten(obj, prefix = '', inline_list_max = 6) {
  let out = {};
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, fullKey, inline_list_max));
    } else if (allPrimitive(v) && v.length <= inline_list_max) {
      out[fullKey] = v.map(fmtVal_v2).join('|');
    } else {
      out[fullKey] = v;
    }
  }
  return out;
}

export function toPackLM_v2(str, inline_list_max = 6) {
  try {
    const data = JSON.parse(str);
    const lines = [];
    const usedAliases = new Set();
    const childBlocks = [];

    function processList(arr, alias) {
      if (!arr || !arr.length) return;
      const flatObjs = [];
      const nestedFields = {};
      
      arr.forEach((item, idx) => {
        let obj = item;
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
           obj = { value: obj };
        }
        const flat = flatten(obj, '', inline_list_max);
        const clean = {};
        for (const [k, v] of Object.entries(flat)) {
          if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && !Array.isArray(v[0])) {
            if (!nestedFields[k]) nestedFields[k] = [];
            nestedFields[k].push([idx, v]);
          } else {
            clean[k] = v;
          }
        }
        flatObjs.push([idx, clean]);
      });

      const allKeys = [...new Set(flatObjs.flatMap(([_, o]) => Object.keys(o)))];
      lines.push(`@${alias} ${allKeys.join(' ')}`);
      
      flatObjs.forEach(([idx, flat]) => {
        const rowVals = allKeys.map(k => {
          const v = flat[k];
          if (v === undefined) return '~';
          if (typeof v === 'string' && v.includes('|') && !v.startsWith('"')) return v;
          return fmtVal_v2(v);
        });
        lines.push(`${alias} ${rowVals.join(' ')}`);
      });

      for (const [field, entries] of Object.entries(nestedFields)) {
        const childAlias = aliasFor(field, usedAliases);
        const allChildObjs = [];
        
        entries.forEach(([refIdx, childArr]) => {
          childArr.forEach(childObj => {
            const flatChild = flatten(
              (childObj && typeof childObj === 'object' && !Array.isArray(childObj)) ? childObj : { value: childObj },
              '', inline_list_max
            );
            allChildObjs.push([refIdx, flatChild]);
          });
        });

        const childKeys = [...new Set(allChildObjs.flatMap(([_, o]) => Object.keys(o)))];
        childBlocks.push(`\n# child:${field}`);
        childBlocks.push(`@${childAlias} _ref ${childKeys.join(' ')}`);
        
        allChildObjs.forEach(([refIdx, flatChild]) => {
          const rowVals = [refIdx];
          childKeys.forEach(k => {
            const v = flatChild[k];
            if (v === undefined) rowVals.push('~');
            else rowVals.push(typeof v === 'string' && v.includes('|') ? v : fmtVal_v2(v));
          });
          childBlocks.push(`${childAlias} ${rowVals.join(' ')}`);
        });
      }
    }

    if (Array.isArray(data)) {
      processList(data, 'R');
    } else if (data && typeof data === 'object') {
      for (const [key, val] of Object.entries(data)) {
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          const flat = flatten(val, '', inline_list_max);
          if (Object.values(flat).every(v => isPrimitive(v) || typeof v === 'string')) {
             const alias = aliasFor(key, usedAliases);
             if (lines.length) lines.push('');
             lines.push(`# meta:${key}`);
             lines.push(`@${alias} ${Object.keys(flat).join(' ')}`);
             lines.push(`${alias} ${Object.values(flat).map(fmtVal_v2).join(' ')}`);
          }
          continue;
        }

        if (allPrimitive(val)) {
          if (lines.length) lines.push('');
          lines.push(`@${key} ${val.map(fmtVal_v2).join(' ')}`);
          continue;
        }

        if (Array.isArray(val)) {
          const alias = aliasFor(key, usedAliases);
          if (lines.length) lines.push('');
          lines.push(`# ${key}`);
          processList(val, alias);
        }
      }
    }

    if (childBlocks.length) lines.push(...childBlocks);
    return lines.join('\n').trim();
  } catch (e) {
    return '# Error: ' + e.message;
  }
}

export const EXAMPLE_JSON = `{
  "context": {
    "task": "Our favorite hikes together",
    "location": "Boulder"
  },
  "friends": ["ana", "luis", "sam"],
  "hikes": [
    {"id": 1, "name": "Blue Lake Trail", "distanceKm": 7.5, "companion": "ana"},
    {"id": 2, "name": "Ridge Overlook",  "distanceKm": 9.2, "companion": "luis"},
    {"id": 3, "name": "Wildflower Loop", "distanceKm": 5.1, "companion": "sam"}
  ]
}`;
