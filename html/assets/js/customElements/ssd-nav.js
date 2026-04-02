import { SSDElement } from './ssd-element.js';
export class SSDNavigation extends SSDElement {
    static get observedAttributes() {
        return ['active'];
    }

    constructor() {
        super();

        this.pages = [
            { id: 'home', label: 'Home', icon: 'home', url: '/' },
            { id: 'dashboard', label: 'Dashboard', icon: 'grid', url: '/dashboard/' },
            { id: 'settings', label: 'Settings', icon: 'gear', url: '/settings/' }
        ];

        this.buttons = {};
        this._renderNavigation();
        this._initTransitionOverlay();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'active' && oldValue !== newValue) {
            this._setActive(newValue);
        }
    }

    _renderNavigation() {
        const nav = document.createElement('div');
        nav.className = 'nav-container';

        this.pages.forEach(page => {
            const btn = document.createElement('button');

            btn.className = 'nav-button';
            btn.dataset.page = page.id;

            btn.innerHTML = `
                <ssd-icon name="${page.icon}"></ssd-icon>
                <span class="label">${page.label}</span>
            `;

            btn.addEventListener('click', () => {
                this.setAttribute('active', page.id);
                this._navigate(page);
            });

            this.buttons[page.id] = btn;
            nav.appendChild(btn);
        });

        this.container.appendChild(nav);

        const initial =
            this.getAttribute('active') ||
            this._getActiveFromUrl() ||
            this.pages[0].id;

        this._setActive(initial);
        this._setActive(initial);
    }
    _getActiveFromUrl() {
        const path = window.location.pathname;
        console.log('Current path:', path);
        const match = this.pages.find(page => page.url === path);

        return match ? match.id : null;
    }
    _setActive(pageId) {
        Object.values(this.buttons).forEach(btn => {
            btn.classList.remove('active');
        });

        if (this.buttons[pageId]) {
            this.buttons[pageId].classList.add('active');
        }
    }
_initTransitionOverlay() {
    this._overlay = document.createElement('div');
    this._overlay.className = 'page-transition-overlay';
    document.body.appendChild(this._overlay);
}
    async _navigate(page) {
        // start animation
        this._overlay.classList.add('active');

        // small delay for smooth fade
        await new Promise(r => setTimeout(r, 250));

        // redirect
        window.location.href = page.url;
    }
}
customElements.define('ssd-nav', SSDNavigation);