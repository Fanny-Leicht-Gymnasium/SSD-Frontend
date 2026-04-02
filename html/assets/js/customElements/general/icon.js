// app-icon.js

const icons = {
  user: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
    </svg>
  `,
  phone: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.6 10.8c1.5 2.9 3.7 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.7.6 4.1.6.7 0 1.3.6 1.3 1.3V21c0 .7-.6 1.3-1.3 1.3C10.3 22.3 1.7 13.7 1.7 3.3 1.7 2.6 2.3 2 3 2h3.5c.7 0 1.3.6 1.3 1.3 0 1.4.2 2.8.6 4.1.1.4 0 .9-.3 1.2l-2.5 2.2z"/>
    </svg>
  `,
  alert: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L1 21h22L12 2zm0 3.8L19.5 19H4.5L12 5.8zM11 10h2v4h-2zm0 6h2v2h-2z"/>
    </svg>
  `
};

class AppIcon extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'size', 'color'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const name = this.getAttribute('name');
    const size = this.getAttribute('size') || '24';
    const color = this.getAttribute('color') || 'currentColor';

    const icon = icons[name];

    if (!icon) {
      this.innerHTML = `<span>[icon:${name}]</span>`;
      return;
    }

    this.style.display = 'inline-block';
    this.style.width = `${size}px`;
    this.style.height = `${size}px`;
    this.style.color = color;

    this.innerHTML = icon;
  }
}

customElements.define('ssd-icon', AppIcon);