import { postMissionStart } from '../../../api/api.generated.js';
import { FormAPIElement } from '../../form-api-element.js';

class SSDMissionStart extends FormAPIElement {
  constructor() {
    super();
    this.defaultAlertErrors = true;
  }

  renderForm() {
    this.form.innerHTML = /*html*/`
            <div class="field" input-label="Injury">
            <input type="text" id="injury" placeholder="Injury (e.g. Broken leg)" required>
            </div>
            <div class="field" input-label="Location">
            <input type="text" id="location" placeholder="Location" required>
            </div>
            <div class="field" input-label="Author">
            <input type="text" id="author" placeholder="Author" required>
            </div>
            <div class="field" input-label="Additional">
            <textarea id="additionalInformation" placeholder="Additional info"></textarea>
            </div>`;
    this.defaultSubmittext = 'Start Mission';
  }
  async load() { }

  async handleSend(data) {
    const missionData = {
      Injury: data.injury,
      location: data.location,
      Author: data.author,
      additionalInformation: data.additionalInformation
    };

    try {
      const data = await postMissionStart(missionData);

      this.result.textContent = `Mission started! UUID: ${data.missionUUID}`;
      this.result.className = 'success';
      return { success: true, redirect: `/mission/?id=${data.missionUUID}` };
    } catch (error) {
      return { success: false, error: error };
    }
    return { success: false };
  }
}

customElements.define('ssd-mission-start', SSDMissionStart);