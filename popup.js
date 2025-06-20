const label = ["website", "thecorner", "macif", "igraal", "widilo", "poulpeo"];
// ["igraal", "widilo", "poulpeo", "ebuyclub", "topcashback",
//  "capitalkoala", "wanteeed", "fun-c", "prescrit",
//  "shopbuddies", "fabuleos", "swagbucks"]

const iconYes = "images/yes.png";
const iconNo = "images/remove.png";

chrome.runtime.sendMessage({ type: "getCashback" }, (data) => {
  const { keyword, platforms } = data;

  // Affiche le nom du site
  document.getElementById("website").textContent =
    keyword.charAt(0).toUpperCase() + keyword.slice(1);

  // Pour chaque plateforme, insère une image oui/non
  for (let i = 1; i < label.length; i++) {
    const platform = label[i];
    const isAvailable = platforms[platform];
    const img = document.createElement("img");
    img.src = isAvailable ? iconYes : iconNo;
    img.alt = isAvailable ? "oui" : "non";
    img.width = 24;
    img.height = 24;
    document.getElementById(platform).appendChild(img);
  }
});
