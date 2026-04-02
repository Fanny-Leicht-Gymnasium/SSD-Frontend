import { APIElement } from './api-element.js';
export class FormAPIElement extends APIElement {
  static get observedAttributes() {
    return ['data', 'id', 'alertErrors', 'submitoninput', 'submittext'];
  }

  constructor() {
    super();
    this.container.innerHTML = `
    <form id="apiForm">
    </form>
    <div id="result"></div>`;
    this.form = this.container.querySelector('#apiForm');
    this.result = this.container.querySelector('#result');

    this.hasSubmitOnInput = this.hasAttribute('submitoninput');
    this.SubmitOnInput = this.getAttribute('submitoninput');
    this.submitListener = this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    if (this.hasAttribute('submittext') || this.defaultSubmittext) {
      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.textContent = this.getAttribute('submittext') || this.defaultSubmittext;
      this.form.appendChild(btn);
    }
    this.renderForm()
    this.addStylesheet('/assets/css/forms.css');
  }
  set defaultSubmittext(text) {
    this._defaultSubmittext = text;
    if (text) {
      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.textContent = text;
      this.form.appendChild(btn);
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
          this.form.appendChild(btn);
        }
        break;
      case 'alerterror':
        this.alertErrors = this.hasAttribute('alerterror');
        break;
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

    if (result.success && result.redirect!== false) {
      redirectURL = result.redirect || this.getAttribute('redirectURL');
      
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
      this.result.innerHTML = this.renderError(result.error);
      return;
    }

  }

  async handleSend(data) {
    throw new Error('handleUpdate not implemented');
  }
  getFormData() {
    const data = {};
    this.form.querySelectorAll('input, textarea').forEach(el => {
      if (el.id) {
        data[el.id] = el.value;
      }
    });
    return data;
  }
  // =========================
  // INPUT LAYER (clean priority chain)
  // =========================
  /** updates the form values */
  render(data) {
    this.form.querySelectorAll('input, textarea').forEach(el => {
      const name = el.id;
      if (data[name]) {
        el.value = data[name];
      }
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
    const el = this.container;
    if (!el) return;

    el.classList.add('loading');

    try {
      const input = this.getInput();

      if (!input) {
        el.textContent = 'Missing input';
        return;
      }
      const data = await this.resolveData(input);

      if (!data) {
        throw new Error('No data returned');
      }
      this.render(data);
    } catch (err) {
      this.result.innerHTML = this.renderError(err);
    }
  }
  /**Unused */
  renderLoading() {
    return `Loading...`;
  }

  renderError(err) {
    return `<ssd-error ${(this.AlertErrors || this.defaultAlertErrors) ? "alert" : ""}>${err.message}</ssd-error>`;
  }
}