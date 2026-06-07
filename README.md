# PackLM · ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg) ![Python 3.8+](https://img.shields.io/badge/python-3.8%2B-blue)

> **Token-efficient structured data format for LLMs.**  
> Define fields once, list values — **60–80% fewer tokens than JSON.**

---

## The problem with JSON

Every time you send a list of objects to an LLM, JSON repeats every key name on every row:

```json
[
  {"student_name": "Alice Smith", "age": 20, "grade": "A",  "city": "Delhi"},
  {"student_name": "Bob Kumar",   "age": 19, "grade": "B",  "city": "Mumbai"},
  {"student_name": "Charlie Roy", "age": 21, "grade": "A+", "city": "Delhi"}
]
```
**~60 tokens** — most of it structural noise (`"student_name":` repeated 3× = 12 tokens wasted on one key alone).

## The PackLM way

```
@R student_name age grade city

R "Alice Smith"  20  A   Delhi
R "Bob Kumar"    19  B   Mumbai
R "Charlie Roy"  21  A+  Delhi
```
**~22 tokens** — schema declared once, values only per row.

| | JSON | PackLM | Saving |
|---|---|---|---|
| 3 rows, 4 fields | ~60 tokens | ~22 tokens | **~63%** |
| 100 rows, 4 fields | ~1,800 tokens | ~505 tokens | **~72%** |
| 500 rows, 4 fields | ~9,000 tokens | ~2,505 tokens | **~72%** |

Saving grows **linearly with row count** — the schema cost is paid once.

---

## 🌐 Live Converter & Docs

We have built a beautiful, fast web app for PackLM!

**Try it out:** Open the Live Converter to paste your JSON and instantly see how PackLM transforms it while calculating your exact token savings in real time. 

The website also contains the full **Premium Documentation** and format specification.

**Run the website locally:**
```bash
cd website
npm install
npm run dev
```

---

## Installation

```bash
# New users
pip install packlm

# Existing users (upgrading from v1.0)
pip install --upgrade packlm
```

Or just copy `packlm.py` into your project — zero dependencies, standard library only.

---

## Quick start

```python
from packlm import PackLM

students = [
    {"name": "Alice",   "age": 20, "grade": "A",  "city": "Delhi"},
    {"name": "Bob",     "age": 19, "grade": "B",  "city": "Mumbai"},
    {"name": "Charlie", "age": 21, "grade": "A+", "city": "Dehradun"},
]

# Encode
packed = PackLM.encode(students)
print(packed)
# @R name age grade city
# R Alice 20 A Delhi
# R Bob 19 B Mumbai
# R Charlie 21 A+ Dehradun

# Decode back to Python objects
restored = PackLM.decode(packed)
# [{"name": "Alice", "age": "20", "grade": "A", "city": "Delhi"}, ...]
```

---

## Using with LLMs

Add one line to your system prompt and send PackLM instead of JSON:

```python
import anthropic
from packlm import PackLM, SYSTEM_PROMPT

client = anthropic.Anthropic()

packed = PackLM.encode(my_data)

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    system=SYSTEM_PROMPT,   # tells the LLM how to read PackLM
    messages=[{"role": "user", "content": f"Analyse this data:\n\n{packed}"}]
)
```

**System prompt to add to any LLM call:**
```
You receive data in PackLM v2 format.
@ lines define schemas: @ALIAS field1 field2 ...
Data rows: ALIAS val1 val2 ... (values match schema order).
~ = null | "" = empty | a|b|c = array | a.b = nested key
# meta:name  -> single plain dict (one-row schema, not a list)
@key v1 v2 v3 -> inline primitive list (@lowercase = list, @UPPERCASE = schema)
# child:name -> child table linked to parent by _ref index
```

---

## Format at a glance

| Syntax | Description | Example |
|---|---|---|
| `@ALIAS f1 f2 f3` | Schema definition — declare once | `@ST name age grade` |
| `ALIAS v1 v2 v3` | Data row — values in schema order | `ST Alice 20 A` |
| `~` | Null / missing value | `ST Bob ~ B` |
| `""` | Explicitly empty string | `ST Charlie "" A` |
| `"value with spaces"` | Multi-word string | `ST "Alice Smith" 20 A` |
| `# comment` | Line comment, ignored by parser | `# student records` |
| *(blank line)* | Ignored, use for readability | |

---

## CLI usage

```bash
# Encode a JSON file to PackLM
python packlm.py encode data.json

# Decode a PackLM file back to JSON
python packlm.py decode data.packlm
```

---

## Token savings estimate

```python
import json
from packlm import PackLM

original = json.dumps(my_data)
packed   = PackLM.encode(my_data)

stats = PackLM.token_savings_estimate(original, packed)
print(stats)
# {"json_tokens": 860, "packlm_tokens": 210, "tokens_saved": 650, "percent_saved": 75.6}
```

---

## Why this matters at scale

At $15 / 1M input tokens (e.g. Claude Opus):

| Monthly data volume | JSON cost | PackLM cost | Saving |
|---|---|---|---|
| 10M tokens | $150 | ~$37 | **$113 / month** |
| 100M tokens | $1,500 | ~$375 | **$1,125 / month** |

---

## Specification

See [SPEC.md](SPEC.md) for the full grammar, edge cases, and rules for implementing PackLM in other languages.

---

## Contributing

PackLM is open-source and community-driven. If you have any new ideas or feature requests, **make sure to raise an issue on GitHub**.

I will personally preview the idea, and once approved, grant you permission as a contributor so you can push your changes directly!

Things we are actively looking for:
- JavaScript / TypeScript implementation
- Rust / Go / Java implementations
- Integrations with LangChain and LlamaIndex
- Benchmarks against real tokenizers (tiktoken, sentencepiece)

---

## License

MIT — see [LICENSE](LICENSE).
