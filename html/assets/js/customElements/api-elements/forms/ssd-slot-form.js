import { createPostScheduleSlotBodyTemplate, createSlotTemplate, deleteScheduleSlotId, getScheduleSlot, getScheduleSlotId, postLogin, postScheduleSlot, putScheduleSlotId } from '../../../api/api.generated.js';
import { FormAPIElement } from '../../form-api-element.js';

class SSDSlotForm extends FormAPIElement {
    constructor() {
        super();
        this.defaultSubmittext = 'Update Slot';
        this.defaultAlertErrors = true;
    }

    // -------------------------
    // FORM STRUCTURE
    // -------------------------
    renderForm() {
        const hasId = this.hasAttribute("id");

        this.form.innerHTML = /*html*/`
        <h1>Slot Editor</h1>
        <div class="field" input-label="Name" trans-lable="slot.lable.name" trans-placeholder="slot.lable.name">
            <input type="text" id="slotName" placeholder="Name" required>
        </div>

        <div class="field" input-label="Weekday" trans-lable="slot.lable.weekday" trans-placeholder="slot.lable.weekday">
        <select id="weekday" required>
                <option value="1"><x-trans>time.weekday.1</x-trans></option>
                <option value="2"><x-trans>time.weekday.2</x-trans></option>
                <option value="3"><x-trans>time.weekday.3</x-trans></option>
                <option value="4"><x-trans>time.weekday.4</x-trans></option>
                <option value="5"><x-trans>time.weekday.5</x-trans></option>
                <option value="6"><x-trans>time.weekday.6</x-trans></option>
                <option value="7"><x-trans>time.weekday.7</x-trans></option>
            </select>
        </div>
        ${hasId ? /*html*/`
        <div class="field" input-label="Position" trans-lable="slot.lable.position" trans-placeholder="slot.lable.position">
            <input type="number" id="slotPosition" placeholder="Position" required>
        </div>
        ` : /*html*/`
        <div class="field" input-label="After" trans-lable="slot.lable.after" trans-placeholder="slot.lable.after">
            <input type="number" id="after" placeholder="After" required>
        </div>
        `}

        <div class="field" input-label="Start time" trans-lable="slot.lable.starttime" trans-placeholder="slot.lable.starttime">
            <input type="time" id="starttime" required>
        </div>
        <div class="field" input-label="End time" trans-lable="slot.lable.endtime" trans-placeholder="slot.lable.endtime">
            <input type="time" id="endtime" required>
        </div>

   
        <div class="field" input-label="Required" trans-lable="slot.lable.required" trans-placeholder="slot.lable.required">
            <input type="checkbox" id="required">
        </div>

        ${hasId ? /*html*/`
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
                await putScheduleSlotId(this.id, createSlotTemplate(data));
            }else{
                await postScheduleSlot(createPostScheduleSlotBodyTemplate(data));
            }
            return { success: true };


        } catch (error) {
            return { success: false, error: error };

        }
        return { success: false };
    }

}

customElements.define('ssd-slot-form', SSDSlotForm);