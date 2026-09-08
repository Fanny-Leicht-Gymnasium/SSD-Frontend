import { APIElement } from '../../api-element.js';
import { getMissionId, getApiUrl, getMissionIdStatus } from '../../../api/api.generated.js';
import { escapeHtml, getStoredUser, isLoggedIn } from '../../../util.js';

class MissionViewer extends APIElement {
  static get observedAttributes() {
    return ['id', 'data', 'collapsed', 'live', "open", "statusMode"];
  }

  constructor() {
    super();
    this.eventSource = null;
  }

  async fetchById(id) {
    if (this.hasAttribute("statusMode")) {
      return await getMissionIdStatus(id);
    }else{
      return await getMissionId(id);
    }
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.startLiveUpdates();
  }

  disconnectedCallback() {
    this.stopLiveUpdates();
    super.disconnectedCallback?.();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;

    if (name === 'live' || name === 'id') {
      this.stopLiveUpdates();
      this.startLiveUpdates();
    }
  }

  startLiveUpdates() {
    const id = this.getAttribute('id');
    if (!this.hasAttribute('live') || !id || this.eventSource) return;

    this.eventSource = new EventSource(
      getApiUrl(`/mission/${encodeURIComponent(id)}/status/subscribe`)
    );
    this.eventSource.onmessage = (event) => {
      const mission = JSON.parse(event.data);
      this.container.innerHTML = this.render(mission);
      this.container.classList.remove('loading');
      this.postRender();
    };
    this.eventSource.onerror = (error) => {
      console.error('Mission live update stream failed:', error);
    };
  }

  stopLiveUpdates() {
    this.eventSource?.close();
    this.eventSource = null;
  }

  render(mission) {
    const me = getStoredUser();
    const author = this.getAttribute("author");
    const injury = mission.injury || this.getAttribute("injury");
    const location = mission.location || this.getAttribute("location");
    const additionalInformation = mission.additionalInformation || this.getAttribute("additionalInformation");

    return /*html*/`
    <div class="mission-card" collapsable ${this.hasAttribute("open")?"open":""}>
      <div class="mission-header header">
        <div class="mission-icon">
          <ssd-icon color ="red" name="status/${mission.status||"open"}"></ssd-icon>
        </div>

        <div class="mission-title">
          <h2>${escapeHtml(injury || 'Unknown Alert')}</h2>
          <span class="mission-id">
            ${escapeHtml(mission.alertId || 'Unknown')}
          </span>
          <div class="mission-closed-info">
        <p>${escapeHtml(location || 'N/A')}</p>
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
        <span>${escapeHtml(location || 'N/A')}</span>
        </div>

        <div class="mission-row">
                  <ssd-icon name="paperclip"></ssd-icon>

          <span>${additionalInformation? escapeHtml(additionalInformation) : /*html*/`<x-translation>mission.no-additional-info</x-translation>`}</span>
        </div>

        <div class="mission-row">
          <ssd-icon name="user"></ssd-icon>
          <span>
            <b><x-translation>mission.author</x-translation></b>
            ${escapeHtml(author || 'N/A')}
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
        ? mission.alertedUser.map((u, index) => /*html*/`
              <div class="user-status ${escapeHtml(u.status || 'unknown')}">
                <ssd-icon color ="red" name="status/${u.status||"N_A"}"></ssd-icon>
                ${
                  me?/*html*/`<ssd-intra-user class="alert-status"
                  id="${escapeHtml(u.userid ?? 'N/A')}">
                </ssd-intra-user>`:/*html*/`<x-translation index=${index+1}>mission.medicWithIndex</x-translation>`
                }
              

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