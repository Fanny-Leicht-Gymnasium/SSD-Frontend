import { APIElement } from '../../api-element.js';
import { escapeHtml } from '../../../util.js';
import { getScheduleYearWeek } from '../../../api/api.generated.js';
class ScheduleElement extends APIElement {
  static get observedAttributes() {
    return ['data', 'year', 'week', 'isAdmin'];
  }


  getCurrentWeek() {
    const now = new Date();

    const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayNum = date.getUTCDay() || 7;

    date.setUTCDate(date.getUTCDate() + 4 - dayNum);

    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

    const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);

    return {
      year: date.getUTCFullYear(),
      week: weekNo
    };
  }

  async fetchByContext() {
    console.log('Fetching schedule with context input');
    // 1. direct attribute override (JSON mode)
    const dataAttr = this.getAttribute('data');

    if (dataAttr) {
      try {
        return JSON.parse(dataAttr);
      } catch (e) {
        console.error('Invalid data JSON', e);
        return null;
      }
    }

    // 2. use Base input system (FIXED)
    const input = this.getInput();

    let year = input?.year;
    let week = input?.week;

    // 3. fallback attributes
    year = year || this.getAttribute('year');
    week = week || this.getAttribute('week');

    // 4. fallback current week
    if (!week || !year) {
      const current = this.getCurrentWeek();
      year = year || current.year;
      week = week || current.week;
    }

    return await getScheduleYearWeek(year, week);
  }

  render(data) {
    const slots = Array.isArray(data) ? data : [];

    // group by position -> weekday
    const grid = new Map();

    let maxWeekday = 6;
    let maxPosition = 0;

    for (const entry of slots) {
      const slot = entry?.slot;
      if (!slot) continue;

      const weekday = slot.weekday ?? 0;
      const position = slot.slotPosition ?? 0;

      maxWeekday = 6;
      maxPosition = Math.max(maxPosition, position);

      if (!grid.has(position)) {
        grid.set(position, new Map());
      }

      grid.get(position).set(weekday, entry);
    }

    const isAdmin = this.hasAttribute("isAdmin");
    return this.renderSchedule(grid, maxWeekday, maxPosition, isAdmin);
  }
  postRender() {
    this._bindAdminGridEvents()

  }

  renderSchedule(grid, maxWeekday, maxPosition, isAdmin) {
    let html = `
        <div class="schedule-grid">
            <table>
                <thead>
                    <tr>
                        <th>Position</th>
    `;

    // weekday headers
    for (let d = 0; d <= maxWeekday; d++) {
      html += `
            <th>
                <x-trans>time.weekday.${d}</x-trans>
                `
      if (isAdmin) {
        html += `
                    <button class="add-slot-btn"
                        data-p="-1"
                        data-d="${d}"
                        data-action="open-slot-form">
                        +
                    </button>
                `;
      }

      html += `
            </th>
        `;

    }
    html += `
                    </tr>
                </thead>
                <tbody>
    `;

    // rows
    for (let p = 0; p <= maxPosition; p++) {
      html += `<tr><td>${p}</td>`;

      for (let d = 0; d <= maxWeekday; d++) {
        const entry = grid.get(p)?.get(d);

        html += `<td class="schedule-cell">`;

        if (entry) {
          html += `
                    <ssd-slot-wrapped data='${escapeHtml(JSON.stringify(entry))}' ${isAdmin?'isAdmin':''}></ssd-slot-wrapped>
                `;
        } else {
          html += `<span class="empty-slot">-</span>`;
        }

        if (isAdmin) {
          html += `
                    <button class="add-slot-btn"
                        data-p="${p}"
                        data-d="${d}"
                        data-action="open-slot-form">
                        +
                    </button>
                `;
        }

        html += `</td>`;
      }

      html += `</tr>`;
    }

    html += `
                </tbody>
            </table>
        </div>
    `;

    return html;
  }
  _bindAdminGridEvents() {
    this.container.querySelectorAll('.add-slot-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const p = Number(e.currentTarget.dataset.p);
        const d = Number(e.currentTarget.dataset.d);

        const form = document.createElement('ssd-slot-form');

        form.setAttribute('asPopup', '');
        form.setAttribute('redirectURL', '/');

        
        const data = {
          after: p,
          weekday: d,
        }
        form.setAttribute('data', JSON.stringify(data));
        document.body.appendChild(form);
      });
    });
  }
}

customElements.define('ssd-schedule', ScheduleElement);