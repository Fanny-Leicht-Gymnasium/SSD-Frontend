import { getUserMe, getUserMeSetting, getUserMeSettingSetting } from "./api/api.generated.js"

// Escape HTML (XSS protection)
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


export async function isLoggedIn() {
  var res
  try {
    res = await getUserMe();

    if (!res) return false;

    return res; // user object zurückgeben (besser als nur true)

  } catch (err) {
    // 401 / not logged in → expected case
    if (res?.status === 401) {
      return false;
    }

    console.error('isLoggedIn error:', err);
    return false;
  }
}
export function getStoredUser() {
  try {
    const storedMe = localStorage.getItem('me');
    if (!storedMe) {
      (async () => {
        const me = await getUserMe();
        localStorage.setItem("me", JSON.stringify(me));
      })();
    }
    return storedMe ? JSON.parse(storedMe) : null;
  } catch (error) {
    console.error('Failed to parse stored user:', error);
    return null;
  }
}
export function getStoredSettings() {
  try {
    const storedSettings = localStorage.getItem('settings');
    if (!storedSettings) {
      (async () => {
        const settings = await getUserMeSetting();
        localStorage.setItem("settings", JSON.stringify(settings));
      })();
    }
    return storedSettings ? JSON.parse(storedSettings) : null;
  } catch (error) {
    console.error('Failed to parse stored settings:', error);
    return null;
  }
}
export function getStoredSetting(settingKey) {
  try {
    const storedSettings = localStorage.getItem('settings');
    if (!storedSettings) {
      (async () => {
        const settings = await getUserMeSetting();
        localStorage.setItem("settings", JSON.stringify(settings));
        updateSettingsToDOM(settings);
      })();
    }
    return storedSettings ? JSON.parse(storedSettings)[settingKey] : null;
  } catch (error) {
    console.error('Failed to parse stored settings:', error);
    return null;
  }
}
export function setStoredSetting(settingKey, value) {
  try {
    const storedSettings = localStorage.getItem('settings');
    if (!storedSettings) {
      return
    }
    let json = storedSettings ? JSON.parse(storedSettings) : {};

    json[settingKey] = value;
    localStorage.setItem("settings", JSON.stringify(json));
    updateSettingsToDOM(json);
    window.dispatchEvent(
      new CustomEvent('setting-changed', {
        detail: {
          key: settingKey,
          value: value,
          settings: json
        }
      })
    );
  } catch (error) {
    console.error('Failed to store settings:', error);
    return null;
  }
}
export async function fetchSettings() {
  const settings = await getUserMeSetting();
  localStorage.setItem("settings", JSON.stringify(settings));
  updateSettingsToDOM(settings);
}

export function updateSettingsToDOM(settings) {
  Object.entries(settings).forEach(([key, value]) => {
    if (key.startsWith('html-')) {
      const el = document.body.setAttribute(key, value.replace(/^"|"$/g, ''));
    }
  });
}

export function waitForStoredUser(timeout = 3000) {
  return new Promise(resolve => {
    const startTime = Date.now();

    const check = () => {
      const me = getStoredUser();

      if (me) {
        resolve(me);
        return;
      }

      if (Date.now() - startTime >= timeout) {
        resolve(null);
        return;
      }

      setTimeout(check, 100);
    };

    check();
  });
}
export function getMondayOfWeek(year, week) {
  const january4 = new Date(year, 0, 4);
  const day = january4.getDay() || 7;

  const monday = new Date(january4);
  monday.setDate(january4.getDate() - day + 1 + (week - 1) * 7);

  return monday;
}