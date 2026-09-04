import { createPostMissionStartBodyTemplate, postMissionStart } from '../../../api/api.generated.js';
import { FormAPIElement } from '../../form-api-element.js';

class SSDMissionStart extends FormAPIElement {
  constructor() {
    super();
    this.defaultAlertErrors = true;
  }

  renderForm() {
    this.form.innerHTML = /*html*/`
            <div class="field" input-label="Injury" trans-lable="mission.injury" trans-placeholder="mission.injury">
            <input type="text" id="injury" placeholder="Injury (e.g. Broken leg)" required>
            </div>
            <div class="field" input-label="Location" trans-lable="mission.location" trans-placeholder="mission.location">
            <input type="text" id="location" placeholder="Location" required>
            </div>
            <div class="field" input-label="Author" trans-lable="mission.author" trans-placeholder="mission.author">
            <input type="text" id="author" placeholder="Author" required>
            </div>
            <div class="field" input-label="Additional" trans-lable="mission.additional-information" trans-placeholder="mission.additional-information">
            <textarea id="additionalInformation" placeholder="Additional info"></textarea>
            </div>`;
    this.defaultSubmittext = 'Start Mission';
  }
  async load() { }

  async handleSend(data) {
    const missionData = createPostMissionStartBodyTemplate({
      Injury: data.injury,
      location: data.location,
      Author: data.author,
      additionalInformation: data.additionalInformation
    })
    try {
      const data = await postMissionStart(missionData);
      console.log('Mission started successfully:', data);
      this.result.textContent = `Mission started! UUID: ${data.alertId}`;
      this.result.className = 'success';
      return { success: true, redirect: "", a:`/mission/?id=${data.alertId}` };
    } catch (error) {
      return { success: false, error: error };
    }
    return { success: false };
  }
}

customElements.define('ssd-mission-start', SSDMissionStart);