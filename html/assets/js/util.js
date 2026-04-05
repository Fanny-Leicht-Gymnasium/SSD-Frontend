import {getUserMe} from "./api/api.generated.js"

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