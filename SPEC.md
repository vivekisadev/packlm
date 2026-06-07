# PackLM Format Specification v2.1

> A plain-text, line-oriented, schema-first format for sending structured data to LLMs
> with minimal token overhead. Now supporting complex nested JSON and primitive arrays.

---

## Overview

PackLM separates the schema (field names) from the data (values). Field names are declared
once per entity type; every subsequent row contains only values in the declared order.
This eliminates the per-row key repetition that makes JSON expensive in LLM token budgets.

Version 2.0+ introduces native support for deeply nested heterogeneous JSON using four core strategies:
1. Meta blocks (for single objects)
2. Inline primitive lists (for flat arrays)
3. Dot-flattening (for nested objects)
4. Child tables (for nested arrays of objects)

---

## Grammar (EBNF)

```ebnf
document     = line*
line         = schema-line | data-line | comment-line | meta-marker | child-marker | inline-list | blank-line

schema-line  = "@" UPPER_ALIAS SP field (SP field)* NL
data-line    = UPPER_ALIAS SP value (SP value)* NL
inline-list  = "@" lower_alias SP value (SP value)* NL

meta-marker  = "# meta:" bare-token NL
child-marker = "# child:" bare-token NL
comment-line = "# " (any-char)* NL
blank-line   = NL

UPPER_ALIAS  = UPPERCASE (UPPERCASE | DIGIT)*
lower_alias  = lowercase (lowercase | DIGIT)*
field        = bare-token | dot-flattened-token
value        = bare-value | quoted-value | null-value | empty-value | array-value

bare-value   = (any-char except whitespace, '"', "~", "|")+
quoted-value = '"' (char | escape)* '"'
null-value   = "~"
empty-value  = '""'
array-value  = (bare-value | quoted-value) ("|" (bare-value | quoted-value))+

escape       = "\\" | "\"" | "\|"
SP           = " " | "\t"
NL           = LF | CRLF
```

---

## Core Rules

### 1 — Schema before data
A schema line (`@ALIAS ...`) **must** appear before any data rows that use that alias.
Parsers MUST raise an error (or skip) data rows whose alias has no declared schema.

### 2 — Null vs empty string
- `~` → decoded as `None` (Python) / `null` (JSON) — value is absent/unknown.
- `""` → decoded as `""` — value is present but explicitly empty.

### 3 — Quoted values
Any value containing whitespace MUST be double-quoted.  
A literal double-quote inside a quoted value MUST be escaped as `\"`.  

---

## V2 Encoding Strategies

### Strategy 1: Meta Blocks (Single Objects)
To encode a single top-level dictionary (e.g. `{"config": {"theme": "dark"}}`), emit a `# meta:` marker, followed by a schema and exactly one data row.
```
# meta:config
@CO theme
CO dark
```
When decoding, `CO` becomes a single object, not an array of objects.

### Strategy 2: Inline Primitive Lists
To encode an array of simple values (e.g. `{"tags": ["red", "blue"]}`), use a lowercase alias starting with `@`. This avoids creating a full table schema.
```
@tags red blue
```

### Strategy 3: Dot-Flattening
Nested dictionaries inside objects are flattened using dot notation.
```json
// JSON
{"user": {"profile": {"age": 20, "city": "NYC"}}}
```
```
// PackLM
@US profile.age profile.city
US 20 NYC
```

### Strategy 4: Child Tables (Nested Arrays of Objects)
If a dictionary contains a nested array of objects, it is extracted into a child table.
The child table is preceded by a `# child:property_name` marker.
Its schema MUST start with a special `_ref` field.
The `_ref` field value indicates the 0-based index of the parent row this child belongs to.

```
@PA name
PA "Parent One"
PA "Parent Two"

# child:children
@CH _ref name age
CH 0 "Child A" 5
CH 1 "Child B" 8
```
This decodes to: `[{"name": "Parent One", "children": [{"name": "Child A", "age": 5}]}, {"name": "Parent Two", "children": [{"name": "Child B", "age": 8}]}]`.

### Strategy 5: Primitive Arrays in Data Rows
If a field contains a short primitive array, it is joined with the pipe `|` character.
```
@US name scores
US Alice 95|80|100
```
Literal pipes inside values MUST be escaped as `\|`.

---

## LLM system prompt

To use PackLM v2 with any LLM, add this to the system prompt:

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

## Reference implementation

`packlm.py` — Python 3.8+, zero dependencies.  
See [github.com/vivekisadev/packlm](https://github.com/vivekisadev/packlm).

---

## License

This specification is released under **CC0 1.0 Universal** (public domain).  
Implement it in any language without restriction.
