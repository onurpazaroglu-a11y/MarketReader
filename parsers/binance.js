// parsers/binance.js

import { decodeWSData, safeJSONParse } from "./common.js";

export function parseBinance(rawPayload) {
  const { data, url, receivedAt } = rawPayload;

  const decoded = decodeWSData(data);
  if (!decoded) return null;

  const parsed = safeJSONParse(decoded);
  if (!parsed) return null;

  if (parsed.e === "trade" || parsed.e === "24hrTicker") {
    const pair = normalizePair(parsed.s);
    const price = parseFloat(parsed.p || parsed.c);
    const timestamp = parsed.T || parsed.E;

    if (!price || !timestamp) return null;

    return {
      pair,
      price,
      timestamp,
      source: "binance",
      receivedAt
    };
  }

  if (parsed.e === "kline") {
    const pair = normalizePair(parsed.s);
    const price = parseFloat(parsed.k.c);
    const timestamp = parsed.k.t;

    if (!price || !timestamp) return null;

    return {
      pair,
      price,
      timestamp,
      source: "binance",
      receivedAt
    };
  }

  return null;
}

function normalizePair(symbol) {
  if (!symbol) return "unknown";
  return symbol.toLowerCase().replace(/[^a-z0-9]/g, "_");
}
