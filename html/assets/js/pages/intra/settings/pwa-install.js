let deferredInstallPrompt = null;

const installButton = document.getElementById("install-pwa-button");

window.addEventListener("beforeinstallprompt", (event) => {
  // Prevent the browser from showing its default install prompt.
  event.preventDefault();

  deferredInstallPrompt = event;

  // Show the custom install button.
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    return;
  }

  // Show the browser's PWA installation prompt.
  deferredInstallPrompt.prompt();

  const { outcome } = await deferredInstallPrompt.userChoice;

  // The prompt can only be used once.
  deferredInstallPrompt = null;
  installButton.hidden = true;

  console.log(`PWA installation: ${outcome}`);
});

window.addEventListener("appinstalled", () => {
  // Hide the button after successful installation.
  installButton.hidden = true;

  deferredInstallPrompt = null;
});