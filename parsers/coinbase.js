// parsers/coinbase.js

import { decodeWSData, safeJSONParse } from "./common.js";

export function parseCoinbase(rawPayload) {
  const { data, receivedAt } = rawPayload;

  const decoded = decodeWSData(data);
  if (!decoded) return null;

  const parsed = safeJSONParse(decoded);
  if (!parsed || !Array.isArray(parsed)) return null;

  const message = parsed[1];
  if (!message) return null;

  if (message.type === "ticker") {
    const pair = normalizePair(message.product_id);
    const price = parseFloat(message.price);
    const timestamp = parseFloat(message.time) * 1000 || receivedAt;

    if (!price) return null;

    return {
      pair,
      price,
      timestamp,
      source: "coinbase",
      receivedAt
    };
  }

  if (message.type === "match" || message.type === "last_match") {
    const pair = normalizePair(message.product_id);
    const price = parseFloat(message.price);
    const timestamp = parseFloat(message.time) * 1000 || receivedAt;

    if (!price) return null;

    return {
      pair,
      price,
      timestamp,
      source: "coinbase",
      receivedAt
    };
  }

  return null;
}

function normalizePair(productId) {
  if (!productId) return "unknown";
  return productId.toLowerCase().replace(/-/, "_");
}
