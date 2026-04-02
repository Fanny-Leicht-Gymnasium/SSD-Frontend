// translation.js

// Global cache for loaded languages
const translationsCache = new Map();

// Global default language
let globalLanguage = 'en';

// Load language file
async function loadLanguage(lang) {
  if (translationsCache.has(lang)) {
    return translationsCache.get(lang);
  }

  const res = await fetch(`/lang/${lang}.json`);
  if (!res.ok) {
    throw new Error(`Failed to load language: ${lang}`);
  }

  const data = await res.json();
  translationsCache.set(lang, data);
  return data;
}

// Get value by dot notation (e.g. "user.name")
function getNested(obj, path) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

// Custom Element
class BaseTranslationElement extends HTMLElement {
  constructor() {
    super();
    this._key = this.textContent.trim();
  }

  async connectedCallback() {
    await this.update();
  }

  async update() {
    try {
      const lang = this.getAttribute('lang') || globalLanguage;
      const translations = await loadLanguage(lang);

      const value = getNested(translations, this._key);

      this.textContent = value ?? `[${this._key}]`;
    } catch (e) {
      console.error(e);
      this.textContent = `[error]`;
    }
  }
}

// Global setter
export async function setLanguage(lang) {
  globalLanguage = lang;

  // preload language
  await loadLanguage(lang);

  // update all elements
  document.querySelectorAll('x-translation, x-trans').forEach(el => {
    el.update();
  });

}

// Two separate elements
class XTranslation extends BaseTranslationElement {}
class XTrans extends BaseTranslationElement {}

customElements.define('x-translation', XTranslation);
customElements.define('x-trans', XTrans);