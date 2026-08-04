import { SSDElement } from './ssd-element.js';
export class APIElement extends SSDElement {
  static get observedAttributes() {
    return [
        ...(super.observedAttributes || []),
        'data',
        'id',
        'alertErrors'
    ];
}  

  constructor() {
    super();
    // Internal state flag
    this.hasLoaded = false;

    // IntersectionObserver instance
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.loadOnce();
          }
        }
      },
      {
        root: null,
        threshold: 0.1
      }
    );
    this.alertErrors = this.hasAttribute('alerterror');
    console.log('APIElement alertErrors:', this.alertErrors);
    this.defaultAlertErrors = false;
  }

  connectedCallback() {
    // Start observing visibility
    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback()

    if (name === 'alerterror') {
      this.alertErrors = this.hasAttribute('alerterror');
    }
    if (oldValue !== newValue) {
      this.load();
    }
  }

  async loadOnce() {
    // Prevent multiple API calls
    if (this.hasLoaded) return;
    this.hasLoaded = true;

    await this.load();
  }
  // =========================
  // OVERRIDES (API layer)
  // =========================

  async fetchById(id) {
    throw new Error('fetchById not implemented');
  }

  async fetchByContext(input) {
    // override point for complex components
    return null;
  }
  async additionalLoading() {
    // override point for complex components
    // gets called at the end of every data loading.
    return null;
  }
  render(data) {
    return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }

  renderLoading() {
    return `Loading...`;
  }

  renderError(err, alert=false) {
    return `<ssd-error ${this.alertErrors || this.defaultAlertErrors || alert? 'alert' : ''}>${err.message}</ssd-error>`;
  }

  postRender(){

  }
  // =========================
  // INPUT LAYER (clean priority chain)
  // =========================

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
      id
    };;
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

    el.innerHTML = this.renderLoading();
    el.classList.add('loading');
    try {
      const input = this.getInput();

      if (!input) {
        el.textContent = 'Missing input';
        return;
      }
      const data = await this.resolveData(input);
      this.additionalLoading()

      if (!data) {
        throw new Error('No data returned');
      }

      el.innerHTML = this.render(data);
          el.classList.remove('loading');

    } catch (err) {
      console.log('err:', err);
      el.innerHTML = this.renderError(err);
                el.classList.remove('loading');

    }
    this.postRender()
  }
}