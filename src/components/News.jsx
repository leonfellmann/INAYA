import { useEffect, useState } from 'react'

// Renders entries from public/news.json (editable without code changes).
// Falls back to the static i18n text while loading / if empty.
export default function News({ t, lang }) {
  const [entries, setEntries] = useState(null)

  useEffect(() => {
    fetch('/news.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setEntries(d?.entries || []))
      .catch(() => setEntries([]))
  }, [])

  return (
    <div className="max-w-3xl mx-auto mb-12 px-[30px]">
      <h2 className="sec-head mb-5">{t.home.newsTitle}</h2>
      {entries === null || entries.length === 0 ? (
        <div className="text-gris font-semibold text-lg leading-snug">{t.home.newsBody}</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((e, i) => (
            <li key={i} className="border-2 border-gris rounded-2xl px-5 py-4 bg-white/50">
              <span className="font-display text-[12px] tracking-[0.08em] text-elektro">
                {formatDate(e.date, lang)}
              </span>
              <div className="font-bold text-gris leading-snug mt-1">
                {e.text[lang] || e.text.de}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function formatDate(iso, lang) {
  try {
    const locale = { de: 'de-CH', fr: 'fr-CH', it: 'it-CH', tu: 'tr', al: 'sq', ku: 'ku' }[lang] || lang
    return new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return iso
  }
}
