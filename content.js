// Listen for copy event
document.addEventListener("copy", function () {
  const newText = window.getSelection().toString().trim();

  if (newText) {
    // send the new text to background.js to log it on storage.
    chrome.runtime.sendMessage({
      type: "NEW_COPY",
      text: newText,
    });
  }
});
