import { SSDNotification } from '../ssd-notification.js';

export class SSDWarning extends SSDNotification {
  connectedCallback() {
    const msg = this.textContent.trim();

    this.renderHTML(`
      <div class="ssd-notification warning">
        <div class="title">Warning</div>
        <div>${this._escape(msg)}</div>
      </div>
    `);
  }

  _escape(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}

customElements.define('ssd-warning', SSDWarning);