const mutationCallback = (mutationsList, observer) => {
  mutationsList.forEach((mutation) => {
    const { attributeName, target } = mutation;
    if (attributeName !== "class") return;

    if (target.classList.contains("tp-modal-open")) {
      const result = hideAntiBlockerPopup(document);
      // const result = hideAntiBlockerPopup();
      if (result) {
        console.log("✔️ Automatically hid anti-blocker popup");
      }

      const message = {
        code: "HIDE_COMPLETE_AUTOMATIC",
        hidden: Boolean(result),
        message: result
          ? "Popup was hidden automatically"
          : "No popups were hidden automatically",
      };
      chrome.runtime.sendMessage(message, (response) => {});
    }

    mutationObserver.disconnect();
  });
};

// Observe 'body' tag to detect any anti-blocker popups that typically place
//   a non-scrollable class at document root.
const mutationObserver = new MutationObserver(mutationCallback);
mutationObserver.observe(document.querySelector("body"), { attributes: true });
