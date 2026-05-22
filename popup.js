const container = document.getElementById("container");

chrome.storage.local.get({ history: [] }, function (data) {
  if (data.history.length === 0) {
    showEmptyState();
    return;
  }

  data.history.forEach(function (item) {
    const clipItem = createClipItem(item);
    container.appendChild(clipItem);
  });
});

function createClipItem(item) {
  const div = document.createElement("div");
  div.className = "clip-item";

  const textSpan = document.createElement("span");
  textSpan.className = "clip-text";
  textSpan.textContent = item.text;

  const timeSpan = document.createElement("span");
  textSpan.className = "clip-time";
  textSpan.textContent = timeAgo(item.time);

  div.appendChild(textSpan);
  div.appendChild(timeSpan);

  div.addEventListener("click", function () {
    navigator.clipboard.writeText(item.text);
    div.classList.add("copied");
    setTimeout(function () {
      div.classList.remove("copied");
    }, 1000);
  });
  return div;
}

function showEmptyState() {
  const div = document.createElement("div");
  div.className = "empty-state";
  div.textContent =
    "Nothing copied yet. Start copying text and it will show up here!";
  container.appendChild(div);
}

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
  if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
  return Math.floor(seconds / 86400) + "d ago";
}
