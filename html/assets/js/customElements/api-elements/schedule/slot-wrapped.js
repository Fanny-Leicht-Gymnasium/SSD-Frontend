import { APIElement, } from '../../api-element.js';
import { escapeHtml } from '../../../util.js';
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

  render(slotWrapper) {
    const slot = slotWrapper?.slot ?? {};
    const isAdmin = this.hasAttribute('isAdmin');
    console.log(slotWrapper)
    return /*html*/`
      <div class="slot">

        <h3>${escapeHtml(slot.slotName || 'Unnamed Slot')}</h3>

        <p>ID: ${escapeHtml(slot.slotId)}</p>
        <p>Position: ${escapeHtml(slot.slotPosition)}</p>
        <p>Weekday: ${escapeHtml(slot.weekday)}</p>
        <p>Required: ${slot.required ? 'Yes' : 'No'}</p>

        <p>Start: <time-display show-date="never"> ${escapeHtml(slot.starttime)}</time-display></p>
        <p>End: <time-display show-date="never">${escapeHtml(slot.endtime)}</time-display></p>

        <p>Additional: ${escapeHtml(slotWrapper.additionalInformation || 'N/A')}</p>

      <button class="apply-btn" data-id="${escapeHtml(slot.slotId)}">
            <ssd-icon name="apply"></ssd-icon>
          </button>

        ${isAdmin ? /*html*/`
          <button class="edit-btn" data-id="${escapeHtml(slot.slotId)}">
            <ssd-icon name="edit"></ssd-icon>
          </button>
        ` : ''}
        <div collapsable>
          <div class="header">Base User ${slotWrapper.baseUsers.length}</div>
          <div class="content">
            ${Array.isArray(slotWrapper.baseUsers)
        ? slotWrapper.baseUsers
          .map(user => /*html*/`<ssd-intra-user id="${escapeHtml(user.id)}" data='${JSON.stringify(user)}'></ssd-intra-user>`)
          .join('')
        : '<p>N/A</p>'
      }
          </div>
        </div>
      <div collapsable>
          <div class="header">Fallback User ${slotWrapper.fallbackusers.length}</div>
          <div class="content">
            ${Array.isArray(slotWrapper.fallbackusers)
        ? slotWrapper.fallbackusers
          .map(user => /*html*/`<ssd-intra-user id="${escapeHtml(user.id)}" data='${JSON.stringify(user)}'></ssd-intra-user>`)
          .join('')
        : '<p>N/A</p>'
      }
          </div>
        </div>
        <div collapsable>
          <div class="header">Replacement User ${slotWrapper.replacementUser.length}</div>
          <div class="content">
            ${Array.isArray(slotWrapper.replacementUser)
        ? slotWrapper.replacementUser
          .map(user => /*html*/`<ssd-intra-user id="${escapeHtml(user.id)}" data='${JSON.stringify(user)}'></ssd-intra-user>`)
          .join('')
        : '<p>N/A</p>'
      }
          </div>
        </div>
        
                <div collapsable>
          <div class="header">Excuses ${slotWrapper.excuses.length}</div>
          <div class="content">
            ${Array.isArray(slotWrapper.excuses)
        ? slotWrapper.excuses
          .map(excusesId => /*html*/`<ssd-intra-excuse id="${escapeHtml(excusesId)}"}'></ssd-intra-excuse>`)
          .join('')
        : '<p>N/A</p>'
      }
          </div>
        </div>
        <div collapsable>
          <div class="header">Alerts ${slotWrapper.alerts.length}</div>
          <div class="content">
            ${Array.isArray(slotWrapper.alerts)
        ? slotWrapper.alerts
          .map(id => /*html*/`<ssd-intra-mission id="${escapeHtml(id)}"></ssd-intra-mission>`)
          .join('')
        : '<p>N/A</p>'
      }
          </div>
        </div>
              <div collapsable>
          <div class="header">Applications ${slotWrapper.applications.length}</div>
          <div class="content">
            ${Array.isArray(slotWrapper.applications)
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