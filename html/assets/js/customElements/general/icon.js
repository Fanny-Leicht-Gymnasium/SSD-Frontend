const iconCache = new Map();
const iconLoading = new Map();

class AppIcon extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'size', 'color'];
  }

  constructor() {
    super();

    this.observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          this.loadIcon();
          this.observer.disconnect();
        }
      },
      {
        rootMargin: '100px'
      }
    );
  }

  connectedCallback() {
    this.setup();
    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.setup();
      this.loadIcon();
    }
  }

  setup() {
    const size = this.getAttribute('size') || '24';
    const color = this.getAttribute('color') || 'currentColor';

    this.style.display = 'inline-block';
    this.style.width = `${size}px`;
    this.style.height = `${size}px`;
    this.style.color = color;

    if (!this.innerHTML) {
      this.innerHTML = '';
    }
  }

  async loadIcon() {
    const name = this.getAttribute('name');

    if (!name) {
      return;
    }

    // Use cached SVG if available
    if (iconCache.has(name)) {
      this.renderSVG(iconCache.get(name));
      return;
    }

    // Reuse existing request if another instance is loading the same icon
    if (iconLoading.has(name)) {
      const svg = await iconLoading.get(name);
      this.renderSVG(svg);
      return;
    }

    const request = fetch(`/assets/icons/${name}.svg`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Icon not found: ${name}`);
        }

        return response.text();
      })
      .then(svg => {
        iconCache.set(name, svg);
        iconLoading.delete(name);

        return svg;
      })
      .catch(error => {
        iconLoading.delete(name);
        throw error;
      });

    iconLoading.set(name, request);

    try {
      const svg = await request;
      this.renderSVG(svg);
    } catch (error) {
      this.innerHTML = `<span>[icon:${name}]</span>`;
      console.error(error);
    }
  }

  renderSVG(svg) {
    this.innerHTML = svg;

    const svgEl = this.querySelector('svg');

    if (!svgEl) {
      return;
    }

    svgEl.style.width = '100%';
    svgEl.style.height = '100%';
    svgEl.style.display = 'block';
  }
}

customElements.define('ssd-icon', AppIcon);