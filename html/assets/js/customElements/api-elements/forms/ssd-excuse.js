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

            <div class="field" input-label="Start date" trans-lable="application.startdate" trans-placeholder="application.startdate">
                <input
                    type="datetime-local"
                    id="starttimestamp"
                    required
                >
            </div>

            <div class="field" input-label="End date" trans-lable="application.enddate" trans-placeholder="application.enddate">
                <input
                    type="datetime-local"
                    id="endtimestamp"
                    required
                >
            </div>

            <div class="field" input-label="Reason" trans-lable="excuse.reason" trans-placeholder="excuse.reason">
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
            const starttimestamp = this.form.querySelector('#starttimestamp')?.value;
            const endtimestamp = this.form.querySelector('#endtimestamp')?.value;
            const reason = this.form.querySelector('#reason')?.value;

            const payload = {
                starttimestamp: this.toISOString(starttimestamp),
                endtimestamp: this.toISOString(endtimestamp),
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