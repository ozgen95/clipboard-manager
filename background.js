chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "NEW_COPY") {
    const copiedText = message.text;

    chrome.storage.local.get({ history: [] }, function (data) {
      const updatedHistory = [
        {
          text: copiedText,
          time: Date.now(),
        },
        ...data.history,
      ];
      chrome.storage.local.set({ history: updatedHistory });
    });
  }
});
