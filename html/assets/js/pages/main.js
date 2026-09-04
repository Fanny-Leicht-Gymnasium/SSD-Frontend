import { getUserMe } from "../api/api.generated.js";




const BUILD_VERSION_URL = "/__build-version";
const INSTALLED_VERSION_KEY = "installed-build-version";
const UPDATE_MESSAGE_KEY = "pwa-update-message";



function showUpdateMessage() {
  const message = localStorage.getItem(UPDATE_MESSAGE_KEY);

  if (!message) {
    return;
  }

  localStorage.removeItem(UPDATE_MESSAGE_KEY);

  const element = document.createElement("div");

  element.textContent = message;

  Object.assign(element.style, {
    position: "fixed",
    top: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "99999",
    padding: "12px 20px",
    borderRadius: "8px",
    background: "#222",
    color: "#fff",
    fontFamily: "sans-serif",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
  });

  document.body.appendChild(element);

  setTimeout(() => {
    element.remove();
  }, 5000);
}

async function checkBuildVersion() {
  if (!navigator.onLine) {
    return false;
  }

  try {
    const response = await fetch(BUILD_VERSION_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const serverVersion = (await response.text()).trim();
    const installedVersion = localStorage.getItem(INSTALLED_VERSION_KEY);

    console.log(
      "[APP] Build version:",
      installedVersion,
      "=>",
      serverVersion
    );

    if (!installedVersion) {
      localStorage.setItem(INSTALLED_VERSION_KEY, serverVersion);
      return false;
    }

    if (installedVersion === serverVersion) {
      return false;
    }

    console.log("[APP] New version detected:", serverVersion);

    await reinstallPWA(serverVersion);

    return true;
  } catch (error) {
    console.warn("[APP] Build version check failed:", error);
    return false;
  }
}

async function reinstallPWA(serverVersion) {
  // Show update message before starting the reload.
  const element = document.createElement("div");

  element.textContent = `Updating to version ${serverVersion} … Please wait while the application reloads.`;

  Object.assign(element.style, {
    position: "fixed",
    top: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "99999",
    padding: "12px 20px",
    borderRadius: "8px",
    background: "#222",
    color: "#fff",
    fontFamily: "sans-serif",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
  });

  document.body.appendChild(element);

  // Store the message so it survives the page reload.
  localStorage.setItem(
    UPDATE_MESSAGE_KEY,
    `Updated to version ${serverVersion}`
  );

  localStorage.setItem(
    INSTALLED_VERSION_KEY,
    serverVersion
  );

  // Give the browser time to display the update message.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Unregister the current service worker.
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();

    await Promise.all(
      registrations.map((registration) => registration.unregister())
    );
  }

  // Clear application caches.
  const cacheNames = await caches.keys();

  await Promise.all(
    cacheNames.map((cacheName) => caches.delete(cacheName))
  );

  // Reload the application.
  window.location.reload();
}

document.addEventListener('click', (e) => {
  const header = e.target.closest('[collapsable] > .header');

  if (!header) return;

  const container = header.closest('[collapsable]');
  if (!container) return;

  container.toggleAttribute('open');
});



(async () => {
    const updated = await checkBuildVersion();

  // The page will reload after an update.
  if (updated) {
    return;
  }

  showUpdateMessage();
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