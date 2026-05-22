document.addEventListener("copy", function (e) {
  let newText = "";

  // Try getting text from the active element (inputs, textareas)
  const active = document.activeElement;
  if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
    newText = active.value.substring(
      active.selectionStart,
      active.selectionEnd,
    );
  } else {
    // Regular text selection on the page
    newText = window.getSelection().toString();
  }

  newText = newText.trim();

  if (newText) {
    chrome.runtime.sendMessage({
      type: "NEW_COPY",
      text: newText,
    });
  }
});
