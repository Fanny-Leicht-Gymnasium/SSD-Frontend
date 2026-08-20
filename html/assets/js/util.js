import { getUserMe } from "./api/api.generated.js"

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