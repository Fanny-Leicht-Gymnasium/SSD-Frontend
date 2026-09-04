// translation.js

import { getStoredSetting } from "../../util.js";

// HTML global attributes that should be ignored
const defaultAttributes = new Set([
  "id",
  "class",
  "style",
  "title",
  "lang",
  "dir",
  "hidden",
  "tabindex",
  "slot",
  "role",
  "draggable",
  "contenteditable",
  "spellcheck",
  "translate",
  "accesskey",
  "autocapitalize",
  "autofocus",
  "enterkeyhint",
  "inputmode",
  "nonce",
  "part",
  "popover",
  "inert"
]);
// Cache for loaded translation data
const translationsCache = new Map();

// Cache for ongoing fetch requests
const translationsLoading = new Map();

// Global default language
let globalLanguage = getStoredSetting('html-lang')||"en";

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
    this._usedPlaceholders = new Set();
  }
 static get observedAttributes() {
    // Observe all attributes
    return [];
  }

  connectedCallback() {
    this._observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          this._usedPlaceholders.has(mutation.attributeName)
        ) {
          this.update();
          break;
        }
      }
    });

    this._observer.observe(this, { attributes: true });

    this.update();
  }

  disconnectedCallback() {
    this._observer?.disconnect();
  }
  async update() {
    try {
      const lang = this.getAttribute('lang') || globalLanguage;
      const translations = await loadLanguage(lang);

      var value = getNested(translations, this._originalKey);
      value ??= buildFallback(this._originalKey, this);
      this._usedPlaceholders = new Set(
        [...value.matchAll(/\{([^}]+)\}/g)].map(match => match[1])
      );

      value = replacePlaceholders(value, this);
      this.textContent = value;
    } catch (error) {
      console.error(error);
      this.textContent = `[error]`;
    }
  }
  
}
function replacePlaceholders(text, element) {
  return text.replace(/\{([^}]+)\}/g, (_, key) => {
    const value = element.getAttribute(key);
    return value ?? `{${key}}`;
  });
}
function buildFallback(key, element) {
  const attributes = [...element.attributes]
    .filter(attr => !defaultAttributes.has(attr.name.toLowerCase()))
    .map(attr => `${attr.name}="${attr.value}"`)
    .join(" ");

  return attributes
    ? `[${key} ${attributes}]`
    : `[${key}]`;
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