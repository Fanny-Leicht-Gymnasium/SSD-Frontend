import { APIElement } from '../../api-element.js';

import { getExcuseId, postExcuseIdAction } from '../../../api/api.generated.js';

import { escapeHtml, getStoredUser } from '../../../util.js';

class ExcuseViewer extends APIElement {

  static get observedAttributes() {
    return ['id', 'data', 'collapsed'];
  }

  async fetchById(id) {
    return await getExcuseId(id);
  }

  render(excuse) {
    const me = getStoredUser()
    const canApprove = me?.role === 'admin' && excuse.status != "denied" && excuse.status != "approved" && excuse.status != "redraw";
    const canDeny =  me?.role === 'admin' && excuse.status != "denied" && excuse.status != "approved" && excuse.status != "redraw";
    const canEndNow = true;
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

            <h2>${escapeHtml(excuse.reason || /*html*/`<x-translation>excuse.unknown</x-translation>`)}</h2>

            <span class="excuse-user-name">
                <ssd-intra-user class="nameonly inline noicon" id="${escapeHtml(excuse.userid ?? 'N/A')}">${escapeHtml(excuse.userid ?? 'N/A')}<ssd-intra-user>
            </span>

            <div class="excuse-status-info">
              <p>${excuse.status ? /*html*/`<x-translation>excuse.statuses.${excuse.status}</x-translation>` : /*html*/`<x-translation>excuse.statuses.pending</x-translation>`}</p>
            </div>

          </div>
                ${canApprove || canDeny || canEndNow
        ? /*html*/`
          <div class="excuse-actions">

            ${canApprove ? /*html*/`
              <button
                class="approve-btn"
                type="button">
                <x-translation>excuse.button.approve</x-translation>
              </button>
            ` : ''}


            ${canDeny ? /*html*/`
              <button
                class="deny-btn"
                type="button">
                <x-translation>excuse.button.deny</x-translation>
              </button>
            ` : ''}


            ${canEndNow ? /*html*/`
              <button
                class="end-now-btn"
                type="button">
                <x-translation>excuse.button.EndNow</x-translation>
              </button>
            ` : ''}

          </div>
        `
        : ''
      }
        </div>

        <div class="excuse-body content">

          <div class="excuse-row">
            <span>
              <ssd-intra-user id="${escapeHtml(excuse.userid ?? 'N/A')}">${escapeHtml(excuse.userid ?? 'N/A')}<ssd-intra-user>
            </span>
          </div>

          <div class="excuse-row">
            <ssd-icon name="paperclip"></ssd-icon>
            <span>
              <b><x-translation>excuse.reason</x-translation></b>
              ${escapeHtml(excuse.reason || /*html*/`<x-translation>excuse.no-reason</x-translation>`)}
            </span>
          </div>

          <div class="excuse-row">
            <ssd-icon name="date-time"></ssd-icon>
            <span>
              <b><x-translation>excuse.start</x-translation></b>
              <time-display
              >
                ${escapeHtml(excuse.starttimestamp || 'N/A')}
              </time-display>
            </span>
          </div>

          <div class="excuse-row">
            <ssd-icon name="date-time"></ssd-icon>
            <span>
              <b><x-translation>excuse.end</x-translation></b>
              <time-display              >
                ${escapeHtml(excuse.endtimestamp || 'N/A')}
              </time-display>
            </span>
          </div>

          <div class="excuse-row">
            <ssd-icon name="status/excuse/${escapeHtml(excuse.status || 'pending')}"></ssd-icon>
            <span>
              <b><x-translation>excuse.status</x-translation></b>
              ${escapeHtml(excuse.status || 'pending')}
            </span>
          </div>

        </div>

      </div>

    `;
  }
  postRender() {
    this.setupEvents();
  }
    setupEvents() {

    this.container.querySelector('.approve-btn')?.addEventListener('click', () => { this.doAction('approve'); });

    this.container.querySelector('.deny-btn')?.addEventListener('click', () => { this.doAction('deny'); });

    this.container.querySelector('.end-now-btn')?.addEventListener('click', () => { this.doAction('redraw'); });
  }
    async doAction(action) {
      try {
        await postExcuseIdAction(
          this.id,
          action,
          {
            reason: ''
          }
        );
        this.setAttribute("id", this.id)
        this.removeAttribute("data")
        await this.additionalLoading();
        await this.load();
      } catch (err) {
        console.log('err:', err);
        this.renderError(err, alert = true);
  
  
      }
    }
}

customElements.define('ssd-intra-excuse', ExcuseViewer);