// parsers/pocketoption.js

import { decodeWSData, safeJSONParse } from "./common.js";

export function parsePocketOption(rawPayload) {
  const { data, receivedAt } = rawPayload;

  const decoded = decodeWSData(data);
  if (!decoded) return null;

  // socket.io event payload'u değilse skip
  // örnek: 42["updateStream",{...}]
  if (!decoded.startsWith("42")) return null;

  const jsonPart = decoded.slice(2);
  const parsed = safeJSONParse(jsonPart);
  if (!parsed || !Array.isArray(parsed)) return null;

  const [event, payload] = parsed;

  if (event !== "updateStream") return null;
  if (!payload) return null;

  /**
   * PO payload genelde şu şekildedir:
   * {
   *   pair: "EURUSD",
   *   price: 1.08452,
   *   timestamp: 1700000000000
   * }
   *
   * (alan adları değişebilir)
   */

  const price = payload.price ?? payload.p;
  const timestamp = payload.timestamp ?? payload.t;
  const pair = normalizePair(payload.pair || payload.symbol);

  if (!price || !timestamp) return null;

  return {
    pair,
    price: Number(price),
    timestamp: Number(timestamp),
    source: "pocketoption",
    receivedAt
  };
}

// ---- helpers ---- //

function normalizePair(pair) {
  if (!pair) return "unknown";

  // EURUSD → eur_usd
  return pair
    .replace("/", "")
    .replace("_", "")
    .toLowerCase()
    .replace(/([a-z]{3})([a-z]{3})/, "$1_$2");
}
