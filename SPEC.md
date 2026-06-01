# PackLM Format Specification v1.0

> A plain-text, line-oriented, schema-first format for sending structured data to LLMs
> with minimal token overhead.

---

## Overview

PackLM separates the schema (field names) from the data (values). Field names are declared
once per entity type; every subsequent row contains only values in the declared order.
This eliminates the per-row key repetition that makes JSON expensive in LLM token budgets.

---

## Grammar (EBNF)

```ebnf
document     = line*
line         = schema-line | data-line | comment-line | blank-line

schema-line  = "@" alias SP field (SP field)* NL
data-line    = alias SP value (SP value)* NL
comment-line = "#" (any-char)* NL
blank-line   = NL

alias        = UPPERCASE (UPPERCASE | DIGIT)*
field        = bare-token
value        = bare-value | quoted-value | null-value | empty-value

bare-value   = (any-char except whitespace, '"', "~")+
quoted-value = '"' (char | escape)* '"'
null-value   = "~"
empty-value  = '""'

escape       = "\\" | "\""
SP           = " " | "\t"
NL           = LF | CRLF
```

---

## Rules

### 1 — Schema before data
A schema line (`@ALIAS ...`) **must** appear before any data rows that use that alias.
Parsers MUST raise an error (or skip) data rows whose alias has no declared schema.

### 2 — Field count must match
The number of values in a data row MUST equal the number of fields in the schema.
Parsers MAY fill trailing missing values with `None` / `null` for robustness, but
conforming encoders MUST always emit the correct field count.

### 3 — Alias convention
- 1–3 uppercase ASCII letters, optionally followed by digits.
- Convention (not required): derive from the entity name — `Students` → `ST`, `Orders` → `OR`.
- Aliases are **case-sensitive**: `ST` and `st` are different aliases.

### 4 — File extension
Files SHOULD use the `.packlm` extension.

### 5 — Encoding
UTF-8 required. Files MUST NOT include a BOM.

### 6 — Line endings
Both `LF` (`\n`) and `CRLF` (`\r\n`) are valid. Parsers MUST accept both.

### 7 — Null vs empty string
- `~` → decoded as `None` (Python) / `null` (JSON) — value is absent/unknown.
- `""` → decoded as `""` — value is present but explicitly empty.

### 8 — Quoted values
Any value containing whitespace MUST be double-quoted.  
A literal double-quote inside a quoted value MUST be escaped as `\"`.  
A literal backslash MUST be escaped as `\\`.

### 9 — Comments
Lines whose first non-whitespace character is `#` are comments.
Inline comments (after a value on a data line) are **not** supported — `#` in
the middle of a data line is treated as a literal value character.

### 10 — Blank lines
Ignored by the parser. Encoders MAY emit blank lines between entity-type groups
for human readability.

### 11 — Version header (recommended)
Files SHOULD include a version comment on the first line:
```
# packlm:1.0
```

---

## Full Example

```
# packlm:1.0 — School database

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
```

---

## Null and empty string examples

```
@US username email last_login
US  alice  alice@example.com  2024-01-15
US  bob    ""                 ~
```

- `bob`'s email is an empty string (present, but blank).
- `bob`'s `last_login` is null (never logged in).

---

## Multi-entity documents

A single PackLM document may contain multiple entity types.
Each entity type has its own schema (`@ALIAS`) and any number of following data rows.

```
@OR order_id customer total
OR  1001  alice  99.50
OR  1002  bob    149.00

@IT order_id product qty
IT  1001  "Laptop Stand"  1
IT  1001  "USB-C Hub"     2
IT  1002  "Mechanical Keyboard"  1
```

---

## LLM system prompt

To use PackLM with any LLM, add this to the system prompt:

```
You receive data in PackLM format.
Lines starting with @ define the schema: @ALIAS field1 field2 ...
Other lines are data rows: ALIAS val1 val2 ... — values match schema order.
~ means null. Multi-word values are double-quoted.
```

---

## Token savings model

For a dataset of **R** rows and **F** fields, approximate token counts:

| Format | Token cost formula | 100 rows × 5 fields |
|---|---|---|
| JSON | `R × (2F keys + 2F colons + 2F commas + 2F quotes + F values + 2 brackets)` | ~3,000 |
| PackLM | `F (schema, once) + R × (1 alias + F values)` | ~610 |

Savings grow linearly with row count. The schema cost is a fixed one-time overhead.

---

## Reference implementation

`packlm.py` — Python 3.8+, zero dependencies.  
See [github.com/yourusername/packlm](https://github.com/yourusername/packlm).

---

## Versioning

This document describes PackLM **v1.0**.  
Future versions will be backwards-compatible unless a major version is incremented.

---

## License

This specification is released under **CC0 1.0 Universal** (public domain).  
Implement it in any language without restriction.
