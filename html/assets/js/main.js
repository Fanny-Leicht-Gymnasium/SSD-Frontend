import { getUserMe, getUserMeSetting } from "./api/api.generated.js";
import { fetchSettings, getStoredSettings, updateSettingsToDOM } from "./util.js";

document.addEventListener('click', (e) => {
  const header = e.target.closest('[collapsable] > .header');

  if (!header) return;

  const container = header.closest('[collapsable]');
  if (!container) return;

  container.toggleAttribute('open');
});

(async () => {
  const me = await getUserMe();
  localStorage.setItem("me", JSON.stringify(me));
  updateSettingsToDOM(getStoredSettings());
  fetchSettings();
  console.log("Updated ME and Settings")
})();