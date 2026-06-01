"""
test_packlm.py — Round-trip encode/decode tests for PackLM.
Run with: python -m pytest tests/ -v
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import pytest
from packlm import PackLM, encode, decode


# ── Encode tests ──────────────────────────────────────────────────────────────

class TestEncode:

    def test_simple_list(self):
        data = [{"name": "Alice", "age": 20}]
        out = PackLM.encode(data)
        assert "@R name age" in out
        assert "R Alice 20" in out

    def test_multiple_rows(self):
        data = [
            {"name": "Alice", "age": 20},
            {"name": "Bob",   "age": 19},
        ]
        out = PackLM.encode(data)
        lines = out.strip().splitlines()
        assert lines[0] == "@R name age"
        assert "R Alice 20" in out
        assert "R Bob 19" in out

    def test_null_value(self):
        data = [{"name": "Alice", "age": None}]
        out = PackLM.encode(data)
        assert "R Alice ~" in out

    def test_empty_string(self):
        data = [{"name": "Alice", "email": ""}]
        out = PackLM.encode(data)
        assert 'R Alice ""' in out

    def test_multiword_value(self):
        data = [{"name": "Alice Smith", "age": 20}]
        out = PackLM.encode(data)
        assert '"Alice Smith"' in out

    def test_dict_of_lists(self):
        data = {
            "students": [{"name": "Alice", "age": 20}],
            "schools":  [{"school": "DPS",  "city": "Delhi"}],
        }
        out = PackLM.encode(data)
        assert "# students" in out
        assert "# schools" in out
        assert "@ST" in out
        assert "@SC" in out

    def test_empty_list(self):
        assert PackLM.encode([]) == ""

    def test_non_dict_items_skipped(self):
        data = [{"name": "Alice"}, "not a dict", 42]
        out = PackLM.encode(data)
        assert "Alice" in out
        # non-dict items should not cause a crash
        lines = [l for l in out.splitlines() if l.startswith("R ")]
        assert len(lines) == 1

    def test_boolean_value(self):
        data = [{"name": "Alice", "active": True}]
        out = PackLM.encode(data)
        assert "R Alice True" in out

    def test_numeric_string(self):
        data = [{"code": "007", "value": 3.14}]
        out = PackLM.encode(data)
        assert "R 007 3.14" in out


# ── Decode tests ──────────────────────────────────────────────────────────────

class TestDecode:

    def test_simple_decode(self):
        text = "@R name age\nR Alice 20\nR Bob 19"
        result = PackLM.decode(text)
        assert isinstance(result, list)
        assert len(result) == 2
        assert result[0] == {"name": "Alice", "age": "20"}
        assert result[1] == {"name": "Bob",   "age": "19"}

    def test_null_decode(self):
        text = "@R name age\nR Alice ~"
        result = PackLM.decode(text)
        assert result[0]["age"] is None

    def test_empty_string_decode(self):
        text = '@R name email\nR Alice ""'
        result = PackLM.decode(text)
        assert result[0]["email"] == ""

    def test_quoted_multiword(self):
        text = '@R name age\nR "Alice Smith" 20'
        result = PackLM.decode(text)
        assert result[0]["name"] == "Alice Smith"

    def test_comments_ignored(self):
        text = "# this is a comment\n@R name\n# another comment\nR Alice"
        result = PackLM.decode(text)
        assert result[0]["name"] == "Alice"

    def test_blank_lines_ignored(self):
        text = "@R name\n\nR Alice\n\nR Bob"
        result = PackLM.decode(text)
        assert len(result) == 2

    def test_multi_alias_returns_dict(self):
        text = "@ST name\nST Alice\n@SC school\nSC DPS"
        result = PackLM.decode(text)
        assert isinstance(result, dict)
        assert "ST" in result
        assert "SC" in result

    def test_unknown_alias_skipped(self):
        text = "@R name\nR Alice\nXX orphan value"
        result = PackLM.decode(text)
        assert len(result) == 1

    def test_version_comment_ignored(self):
        text = "# packlm:1.0\n@R name\nR Alice"
        result = PackLM.decode(text)
        assert result[0]["name"] == "Alice"


# ── Round-trip tests ──────────────────────────────────────────────────────────

class TestRoundTrip:

    def _roundtrip(self, data):
        packed = PackLM.encode(data)
        restored = PackLM.decode(packed)
        return restored

    def test_basic_roundtrip(self):
        data = [
            {"name": "Alice", "age": "20", "grade": "A"},
            {"name": "Bob",   "age": "19", "grade": "B"},
        ]
        assert self._roundtrip(data) == data

    def test_null_roundtrip(self):
        data = [{"name": "Alice", "email": None}]
        assert self._roundtrip(data) == data

    def test_empty_string_roundtrip(self):
        data = [{"name": "Alice", "email": ""}]
        assert self._roundtrip(data) == data

    def test_multiword_roundtrip(self):
        data = [{"name": "Alice Smith", "city": "New Delhi"}]
        assert self._roundtrip(data) == data

    def test_many_rows_roundtrip(self):
        data = [{"id": str(i), "val": f"item_{i}"} for i in range(100)]
        assert self._roundtrip(data) == data

    def test_unicode_roundtrip(self):
        data = [{"name": "田中花子", "city": "東京"}]
        assert self._roundtrip(data) == data

    def test_mixed_nulls_roundtrip(self):
        data = [
            {"a": "1",  "b": None, "c": "3"},
            {"a": None, "b": "2",  "c": None},
        ]
        assert self._roundtrip(data) == data


# ── Token savings estimate ────────────────────────────────────────────────────

class TestTokenSavings:

    def test_savings_positive(self):
        import json
        data = [{"student_name": "Alice Smith", "age": 20, "grade": "A", "city": "Delhi"}
                for _ in range(10)]
        original = json.dumps(data)
        packed = PackLM.encode(data)
        stats = PackLM.token_savings_estimate(original, packed)
        assert stats["percent_saved"] > 0
        assert stats["json_tokens"] > stats["packlm_tokens"]

    def test_savings_keys_present(self):
        import json
        data = [{"k": "v"}]
        stats = PackLM.token_savings_estimate(json.dumps(data), PackLM.encode(data))
        for key in ("json_tokens", "packlm_tokens", "tokens_saved", "percent_saved"):
            assert key in stats


# ── Convenience functions ─────────────────────────────────────────────────────

class TestConvenienceFunctions:

    def test_top_level_encode(self):
        data = [{"x": "1"}]
        assert encode(data) == PackLM.encode(data)

    def test_top_level_decode(self):
        text = "@R x\nR 1"
        assert decode(text) == PackLM.decode(text)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
