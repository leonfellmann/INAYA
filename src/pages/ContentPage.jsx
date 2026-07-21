import { useOutletContext } from 'react-router-dom'

// Rendert give / get / about / friends aus der i18n-sections-Struktur.
// Auf der "give"-Seite filtern wir die (veralteten) Bankdetails aus dem
// Quelltext heraus und zeigen die korrekten, stadtspezifischen Daten
// einmalig über <GiveExtras>.
function isBankSection(s) {
  const h = s.heading || ''
  return h.includes('Konto:') || h.includes('IBAN') || h.includes('TWINT')
}

export default function ContentPage({ section }) {
  const { t, lang, city } = useOutletContext()
  const data = t[section]

  if (!data || !data.sections) return null

  const sections =
    section === 'give' ? data.sections.filter((s) => !isBankSection(s)) : data.sections

  const renderSection = (s, i) => (
    <section key={i} className={i > 0 ? 'pt-[30px]' : ''}>
      {s.heading && <h1 className={i === 0 ? 'text-h1' : 'text-h2'}>{s.heading}</h1>}
      {s.body && <div className="text-content whitespace-pre-line">{s.body}</div>}
      {s.links && s.links.length > 0 && (
        <ul className="text-content">
          {s.links.map((l, j) => (
            <li key={j}>
              <a
                href={l.href}
                className="underline hover:opacity-60"
                target={l.href?.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )

  if (section === 'give') {
    return (
      <div className="max-w-3xl mx-auto mb-10">
        {sections.length > 0 && renderSection(sections[0], 0)}
        <GiveExtras city={city} lang={lang} />
        {sections.slice(1).map((s, i) => renderSection(s, i + 1))}
      </div>
    )
  }

  return <div className="max-w-3xl mx-auto mb-10">{sections.map(renderSection)}</div>
}

// Bankdetails, QR-Codes und Online-Spende für die "give"-Seite — stadtspezifisch.
function GiveExtras({ city, lang }) {
  const rn = { de: 'de', fr: 'fr', it: 'it', en: 'en' }[lang] || 'en'
  const donateHref = city.onlineDonation ? `${city.onlineDonation}?lng=${rn}` : null

  return (
    <>
      <div className="bg-lima mt-8 py-[30px]">
        <div className="text-h2 pt-[10px]">
          <ul>
            <li>{city.org}</li>
            <li>{city.konto}</li>
            <li>{city.iban}</li>
            <li>{city.cityLine}</li>
          </ul>
        </div>
        {(city.bankQr || donateHref) && (
          <div className="px-[30px] pb-[30px]">
            {city.bankQr && (
              <a href={donateHref || undefined}>
                <img src={city.bankQr} className="w-2/5 max-w-[220px]" alt="Bank QR-Code" />
              </a>
            )}
            {donateHref && (
              <>
                <br />
                <a href={donateHref} className="underline font-semibold">
                  Online spenden
                </a>
              </>
            )}
          </div>
        )}
      </div>

      <div className="bg-lila py-[30px]">
        <div className="text-h2 pt-[10px]">TWINT:</div>
        <div className="text-contentbold">{city.org}</div>
        {city.twintQr && (
          <div className="px-[30px] pb-[20px]">
            <img src={city.twintQr} className="w-2/5 max-w-[220px]" alt="TWINT QR-Code" />
          </div>
        )}
      </div>
    </>
  )
}
