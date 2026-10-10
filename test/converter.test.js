import test from "node:test";
import assert from "node:assert/strict";

import {
  htmlDecode,
  htmlEncode,
  jsonEscape,
  jsonUnescape,
  legacyEscape,
  legacyUnescape,
  transform,
  unicodeEscape,
  unicodeUnescape,
} from "../src/converter.js";

test("legacy escape preserves the historical safe character set", () => {
  assert.equal(legacyEscape("A test/value+1"), "A%20test/value+1");
});

test("legacy escape uses %uXXXX for UTF-16 code units", () => {
  assert.equal(legacyEscape("café ✓"), "caf%E9%20%u2713");
  assert.equal(legacyUnescape("caf%E9%20%u2713"), "café ✓");
});

test("complete escape encodes every code unit", () => {
  assert.equal(legacyEscape("Az", true), "%41%7A");
  assert.equal(transform("completeUnescape", "%41%7A"), "Az");
});

test("invalid legacy sequences remain unchanged", () => {
  assert.equal(legacyUnescape("%u12ZZ and %Q1"), "%u12ZZ and %Q1");
});

test("Unicode transformations support BMP and supplementary characters", () => {
  assert.equal(unicodeEscape("café 😀"), "caf\\u00E9 \\u{1F600}");
  assert.equal(unicodeUnescape("caf\\u00E9 \\u{1F600}"), "café 😀");
});

test("HTML transformations cover the five syntax-sensitive characters", () => {
  const input = "<a title=\"Tom & Jerry's\">";
  assert.equal(htmlDecode(htmlEncode(input)), input);
});

test("JSON transformations round-trip control characters", () => {
  const input = "line 1\n\"line 2\"";
  assert.equal(jsonUnescape(jsonEscape(input)), input);
});

test("URI component mode uses UTF-8 percent encoding", () => {
  assert.equal(transform("encodeURIComponent", "café & tea"), "caf%C3%A9%20%26%20tea");
});

test("unknown transformation modes fail explicitly", () => {
  assert.throws(() => transform("unknown", "text"), RangeError);
});
