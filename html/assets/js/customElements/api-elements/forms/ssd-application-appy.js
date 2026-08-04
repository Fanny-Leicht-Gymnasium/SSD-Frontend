import { postScheduleYearWeekSlotSlotidApply } from '../../../api/api.generated.js';
import { FormAPIElement } from '../../form-api-element.js';

class SSDApplicationApply extends FormAPIElement {
    constructor() {
        super();
        this.defaultSubmittext = 'Apply';
        this.defaultAlertErrors = true;
    }

    // -------------------------
    // FORM STRUCTURE
    // -------------------------
    renderForm() {
        this.form.innerHTML = `
            <h1>Apply</h1>

            <label>Reason</label>
            <textarea id="reason" placeholder="Reason for application"></textarea>

            <label>Type</label>
            <select id="type" required>
                <option value="">Select type</option>
                <option value="BASE_USER">Base user</option>
                <option value="FALLBACK_USER">Fallback user</option>
            </select>
        `;
    }

    postRender() {
    }

    // -------------------------
    // FETCH (not needed)
    // -------------------------
    async fetchById() {
        return null;
    }

    // -------------------------
    // SUBMIT HANDLER
    // -------------------------
    async handleSend(data) {
        try {
            const year = this.getAttribute('year');
            const week = this.getAttribute('week');
            const slotID = this.getAttribute('slot-id');

            if (!year || !week || !slotID) {
                throw new Error('Missing schedule parameters');
            }

            const body = {
                reason: data.reason,
                type: data.type
            };

            const response = await postScheduleYearWeekSlotSlotidApply(
                year,
                week,
                slotID,
                body
            );

            return {
                success: true,
                data: response
            };

        } catch (error) {
            console.error('Application failed', error);
            
            return {
                success: false,
                error
            };
        }
    }
}

customElements.define('ssd-application-apply', SSDApplicationApply);