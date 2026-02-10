// utils/logger.js

const MAX_LINES = 50;
let buffer = [];

/**
 * Log ekle
 */
export function log(message) {
const entry = {
    time: Date.now(),
    message
};

buffer.push(entry);

if (buffer.length > MAX_LINES) {
    buffer.shift();
}

return entry;
}

/**
 * Tüm logları al (popup için)
 */
export function getLogs() {
return buffer.slice();
}

/**
 * Logları temizle
 */
export function clearLogs() {
buffer = [];
}
