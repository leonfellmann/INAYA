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
    <div className="max-w-3xl mx-auto mb-10">
      <h2 className="text-h1">{t.home.newsTitle}</h2>
      {entries === null || entries.length === 0 ? (
        <div className="text-h2 pt-[30px]">
          <b>{t.home.newsBody}</b>
        </div>
      ) : (
        <ul>
          {entries.map((e, i) => (
            <li key={i} className="text-content">
              <span className="font-semibold text-browndark">{formatDate(e.date, lang)}</span>
              <br />
              <b>{e.text[lang] || e.text.de}</b>
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
