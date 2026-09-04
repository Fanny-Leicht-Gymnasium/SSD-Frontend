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
    <div class="mission-card" collapsable>
      <div class="mission-header header">
        <div class="mission-icon">
          <ssd-icon color ="red" name="status/${mission.status||"open"}"></ssd-icon>
        </div>

        <div class="mission-title">
          <h2>${escapeHtml(mission.injury || 'Unknown Alert')}</h2>
          <span class="mission-id">
            ${escapeHtml(mission.alertId || 'Unknown')}
          </span>
          <div class="mission-closed-info">
        <p>${escapeHtml(mission.location || 'N/A')}</p>
        <p>${mission.additionalInformation? escapeHtml(mission.additionalInformation) : /*html*/`<x-translation>mission.no-additional-info</x-translation>`}</p>
        <time-display 
              show-countdown="true" 
              show-date="nottoday">
              ${escapeHtml(mission.timestamp || 'N/A')}
        </time-display>
        </div>
        </div>
      </div>

      <div class="mission-body content">

        <div class="mission-row">
        <ssd-icon name="map-pin"></ssd-icon>
        <span>${escapeHtml(mission.location || 'N/A')}</span>
        </div>

        <div class="mission-row">
                  <ssd-icon name="paperclip"></ssd-icon>

          <span>${mission.additionalInformation? escapeHtml(mission.additionalInformation) : /*html*/`<x-translation>mission.no-additional-info</x-translation>`}</span>
        </div>

        <div class="mission-row">
          <ssd-icon name="user"></ssd-icon>
          <span>
            <b><x-translation>mission.author</x-translation></b>
            ${escapeHtml(mission.author || 'N/A')}
          </span>
        </div>

        <div class="mission-row">
          <ssd-icon name="date-time"></ssd-icon>
          <span>
            <time-display 
              show-countdown="true" 
              show-date="nottoday">
              ${escapeHtml(mission.timestamp || 'N/A')}
            </time-display>
          </span>
        </div>

        <div class="mission-row mission-row-header">
          <ssd-icon name="call"></ssd-icon>
          <span><x-translation>mission.call-log</x-translation></span>
        </div>


         <div class="alert-users">
          ${Array.isArray(mission.alertedUser)
        ? mission.alertedUser.map(u => /*html*/`
              <div class="user-status ${escapeHtml(u.status || 'unknown')}">
                <ssd-icon color ="red" name="status/${u.status||"N_A"}"></ssd-icon>
  
              <ssd-intra-user class="alert-status"
                  id="${escapeHtml(u.userid ?? 'N/A')}">
                </ssd-intra-user>

              </div>
            `).join('')
        : /*html*/`<div class="user-status unknown"><x-translation>mission.no-users</x-translation></div>`
      }
        </div>

      </div>
    </div>
  `;
  }
}

customElements.define('ssd-intra-mission', MissionViewer);