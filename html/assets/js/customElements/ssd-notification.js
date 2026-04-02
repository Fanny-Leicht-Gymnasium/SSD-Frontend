import { SSDElement } from './ssd-element.js';

export class SSDNotification extends SSDElement {
  static get observedAttributes() {
    return ['alert'];
  }

  constructor() {
    super();
    this.container.innerHTML = `<div id="inline"></div>`;
    this.inline = this.container.querySelector('#inline');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'alert' && this._lastHTML) {
      this._render(this._lastHTML);
    }
  }

  /**
   * Render raw HTML (provided by subclasses)
   */
  renderHTML(html) {
    this._lastHTML = html;
    this._render(html);
  }

  _render(html) {
    if (this.hasAttribute('alert')) {
      this._showAsAlert(html);
    } else {
      this.inline.innerHTML = html;
    }
  }

  // -------------------------
  // ALERT STACK SYSTEM
  // -------------------------
  _showAsAlert(html) {
    this._ensureCSS();

    let stack = document.getElementById('ssd-notification-stack');

    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'ssd-notification-stack';
      document.body.insertBefore(stack,document.body.firstChild);
    }

    const item = document.createElement('div');
    item.className = 'ssd-alert';
    item.innerHTML = html;

    stack.appendChild(item);

    requestAnimationFrame(() => {
      item.classList.add('show');
    });

    setTimeout(() => {
      item.classList.remove('show');

      setTimeout(() => {
        item.remove();
        if (stack.children.length === 0) {
          stack.remove();
        }
      }, 200);
    }, 5000);
  }

  _ensureCSS() {
    if (!document.getElementById('ssd-notification-css')) {
      const link = document.createElement('link');
      link.id = 'ssd-notification-css';
      link.rel = 'stylesheet';
      link.href = '/assets/css/customElement/ssd-notification.css';
      document.head.appendChild(link);
    }
  }
}