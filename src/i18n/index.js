import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { LANGUAGES } from './languages'

// Every JSON file in ./locales is registered automatically, so adding a language never
// needs a code change here — only the entry in languages.js and the generated file.
const modules = import.meta.glob('./locales/*.json', { eager: true })
const resources = {}
for (const [file, mod] of Object.entries(modules)) {
  const code = file.match(/\/([^/]+)\.json$/)[1]
  resources[code] = { translation: mod.default ?? mod }
}

// Only languages that actually have a locale file are offered in the switcher.
export const AVAILABLE_LANGUAGES = LANGUAGES.filter((l) => resources[l.code])

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // any key missing from a language file falls back to English
    supportedLngs: AVAILABLE_LANGUAGES.map((l) => l.code),
    nonExplicitSupportedLngs: true, // "hi-IN" -> "hi", "en-US" -> "en"
    load: 'languageOnly',
    detection: {
      // localStorage first (so a person's choice sticks), then the browser's own language.
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'bis-language',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  })

// Keeps <html lang> in step (screen readers, hyphenation, and the right script font).
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') document.documentElement.lang = (lng || 'en').split('-')[0]
})

// Accepts a code ("hi"), an English name ("Hindi") or a native name ("हिन्दी") and returns a
// code the UI has a locale file for, or null.
export function normalizeLanguage(value) {
  if (!value) return null
  const v = String(value).trim().toLowerCase()
  const hit = AVAILABLE_LANGUAGES.find(
    (l) =>
      l.code === v ||
      l.label.toLowerCase() === v ||
      l.native.toLowerCase() === v ||
      (l.aliases || []).some((a) => a.toLowerCase() === v),
  )
  return hit ? hit.code : null
}

// Switches the whole UI (and, through the Accept-Language header, every AI answer) to the
// person's saved preferred language. No-op for unsupported or already-active languages.
export function applyLanguage(value) {
  const code = normalizeLanguage(value)
  if (code && code !== (i18n.resolvedLanguage || i18n.language)) i18n.changeLanguage(code)
}

export default i18n
