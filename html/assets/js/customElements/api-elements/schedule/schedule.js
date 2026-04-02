import { APIElement } from '../../api-element.js';
import { escapeHtml } from '../../../util.js';
import { getScheduleYearWeek } from '../../../api/api.generated.js';
class ScheduleElement extends APIElement {
  static get observedAttributes() {
    return ['data', 'year', 'week'];
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

  let maxWeekday = 0;
  let maxPosition = 0;

  for (const entry of slots) {
    const slot = entry?.slot;
    if (!slot) continue;

    const weekday = slot.weekday ?? 0;
    const position = slot.slotPosition ?? 0;

    maxWeekday = Math.max(maxWeekday, weekday);
    maxPosition = Math.max(maxPosition, position);

    if (!grid.has(position)) {
      grid.set(position, new Map());
    }

    grid.get(position).set(weekday, entry);
  }

  let html = `
    <div class="schedule-grid">
      <table>
        <thead>
          <tr>
            <th>Position</th>
  `;

for (let d = 0; d <= maxWeekday; d++) {
  html += `
    <th>
      <x-trans>time.weekday.${d}</x-trans>
    </th>
  `;
}

  html += `
          </tr>
        </thead>
        <tbody>
  `;

  // rows: positions
  for (let p = 0; p <= maxPosition; p++) {
    html += `<tr><td>${p}</td>`;

    for (let d = 0; d <= maxWeekday; d++) {
      const entry = grid.get(p)?.get(d);

      html += `<td>`;

      if (entry) {
        html += `
          <ssd-slot data='${escapeHtml(JSON.stringify(entry))}'></ssd-slot>
        `;
      } else {
        html += `-`;
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
}

customElements.define('ssd-schedule', ScheduleElement);