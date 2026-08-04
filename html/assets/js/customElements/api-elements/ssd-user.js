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
    return /*html*/`
      <h2>User: ${escapeHtml(user.name || user.username ||'Unknown')}</h2>
      <p><x-translation>userid</x-translation>: ${escapeHtml(user.userid || 'N/A')}</p>
      <p><x-translation>username</x-translation>: ${escapeHtml(user.username || 'N/A')}</p>
      <p><x-translation>email</x-translation>: ${escapeHtml(user.email || 'N/A')}</p>
      <p><x-translation>role</x-translation>: ${escapeHtml(user.role || 'N/A')}</p>
      <p><x-translation>phonenumber</x-translation>: ${escapeHtml(user.phonenumber || 'N/A')}</p>
      <p><x-translation>class</x-translation>: ${escapeHtml(user.class || 'N/A')}</p>
      <p><x-translation>name</x-translation>: ${escapeHtml(user.name || 'N/A')}</p>
    `;
  }
}

customElements.define('ssd-intra-user', UserViewer);