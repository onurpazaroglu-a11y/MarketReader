// content/injector.js
(() => {
  // 1️⃣ Page context'e ws_hook.js enjekte et
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("background/ws_hook.js");
  script.type = "text/javascript";
  script.async = false;

  (document.head || document.documentElement).appendChild(script);
  script.remove();

  // 2️⃣ Page → Content → Background veri köprüsü
  window.addEventListener("message", (event) => {
    // sadece page context'ten gelenleri al
    if (event.source !== window) return;

    if (event.data?.source !== "MarketReaderWS_RAW") return;

    chrome.runtime.sendMessage({
      type: "TICK_DATA",
      payload: event.data.payload
    });
  });

})();
