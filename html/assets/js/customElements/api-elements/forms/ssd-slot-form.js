import { deleteScheduleSlotId, getScheduleSlot, getScheduleSlotId, postLogin, postScheduleSlot, putScheduleSlotId } from '../../../api/api.generated.js';
import { FormAPIElement } from '../../form-api-element.js';

class SSDSlotForm extends FormAPIElement {
    constructor() {
        super();
        this.defaultSubmittext = 'Login';
        this.defaultAlertErrors = true;
    }

    // -------------------------
    // FORM STRUCTURE
    // -------------------------
    renderForm() {
        const hasId = this.hasAttribute("id");

        this.form.innerHTML = `
        <h1>Slot Editor</h1>
        <input type="text" id="slotName" placeholder="Name" required>

        <input type="number" id="weekday" placeholder="Weekday (0-6)" required>
        ${hasId ? `
        <input type="number" id="slotPosition" placeholder="Position" required>
        ` : '<input type="number" id="after" placeholder="After" required>'}

        <label>Start time</label>
        <input type="time" id="starttime" required>

        <label>End time</label>
        <input type="time" id="endtime" required>

        <label>
            <input type="checkbox" id="required">
            Required
        </label>

        ${hasId ? `
            <button type="button" id="deleteBtn" class="danger-btn">
                Delete
            </button>
        ` : ''}
    `;
        this._bindDelete();

    }
    _bindDelete() {
        const btn = this.form.querySelector('#deleteBtn');
        if (!btn) return;
        btn.addEventListener('click', async () => {
            const id = this.getAttribute("id");

            if (!id) return;

            const ok = confirm('Delete this slot?');
            if (!ok) return;

            try {
                await deleteScheduleSlotId(id); // or DELETE endpoint if you have one
                
                this.remove(); // close popup
            } catch (err) {
                console.error('Delete failed', err);
            }
        });
    }
    postRender() {
    }

    async fetchById(id) {
        console.log("fetvch")
        return getScheduleSlotId(id)
    }
    // -------------------------
    // UPDATE HANDLER
    // -------------------------
    async handleSend(data) {
        try {
            if (this.hasAttribute("id")){
                await putScheduleSlotId(this.id, data);
            }else{
                await postScheduleSlot(data);
            }
            return { success: true };


        } catch (error) {
            return { success: false, error: error };

        }
        return { success: false };
    }

}

customElements.define('ssd-slot-form', SSDSlotForm);