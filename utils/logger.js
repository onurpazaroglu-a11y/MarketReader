// utils/logger.js

const MAX_LINES = 50;
let buffer = [];

/**
 * Log ekle
 */
export function log(message) {

const entry = {
    time: Date.now(),
    message,
    type: "info"
};

buffer.push(entry);

if (buffer.length > MAX_LINES) {
    buffer.shift();
}

return entry;
}

/**
 * Uyarı logu
 */
export function warn(message) {
const entry = {
    time: Date.now(),
    message,
    type: "warn"
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
