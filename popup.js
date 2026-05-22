const container = document.getElementById("container");

chrome.storage.local.get({ history: [] }, function (data) {
  if (data.history.length === 0) {
    showEmptyState();
    return;
  }

  data.history.forEach(function (item, index) {
    const clipItem = createClipItem(item, index);
    container.appendChild(clipItem);
  });
});

function createClipItem(item, index) {
  const div = document.createElement("div");
  div.className = "clip-item";

  const textSpan = document.createElement("span");
  textSpan.className = "clip-text";
  textSpan.textContent = item.text;

  const rightSide = document.createElement("div");
  rightSide.className = "clip-right";

  const timeSpan = document.createElement("span");
  timeSpan.className = "clip-time";
  timeSpan.textContent = timeAgo(item.time);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "×";
  deleteBtn.title = "Remove";

  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent triggering the copy click
    deleteItem(index);
  });

  rightSide.appendChild(timeSpan);
  rightSide.appendChild(deleteBtn);

  div.appendChild(textSpan);
  div.appendChild(rightSide);

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

function deleteItem(index) {
  chrome.storage.local.get({ history: [] }, function (data) {
    data.history.splice(index, 1); // remove the item at this position
    chrome.storage.local.set({ history: data.history }, function () {
      // Refresh the displayed list
      container.innerHTML = "";
      if (data.history.length === 0) {
        showEmptyState();
      } else {
        data.history.forEach(function (item, i) {
          container.appendChild(createClipItem(item, i));
        });
      }
    });
  });
}

document.getElementById("clear-btn").addEventListener("click", function () {
  chrome.storage.local.set({ history: [] }, function () {
    container.innerHTML = "";
    showEmptyState();
  });
});
