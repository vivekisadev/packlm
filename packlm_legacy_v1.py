"""
PackLM — Token-efficient structured data format for LLMs.

Zero dependencies. Python 3.8+.

Format:
  @ALIAS field1 field2 ...   <- schema (once per entity type)
  ALIAS  val1   val2   ...   <- data rows
  ~                          <- null value
  "multi word"               <- quoted value with spaces

Usage:
  packed = PackLM.encode(list_of_dicts)
  original = PackLM.decode(packed)
"""

import shlex
import json


class PackLM:
    """
    PackLM — Token-efficient structured data format for LLMs.
    Zero dependencies. Python 3.8+.

    Format:
      @ALIAS field1 field2 ...   <- schema (once per entity type)
      ALIAS  val1   val2   ...   <- data rows
      ~                          <- null value
      "multi word"               <- quoted value with spaces

    Usage:
      packed = PackLM.encode(list_of_dicts)
      original = PackLM.decode(packed)
    """

    VERSION = "1.0.0"

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
            return f'"{s}"' if ' ' in s else s

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

        return '\n'.join(lines).strip()

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

        # Unwrap single-schema 'R' results to a plain list
        if list(result.keys()) == ['R']:
            return result['R']
        return result

    @staticmethod
    def to_json(data, **kwargs) -> str:
        """Encode data to PackLM, then immediately give back the JSON equivalent.
        Useful for verifying round-trip fidelity."""
        packed = PackLM.encode(data)
        decoded = PackLM.decode(packed)
        return json.dumps(decoded, **kwargs)

    @staticmethod
    def token_savings_estimate(original_json: str, packed: str) -> dict:
        """
        Rough token count comparison between JSON and PackLM.
        Uses punctuation + word counting — actual BPE savings vary by model.
        """
        def est(txt):
            punct = len([c for c in txt if c in '{}[]",:'])
            words = len(txt.split())
            return punct + words

        orig_tokens = est(original_json)
        pack_tokens = est(packed)
        saved = orig_tokens - pack_tokens
        pct = round((saved / orig_tokens) * 100, 1) if orig_tokens else 0

        return {
            "json_tokens": orig_tokens,
            "packlm_tokens": pack_tokens,
            "tokens_saved": saved,
            "percent_saved": pct,
        }


# ── Convenience top-level functions ──────────────────────────────────────────

def encode(data) -> str:
    """Shorthand for PackLM.encode(data)."""
    return PackLM.encode(data)


def decode(text: str):
    """Shorthand for PackLM.decode(text)."""
    return PackLM.decode(text)


# ── LLM System Prompt ─────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You receive data in PackLM format.
Lines starting with @ define the schema: @ALIAS field1 field2 ...
Other lines are data rows: ALIAS val1 val2 ... (values match schema order).
~ means null. Multi-word values are double-quoted."""


# ── CLI ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage:")
        print("  python packlm.py encode <file.json>")
        print("  python packlm.py decode <file.packlm>")
        sys.exit(0)

    cmd = sys.argv[1]
    path = sys.argv[2] if len(sys.argv) > 2 else None

    if cmd == "encode" and path:
        with open(path) as f:
            data = json.load(f)
        print(PackLM.encode(data))

    elif cmd == "decode" and path:
        with open(path) as f:
            text = f.read()
        print(json.dumps(PackLM.decode(text), indent=2))

    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
