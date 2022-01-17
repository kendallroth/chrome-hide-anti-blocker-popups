/*document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: onPageLoad,
  });
});*/

let hideButton = document.getElementById("hideBtn");
hideButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: onHideClick,
  });
});

/**
 * Communication between various portions of the extension
 *
 *   - From: background, options, popup, foreground
 *   - To:   background, options, popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request.code) return;

  let messageText = document.getElementById("messageTxt");

  // Callback after manually hiding anti-blocker popups (from extension popup)
  if (
    request.code === "HIDE_COMPLETE_MANUAL" ||
    request.code === "HIDE_COMPLETE_AUTOMATIC"
  ) {
    messageText.innerText = request.message;
  }

  // Empty response necessary to avoid errors
  sendResponse();
});

/**
 * Hide anti-blocker popups
 *
 * NOTE: Executed inside current tab (not service worker!)
 */
const onHideClick = () => {
  const result = hideAntiBlockerPopup(document);

  if (result) {
    console.log("✔️ Manually hid anti-blocker popup");
  }

  const message = {
    code: "HIDE_COMPLETE_MANUAL",
    hidden: Boolean(result),
    message: result
      ? "Popup was hidden manually"
      : "No popups were hidden manually",
  };
  chrome.runtime.sendMessage(message, (response) => {});
};
