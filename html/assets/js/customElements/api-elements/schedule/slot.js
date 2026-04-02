import { APIElement } from '../../api-element.js';
import { escapeHtml } from '../../../util.js';

class SlotElement extends APIElement {
  static get observedAttributes() {
    return ['data'];
  }

  render(slotWrapper) {
    const slot = slotWrapper?.slot ?? {};

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

        <div collapsable>
          <div class="header">Alerts</div>
          <div class="content">
                  
      ${Array.isArray(slotWrapper.alerts)
              ? slotWrapper.alerts
                .map(id => `<ssd-intra-mission id="${escapeHtml(id)}"></ssd-intra-mission>`)
                .join('')
              : '<p>N/A</p>'
            }
           
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('ssd-slot', SlotElement);