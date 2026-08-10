import { APIElement } from '../api-element.js';
import { getUserUserid } from '../../api/api.generated.js';
import { escapeHtml } from '../../util.js';

class UserViewer extends APIElement {
  static get observedAttributes() {
    return ['id', 'data', 'collapsed'];
  }

  async fetchById(id) {
    return await getUserUserid(id);
  }

  render(user) {
    const fields = [
      ['userid', 'userid'],
      ['username', 'username'],
      ['email', 'email'],
      ['role', 'role'],
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

    return /*html*/`
      <div class="user-viewer">
        <div class="user-header">
          <ssd-icon name="user"></ssd-icon>

          <h2>
            ${escapeHtml(user?.name || user?.username || 'Unknown')}
          </h2>
        </div>

        <div class="user-fields">
          ${availableFields.map(([key, label]) => /*html*/`
            <div class="user-field user-${escapeHtml(key)}">
              <span class="user-label">
                <x-translation>${escapeHtml(label)}</x-translation>
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
}

customElements.define('ssd-intra-user', UserViewer);