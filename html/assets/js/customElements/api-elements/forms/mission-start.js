import {
  createPostMissionStartBodyTemplate,
  postMissionStart
} from '../../../api/api.generated.js';

import { FormAPIElement } from '../../form-api-element.js';

class SSDMissionStart extends FormAPIElement {

  constructor() {
    super();

    this.defaultAlertErrors = true;
    this.injuries = [];
  }

  renderForm() {
    this.form.innerHTML = /*html*/`
            <div class="field" input-label="Injury" trans-lable="mission.injury" trans-placeholder="mission.injury">
            <input type="text" id="injury" placeholder="Injury (e.g. Broken leg)" list="injury-options" required>
            <datalist id="injury-options"></datalist>
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

  async load() {
    try {
      const response = await fetch('/assets/datasets/injury.json');

      if (!response.ok) {
        throw new Error(`Failed to load injury data: ${response.status}`);
      }

      this.injuries = await response.json();

      this.populateInjuryAutocomplete();
    } catch (error) {
      console.error('Failed to load injuries:', error);
    }
  }

  populateInjuryAutocomplete() {
    const datalist = this.form.querySelector('#injury-options');

    if (!datalist) {
      return;
    }

    datalist.innerHTML = '';

    for (const injury of this.injuries) {
      const option = document.createElement('option');

      option.value = injury;

      datalist.appendChild(option);
    }
  }

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
      if (this.hasAttribute("noRedirect")){
              return { success: true, redirect: `` , data: data};
      }
      return { success: true, redirect: `/mission/?id=${data.alertId}`, data: data};
    } catch (error) {
      return { success: false, error: error };
    }
    return { success: false };
  }
}

customElements.define('ssd-mission-start', SSDMissionStart);