document.addEventListener("DOMContentLoaded", () => { 
  const safe = (id) => document.getElementById(id);

  // ------------------------
  // ROUTING
  // ------------------------
  const views = document.querySelectorAll(".view");
  const navItems = document.querySelectorAll("nav div");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const target = safe(item.dataset.route);
      if (!target) return;

      views.forEach(v => v.classList.remove("active"));
      target.classList.add("active");
    });
  });

  // ------------------------
  // ADULT TOGGLE
  // ------------------------
  const toggle = safe("adultToggle");
  const container = safe("adultSidebarToggle");

  if (toggle && container) {
    container.addEventListener("click", () => {
      toggle.classList.toggle("on");
    });
  }

  // ------------------------
  // DARK MODE
  // ------------------------
  const themeToggle = safe("themeToggle");

  if (themeToggle && chrome?.storage) {
    chrome.storage.local.get(["darkMode"], data => {
      if (data.darkMode) {
        document.body.classList.add("dark");
        themeToggle.classList.add("on");
      }
    });

    themeToggle.addEventListener("click", () => {
      const enabled = themeToggle.classList.toggle("on");
      document.body.classList.toggle("dark");
      chrome.storage.local.set({ darkMode: enabled });
    });
  }

  // ------------------------
  // PREMIUM BUTTONS
  // ------------------------
  const premiumLink = "https://paystack.shop/pay/smhx4zgxoe";

  safe("getMonthlyBtn")?.addEventListener("click", () =>
    chrome.tabs.create({ url: premiumLink })
  );

  safe("getPremiumBtn")?.addEventListener("click", () =>
    chrome.tabs.create({ url: premiumLink })
  );

  // ------------------------
  // RATE PAGE
  // ------------------------
  safe("rateBtn")?.addEventListener("click", () => {
    views.forEach(v => v.classList.remove("active"));
    safe("rate")?.classList.add("active");
  });

  const stars = document.querySelectorAll(".star");
  const ratingText = safe("ratingText");

  stars.forEach((star, i) => {
    star.addEventListener("click", () => {
      const rating = i + 1;

      stars.forEach((s, index) =>
        s.textContent = index < rating ? "★" : "☆"
      );

      ratingText.textContent =
        `You rated ${rating} star${rating > 1 ? "s" : ""} ⭐`;

      if (rating >= 4) {
        chrome.tabs.create({
          url: "https://chromewebstore.google.com/detail/stop-blocker-porn-blocker/pbncgjkpiapeokfmfmiplaehdmfpfghl"
        });
      } else {
        alert("Tell us how we can improve!");
      }
    });
  });

  // ------------------------
  // SECURITY SETTINGS
  // ------------------------
  const securityToggle = safe("securityToggle");

  if (securityToggle) {
    chrome.storage.local.get(["requirePassword"], data => {
      if (data.requirePassword !== false) {
        securityToggle.classList.add("on");
        securityToggle.style.background = "#22c55e";
      }
    });

    securityToggle.addEventListener("click", () => {
      const enabled = securityToggle.classList.toggle("on");
      securityToggle.style.background = enabled ? "#22c55e" : "#ccc";
      chrome.storage.local.set({ requirePassword: enabled });
    });
  }

  safe("updatePasswordBtn")?.addEventListener("click", () => {
    const newPass = safe("newPassword").value;
    const confirmPass = safe("confirmPassword").value;

    if (!newPass || newPass.length < 4)
      return alert("Password must be at least 4 characters.");

    if (newPass !== confirmPass)
      return alert("Passwords do not match.");

    chrome.storage.local.set({ settingsPassword: newPass });
    alert("Password updated successfully.");
  });

  // ------------------------
  // FOCUS SCORE SYSTEM
  // ------------------------
  const SCORE_MAX = 100;

  function updateFocusUI(score) {
    const bar = safe("focusBar");
    const text = safe("focusText");
    if (!bar || !text) return;

    bar.style.width = score + "%";
    text.textContent = "Score: " + score;
  }

  function loadFocus() {
    chrome.storage.local.get(["focusScore"], data => {
      updateFocusUI(data.focusScore ?? 70);
    });
  }

  function changeFocus(delta) {
    chrome.storage.local.get(["focusScore"], data => {
      let score = (data.focusScore ?? 70) + delta;
      score = Math.max(0, Math.min(SCORE_MAX, score));
      chrome.storage.local.set({ focusScore: score });
      updateFocusUI(score);
    });
  }

  setInterval(() => changeFocus(+1), 30000);
  loadFocus();

  function setBar(id, numId, value) {
    const bar = document.getElementById(id);
    const text = document.getElementById(numId);
    if (!bar || !text) return;

    bar.style.width = value + "%";
    text.textContent = value;
  }

  // demo values
  setBar("barToday", "todayNum", 40);
  setBar("barMonth", "monthNum", 65);
  setBar("barLife", "lifeNum", 90);

  // ------------------------
  // BLOCKLIST SYSTEM
  // ------------------------
  const addBtn = safe("addSiteBtn");
  const siteInput = safe("siteInput");
  const tableBody = safe("blockTableBody");

  function renderBlocklist() {
    chrome.storage.local.get(["blocklist"], (data) => {
      const list = data.blocklist || [];
      tableBody.innerHTML = "";

      if (list.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="2" style="padding:12px; opacity:.6;">No sites added to block list</td></tr>`;
        return;
      }

      list.forEach((site, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td style="padding:8px;">${site}</td>
          <td style="text-align:right;padding:8px;">
            <button data-index="${index}" class="removeBtn">Remove</button>
          </td>
        `;

        tableBody.appendChild(row);
      });

      document.querySelectorAll(".removeBtn").forEach(btn => {
        btn.addEventListener("click", () => {
          const index = btn.dataset.index;

          chrome.storage.local.get(["blocklist"], (data) => {
            const list = data.blocklist || [];
            list.splice(index, 1);

            chrome.storage.local.set({ blocklist: list }, renderBlocklist);
          });
        });
      });
    });
  }

  function addSite() {
    const domain = siteInput.value.trim();
    if (!domain) return;

    chrome.storage.local.get(["blocklist", "plan"], (data) => {
      const list = data.blocklist || [];
      const plan = data.plan || "free";

      if (plan === "free" && list.length >= 1) {
        alert("Free plan allows only 1 blocked site. Upgrade to Premium.");
        return;
      }

      if (list.includes(domain)) {
        alert("Site already added");
        return;
      }

      list.push(domain);
      chrome.storage.local.set({ blocklist: list }, () => {
        siteInput.value = "";
        renderBlocklist();
      });
    });
  }

  addBtn?.addEventListener("click", addSite);
  renderBlocklist();

  // ------------------------
  // PROFILE CARD
  // ------------------------
  const profileCard = safe("profileCard");

  if (profileCard) {
    profileCard.addEventListener("click", () => {
      chrome.storage.local.get(["isLoggedIn"], (data) => {
        window.location.href = data.isLoggedIn ? "account.html" : "signup.html";
      });
    });
  }

  // ------------------------
  // INCOGNITO TOGGLE
  // ------------------------
  const incognitoToggle = safe("incognitoToggle");

  if (incognitoToggle && chrome.extension) {
    chrome.extension.isAllowedIncognitoAccess((allowed) => {
      if (allowed) incognitoToggle.classList.add("on");
    });

    incognitoToggle.addEventListener("click", () => {
      alert(
        "To enable Incognito Mode:\n\n" +
        "1. Go to chrome://extensions\n" +
        "2. Find Stop Blocker\n" +
        "3. Turn ON 'Allow in Incognito'"
      );
    });
  }

  // ------------------------
  // STEALTH TOGGLE
  // ------------------------
  const stealthToggle = safe("stealthToggle");

  if (stealthToggle && chrome?.storage) {
    chrome.storage.local.get(["stealthMode"], data => {
      if (data.stealthMode) {
        stealthToggle.classList.add("on");
      }
    });

    stealthToggle.addEventListener("click", () => {
      const enabled = stealthToggle.classList.toggle("on");
      chrome.storage.local.set({ stealthMode: enabled });
      console.log("Stealth mode:", enabled ? "ON" : "OFF");
    });
  }

  // ------------------------
  // LANGUAGE SYSTEM
  // ------------------------
  const select = safe("languageSelect");

  if (select) {
    const savedLang = localStorage.getItem("lang") || "en";
    select.value = savedLang;
    applyLanguage(savedLang);

    select.addEventListener("change", () => {
      const lang = select.value;
      localStorage.setItem("lang", lang);
      applyLanguage(lang);
    });
  }

  function applyLanguage(lang) {
    const dict = window.translations[lang];
    if (!dict) return;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) el.placeholder = dict[key];
    });
  }
});
