import { useOutletContext } from 'react-router-dom'

// Renders give / get / about / friends pages from the i18n sections structure.
// On the "give" page the source HTML contained bank-detail / TWINT sections
// with outdated info and typos (old Basel account, wrong Konto numbers).
// We filter those out and render the correct details once in <GiveExtras>.
function isBankSection(s) {
  const h = s.heading || ''
  return h.includes('Konto:') || h.includes('IBAN') || h.includes('TWINT')
}

export default function ContentPage({ section }) {
  const { t } = useOutletContext()
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
    // original page order: intro → bank details → TWINT → thanks → contact
    return (
      <div className="max-w-3xl mx-auto mb-10">
        {sections.length > 0 && renderSection(sections[0], 0)}
        <GiveExtras t={t} />
        {sections.slice(1).map((s, i) => renderSection(s, i + 1))}
      </div>
    )
  }

  return <div className="max-w-3xl mx-auto mb-10">{sections.map(renderSection)}</div>
}

// Bank details, QR codes and online donation for the "give" page,
// matching the original German page.
function GiveExtras({ t }) {
  return (
    <>
      <div className="bg-lima mt-8 py-[30px]">
        <div className="text-h2 pt-[10px]">
          <ul>
            <li>{t.footer.orgLine}</li>
            <li>{t.footer.account}</li>
            <li>{t.footer.iban}</li>
            <li>{t.footer.city}</li>
          </ul>
        </div>
        <div className="px-[30px] pb-[30px]">
          <a href={t.contactPopup.onlineDonationHref}>
            <img
              src="/assets/qr-code_bankkontoZH.jpeg"
              className="w-2/5 max-w-[220px]"
              alt="Bank QR-Code"
            />
          </a>
          <br />
          <a href={t.contactPopup.onlineDonationHref} className="underline font-semibold">
            {t.contactPopup.onlineDonation}
          </a>
        </div>
      </div>

      <div className="bg-lila py-[30px]">
        <div className="text-h2 pt-[10px]">TWINT:</div>
        <div className="text-contentbold">Verein INAYA Zürich</div>
        <div className="px-[30px] pb-[20px]">
          <img src="/assets/qrtwintZH.jpg" className="w-2/5 max-w-[220px]" alt="TWINT QR-Code" />
        </div>
      </div>
    </>
  )
}
