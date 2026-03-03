document.addEventListener("DOMContentLoaded", () => {

  console.log("POPUP JS LOADED");

  const tabs = document.querySelectorAll(".tab");
  const views = document.querySelectorAll(".view");
  const toggle = document.getElementById("toggle");

  const premiumLink = document.getElementById("premiumLink");
  const viewKeywordsBtn = document.getElementById("viewKeywordsBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const closeBtn = document.getElementById("closeBtn");
  const blockBtn = document.getElementById("blockBtn");
  const addKeywordBtn = document.getElementById("addKeywordBtn");

  // ✅ TAB SWITCHING
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      views.forEach(v => v.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.view).classList.add("active");
    });
  });

  // ✅ TOGGLE SWITCH
  if (toggle) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("on");
    });
  }

  // ✅ BLOCK BUTTON
 if (blockBtn) {
    blockBtn.addEventListener("click", () => {
      chrome.tabs.create({
        url: chrome.runtime.getURL("welcome.html")
      });
    });
  }

  // ✅ OPEN welcome.html
  if (premiumLink) {
    premiumLink.addEventListener("click", () => {
      chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") });
    });
  }

  if (viewKeywordsBtn) {
    viewKeywordsBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") });
    });
  }

  // ✅ OPEN OPTIONS PAGE
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      chrome.runtime.openOptionsPage();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      chrome.runtime.openOptionsPage();
    });
  }

  if (addKeywordBtn) {
    addKeywordBtn.addEventListener("click", () => {
      chrome.runtime.openOptionsPage();
    });
  }

});