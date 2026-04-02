export class SSDElement extends HTMLElement {
    static get observedAttributes() {
        return ['aspopup'];
    }

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<div id="container"></div>`;
        this._container = this.root.getElementById('container');
        // optional base stylesheet
        this.addStylesheet('/assets/css/global.css');
        this.addStylesheet('/assets/css/style.css');
        this.loadDefaultStyles();
        if (this.hasAttribute('aspopup')) {
            this._enablePopupClose();
            console.log('Popup mode enabled for', this.tagName);
        }
        this.root.addEventListener('click', (e) => {
            const header = e.target.closest('[collapsable] > .header');
            if (!header) return;
            const container = header.closest('[collapsable]');
            if (!container) return;
            container.toggleAttribute('open');
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name=="aspopup"){
            if (this.hasAttribute('aspopup')) {
                this._enablePopupClose();
                console.log('Popup mode enabled for', this.tagName);
            }
        }
}
    _enablePopupClose() {
        const btn = document.createElement('button');

        btn.textContent = '✕';
        btn.className = 'popup-close';

        btn.addEventListener('click', () => {
            this._closePopup();
        });

        this.root.appendChild(btn);
    }

    _closePopup() {
        // remove attribute (your requirement)
        this.removeAttribute('aspopup');

        // optional: remove from DOM completely
        this.remove();
    }

    get container() {
        if (!this._container) {
            this._container = this.root.getElementById('container');
        }
        return this._container || this.root.getElementById('container');
    }

    /**
     * Adds an external stylesheet to the shadow root
     */
    addStylesheet(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;

        this.root.appendChild(link);
    }

    /**
     * Adds raw CSS directly into the shadow root
     */
    addCSS(cssText) {
        const style = document.createElement('style');
        style.textContent = cssText;

        this.root.appendChild(style);
    }

    /**
     * Loads CSS based on registered custom element name
     */
    loadDefaultStyles() {
        const name = this.tagName.toLowerCase();
        this.addStylesheet(`/assets/css/customElement/${name}.css`);
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