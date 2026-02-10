// content/ws_hook.js

(function () {
if (window.__marketReaderWSHooked) return;
window.__marketReaderWSHooked = true;

const OriginalWebSocket = window.WebSocket;

window.WebSocket = function (...args) {
    const ws = new OriginalWebSocket(...args);
    const wsUrl = args[0];

    ws.addEventListener("message", (event) => {
    try {
        chrome.runtime.sendMessage({
        type: "WS_MESSAGE",
        data: event.data,
        url: wsUrl
        });
    } catch (e) {
        // sessiz geç
    }
    });

    return ws;
};

  // prototype chain korunur (çok önemli)
window.WebSocket.prototype = OriginalWebSocket.prototype;

})();
