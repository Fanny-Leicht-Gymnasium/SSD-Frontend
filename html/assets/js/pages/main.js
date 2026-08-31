import { getUserMe } from "../api/api.generated.js";

(async () => {
  const me = await getUserMe();
  localStorage.setItem("me", JSON.stringify(me));
  console.log("----------------------------------------------------------------------------------------------------------------- Updeded ME")
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  });
}