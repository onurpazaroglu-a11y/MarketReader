// background/background.js

import { initDB, writeTick, exportTicks } from "../storage/db.js";
import { log, warn } from "../utils/logger.js";
import { parseTick } from "../parsers/index.js";
import { nowMs, diffMs } from "../utils/time.js";

// ---- STATE ---- //

let isRunning = false;
let currentPair = null;
let lastTickTs = null;
let lastReceiveTs = null;

// lag / hız kontrolü
const EXPECTED_INTERVAL_MS = 1000; // tick beklentisi (1s varsayım)
const LAG_THRESHOLD_MS = 2000;     // 2s üstü uyarı

// ---- CORE: WS DATA ENTRY POINT ---- //
// injector / ws_hook buraya message yollar

function handleWebSocketMessage(rawData, wsUrl) {
if (!isRunning) return;

const receiveTs = nowMs();

const rawPayload = {
    data: rawData,
    url: wsUrl,
    receivedAt: receiveTs
};

  // 🔹 parse + normalize (TEK NOKTA)
const tick = parseTick(rawPayload);
if (!tick) return;

  // ---- PAIR FILTER ---- //
const normalizedInput = currentPair.toLowerCase().replace(/[^a-z0-9]/g, "");
const normalizedTick = tick.pair.toLowerCase().replace(/[^a-z0-9]/g, "");

if (normalizedInput !== normalizedTick) {
    return;
}

  // ---- TIME SANITY ---- //

  // timestamp geri gidiyorsa discard
if (lastTickTs && tick.timestamp <= lastTickTs) {
    warn("Tick discarded (time regression)", tick);
    return;
}

  // lag hesabı
let lag = null;
if (lastReceiveTs) {
    const delta = diffMs(receiveTs, lastReceiveTs);
    lag = delta - EXPECTED_INTERVAL_MS;

    if (delta > LAG_THRESHOLD_MS) {
    broadcastStatus({
        type: "WARN",
        message: "Low data rate detected",
        delta
    });
    }
}

lastTickTs = tick.timestamp;
lastReceiveTs = receiveTs;

const finalTick = {
    ...tick,
    lag
};

  // ---- STORAGE ---- //
writeTick(finalTick);

  // ---- UI ECHO ---- //
broadcastToPopup(finalTick);

log("TICK", finalTick);
}

// ---- MESSAGING ---- //

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
switch (message.type) {

    // ▶ START
    case "START_READER": {
    isRunning = true;
    currentPair = message.pair;

    lastTickTs = null;
    lastReceiveTs = null;

    initDB(currentPair);

    log("Reader started", { pair: currentPair });
    sendResponse({ status: "started" });
    break;
    }

    // ⏹ STOP
    case "STOP_READER": {
    isRunning = false;

    log("Reader stopped");
    sendResponse({ status: "stopped" });
    break;
    }

    // 📡 WS DATA (content / injector'dan gelir)
    case "WS_MESSAGE": {
    handleWebSocketMessage(message.data, message.url);
    break;
    }

    // 📤 EXPORT DATA (popup'tan gelir)
    case "EXPORT_DATA": {
    exportTicks((csv) => {
        sendResponse({ csv: csv, pair: currentPair });
    });
    return true;
    }
}

return true;
});

// ---- UI HELPERS ---- //

function broadcastToPopup(tick) {
chrome.runtime.sendMessage({
    type: "UI_TICK",
    payload: tick
});
}

function broadcastStatus(status) {
chrome.runtime.sendMessage({
    type: "UI_STATUS",
    payload: status
});
}
