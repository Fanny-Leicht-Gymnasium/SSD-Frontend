import { SSDNotification } from '../ssd-notification.js';

export class SSDError extends SSDNotification {
  connectedCallback() {
    const raw = this.textContent.trim();
    const data = this._parse(raw);

    this._renderError(data);
  }

  /**
   * Public API (für JS Nutzung)
   */
  setError(err) {
    this._renderError(err);
  }

  _renderError(err) {
    const userMessage = err?.userMessage || err?.message || 'Unknown error';
    const devMessage = err?.devMessage || '';
    const traceId = err?.TraceId || err?.traceId || '';

    this.renderHTML(`
      <div class="ssd-notification error">
        <div class="title">Error</div>
        <div>${this._escape(userMessage)}</div>
        ${devMessage ? `<div class="meta">${this._escape(devMessage)}</div>` : ''}
        ${traceId ? `<div class="meta">TraceId: ${this._escape(traceId)}</div>` : ''}
      </div>
    `);
  }

  /**
   * JSON parsing (nur hier!)
   */
  _parse(text) {
    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
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

customElements.define('ssd-error', SSDError);