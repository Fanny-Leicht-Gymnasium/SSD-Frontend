import { APIElement } from '../../api-element.js';
import { escapeHtml } from '../../../util.js';

class SlotElement extends APIElement {
  static get observedAttributes() {
    return ['data'];
  }


  render(slot) {
    const isAdmin = this.hasAttribute('isAdmin');
    return /*html*/`
      <div class="slot">

        <h3>${escapeHtml(slot.slotName || 'Unnamed Slot')}</h3>

        <p>ID: ${escapeHtml(slot.slotId)}</p>
        <p>Position: ${escapeHtml(slot.slotPosition)}</p>
        <p>Weekday: ${escapeHtml(slot.weekday)}</p>
        <p>Required: ${slot.required ? 'Yes' : 'No'}</p>

        <p>Start: <time-display show-date="never"> ${escapeHtml(slot.starttime)}</time-display></p>
        <p>End: <time-display show-date="never">${escapeHtml(slot.endtime)}</time-display></p>


        ${isAdmin ? /*html*/`
          <button class="edit-btn" data-id="${escapeHtml(slot.slotId)}">
            <ssd-icon name="edit"></ssd-icon>
          </button>
        ` : ''}
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

customElements.define('ssd-slot', SlotElement);