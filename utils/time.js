// utils/time.js

/**
 * ms timestamp → ISO string
 */
export function toISO(ts) {
return new Date(ts).toISOString();
}

/**
 * ms timestamp → HH:MM:SS
 * popup için
 */
export function toTime(ts) {
return new Date(ts).toLocaleTimeString();
}

/**
 * Candle başlangıç zamanı
 * intervalSeconds: 5, 15, 60, ...
 */
export function candleStart(ts, intervalSeconds) {
  const intervalMs = intervalSeconds * 1000;
  return Math.floor(ts / intervalMs) * intervalMs;
}
