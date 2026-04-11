import { APIElement } from '../../api-element.js';
import { escapeHtml } from '../../../util.js';

class SlotElementWrapped extends APIElement {
  static get observedAttributes() {
    return ['data'];
  }


  render(slotWrapper) {
    const slot = slotWrapper?.slot ?? {};
    const isAdmin = this.hasAttribute('isAdmin');
console.log(slotWrapper)
    return `
      <div class="slot">

        <h3>${escapeHtml(slot.slotName || 'Unnamed Slot')}</h3>

        <p>ID: ${escapeHtml(slot.slotId)}</p>
        <p>Position: ${escapeHtml(slot.slotPosition)}</p>
        <p>Weekday: ${escapeHtml(slot.weekday)}</p>
        <p>Required: ${slot.required ? 'Yes' : 'No'}</p>

        <p>Start: ${escapeHtml(slot.starttime)}</p>
        <p>End: ${escapeHtml(slot.endtime)}</p>

        <p>Additional: ${escapeHtml(slotWrapper.additionalInformation || 'N/A')}</p>

        ${isAdmin ? `
          <button class="edit-btn" data-id="${escapeHtml(slot.slotId)}">
            <ssd-icon name="edit"></ssd-icon>
          </button>
        ` : ''}
        <div collapsable>
          <div class="header">Base User ${slotWrapper.baseUsers.length}</div>
          <div class="content">
            ${Array.isArray(slotWrapper.baseUsers)
        ? slotWrapper.baseUsers
          .map(user => `<ssd-intra-user id="${escapeHtml(user.id)}" data='${JSON.stringify(user)}'></ssd-intra-user>`)
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
          .map(user => `<ssd-intra-user id="${escapeHtml(user.id)}" data='${JSON.stringify(user)}'></ssd-intra-user>`)
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
          .map(user => `<ssd-intra-user id="${escapeHtml(user.id)}" data='${JSON.stringify(user)}'></ssd-intra-user>`)
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
          .map(excusesId =>`<ssd-intra-excuse id="${escapeHtml(excusesId)}"}'></ssd-intra-excuse>`)
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
          .map(id => `<ssd-intra-mission id="${escapeHtml(id)}"></ssd-intra-mission>`)
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
          .map(application => `<ssd-intra-applications id="${escapeHtml(application.id)}" data='${JSON.stringify(application)}'></ssd-intra-applications>`)
          .join('')
        : '<p>N/A</p>'
      }
          </div>
        </div>
      </div>
    `;
  }
  postRender() {
    if (!this.hasAttribute('isAdmin')) return;

    this.root.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;

        const form = document.createElement('ssd-slot-form');

        form.setAttribute('asPopup', '');
        form.setAttribute('redirectURL', 'close');

        document.body.appendChild(form);
        form.setAttribute('id', id); // load by id
      });
    });
  }
}

customElements.define('ssd-slot-wrapped', SlotElementWrapped);