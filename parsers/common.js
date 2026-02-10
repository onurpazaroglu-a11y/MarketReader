// parsers/common.js

export function safeJSONParse(data) {
try {
    return JSON.parse(data);
} catch {
    return null;
}
}

export function decodeWSData(data) {
  // çoğu WS string gelir
if (typeof data === "string") return data;

  // ArrayBuffer → string
if (data instanceof ArrayBuffer) {
    return new TextDecoder("utf-8").decode(data);
}

return null;
}
