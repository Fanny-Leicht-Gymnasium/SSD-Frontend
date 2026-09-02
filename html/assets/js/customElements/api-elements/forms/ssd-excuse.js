import { postExcuse } from '../../../api/api.generated.js';
import { FormAPIElement } from '../../form-api-element.js';

class SSDExcuseForm extends FormAPIElement {

    constructor() {
        super();

        this.defaultSubmittext = 'Create Excuse';
        this.defaultAlertErrors = true;
    }

    // -------------------------
    // FORM STRUCTURE
    // -------------------------
    renderForm() {
        this.form.innerHTML = /*html*/`
            <h1>Create Excuse</h1>

            <div class="field" input-label="Start date">
                <input
                    type="datetime-local"
                    id="startdate"
                    required
                >
            </div>

            <div class="field" input-label="End date">
                <input
                    type="datetime-local"
                    id="enddate"
                    required
                >
            </div>

            <div class="field" input-label="Reason">
                <textarea
                    id="reason"
                    placeholder="Reason"
                    required
                ></textarea>
            </div>
        `;
    }

    postRender() {
    }

    // -------------------------
    // CREATE HANDLER
    // -------------------------
    async handleSend(data) {
        try {
            const startdate = this.form.querySelector('#startdate')?.value;
            const enddate = this.form.querySelector('#enddate')?.value;
            const reason = this.form.querySelector('#reason')?.value;

            const payload = {
                startdate: this.toISOString(startdate),
                enddate: this.toISOString(enddate),
                reason
            };

            await postExcuse(payload);

            return { success: true };

        } catch (error) {
            console.error('Creating excuse failed', error);

            return {
                success: false,
                error
            };
        }
    }

    // Convert datetime-local value into an API-compatible ISO timestamp.
    toISOString(value) {
        if (!value) {
            return undefined;
        }

        return new Date(value).toISOString();
    }
}

customElements.define('ssd-excuse-form', SSDExcuseForm);