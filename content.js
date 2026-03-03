document.addEventListener("DOMContentLoaded", () => {
  console.log("content loaded safely");
});

chrome.storage.local.get(["focusScore"], data => {
  let score = data.focusScore ?? 100;
  score -= 5;

  chrome.storage.local.set({ focusScore: Math.max(0, score) });
});
