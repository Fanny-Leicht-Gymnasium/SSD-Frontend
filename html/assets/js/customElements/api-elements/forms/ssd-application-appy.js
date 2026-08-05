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
        this.form.innerHTML = /*html*/`
            <h1>Apply</h1>         
            <div class="field" input-label="Reason for application" translate>
                <textarea id="reason" placeholder="Reason for application"></textarea>
            </div>
            <div class="field" input-label="Type" translate>
                <select id="type" required>
                    <option value="">Select type</option>
                    <option value="base">Base user</option>
                    <option value="fallback">Fallback user</option>
                </select>
            </div>
            
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