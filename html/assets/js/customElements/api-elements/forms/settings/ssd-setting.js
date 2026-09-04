import { createPostMissionStartBodyTemplate, getUserMeSettingSetting, postMissionStart, postUserMeSettingSetting } from '../../../../api/api.generated.js';
import { escapeHtml, getStoredSetting, getStoredSettings, setStoredSetting } from '../../../../util.js';
import { FormAPIElement } from '../../../form-api-element.js';

class SSDSetting extends FormAPIElement {

  static get observedAttributes() {
    return [
      ...(super.observedAttributes || []),
      'name',
      'storagekey',
      'trans-name',
      'trans-placeholder',
      'refreshButton',
      'saveButton',

      'placeholder',
      'type',

      // Validation
      'required',
      'minlength',
      'maxlength',
      'min',
      'max',
      'step',
      'pattern',

      // State
      'disabled',
      'readonly',
      'autofocus',
      'checked',

      // Input behavior
      'autocomplete',
      'inputmode',
      'enterkeyhint',
      'spellcheck',
      'size',
      'multiple',
      'accept',
      'list',

      // Textarea
      'rows',
      'cols',
      'wrap',
    ];
  }

  constructor() {
    super();
    this.defaultAlertErrors = true;
  }

  /**
   * Build HTML attributes from the component attributes.
   * Boolean attributes are only rendered when they are actually present.
   */
  getInputAttributes() {
    const booleanAttributes = [
      'required',
      'disabled',
      'readonly',
      'autofocus',
      'checked',
      'multiple',
    ];

    const normalAttributes = [
      'autocomplete',
      'minlength',
      'maxlength',
      'min',
      'max',
      'step',
      'pattern',
      'size',
      'accept',
      'list',
      'inputmode',
      'enterkeyhint',
      'spellcheck',
      'rows',
      'cols',
      'wrap',
    ];

    const attributes = [];

    for (const attribute of booleanAttributes) {
      if (this.hasAttribute(attribute)) {
        attributes.push(attribute);
      }
    }

    for (const attribute of normalAttributes) {
      if (this.hasAttribute(attribute)) {
        const value = this.getAttribute(attribute);

        if (value !== null) {
          attributes.push(
            `${attribute}="${escapeHtml(value)}"`
          );
        }
      }
    }

    return attributes.join(' ');
  }


  renderForm() {
    const storagekey = this.getAttribute('storagekey') || '';
    const name = this.getAttribute('name') || storagekey;
    const placeholder = this.getAttribute('placeholder') || name;
    const transName = this.getAttribute('trans-name') || '';
    const transPlaceholder = this.getAttribute('trans-placeholder') || '';
    const type = this.getAttribute('type') || 'text';
    const hidden = this.getAttribute('hidden') || '';

    if (storagekey === '') {
      this.form.innerHTML = /* html */ `
        <div class="field" input-label="Error">
          <input
            type="text"
            id="error"
            placeholder="Error: storagekey not set"
            required
          >
        </div>
      `;

      return;
    }

    const saveButton = this.hasAttribute('saveButton') || false;
    const refreshButton = this.hasAttribute('refreshButton') || false;
    const buttons = `
    ${refreshButton ? `<button type="button" id="refreshButton"><ssd-icon name="form/refresh">refresh</ssd-icon></button>` : ''}
    ${saveButton ? `<button type="submit" id="saveButton"><ssd-icon name="form/save">save</ssd-icon></button>` : ''}
    `

    const attributes = this.getInputAttributes();

    const inputTypes = [
      'checkbox',
      'color',
      'date',
      'datetime-local',
      'email',
      'month',
      'number',
      'password',
      'range',
      'search',
      'tel',
      'text',
      'time',
      'url',
      'week',
    ];

    if (inputTypes.includes(type)) {
      this.form.innerHTML = /* html */ `
        <div
          class="field"
          input-label="${escapeHtml(name)}"
          ${transName ? `trans-lable="${escapeHtml(transName)}"` : ''}
          ${transPlaceholder ? `trans-placeholder="${escapeHtml(transPlaceholder)}"` : ''}
          ${hidden ? 'hidden' : ''}
        >
          <input
            type="${escapeHtml(type)}"
            id="${escapeHtml(storagekey)}"
            placeholder="${escapeHtml(placeholder)}"
            ${attributes}
          >
          ${buttons}
        </div>
      `;

      return;
    }

    if (type === 'textarea') {
      this.form.innerHTML = /* html */ `
        <div
          class="field"
          input-label="${escapeHtml(name)}"
          ${transName ? `trans-lable="${escapeHtml(transName)}"` : ''}
          ${transPlaceholder ? `trans-placeholder="${escapeHtml(transPlaceholder)}"` : ''}
          ${hidden ? 'hidden' : ''}
        >
          <textarea
            id="${escapeHtml(storagekey)}"
            placeholder="${escapeHtml(placeholder)}"
            ${attributes}
          ></textarea>
          ${buttons}
        </div>
      `;

      return;
    }

    if (type === 'select') {
      const options = (this.getAttribute('options') || '')
        .split(';')
        .map(option => option.trim())
        .filter(option => option !== '');

      const optionHtml = options
        .map(option => `
      <option value="${escapeHtml(option)}">
        ${escapeHtml(option)}
      </option>
    `)
        .join('');

      this.form.innerHTML = /* html */ `
    <div
      class="field"
      input-label="${escapeHtml(name)}"
      ${transName ? `trans-lable="${escapeHtml(transName)}"` : ''}
      ${transPlaceholder ? `trans-placeholder="${escapeHtml(transPlaceholder)}"` : ''}
      ${hidden ? 'hidden' : ''}
    >
      <select
        id="${escapeHtml(storagekey)}"
        ${attributes}
      >
        ${optionHtml}
      </select>
      ${buttons}
    </div>
  `;

      return;
    }

    this.form.innerHTML = /* html */ `
      <div class="field" input-label="Error">
        <input
          type="text"
          id="error"
          placeholder="Error: invalid type '${escapeHtml(type)}'"
          required
        >
      </div>
    `;
  }
  async fetchByContext(input) {
    const storagekey = this.getAttribute('storagekey') || '';
    const forceRefresh = this.hasAttribute('forceRefresh') || false;
    if (!forceRefresh) {
      const value = String(getStoredSetting(storagekey)).replace(/^"|"$/g, '');
      console.log("Fetched value from localStorage:", value);
      if (value !== null) {
        return { [storagekey]: value };
      }
    }
    const data = (await getUserMeSettingSetting(storagekey)).replace(/^"|"$/g, '');
    setStoredSetting(storagekey, data);
    const result = { [storagekey]: data };
    return result;
  }

  async handleSend(data) {
    try {
      const storagekey = this.getAttribute('storagekey') || '';
      const name = this.getAttribute('name') || storagekey;
      console.log(data[storagekey])
      const result = await postUserMeSettingSetting(storagekey, data[storagekey]);

      setStoredSetting(storagekey, data[storagekey]);
      this.result.innerHTML = `<ssd-ok alert>Setting ${name} saved successfully!</ssd-ok>`;

      this.result.className = 'success';

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
  async postRender() {
    const refreshButton = this.form.querySelector('#refreshButton');
    if (refreshButton) {
      refreshButton.onclick = async () => {
        const storagekey = this.getAttribute('storagekey') || '';
        const name = this.getAttribute('name') || storagekey;
        this.setAttribute('forceRefresh', '');
        await this.load();
        this.result.innerHTML = `<ssd-ok alert>Setting ${name} fetched successfully!</ssd-ok>`;

      };
    }
  }
}

customElements.define('ssd-setting', SSDSetting);