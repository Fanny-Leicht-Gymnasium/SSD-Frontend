import { APIElement } from '../../api-element.js';
import { getApplicationId, getMissionId } from '../../../api/api.generated.js';
import { escapeHtml } from '../../../util.js';

class ApplicationViewer extends APIElement {
  static get observedAttributes() {
    return ['id', 'data', 'collapsed'];
  }
  async fetchById(id) {
    return await getApplicationId(id);
  }

  render(application) {
    return `
        <p><ssd-icon name="status-${escapeHtml(application.status || 'N/A')}">status-${escapeHtml(application.status || 'N/A')}</ssd-icon></p>

      <p><x-translation>ApplicationID</x-translation>: ${escapeHtml(application.id || 'N/A')}</p>
      
      <p><x-translation>Startdate</x-translation>: <time-display show-countdown="false" show-date="always">${escapeHtml(application.startdate || 'N/A')}</time-display></p>
      <p><x-translation>Enddate</x-translation>:  <time-display show-countdown="false" show-date="always">${escapeHtml(application.enddate || 'N/A')}</time-display></p>

      <ssd-slot data='${JSON.stringify(application.data)}'></ssd-slot>

      <p><x-translation>reason</x-translation>: ${escapeHtml(application.reason || 'N/A')}</p>

      <ssd-user data='${JSON.stringify(application.user)}'></ssd-slot>

    <p><x-translation>type</x-translation>: ${escapeHtml(application.type || 'N/A')}</p>

    <p><x-translation>status</x-translation>: ${escapeHtml(application.status || 'N/A')}</p>
    `;
  }
}

customElements.define('ssd-intra-application', ApplicationViewer);