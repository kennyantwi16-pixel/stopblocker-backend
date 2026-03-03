chrome.runtime.onInstalled.addListener(() => {
  updateBlockingRules();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.blocklist) {
    updateBlockingRules();
  }
});

function updateBlockingRules() {
  chrome.storage.local.get(["blocklist"], (data) => {
    const list = data.blocklist || [];

    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
      const existingIds = existingRules.map(rule => rule.id);

      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingIds,
        addRules: list.map((site, index) => {

          // Clean the domain
          const cleanSite = site
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .trim();

          return {
            id: index + 1,
            priority: 1,
            action: {
              type: "redirect",
              redirect: {
                extensionPath: "/blocked.html"
              }
            },
            condition: {
              urlFilter: `||${cleanSite}^`,
              resourceTypes: ["main_frame"]
            }
          };
        })
      });
    });
  });
}



function breakStreak() {
  const today = new Date().toISOString().split("T")[0];

  chrome.storage.local.get(
    ["currentStreak", "bestStreak"],
    (data) => {

      let best = data.bestStreak || 0;
      let current = data.currentStreak || 0;

      if (current > best) {
        best = current;
      }

      chrome.storage.local.set({
        currentStreak: 0,
        bestStreak: best,
        brokeToday: true,
        lastDate: today
      });
    }
  );
}



chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({ url: "welcome.html" });
  }
});

