const hex = (value, width) => value.toString(16).toUpperCase().padStart(width, "0");

/**
 * Reproduce the historical JavaScript escape() algorithm without calling the
 * deprecated global function. The complete mode escapes every UTF-16 code unit.
 */
export function legacyEscape(value, complete = false) {
  let result = "";

  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    const character = value[index];

    if (!complete && /[A-Za-z0-9@*_+\-./]/.test(character)) {
      result += character;
    } else if (code <= 0xFF) {
      result += `%${hex(code, 2)}`;
    } else {
      result += `%u${hex(code, 4)}`;
    }
  }

  return result;
}

/** Decode legacy %XX and %uXXXX sequences while leaving invalid text intact. */
export function legacyUnescape(value) {
  return value.replace(
    /%u([0-9a-f]{4})|%([0-9a-f]{2})/gi,
    (match, wide, narrow) => String.fromCharCode(Number.parseInt(wide || narrow, 16)),
  );
}

/** Escape non-ASCII characters and JavaScript control characters. */
export function unicodeEscape(value) {
  let result = "";

  for (const character of value) {
    const point = character.codePointAt(0);

    if (character === "\\") result += "\\\\";
    else if (character === "\n") result += "\\n";
    else if (character === "\r") result += "\\r";
    else if (character === "\t") result += "\\t";
    else if (character === "\b") result += "\\b";
    else if (character === "\f") result += "\\f";
    else if (point <= 0x7F) result += character;
    else if (point <= 0xFFFF) result += `\\u${hex(point, 4)}`;
    else result += `\\u{${hex(point, 1)}}`;
  }

  return result;
}

/** Decode JavaScript-style Unicode, hexadecimal and common control escapes. */
export function unicodeUnescape(value) {
  return value
    .replace(/\\u\{([0-9a-f]+)\}/gi, (_, part) => String.fromCodePoint(Number.parseInt(part, 16)))
    .replace(/\\u([0-9a-f]{4})/gi, (_, part) => String.fromCharCode(Number.parseInt(part, 16)))
    .replace(/\\x([0-9a-f]{2})/gi, (_, part) => String.fromCharCode(Number.parseInt(part, 16)))
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\\\/g, "\\");
}

export function htmlEncode(value) {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  };

  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

export function htmlDecode(value) {
  const entities = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: "\"",
    apos: "'",
    "#39": "'",
  };

  return value.replace(/&(amp|lt|gt|quot|apos|#39);/g, (match, name) => entities[name]);
}

export function jsonEscape(value) {
  return JSON.stringify(value).slice(1, -1);
}

export function jsonUnescape(value) {
  return JSON.parse(`"${value}"`);
}

export function transform(mode, value) {
  switch (mode) {
    case "legacyEscape": return legacyEscape(value);
    case "legacyUnescape":
    case "completeUnescape": return legacyUnescape(value);
    case "completeEscape": return legacyEscape(value, true);
    case "encodeURI": return encodeURI(value);
    case "decodeURI": return decodeURI(value);
    case "encodeURIComponent": return encodeURIComponent(value);
    case "decodeURIComponent": return decodeURIComponent(value);
    case "unicodeEscape": return unicodeEscape(value);
    case "unicodeUnescape": return unicodeUnescape(value);
    case "htmlEncode": return htmlEncode(value);
    case "htmlDecode": return htmlDecode(value);
    case "jsonEscape": return jsonEscape(value);
    case "jsonUnescape": return jsonUnescape(value);
    default: throw new RangeError(`Unknown transformation mode: ${mode}`);
  }
}
