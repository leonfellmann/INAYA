import { useOutletContext } from 'react-router-dom'
import { getCity } from '../data/cities'

// Rendert give / get / about / friends aus der i18n-sections-Struktur.
// "give": veraltete Bankdetails werden herausgefiltert, korrekte stadtspezifische
// Daten kommen über <GiveExtras>. "friends": Links kommen aus cities.js (city.friends),
// damit jede Stadt ihr eigenes Netzwerk zeigt (kein Zürich/Basel-Mix mehr).
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

  const renderSection = (s, i, links) => (
    <section key={i} className={i > 0 ? 'pt-[30px]' : ''}>
      {s.heading && <h1 className={i === 0 ? 'text-h1' : 'text-h2'}>{s.heading}</h1>}
      {s.body && <div className="text-content whitespace-pre-line">{s.body}</div>}
      {links && links.length > 0 && (
        <ul className="px-[30px]">
          {links.map((l, j) => (
            <li key={j} className="border-b-2 border-gris">
              <a
                href={l.href}
                className="flex items-center justify-between py-[15px] font-display uppercase text-base text-gris hover:text-magenta"
                target={l.href?.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
              >
                <span>{l.label}</span>
                <span className="text-elektro">↗</span>
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

  if (section === 'friends') {
    const heading = sections[0]?.heading || city.friendsLabel
    return (
      <div className="max-w-3xl mx-auto mb-10">
        <section>
          <h1 className="text-h1">{heading}</h1>
          <ul className="px-[30px] border-t-2 border-gris">
            {(city.friends || []).map((l, j) => (
              <li key={j} className="border-b-2 border-gris">
                <a
                  href={l.href}
                  className="flex items-center justify-between py-[15px] font-display uppercase text-base text-gris hover:text-magenta"
                  target={l.href?.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                >
                  <span>{l.label}</span>
                  <span className="text-elektro">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    )
  }

  return <div className="max-w-3xl mx-auto mb-10">{sections.map((s, i) => renderSection(s, i))}</div>
}

// Bankdetails, Online-Spende und TWINT für die "give"-Seite — stadtspezifisch.
// Der Bank-QR-Code wurde auf Wunsch entfernt; Online-Spende + TWINT-QR bleiben.
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
        {donateHref && (
          <div className="px-[30px] pb-[10px]">
            <a href={donateHref} className="btn-donate">
              Online spenden →
            </a>
          </div>
        )}
      </div>

      <div className="bg-lila py-[30px]">
        <div className="text-h2 pt-[10px]">TWINT:</div>
        <div className="text-contentbold">{city.org}</div>
        {city.twintQr && (
          <div className="px-[30px] pb-[20px]">
            <img
              src={city.twintQr}
              className="w-2/5 max-w-[220px] border-[3px] border-gris"
              alt="TWINT QR-Code"
            />
          </div>
        )}
      </div>
    </>
  )
}
