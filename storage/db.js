// storage/db.js

let db = null;
let currentPair = null;

/**
 * DB adı = pair adı
 * örn: eur_usd.db (IndexedDB içinde)
 */
export function initDB(pair) {
if (!pair) throw new Error("Pair required for DB init");

currentPair = pair;
const dbName = `${pair}.db`;

const request = indexedDB.open(dbName, 1);

request.onupgradeneeded = (event) => {
    const dbInstance = event.target.result;

    // tick tablosu
    const store = dbInstance.createObjectStore("ticks", {
    keyPath: "timestamp"
    });

    store.createIndex("timestamp", "timestamp", { unique: true });
};

request.onsuccess = (event) => {
    db = event.target.result;
};

request.onerror = () => {
    console.error("MarketReader DB init failed");
};
}

/**
 * Append-only tick write
 */
export function writeTick(tick) {
if (!db || !currentPair) return;

const tx = db.transaction("ticks", "readwrite");
const store = tx.objectStore("ticks");

try {
    store.add({
    timestamp: tick.timestamp,
    price: tick.price,
    lag: tick.lag ?? null
    });
} catch (e) {
    // duplicate timestamp vs. sessiz geç
}
}

/**
 * (Opsiyonel)
 * Python tarafına export için
 * tüm tickleri al
 */
export function readAllTicks(callback) {
if (!db) return;

const tx = db.transaction("ticks", "readonly");
const store = tx.objectStore("ticks");
const request = store.getAll();

request.onsuccess = () => {
    callback(request.result);
};
}
