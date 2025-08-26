document.getElementById('capture').addEventListener('click', async () => {
  alert("Capture initiated. Please wait while GPT processes the listing.");
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("[Land Capture] Sending CAPTURE_LISTING message to tab:", tab.id);
  chrome.tabs.sendMessage(tab.id, { type: "CAPTURE_LISTING" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("[Land Capture] Message send error:", chrome.runtime.lastError.message);
      alert("Error sending message: " + chrome.runtime.lastError.message);
    } else {
      console.log("[Land Capture] Message sent successfully.");
    }
  });
});