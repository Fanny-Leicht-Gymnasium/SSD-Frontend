import { APIElement } from '../api-element.js';
import { getUserUserid } from '../../api/api.generated.js';
import { escapeHtml } from '../../util.js';
import {
  readCachedData,
  setOfflineMode,
  writeCachedData
} from '../../offline-cache.js';

const USER_CACHE_TTL = 1 * 60 * 1000;
const userRequests = new Map();

class UserViewer extends APIElement {
  static get observedAttributes() {
    return ['id', 'data', 'collapsed'];
  }

  async fetchById(id) {
    const cacheKey = `user:${id}`;
    const cached = readCachedData(cacheKey);
    const cachedIsFresh = cached?.updatedAt &&
      Date.now() - Date.parse(cached.updatedAt) < USER_CACHE_TTL;

    if (cachedIsFresh) {
      return cached.data;
    }

    if (userRequests.has(String(id))) {
      return userRequests.get(String(id));
    }

    const request = getUserUserid(id)
      .then(user => {
        writeCachedData(cacheKey, user);
        setOfflineMode(false);
        return user;
      })
      .catch(error => {
        const fallback = readCachedData(cacheKey);

        if (fallback) {
          setOfflineMode(true, fallback.updatedAt);
          return fallback.data;
        }

        throw error;
      })
      .finally(() => {
        userRequests.delete(String(id));
      });

    userRequests.set(String(id), request);
    return request;
  }

  render(user) {
    const fields = [
      ['userid', 'userid'],
      ['username', 'username'],
      ['email', 'email'],
      ['role', 'Role'],
      ['phonenumber', 'phonenumber'],
      ['class', 'class'],
      ['name', 'name'],
    ];

    const availableFields = fields.filter(([key]) => {
      const value = user?.[key];

      return value !== null &&
        value !== undefined &&
        String(value).trim() !== '';
    });

    const editButton = this.hasAttribute('edit') ? /*html*/`
      <button type="button" class="edit-user" aria-label="Edit user">
        <ssd-icon name="edit"></ssd-icon>
      </button>
    ` : '';

    return /*html*/`
      <div class="user-viewer">
        <div class="user-header">
          <ssd-icon name="user"></ssd-icon>

          <h2>
            ${escapeHtml(user?.name || user?.username || 'Unknown')}
          </h2>
          ${editButton}
        </div>

        <div class="user-fields">
          ${availableFields.map(([key, label]) => /*html*/`
            <div class="user-field user-${escapeHtml(key)}">
              <span class="user-label">
                <x-translation>user.${escapeHtml(label)}</x-translation>
              </span>

              <span class="user-value">
                ${escapeHtml(String(user[key]))}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  postRender() {
    this.container.querySelector('.edit-user')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('user-edit', {
        bubbles: true,
        composed: true,
        detail: { userId: this.getUserById() }
      }));
    });
  }

  getUserById() {
    const data = this.getAttribute('data');
    return data ? JSON.parse(data).userid : this.getAttribute('id');
  }
}

customElements.define('ssd-intra-user', UserViewer);