import { APIElement } from '../../api-element.js';
import { getMissionId } from '../../../api/api.generated.js';
import { escapeHtml } from '../../../util.js';

class MissionViewer extends APIElement {
  static get observedAttributes() {
    return ['id', 'data', 'collapsed'];
  }
  async fetchById(id) {
    return await getMissionId(id);
  }

  render(mission) {
    return /*html*/`
      <h2>Alert: ${escapeHtml(mission.alertId || 'Unknown')}</h2>

      <p><x-translation>Author</x-translation>: ${escapeHtml(mission.author || 'N/A')}</p>
      <p><x-translation>Injury</x-translation>: ${escapeHtml(mission.injury || 'N/A')}</p>
      <p><x-translation>Location</x-translation>: ${escapeHtml(mission.location || 'N/A')}</p>
      <p><x-translation>Timestamp</x-translation>: <time-display show-countdown="true" show-date="nottoday">${escapeHtml(mission.timestamp || 'N/A')}<time-display></p>
      <div collapsable>
          <div class="header">Alerted Users</div>
          <div class="content">
              <ul>
        ${
          Array.isArray(mission.alertedUser)
            ? mission.alertedUser.map(u => /*html*/`
                <li>
                  <ssd-intra-user id="${escapeHtml(u.userid ?? 'N/A')}"></ssd-intra-user>
                  Status: ${escapeHtml(u.status ?? 'N/A')}
                </li>
              `).join('')
            : /*html*/`<li>N/A</li>`
        }
      </ul>
          </div>
      </div>
   
    `;
  }
}

customElements.define('ssd-intra-mission', MissionViewer);