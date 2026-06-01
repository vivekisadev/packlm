"""
anthropic_example.py — Using PackLM with the Anthropic Claude API.

Shows how to replace verbose JSON with PackLM when sending structured
data to Claude, reducing token usage by 60-80%.

Install:
    pip install anthropic packlm

Run:
    python examples/anthropic_example.py
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import json
from packlm import PackLM, SYSTEM_PROMPT


# ── Sample data ───────────────────────────────────────────────────────────────

students = [
    {"name": "Alice Sharma",  "age": 20, "grade": "A",  "gpa": 3.9, "city": "Delhi"},
    {"name": "Bob Kumar",     "age": 19, "grade": "B",  "gpa": 3.2, "city": "Mumbai"},
    {"name": "Charlie Singh", "age": 21, "grade": "A+", "gpa": 3.8, "city": "Dehradun"},
    {"name": "Diana Mehta",   "age": 20, "grade": "B+", "gpa": 3.5, "city": "Delhi"},
    {"name": "Ethan Patel",   "age": 22, "grade": "A",  "gpa": 4.0, "city": "Mumbai"},
]


# ── Show token savings ────────────────────────────────────────────────────────

json_str = json.dumps(students, indent=2)
packed   = PackLM.encode(students)
stats    = PackLM.token_savings_estimate(json_str, packed)

print("=" * 55)
print("JSON version:")
print(json_str)
print()
print("PackLM version:")
print(packed)
print()
print(f"Estimated savings: {stats['percent_saved']}% fewer tokens")
print(f"  JSON:   ~{stats['json_tokens']} tokens")
print(f"  PackLM: ~{stats['packlm_tokens']} tokens")
print("=" * 55)


# ── Send to Claude (requires ANTHROPIC_API_KEY env var) ───────────────────────

try:
    import anthropic

    client = anthropic.Anthropic()

    print("\nSending PackLM data to Claude...\n")

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=512,
        system=SYSTEM_PROMPT,
        messages=[{
            "role": "user",
            "content": (
                f"Here is student data in PackLM format:\n\n{packed}\n\n"
                "Which city has the most students? Who has the highest GPA? "
                "Answer briefly."
            )
        }]
    )

    print("Claude's response:")
    print(response.content[0].text)

except ImportError:
    print("\n(Install 'anthropic' with: pip install anthropic)")
except Exception as e:
    print(f"\n(API call skipped: {e})")


# ── Decode round-trip ─────────────────────────────────────────────────────────

restored = PackLM.decode(packed)
print("\nDecoded back to Python:")
print(json.dumps(restored, indent=2))
