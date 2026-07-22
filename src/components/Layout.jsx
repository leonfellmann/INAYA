import { useState, useEffect } from 'react'
import { Outlet, Link, useParams, useLocation, Navigate } from 'react-router-dom'
import { getDict, LANGUAGES, isComplete } from '../i18n'
import { useCart } from '../context/CartContext'
import { getCity, isValidCity, onlineDonationHref } from '../data/cities'

const validLangs = LANGUAGES.map((l) => l.code)
const CITY_TABS = [
  { code: 'ba', label: 'basel' },
  { code: 'zu', label: 'zürich' },
  { code: 'be', label: 'bern' },
]

export default function Layout() {
  const { city, lang } = useParams()
  const location = useLocation()
  const cart = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
    setPopupOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (validLangs.includes(lang)) {
      try {
        localStorage.setItem('inaya-lang', lang)
      } catch {
        /* ignore */
      }
    }
  }, [lang])

  const cartCount = cart ? cart.items.reduce((n, i) => n + i.qty, 0) : 0

  if (!isValidCity(city)) return <Navigate to="/" replace />
  if (!validLangs.includes(lang)) return <Navigate to={`/${city}`} replace />

  const c = getCity(city)
  const t = getDict(lang)
  const base = `/${city}/${lang}`
  const donateHref = onlineDonationHref(c, lang)
  const friendsLabel = city === 'be' ? c.friendsLabel : t.nav.friends

  return (
    <div dir={t.meta.dir} className="text-body bg-lila w-full min-h-screen">
      {/* Menü-Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-gris px-[22px] py-[22px] overflow-y-auto">
          <div className="flex justify-end">
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Menü schliessen"
              className="w-10 h-10 rounded-full border-[3px] border-lila text-lila text-2xl leading-none flex items-center justify-center"
            >
              ×
            </button>
          </div>
          <ul className="mt-11 flex flex-col gap-[26px] font-display uppercase text-3xl leading-none tracking-wide">
            <li className="text-turc"><Link to={`${base}/hilfe-geben`}>{t.nav.give}</Link></li>
            <li className="text-lima"><Link to={`${base}/hilfe-bekommen`}>{t.nav.get}</Link></li>
            <li className="text-lila"><Link to={`${base}/ueber-uns`}>{t.nav.about}</Link></li>
            <li className="text-lila"><Link to={`${base}/freundinnen`}>{friendsLabel}</Link></li>
            {c.hasShop && (
              <li className="text-turc">
                <Link to={`${base}/shop`}>
                  {t.store.title}
                  {cartCount > 0 && (
                    <span className="inline-block bg-turc text-gris text-base rounded-full px-2 ml-2 align-middle">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            )}
            <li className="text-turc"><Link to={`${base}/kontakt`}>{t.store.contactTitle}</Link></li>
            <li className="pt-2">
              <Link
                to={`/${city}`}
                state={{ chooser: true }}
                className="inline-block text-xl border-[3px] border-lila rounded-full px-5 py-2 text-lila"
              >
                Sprache · Language
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Kontakt- / Spenden-Popup */}
      {popupOpen && (
        <div className="fixed inset-0 z-50 bg-turc text-gris px-[22px] py-[22px] overflow-y-auto">
          <div className="flex justify-end">
            <button
              onClick={() => setPopupOpen(false)}
              aria-label="Schliessen"
              className="w-10 h-10 rounded-full border-[3px] border-gris text-gris text-2xl leading-none flex items-center justify-center"
            >
              ×
            </button>
          </div>
          <div className="max-w-3xl mx-auto pt-5 px-[6px]">
            <div className="font-display uppercase tracking-[0.16em] text-[13px] text-gris/60">
              {t.contactPopup.writeUs}
            </div>
            <a href={`mailto:${c.email}`} className="block font-display text-2xl text-elektro break-all mt-1">
              {c.email}
            </a>
            <div className="font-display uppercase tracking-[0.16em] text-[13px] text-gris/60 mt-8">
              {t.contactPopup.donateTo}
            </div>
            <div className="font-semibold leading-relaxed mt-1">
              {c.org}<br />{c.konto}<br />{c.iban}<br />{c.cityLine}
            </div>
            {donateHref && (
              <a
                href={donateHref}
                className="inline-block mt-6 font-display uppercase text-base bg-lima text-gris rounded-full px-6 py-3"
              >
                {t.contactPopup.onlineDonation} →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Kopfzeile */}
      <header className="sticky top-0 z-40 bg-lila border-b-[3px] border-elektro px-[18px] py-[11px]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to={base} className="block w-[130px]">
            <img src="/assets/kleininaya.svg" alt="INAYA" />
          </Link>
          <div className="flex items-center gap-[10px]">
            <button
              onClick={() => setPopupOpen(true)}
              className="font-display uppercase tracking-wide text-[13px] text-gris bg-turc rounded-full px-[15px] py-[8px]"
            >
              {t.store.donationTitle || 'Spenden'}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Menü öffnen"
              className="flex flex-col gap-[5px] w-[26px] py-1"
            >
              <span className="h-[3px] bg-elektro rounded" />
              <span className="h-[3px] bg-elektro rounded" />
              <span className="h-[3px] bg-elektro rounded" />
            </button>
          </div>
        </div>
        <div className="max-w-3xl mx-auto flex gap-[14px] mt-[7px]">
          {CITY_TABS.map((ct) => (
            <Link
              key={ct.code}
              to={`/${ct.code}`}
              className={`font-display text-[12px] tracking-[0.14em] lowercase ${
                ct.code === city ? 'text-elektro' : 'text-gris/50'
              }`}
            >
              {ct.label}
            </Link>
          ))}
        </div>
      </header>

      {/* Hinweis bei unvollständiger Übersetzung */}
      {!isComplete(lang) && (
        <div className="pt-4 px-[30px]">
          <div className="max-w-3xl mx-auto bg-lima text-gris text-sm px-4 py-2">
            {t.store.translationNote}
          </div>
        </div>
      )}

      <main className="w-full pb-[10px]">
        <Outlet context={{ t, lang, city: c, cityCode: city, base, donateHref }} />
      </main>

      <footer className="bg-gris text-lila tracking-wide pt-9 pb-11 px-[30px]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-display text-white text-xl tracking-wide">{c.org}</div>
          <a href={`mailto:${c.email}`} className="block mt-1 text-turc">{c.email}</a>
          <div className="mt-3 text-sm font-light leading-relaxed text-lila/90">
            {c.konto}<br />{c.iban}<br />{c.cityLine}
          </div>
          {c.instagram && (
            <a href={c.instagram} target="_blank" rel="noreferrer" className="inline-block mt-3 text-turc underline">
              Instagram
            </a>
          )}
          <div className="mt-6 flex flex-col items-center gap-2 text-sm">
            <Link to="/" className="font-display tracking-[0.18em] text-white/90">basel | zürich | bern</Link>
            <a href="/datenschutz.html" className="text-lila/70 underline">
              {t.footer.privacyLabel || 'AGBs und Datenschutz'}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
