import { APIElement, } from '../../api-element.js';
import { escapeHtml, getStoredUser, waitForStoredUser } from '../../../util.js';
import { getScheduleYearWeekSlotSlotid } from '../../../api/api.generated.js';
class SlotElementWrapped extends APIElement {
  static get observedAttributes() {
    return ['data'];
  }
  async fetchById(id) {
    const week = this.getAttribute("week")
    const year = this.getAttribute("year")
    return getScheduleYearWeekSlotSlotid(year, week, id);
  }

  getInput() {
    const slotId = this.getAttribute('slot-id');
    if (slotId) {
      return {
        source: 'api',
        id: slotId
      };
    }

    return super.getInput();
  }
  additionalLoading() {
    // Try to load the user immediately
    this.me = getStoredUser();

    // Wait up to 3 seconds if the user is not available yet
    if (!this.me) {
      (async () => {
        this.me = await waitForStoredUser(3000);
        this.load()
      })();
    }

    // Use the loaded user
    this.userId = this.me?.id ?? null;
  }
  render(slotWrapper) {
    const slot = slotWrapper?.slot ?? {};
    const isAdmin = this.hasAttribute('isAdmin');


    const baseUsers = slotWrapper?.baseUsers ?? [];
    const fallbackUsers = slotWrapper?.fallbackusers ?? [];
    const replacementUsers = slotWrapper?.replacementUser ?? [];
    const excuses = slotWrapper?.excuses ?? [];
    const alerts = slotWrapper?.alerts ?? [];
    const applications = slotWrapper?.applications ?? [];

    const openApplications = applications.filter(
      application => application.status === 'open'
    );

    const slotName = escapeHtml(slot.slotName || 'Unnamed Slot');
    const additionalInformation = escapeHtml(
      slotWrapper?.additionalInformation || ''
    );

    const slotId = escapeHtml(String(slot.slotId ?? ''));

    const isFallbackUser = fallbackUsers.some(
      user => user.userid === this.me?.userid
    );
    const isBaseUser = baseUsers.some(
      user => user.userid === this.me?.userid
    );

    return /*html*/`
          <div class="slot ${slot.required ? 'required' : ''} ${fallbackUsers.length + baseUsers.length <= 0 ? 'unfulfilled' : ''} ${isFallbackUser || isBaseUser ? 'your' : ''}">
            <div class="slot-title-row">
              <h3>${escapeHtml(slot.slotName || 'Unnamed Slot')}</h3>
              ${slot.required ? /*html*/`
                <span class="slot-required"><x-trans>slot.lable.required</x-trans></span>
                ` : ''}

            </div>
            <p class="slot-time"><x-trans>time.weekday.${escapeHtml(slot.weekday)}</x-trans> <time-display show-date="never">${escapeHtml(slot.starttime)}</time-display> - <time-display show-date="never">${escapeHtml(slot.endtime)}</time-display></p>
            ${isAdmin ? /*html*/`
                  <p>ID: ${escapeHtml(slot.slotId)}</p>
                  <p>Position: ${escapeHtml(slot.slotPosition)}</p>
                  ` : ''}

            <p class="slot-additional ${additionalInformation ? '' : 'empty'}">
              <ssd-icon name="info"></ssd-icon>
              <span class="data">${additionalInformation || 'N/A'}</span>
            </p>
            <button class="apply-btn slot-action" data-id="${escapeHtml(slot.slotId)}">
              <ssd-icon name="apply"></ssd-icon>
            </button>

            ${isAdmin ? /*html*/`
              <button class="edit-btn slot-action" data-id="${escapeHtml(slot.slotId)}">
                <ssd-icon name="edit"></ssd-icon>
              </button>
            ` : ''}
            
            
            <div collapsable ${this.getAttribute("open") == "base" ? "open" : ""} class="slot-meta-item" type="base">
              <div class="header">
                  <ssd-icon name="user"></ssd-icon>
                  <x-trans class="lable">slot.lable.base</x-trans> <span class="data">${baseUsers.length}</span>
              </div>
              <div class="content">
                  ${Array.isArray(slotWrapper.baseUsers)
        ? slotWrapper.baseUsers
          .map(user => /*html*/`<ssd-intra-user id="${escapeHtml(user.id)}" data='${JSON.stringify(user)}'></ssd-intra-user>`)
          .join('')
        : '<p>N/A</p>'
      }
              </div>
            </div>

            <div collapsable ${this.getAttribute("open") == "fallback" ? "open" : ""}  class="slot-meta-item" type="fallback">
              <div class="header">
                <ssd-icon name="users"></ssd-icon>
                <x-trans class="lable">slot.lable.fallback</x-trans> <span class="data">${fallbackUsers.length}</span>
              </div>
              <div class="content">
                ${Array.isArray(slotWrapper.fallbackusers)
        ? slotWrapper.fallbackusers
          .map(user => /*html*/`<ssd-intra-user id="${escapeHtml(user.id)}" data='${JSON.stringify(user)}'></ssd-intra-user>`)
          .join('')
        : '<p>N/A</p>'
      }
              </div>
            </div>
            <div collapsable  ${this.getAttribute("open") == "replacement" ? "open" : ""}  class="slot-meta-item" type="replacement">
              <div class="header">
                <ssd-icon name="replace-user"></ssd-icon>
                <x-trans class="lable">slot.lable.replacement</x-trans> <span class="data">${replacementUsers.length}</span>
              </div>
              <div class="content">
                ${Array.isArray(slotWrapper.replacementUser)
        ? slotWrapper.replacementUser
          .map(user => /*html*/`<ssd-intra-user id="${escapeHtml(user.id)}" data='${JSON.stringify(user)}'></ssd-intra-user>`)
          .join('')
        : '<p>N/A</p>'
      }
              </div>
            </div>

            <div collapsable ${this.getAttribute("open") == "excuses" ? "open" : ""}  class="slot-meta-item" type="excuses">
              <div class="header">
                <ssd-icon name="virus"></ssd-icon>
                <x-trans class="lable">slot.lable.excuses</x-trans> <span class="data">${excuses.length}</span>
              </div>
              <div class="content">
                ${Array.isArray(slotWrapper.excuses)
        ? slotWrapper.excuses
          .map(excusesId => /*html*/`<ssd-intra-excuse id="${escapeHtml(excusesId)}"></ssd-intra-excuse>`)
          .join('')
        : '<p>N/A</p>'
      }
              </div>
            </div>
            <div collapsable ${this.getAttribute("open") == "alerts" ? "open" : ""} class="slot-meta-item" type="alerts">
              <div class="header">
                <ssd-icon name="alert-triangle"></ssd-icon>
                <x-trans class="lable">slot.lable.alerts</x-trans> <span class="data">${alerts.length}</span>
              </div>
              <div class="content">
                ${Array.isArray(slotWrapper.alerts)
        ? slotWrapper.alerts
          .map(id => /*html*/`<ssd-intra-mission id="${escapeHtml(id)}"></ssd-intra-mission>`)
          .join('')
        : '<p>N/A</p>'
      }
              </div>
            </div>
            <div collapsable ${this.getAttribute("open") == "applications" ? "open" : ""}  class="slot-meta-item" type="applications">
              <div class="header">
                <ssd-icon name="clipboard"></ssd-icon>
                <x-trans class="lable">slot.lable.applications</x-trans> <span class="data">${openApplications.length}</span>
              </div>
              <div class="content">
                ${
                  /*TODO: Sort open first*/
                  Array.isArray(slotWrapper.applications)
        ? slotWrapper.applications
          .map(application => /*html*/`<ssd-intra-application id="${escapeHtml(application.id)}" data='${JSON.stringify(application)}' hideSlot></ssd-intra-application>`)
          .join('')
        : '<p>N/A</p>'
      }
              </div>
            </div>
          </div>
          `;
  }
  postRender() {
    this.root.querySelectorAll('.apply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;

        const form = document.createElement('ssd-application-apply');

        form.setAttribute('asPopup', '');
        form.setAttribute('redirectURL', 'close');

        form.addEventListener('form-success', () => {
          console.log('form-success');
          this.removeAttribute('data');
          this.load();
        });

        document.body.appendChild(form);
        form.setAttribute('slot-id', id);
        form.setAttribute('year', this.getAttribute('year'));
        form.setAttribute('week', this.getAttribute('week'));

      });
    });
    if (!this.hasAttribute('isAdmin')) return;

    this.root.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;

        const form = document.createElement('ssd-slot-form');

        form.setAttribute('asPopup', '');
        form.setAttribute('redirectURL', 'close');
        form.setAttribute('id', id);
        form.setAttribute('year', this.getAttribute('year'));
        form.setAttribute('week', this.getAttribute('week'));
        form.addEventListener('form-success', () => {
          console.log('form-success');
          this.removeAttribute('data');
          this.load();
        });

        document.body.appendChild(form);
      });
    });

  }
}

customElements.define('ssd-slot-wrapped', SlotElementWrapped);