# JavaScript Escape / Unescape Converter

A small, dependency-free JavaScript library for converting legacy escape
sequences and modern text-encoding formats.

The project supports historical `%XX` and `%uXXXX` data without using the
deprecated global `escape()` and `unescape()` functions. It also exposes modern
URI encoding, JavaScript Unicode escapes, HTML entities and JSON string escapes.

Try the browser-based
[JavaScript Escape / Unescape Converter](https://web-code.org/coding-tools/javascript-escape-unescape-converter-tool.html).

## Why this exists

Legacy JavaScript escaping is not the same operation as URL encoding:

- `escape()` works on UTF-16 code units and may generate non-standard
  `%uXXXX` sequences.
- `encodeURI()` and `encodeURIComponent()` encode text as UTF-8 and generate
  standard percent-encoded bytes.
- JavaScript string escapes such as `\u00E9` belong to source-code and string
  syntax, not URL encoding.

These differences matter when inspecting old application data, archived code,
logs or security samples. The live converter keeps the modes separate so that
the selected transformation is explicit.

## Supported transformations

- Legacy escape and unescape: `%XX`, `%uXXXX`
- Complete legacy escape and unescape
- `encodeURI()` and `decodeURI()`
- `encodeURIComponent()` and `decodeURIComponent()`
- JavaScript Unicode escape and unescape
- HTML entity encode and decode
- JSON string escape and unescape

## Usage

```js
import {
  legacyEscape,
  legacyUnescape,
  transform,
} from "./src/converter.js";

legacyEscape("café ✓");
// "caf%E9%20%u2713"

legacyUnescape("caf%E9%20%u2713");
// "café ✓"

transform("encodeURIComponent", "café & tea");
// "caf%C3%A9%20%26%20tea"
```

## Development

The project requires a current Node.js version only for its test runner. The
conversion module itself has no dependencies.

```bash
npm test
```

## Safety

All input is treated as text. The library never evaluates or executes decoded
JavaScript. The browser-based tool processes input locally and does not send
converter contents to a server.

## Historical context

Web-Code.org previously provided a JavaScript Escape / Unescape Converter at
the same URL now used by the rebuilt tool. The current implementation is an
independent reconstruction with newly written code and explicit separation
between deprecated compatibility modes and current encoding standards.

## License

MIT © 2026 Oliver Jordanov
