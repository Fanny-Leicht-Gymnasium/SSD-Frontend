import { getMondayOfWeek } from "../../util.js";

class WeekSwitch extends HTMLElement {
    static get observedAttributes() {
        return ['week', 'year'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        if (this.isConnected) {
            this.render();
        }
    }

    get week() {
        return Number(this.getAttribute('week') || this.getCurrentWeek());
    }

    get year() {
        return Number(this.getAttribute('year') || new Date().getFullYear());
    }

    getCurrentWeek() {
        const date = new Date();
        const day = date.getDay() || 7;

        date.setDate(date.getDate() + 4 - day);

        return Math.ceil(
            ((date - new Date(date.getFullYear(), 0, 1)) / 86400000 + 1) / 7
        );
    }

    getWeeksInYear(year) {
        const december28 = new Date(year, 11, 28);
        const day = december28.getDay() || 7;

        const thursday = new Date(december28);
        thursday.setDate(december28.getDate() - day + 4);

        const january1 = new Date(thursday.getFullYear(), 0, 1);

        return Math.ceil(
            ((thursday - january1) / 86400000 + 1) / 7
        );
    }

    setWeek(newWeek, newYear = this.year) {
        this.setAttribute('week', String(newWeek));
        this.setAttribute('year', String(newYear));

        this.dispatchEvent(new CustomEvent('date-change', {
            detail: {
                year: newYear,
                week: newWeek
            },
            bubbles: true
        }));
    }

    setYear(newYear) {
        this.setAttribute('year', String(newYear));

        this.dispatchEvent(new CustomEvent('date-change', {
            detail: {
                year: newYear,
                week: this.week
            },
            bubbles: true
        }));
    }

    previousWeek() {
        if (this.week > 1) {
            this.setWeek(this.week - 1);
            return;
        }

        // Week 1 -> last ISO week of previous year
        const previousYear = this.year - 1;
        this.setWeek(
            this.getWeeksInYear(previousYear),
            previousYear
        );
    }

    nextWeek() {
        const weeksInYear = this.getWeeksInYear(this.year);

        if (this.week < weeksInYear) {
            this.setWeek(this.week + 1);
            return;
        }

        // Last week -> week 1 of next year
        this.setWeek(1, this.year + 1);
    }
    render() {
        const week = this.week;
        const year = this.year;
        const weeksInYear = this.getWeeksInYear(year);

        const display = this.hasAttribute('kw')
            ? `KW ${week} - ${year}`
            : getMondayOfWeek(year, week).toLocaleDateString('de-de', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

        this.innerHTML = `
        <div class="week-switch">
            <button type="button" data-action="prev">
                Previous
            </button>

            <span>
                ${display}
            </span>

            <button type="button" data-action="next">
                Next
            </button>
        </div>
    `;

        this.querySelector('[data-action="prev"]')
            ?.addEventListener('click', () => {
                this.previousWeek();
            });

        this.querySelector('[data-action="next"]')
            ?.addEventListener('click', () => {
                this.nextWeek();
            });
    }
}

customElements.define('ssd-week-switch', WeekSwitch);