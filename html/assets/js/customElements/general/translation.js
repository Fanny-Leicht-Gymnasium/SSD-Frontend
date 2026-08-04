// translation.js

// Cache for loaded translation data
const translationsCache = new Map();

// Cache for ongoing fetch requests
const translationsLoading = new Map();

// Global default language
let globalLanguage = 'en';

// Load language file with caching
async function loadLanguage(lang) {
  // Return cached language
  if (translationsCache.has(lang)) {
    return translationsCache.get(lang);
  }

  // Return existing request
  if (translationsLoading.has(lang)) {
    return translationsLoading.get(lang);
  }

  const request = fetch(`/lang/${lang}.json`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to load language: ${lang}`);
      }

      return res.json();
    })
    .then(data => {
      translationsCache.set(lang, data);
      translationsLoading.delete(lang);

      return data;
    })
    .catch(error => {
      translationsLoading.delete(lang);
      throw error;
    });

  translationsLoading.set(lang, request);

  return request;
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
    this._originalKey = this._key;
  }

  connectedCallback() {
    this.update();
  }

  async update() {
    try {
      const lang = this.getAttribute('lang') || globalLanguage;
      const translations = await loadLanguage(lang);

      const value = getNested(translations, this._originalKey);

      this.textContent = value ?? `[${this._originalKey}]`;
    } catch (error) {
      console.error(error);
      this.textContent = `[error]`;
    }
  }
}

// Global language setter
export async function setLanguage(lang) {
  globalLanguage = lang;

  await loadLanguage(lang);

  document
    .querySelectorAll('x-translation, x-trans')
    .forEach(element => element.update());
}

// Clear cache if needed
export function clearTranslationCache(lang = null) {
  if (lang) {
    translationsCache.delete(lang);
    translationsLoading.delete(lang);
    return;
  }

  translationsCache.clear();
  translationsLoading.clear();
}

// Two separate elements
class XTranslation extends BaseTranslationElement {}
class XTrans extends BaseTranslationElement {}

customElements.define('x-translation', XTranslation);
customElements.define('x-trans', XTrans);