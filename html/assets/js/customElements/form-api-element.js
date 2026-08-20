import { APIElement } from './api-element.js';
export class FormAPIElement extends APIElement {

  static get observedAttributes() {
    return [
      ...(super.observedAttributes || []),
      'submitoninput',
      'submittext'
    ];
  }
  constructor() {
    super();
    this.container.innerHTML = /*html*/`
    <form id="apiForm">
    <div id="customForm">
    </div>
    </form>
    <div id="result"></div>`;
    this.form = this.container.querySelector('#customForm');
    this.apiForm = this.container.querySelector('#apiForm');
    this.result = this.errorArea;

    this.hasSubmitOnInput = this.hasAttribute('submitoninput');
    this.SubmitOnInput = this.getAttribute('submitoninput');
    this.submitListener = this.apiForm.addEventListener('submit', (e) => this.handleSubmit(e));
    if (this.hasAttribute('submittext') || this.defaultSubmittext) {
      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.textContent = this.getAttribute('submittext') || this.defaultSubmittext;
      this.apiForm.appendChild(btn);
    }
    this.renderForm()
    this.postRender()
    this.addStylesheet('/assets/css/forms.css');
  }
  set defaultSubmittext(text) {
    this._defaultSubmittext = text;
    if (text) {
      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.textContent = text;
      this.apiForm.appendChild(btn);
    }
  }
  get defaultSubmittext() {
    return this._defaultSubmittext;
  }
  set defaultSubmitOnInput(input) {
    this._defaultSubmitOnInput = input;
  }
  get defaultSubmitOnInput() {
    return this._defaultSubmitOnInput;
  }

  //TODO: implement that this function is called on input change if submitoninput is set
  async onInputHandleSubmit(e) {
    if (this.hasSubmitOnInput && this.SubmitOnInput === "false") {
      return;
    }
    if (this.defaultSubmitOnInput || this.hasSubmitOnInput) {
      await this.handleSubmit(e);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback()
    switch (name) {
      case 'submitoninput':
        this.hasSubmitOnInput = this.hasAttribute('submitoninput');
        this.SubmitOnInput = this.getAttribute('submitoninput');
        break;
      case 'submittext':
        if (this.hasAttribute('submittext')) {
          const btn = document.createElement('button');
          btn.type = 'submit';
          btn.textContent = this.getAttribute('submittext') || 'Submit';
          this.apiForm.appendChild(btn);
        }
        break;
      case 'alerterror':
        this.alertErrors = this.hasAttribute('alerterror');
        break;
      case 'id':
        this.load()
      default:
        if (oldValue !== newValue) {
          this.load();
        }
        break;
    }
  }

  // =========================
  // OVERRIDES (API layer)
  // =========================
  async fetchById(id) {
    throw new Error('fetchById not implemented');
  }
  async fetchByContext(input) {
    // NEW: override point for complex components
    return null;
  }

  renderForm() {
    throw new Error('Form renderer not implemented');
  }

  async handleSubmit(e) {
    e.preventDefault();

    let data = this.getFormData();
    const result = await this.handleSend(data);

    if (result.success) {
      this.dispatchEvent(new CustomEvent('form-success', {
        bubbles: true,
        composed: true,
        detail: result
      }));
    }

    if (result.success && result.redirect != false) {
      const redirectURL = result.redirect || this.getAttribute('redirectURL');

      if (this.hasAttribute('redirectURL') || result.redirect) {
        if (redirectURL === "close") {
          this.remove();
        } else {
          window.location.href = redirectURL;
        }
        return;
      }
    }
    else if (result.error) {
      this.renderError(result.error);
      return;
    }

  }

  async handleSend(data) {
    throw new Error('handleUpdate not implemented');
  }
  getFormData() {
    const data = {};

    this.form.querySelectorAll('input, textarea, select').forEach(el => {
      if (!el.id) return;

      let value = el.value;
      if (el.type === 'time') {
        const time = value; // "16:22"

        if (typeof time === 'string' && time.includes(':')) {
          const [hours, minutes] = time.split(':').map(Number);

          const date = new Date();

          date.setHours(hours);
          date.setMinutes(minutes);
          date.setSeconds(0);
          date.setMilliseconds(0);

          value = date;
        }
      }
      // boolean handling
      if (el.type === 'checkbox') {
        value = el.checked;
      } else {
        // number detection
        if (typeof value === 'string' && value.trim() !== '') {
          const num = Number(value);

          if (!Number.isNaN(num) && value.trim() !== '') {
            value = num;
          }
        }

        // boolean string fallback
        if (value === 'true') value = true;
        if (value === 'false') value = false;
      }

      data[el.id] = value;
    });

    return data;
  }
  // =========================
  // INPUT LAYER (clean priority chain)
  // =========================
  /** updates the form values */
render(data) {
    if (!data) return;

    this.form.querySelectorAll('input, textarea, select').forEach(el => {
        const name = el.id;

        if (data[name] === undefined || data[name] === null) return;

        let value = data[name];

        // Handle time inputs (HH:mm)
        if (el.type === 'time') {
            const date = new Date(value);

            if (!isNaN(date.getTime())) {
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');

                value = `${hours}:${minutes}`;
            }
        }

        // Handle checkbox
        if (el.type === 'checkbox') {
            el.checked = !!value;
            return;
        }

        el.value = value;
    });
}
  getInput() {
    // 1. attribute JSON override
    const json = this.getAttribute('data');
    if (json) {
      try {
        return {
          source: 'attribute',
          data: JSON.parse(json)
        };
      } catch (e) {
        console.error('Invalid JSON attribute:', e);
      }
    }

    // 2. id-based API fetch
    const id = this.getAttribute('id');
    if (id) {
      return {
        source: 'api',
        id
      };
    }

    return {
      source: 'other',
      id: this.getAttribute('id'),
      attr: this.attributes,
    };
  }

  // =========================
  // CORE LOAD PIPELINE
  // =========================

  async resolveData(input) {
    // 1. direct attribute data
    if (input?.source === 'attribute') {
      return input.data;
    }

    // 2. id-based API fetch
    if (input?.source === 'api') {
      return await this.fetchById(input.id);
    }

    // 3. context-based fetch (NEW extension hook)
    return await this.fetchByContext(input);
  }

  async load() {
    this.renderForm();

    const el = this.container;
    if (!el) return;

    el.classList.add('loading');

    try {
      const input = this.getInput();

      if (!input) {
        this.renderError("Missing Input");
        return;
      }
      const data = await this.resolveData(input);

      if (!data) {
        el.classList.remove('loading');
        return
      }
      this.render(data);
      el.classList.remove('loading');

    } catch (err) {
      this.renderError(err);
    }
  }
  /**Unused */
  renderLoading() {
    return `Loading...`;
  }
}