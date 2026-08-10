import { APIElement, } from '../../api-element.js';
import { escapeHtml, waitForStoredUser, getStoredUser } from '../../../util.js';
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

        <div class="slot-main">
          <div class="slot-title-row">
            <h3>${slotName}</h3>

            ${slot.required ? /*html*/`
              <span class="slot-required"><x-trans>slot.lable.required</x-trans></span>
            ` : ''}
          </div>

         <p class="slot-additional ${additionalInformation ? '' : 'empty'}">
              <ssd-icon name="info"></ssd-icon>
              <span class="data">${escapeHtml(additionalInformation || 'N/A')}</span>
            </p>

          <div class="slot-meta">
            <div class="slot-meta">
              <span class="slot-meta-item" type="base">
                <ssd-icon name="user"></ssd-icon>
                <x-trans class="lable">slot.lable.base</x-trans> <span class="data">${baseUsers.length}</span>
              </span>

              <span class="slot-meta-item" type="fallback">
                <ssd-icon name="users"></ssd-icon>
                <x-trans class="lable">slot.lable.fallback</x-trans> <span class="data">${fallbackUsers.length}</span>
              </span>

              ${replacementUsers.length > 0 ? /*html*/`
                <span class="slot-meta-item" type="replacement">
                  <ssd-icon name="replace-user"></ssd-icon>
                  <x-trans class="lable">slot.lable.replacement</x-trans> <span class="data">${replacementUsers.length}</span>
                </span>
              ` : ''}

              ${excuses.length > 0 ? /*html*/`
                <span class="slot-meta-item" type="excuses">
                  <ssd-icon name="virus"></ssd-icon>
                  <x-trans class="lable">slot.lable.excuses</x-trans> <span class="data">${excuses.length}</span>
                </span>
              ` : ''}

              ${alerts.length > 0 ? /*html*/`
                <span class="slot-meta-item slot-meta-alert" type="alerts">
                  <ssd-icon name="alert-triangle"></ssd-icon>
                  <x-trans class="lable">slot.lable.alerts</x-trans> <span class="data">${alerts.length}</span>
                </span>
              ` : ''}

              ${isAdmin && openApplications.length > 0 ? /*html*/`
                <span class="slot-meta-item" type="applications">
                  <ssd-icon name="clipboard"></ssd-icon>
                  <x-trans class="lable">slot.lable.applications</x-trans> <span class="data">${openApplications.length}</span>
                </span>
              ` : ''}
             ${isAdmin ? /*html*/`
            <button
              class="slot-action edit-btn"
              type="button"
              data-id="${slotId}"
              aria-label="Edit slot"
              title="Edit"
            >
              <ssd-icon name="edit"></ssd-icon>
            </button>
          ` : ''}
              </div>

          </div>
          
        </div>
        </div>
      </div>
    `;
  }


  postRender() {

    if (this.hasAttribute('isAdmin')) {
      this.bindEditButtons();
    }
    this.container.onclick = (event) => {
      const form = document.createElement('ssd-slot-wrapped');
      const slotMetaItem = event.target.closest('.slot-meta-item');

      if (slotMetaItem && this.container.contains(slotMetaItem)) {
        const type = slotMetaItem.getAttribute('type');

        if (type !== null) {
          form.setAttribute('open', type);
        }
      }

      form.setAttribute('asPopup', '');
      form.setAttribute('redirectURL', 'close');
      form.setAttribute('slot-id', this.getAttribute('slot-id'));
      form.setAttribute('year', this.getAttribute('year'));
      form.setAttribute('week', this.getAttribute('week'));
      form.setAttribute('data', this.getAttribute('data'));


      if (this.hasAttribute("isAdmin")) {
        form.setAttribute("isAdmin", "")
      }
      form.addEventListener('form-success', () => {
        this.load();
      });

      document.body.appendChild(form);
    }
  }

  bindEditButtons() {
    this.root.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const id = button.dataset.id;

        const form = document.createElement('ssd-slot-form');

        form.setAttribute('asPopup', '');
        form.setAttribute('redirectURL', 'close');
        form.setAttribute('id', id);
        form.setAttribute('year', this.getAttribute('year'));
        form.setAttribute('week', this.getAttribute('week'));

        form.addEventListener('form-success', () => {
          this.removeAttribute('data');
          this.load();
        });

        document.body.appendChild(form);
      });
    });
  }
}

customElements.define('slot-wrapped-inschedule', SlotElementWrapped);