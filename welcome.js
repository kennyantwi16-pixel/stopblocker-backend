function renderBlocklist() {
  chrome.storage.local.get(["blocklist"], (data) => {
    const list = data.blocklist || [];
    const tableBody = document.getElementById("blockTableBody");

    tableBody.innerHTML = "";

    if (list.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="2" style="padding:12px; opacity:.6;">
            No sites added to block list
          </td>
        </tr>
      `;
      return;
    }

    list.forEach((site) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td style="padding:8px;">${site}</td>
        <td style="padding:8px; text-align:right;">
          <button class="removeBtn">Remove</button>
        </td>
      `;

      row.querySelector(".removeBtn").addEventListener("click", () => {
        removeSite(site);
      });

      tableBody.appendChild(row);
    });
  });
}

function addSite() {
  const input = document.getElementById("siteInput");
  const domain = input.value.trim();

  if (!domain) return;

  chrome.storage.local.get(["blocklist"], (data) => {
    const list = data.blocklist || [];

    if (!list.includes(domain)) {
      list.push(domain);

      chrome.storage.local.set({ blocklist: list }, () => {
        input.value = "";
        renderBlocklist();
      });
    }
  });
}

document.getElementById("addSiteBtn")
  .addEventListener("click", addSite);

document.addEventListener("DOMContentLoaded", renderBlocklist);



                    