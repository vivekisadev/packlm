"""
PackLM v2.1.0 — Token-efficient structured data format for LLMs.
Zero dependencies. Python 3.8+.

4 encoding strategies:
  1. META block       — top-level plain dicts  -> # meta:key single row
  2. Inline list      — primitive arrays       -> key v1 v2 v3  (space-separated, fewest tokens)
  3. Dot flattening   — nested dicts           -> dot-separated fields
  4. Child tables     — nested arrays of dicts -> separate schema with _ref
"""

import shlex, json, re


def _is_primitive(v):
    return v is None or isinstance(v, (str, int, float, bool))

def _all_primitive(lst):
    return isinstance(lst, list) and all(_is_primitive(v) for v in lst)

def _fmt_val(v):
    if v is None: return '~'
    s = str(v)
    if s == '': return '""'
    s = s.replace('|', '\\|')
    return f'"{s}"' if ' ' in s else s

def _parse_val(v):
    if v == '~': return None
    if v == '""': return ''
    return v.replace('\\|', '|')

def _alias_for(name: str, used: set) -> str:
    base = re.sub(r'[^A-Za-z0-9]', '', name).upper()
    alias = base[:2] or 'R'
    n = 2
    while alias in used:
        alias = base[0] + str(n); n += 1
    used.add(alias)
    return alias

def _flatten(obj: dict, prefix: str = '', inline_list_max: int = 6) -> dict:
    out = {}
    for k, v in obj.items():
        full_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            out.update(_flatten(v, full_key, inline_list_max))
        elif _all_primitive(v) and len(v) <= inline_list_max:
            out[full_key] = '|'.join(_fmt_val(i) for i in v)
        else:
            out[full_key] = v
    return out

def _unflatten(flat: dict) -> dict:
    out = {}
    for k, v in flat.items():
        parts = k.split('.')
        d = out
        for part in parts[:-1]:
            d = d.setdefault(part, {})
        d[parts[-1]] = v
    return out


class PackLM:
    VERSION = "2.1.0"

    @staticmethod
    def encode(data, inline_list_max: int = 6) -> str:
        lines = []
        used_aliases = set()
        child_blocks = []

        def process_list(arr, alias):
            if not arr: return
            flat_objs, nested_fields = [], {}
            for idx, obj in enumerate(arr):
                if not isinstance(obj, dict): obj = {'value': obj}
                flat = _flatten(obj, inline_list_max=inline_list_max)
                clean = {}
                for k, v in flat.items():
                    if isinstance(v, list) and v and isinstance(v[0], dict):
                        nested_fields.setdefault(k, []).append((idx, v))
                    else:
                        clean[k] = v
                flat_objs.append((idx, clean))

            all_keys = list(dict.fromkeys(k for _, o in flat_objs for k in o.keys()))
            lines.append(f"@{alias} {' '.join(all_keys)}")
            for idx, flat in flat_objs:
                row_vals = []
                for k in all_keys:
                    v = flat.get(k)
                    if v is None and k not in flat:
                        row_vals.append('~')
                    elif isinstance(v, str) and '|' in v and not v.startswith('"'):
                        row_vals.append(v)
                    else:
                        row_vals.append(_fmt_val(v))
                lines.append(f"{alias} {' '.join(row_vals)}")

            for field, entries in nested_fields.items():
                child_alias = _alias_for(field, used_aliases)
                all_child_objs = []
                for ref_idx, child_arr in entries:
                    for child_obj in child_arr:
                        flat_child = _flatten(
                            child_obj if isinstance(child_obj, dict) else {'value': child_obj},
                            inline_list_max=inline_list_max)
                        all_child_objs.append((ref_idx, flat_child))
                child_keys = list(dict.fromkeys(k for _, o in all_child_objs for k in o.keys()))
                child_blocks.append(f"\n# child:{field}")
                child_blocks.append(f"@{child_alias} _ref {' '.join(child_keys)}")
                for ref_idx, flat_child in all_child_objs:
                    row_vals = [str(ref_idx)]
                    for k in child_keys:
                        v = flat_child.get(k)
                        if v is None and k not in flat_child:
                            row_vals.append('~')
                        else:
                            row_vals.append(_fmt_val(v) if not (isinstance(v, str) and '|' in v) else v)
                    child_blocks.append(f"{child_alias} {' '.join(row_vals)}")

        if isinstance(data, list):
            process_list(data, 'R')

        elif isinstance(data, dict):
            for key, val in data.items():

                # strategy 1: plain dict -> META block (single row schema)
                if isinstance(val, dict):
                    flat = _flatten(val, inline_list_max=inline_list_max)
                    if all(_is_primitive(v) or isinstance(v, str) for v in flat.values()):
                        alias = _alias_for(key, used_aliases)
                        lines.extend(['', f'# meta:{key}'])
                        lines.append(f"@{alias} {' '.join(flat.keys())}")
                        lines.append(f"{alias} {' '.join(_fmt_val(v) for v in flat.values())}")
                    continue

                # strategy 2: primitive list -> space-separated inline line
                # e.g.  @friends ana luis sam
                # space saves tokens vs pipe (no extra | symbol per item)
                if _all_primitive(val) and isinstance(val, list):
                    lines.append('@' + key + ' ' + ' '.join(_fmt_val(v) for v in val))
                    continue

                # strategy 3+4: list of dicts -> table (with nested child support)
                if not isinstance(val, list):
                    continue
                alias = _alias_for(key, used_aliases)
                lines.extend(['', f'# {key}'])
                process_list(val, alias)

        lines.extend(child_blocks)
        return '\n'.join(lines).strip()

    @staticmethod
    def decode(text: str):
        schemas      = {}
        rows         = {}
        child_of     = {}
        meta_aliases = set()
        inline_lists = {}   # key -> [val, val, ...]
        pending      = None

        for line in text.strip().splitlines():
            line = line.strip()
            if not line:
                continue

            if line.startswith('#'):
                tag = line[1:].strip()
                if tag.startswith('child:'):
                    pending = ('child', tag[len('child:'):])
                elif tag.startswith('meta:'):
                    pending = ('meta', tag[len('meta:'):])
                else:
                    pending = None
                continue

            # @lowercase key = inline primitive list: @friends ana luis sam
            # @UPPERCASE key = schema definition (handled below)
            if line.startswith('@'):
                first = line[1:].split()[0] if line[1:].split() else ''
                if first and first[0].islower():
                    try:
                        parts = shlex.split(line[1:])  # strip the @
                    except ValueError:
                        parts = line[1:].split()
                    lkey, vals = parts[0], parts[1:]
                    inline_lists[lkey] = [_parse_val(v) for v in vals]
                    continue
                # else falls through to schema handler below

            if line.startswith('@'):
                parts = line[1:].split()
                alias, fields = parts[0], parts[1:]
                schemas[alias] = fields
                rows[alias] = []
                if pending:
                    kind, name = pending
                    if kind == 'child':
                        child_of[alias] = name
                    elif kind == 'meta':
                        meta_aliases.add(alias)
                    pending = None
                continue

            try:
                parts = shlex.split(line)
            except ValueError:
                parts = line.split()
            if not parts: continue
            alias, vals = parts[0], parts[1:]
            if alias not in schemas: continue
            obj = {}
            for k, v in zip(schemas[alias], vals):
                if v == '~':
                    obj[k] = None
                elif '|' in v and not v.startswith('"'):
                    obj[k] = [_parse_val(i) for i in v.split('|')]
                else:
                    obj[k] = _parse_val(v)
            rows[alias].append(obj)

        result = {}
        child_aliases = set(child_of.keys())

        for alias, record_list in rows.items():
            if alias in child_aliases:
                continue
            if alias in meta_aliases:
                result[alias] = _unflatten(record_list[0]) if record_list else {}
            else:
                result[alias] = [_unflatten(r) for r in record_list]

        # re-attach child tables
        for child_alias, field_name in child_of.items():
            child_rows = rows.get(child_alias, [])
            for parent_alias, parent_rows in result.items():
                if not isinstance(parent_rows, list): continue
                for child_row in child_rows:
                    ref = child_row.get('_ref')
                    if ref is None: continue
                    try: idx = int(ref)
                    except (ValueError, TypeError): continue
                    if idx < len(parent_rows):
                        parent_rows[idx].setdefault(field_name, [])
                        child_data = {k: v for k, v in child_row.items() if k != '_ref'}
                        parent_rows[idx][field_name].append(_unflatten(child_data))

        # merge inline primitive lists
        result.update(inline_lists)

        if list(result.keys()) == ['R']:
            return result['R']
        return result

    @staticmethod
    def token_savings_estimate(original_json: str, packed: str) -> dict:
        def est(txt):
            punct = len([c for c in txt if c in '{}[]",:'])
            return punct + len(txt.split())
        orig = est(original_json); pack = est(packed)
        saved = orig - pack
        pct = round((saved / orig) * 100, 1) if orig else 0
        return {"json_tokens": orig, "packlm_tokens": pack,
                "tokens_saved": saved, "percent_saved": pct}

    @staticmethod
    def to_json(data, **kwargs) -> str:
        return json.dumps(PackLM.decode(PackLM.encode(data)), **kwargs)


