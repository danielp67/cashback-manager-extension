const platforms = [
  { key: "thecorner", label: "The Corner BoursoBank" },
  { key: "macif", label: "Macif" },
  { key: "igraal", label: "Igraal" },
  { key: "widilo", label: "Widilo" },
  { key: "poulpeo", label: "Poulpeo" }
];

const form = document.getElementById("options-form");
const tableBody = document.getElementById("table-body");
const status = document.getElementById("status");

function buildForm(savedPrefs = {}) {
  platforms.forEach(({ key, label }) => {
    const isChecked = savedPrefs[key] ?? true;

    const tr = document.createElement("tr");

    const tdLabel = document.createElement("td");
    tdLabel.textContent = label;

    const tdSwitch = document.createElement("td");
    const div = document.createElement("div");
    div.className = "form-check form-switch";

    const input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "checkbox";
    input.id = key;
    input.checked = isChecked;
    input.addEventListener("change", saveOptions);

    div.appendChild(input);
    tdSwitch.appendChild(div);

    tr.appendChild(tdLabel);
    tr.appendChild(tdSwitch);
    tableBody.appendChild(tr);
  });
}

function saveOptions() {
  const prefs = {};
  platforms.forEach(({ key }) => {
    prefs[key] = document.getElementById(key).checked;
  });

  chrome.storage.sync.set({ cashbackPrefs: prefs }, () => {
    status.style.display = "block";
    setTimeout(() => {
      status.style.display = "none";
    }, 1500);
  }); 
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get("cashbackPrefs", ({ cashbackPrefs }) => {
    buildForm(cashbackPrefs || {});
  });
});
