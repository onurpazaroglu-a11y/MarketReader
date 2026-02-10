const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const pairInput = document.getElementById("pairInput");
const statusLine = document.getElementById("statusLine");
const lagLine = document.getElementById("lagLine");
const tickList = document.getElementById("tickList");

const MAX_TICKS = 20;

// Start
startBtn.addEventListener("click", () => {
const pair = pairInput.value.trim();
if (!pair) return alert("Pair required");

chrome.runtime.sendMessage({ type: "START_READER", pair }, (resp) => {
    statusLine.textContent = `Status: running (${pair})`;
});
});

// Stop
stopBtn.addEventListener("click", () => {
chrome.runtime.sendMessage({ type: "STOP_READER" }, (resp) => {
    statusLine.textContent = "Status: stopped";
});
});

// WS TICK & STATUS listener
chrome.runtime.onMessage.addListener((message) => {
switch (message.type) {

    case "UI_TICK":
    addTick(message.payload);
    break;

    case "UI_STATUS":
    if (message.payload.type === "WARN") {
        lagLine.textContent = `⚠️ ${message.payload.message} (${message.payload.delta}ms)`;
    }
    break;
}
});

function addTick(tick) {
const li = document.createElement("li");
li.textContent = `${tick.pair} | ${tick.price} | ${new Date(tick.timestamp).toLocaleTimeString()}`;
tickList.prepend(li);

while (tickList.children.length > MAX_TICKS) {
    tickList.removeChild(tickList.lastChild);
}

  lagLine.textContent = ""; // temizle lag mesajını yeni tick geldiğinde
}