def encode(data) -> str: return PackLM.encode(data)
def decode(text: str):   return PackLM.decode(text)

SYSTEM_PROMPT = """You receive data in PackLM v2 format.
@ lines define schemas: @ALIAS field1 field2 ...
Data rows: ALIAS val1 val2 ... (values match schema order).
~ = null | "" = empty | a|b|c = array | a.b = nested key
# meta:name  -> single plain dict (one-row schema, not a list)
@key v1 v2 v3 -> inline primitive list (@lowercase = list, @UPPERCASE = schema)
# child:name -> child table linked to parent by _ref index"""


if __name__ == "__main__":
    import json
    data = {
      "context": {
        "task": "Our favorite hikes together",
        "location": "Boulder",
        "season": "spring_2025"
      },
      "friends": ["ana", "luis", "sam"],
      "hikes": [
        {"id": 1, "name": "Blue Lake Trail",  "distanceKm": 7.5, "elevationGain": 320, "companion": "ana",  "wasSunny": True},
        {"id": 2, "name": "Ridge Overlook",   "distanceKm": 9.2, "elevationGain": 540, "companion": "luis", "wasSunny": False},
        {"id": 3, "name": "Wildflower Loop",  "distanceKm": 5.1, "elevationGain": 180, "companion": "sam",  "wasSunny": True},
      ]
    }

    original = json.dumps(data, indent=2)
    packed   = PackLM.encode(data)
    stats    = PackLM.token_savings_estimate(original, packed)

    print("PackLM v2.1 ENCODED:")
    print(packed)
    print(f"\nToken savings: {stats['percent_saved']}%  ({stats['json_tokens']} -> {stats['packlm_tokens']} tokens)")

    # token breakdown per section
    def est(t): return len([c for c in t if c in '{}[]",:']) + len(t.split())
    friends_json   = json.dumps({"friends": ["ana","luis","sam"]})
    friends_packlm = "@friends ana luis sam"
    print(f"\nFriends specifically:")
    print(f"  JSON    : {friends_json!r}  -> ~{est(friends_json)} tokens")
    print(f"  PackLM  : {friends_packlm!r}  -> ~{est(friends_packlm)} tokens")

    print("\nDECODED BACK:")
    print(json.dumps(PackLM.decode(packed), indent=2))
