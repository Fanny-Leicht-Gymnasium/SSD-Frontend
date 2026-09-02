import { APIElement } from '../../api-element.js';

import { getExcuseId } from '../../../api/api.generated.js';

import { escapeHtml } from '../../../util.js';

class ExcuseViewer extends APIElement {

  static get observedAttributes() {
    return ['id', 'data', 'collapsed'];
  }

  async fetchById(id) {
    return await getExcuseId(id);
  }

  render(excuse) {
    return /*html*/`

      <div class="excuse-card" collapsable>

        <div class="excuse-header header">

          <div class="excuse-icon">
            <ssd-icon
              color="${excuse.status === 'approved' ? 'green' : excuse.status === 'denied' ? 'red' : 'orange'}"
              name="status/excuse/${escapeHtml(excuse.status || 'pending')}"
            ></ssd-icon>
          </div>

          <div class="excuse-title">

            <h2>${escapeHtml(excuse.reason || 'Unknown Excuse')}</h2>

            <span class="excuse-user-name">
                <ssd-intra-user class="nameonly inline noicon" id="${escapeHtml(excuse.userid ?? 'N/A')}">${escapeHtml(excuse.userid ?? 'N/A')}<ssd-intra-user>
            </span>

            <div class="excuse-status-info">
              <p>${escapeHtml(excuse.status || 'pending')}</p>
            </div>

          </div>

        </div>

        <div class="excuse-body content">

          <div class="excuse-row">
            <ssd-icon name="user"></ssd-icon>
            <span>
              <b><x-translation>excuse.user</x-translation></b>
              <ssd-intra-user id="${escapeHtml(excuse.userid ?? 'N/A')}">${escapeHtml(excuse.userid ?? 'N/A')}<ssd-intra-user>
            </span>
          </div>

          <div class="excuse-row">
            <ssd-icon name="paperclip"></ssd-icon>
            <span>
              <b><x-translation>Reason</x-translation></b>
              ${escapeHtml(excuse.reason || 'No reason provided')}
            </span>
          </div>

          <div class="excuse-row">
            <ssd-icon name="date-time"></ssd-icon>
            <span>
              <b><x-translation>excuse.start</x-translation></b>
              <time-display
                show-countdown
                show-date="nottoday"
              >
                ${escapeHtml(excuse.startdate || 'N/A')}
              </time-display>
            </span>
          </div>

          <div class="excuse-row">
            <ssd-icon name="date-time"></ssd-icon>
            <span>
              <b><x-translation>excuse.end</x-translation></b>
              <time-display
                show-countdown
                show-date="nottoday"
              >
                ${escapeHtml(excuse.enddate || 'N/A')}
              </time-display>
            </span>
          </div>

          <div class="excuse-row">
            <ssd-icon name="status/${escapeHtml(excuse.status || 'pending')}"></ssd-icon>
            <span>
              <b><x-translation>Status</x-translation></b>
              ${escapeHtml(excuse.status || 'pending')}
            </span>
          </div>

        </div>

      </div>

    `;
  }

}

customElements.define('ssd-intra-excuse', ExcuseViewer);