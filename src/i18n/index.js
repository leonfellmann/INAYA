import al from './al.json'
import ar from './ar.json'
import de from './de.json'
import en from './en.json'
import es from './es.json'
import fa from './fa.json'
import fr from './fr.json'
import it from './it.json'
import ku from './ku.json'
import ru from './ru.json'
import tu from './tu.json'
import { storeStrings } from './store'

// Languages with complete, current translations.
// de/fr/ar/ku/tu come from the old site; en/it/es/ru/al/fa were
// AI-translated from the German source (2026-07) — native-speaker
// review recommended before launch.
const COMPLETE = ['de', 'fr', 'ar', 'ku', 'tu', 'en', 'it', 'es', 'ru', 'al', 'fa']

const raw = { al, ar, de, en, es, fa, fr, it, ku, ru, tu }

export const LANGUAGES = [
  { code: 'de', label: 'deutsch' },
  { code: 'fr', label: 'français' },
  { code: 'en', label: 'english' },
  { code: 'ar', label: 'عربية / arabisch' },
  { code: 'it', label: 'italiano / italienisch' },
  { code: 'ku', label: 'kurdî / kurdisch' },
  { code: 'tu', label: 'türkçe / türkisch' },
  { code: 'al', label: 'shqip / albanisch' },
  { code: 'fa', label: 'فارسی / farsi' },
  { code: 'es', label: 'español / spanisch' },
  { code: 'ru', label: 'русский / russisch' },
]

export function isRtl(lang) {
  return lang === 'ar' || lang === 'fa'
}

export function isComplete(lang) {
  return COMPLETE.includes(lang)
}

// deep-merge: fill missing keys from the German dictionary
function withFallback(obj, fallback) {
  if (obj === undefined || obj === null || obj === '') return fallback
  if (Array.isArray(obj)) return obj.length ? obj : fallback
  if (typeof obj === 'object' && typeof fallback === 'object' && !Array.isArray(fallback)) {
    const out = { ...obj }
    for (const k of Object.keys(fallback)) out[k] = withFallback(obj[k], fallback[k])
    return out
  }
  return obj
}

// raisenow donation form language
const RAISENOW_LNG = { de: 'de', fr: 'fr', it: 'it', en: 'en' }

export function getDict(lang) {
  const base = isComplete(lang) ? withFallback(raw[lang], raw.de) : raw.de
  const rnLng = RAISENOW_LNG[lang] || 'en'
  return {
    ...base,
    contactPopup: {
      ...base.contactPopup,
      onlineDonationHref: `https://donate.raisenow.io/xwxqm?lng=${rnLng}`,
    },
    meta: {
      ...base.meta,
      dir: isRtl(lang) && isComplete(lang) ? 'rtl' : 'ltr',
      isPlaceholder: !isComplete(lang),
    },
    store: storeStrings[lang] || storeStrings.de,
  }
}
