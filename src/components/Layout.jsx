import { useState, useEffect } from 'react'
import { Outlet, Link, useParams, useLocation, Navigate } from 'react-router-dom'
import { getDict, LANGUAGES, isComplete } from '../i18n'
import { useCart } from '../context/CartContext'
import { getCity, isValidCity, onlineDonationHref } from '../data/cities'

const validLangs = LANGUAGES.map((l) => l.code)

export default function Layout() {
  const { city, lang } = useParams()
  const location = useLocation()
  const cart = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)

  // Overlays bei Navigation schliessen
  useEffect(() => {
    setMenuOpen(false)
    setPopupOpen(false)
  }, [location.pathname])

  // Sprache merken für den Auto-Redirect auf "/:city"
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
    <div
      dir={t.meta.dir}
      className="text-body bg-gradient-to-b from-purple-300 to-lila w-full min-h-screen"
    >
      {/* Menü-Overlay */}
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full bg-browndark text-2xl font-bold tracking-wide leading-none pt-[60px] pb-[30px] px-[30px] z-50">
          <div className="absolute top-7 right-7">
            <button onClick={() => setMenuOpen(false)} className="w-[80px]" aria-label="Menü schliessen">
              <img src="/assets/zu.svg" alt="" />
            </button>
          </div>
          <ul className="pt-[70px]">
            <li className="text-turc pb-[30px]">
              <Link to={`${base}/hilfe-geben`}>{t.nav.give}</Link>
            </li>
            <li className="text-lima pb-[30px]">
              <Link to={`${base}/hilfe-bekommen`}>{t.nav.get}</Link>
            </li>
            <li className="text-lila pb-[30px]">
              <Link to={`${base}/ueber-uns`}>{t.nav.about}</Link>
            </li>
            <li className="text-lila pb-[30px]">
              <Link to={`${base}/freundinnen`}>{friendsLabel}</Link>
            </li>
            {c.hasShop && (
              <li className="text-lima pb-[30px]">
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
            <li className="text-turc pb-[30px]">
              <Link to={`${base}/kontakt`}>{t.store.contactTitle}</Link>
            </li>
            <li>
              <Link to={`/${city}`} state={{ chooser: true }}>
                <div className="w-[200px]">
                  <img src="/assets/boca.svg" alt="Sprache wählen / choose language" />
                </div>
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Kontakt- / Spenden-Popup */}
      {popupOpen && (
        <div className="fixed top-0 left-0 w-full bg-turc text-browndark font-bold tracking-wide leading-normal pt-[60px] pb-[30px] px-[30px] z-50">
          <div className="px-[30px] max-w-3xl mx-auto mb-10">
            <div className="text-browndark">
              <span className="font-normal text-gris">{t.contactPopup.writeUs}</span>
              <br />
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </div>
            <div className="pt-[30px]">
              <span className="font-normal text-gris">{t.contactPopup.donateTo}</span>
              <br />
              {c.org}
              <br />
              {c.konto}
              <br />
              {c.iban}
              <br />
              {c.cityLine}
            </div>
            {donateHref && (
              <div className="pt-[10px]">
                <a href={donateHref} className="underline">
                  {t.contactPopup.onlineDonation}
                </a>
              </div>
            )}
            <div className="absolute top-7 right-7">
              <button onClick={() => setPopupOpen(false)} className="w-[80px]" aria-label="Schliessen">
                <img src="/assets/zu.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kopfzeile */}
      <header className="bg-lila px-[30px] pt-[5px] pb-[5px] w-full fixed z-40 border-b-[3px] border-elektro">
        <div className="py-2">
          <div className="w-[180px]">
            <Link to={base}>
              <img src="/assets/kleininaya.svg" alt="INAYA" />
            </Link>
          </div>
          <div className="w-[220px] text-browndark font-semibold p-2">
            <Link to="/">basel | zürich | bern</Link>
          </div>
          <div className="fixed top-0 right-7 z-40">
            <button onClick={() => setMenuOpen(true)} className="w-[80px]" aria-label="Menü öffnen">
              <img src="/assets/menu.svg" alt="" />
            </button>
          </div>
          <div className="fixed right-8 pt-[120px] z-40">
            <button
              onClick={() => setPopupOpen(true)}
              className="w-[70px] pt-[10px]"
              aria-label="Kontakt und Spenden"
            >
              <img src="/assets/geben.svg" alt="" />
            </button>
          </div>
        </div>
      </header>

      {/* Hinweis bei unvollständiger Übersetzung */}
      {!isComplete(lang) && (
        <div className="pt-[140px] -mb-[110px] px-[30px]">
          <div className="max-w-3xl mx-auto bg-lima text-gris text-sm px-4 py-2">
            {t.store.translationNote}
          </div>
        </div>
      )}

      <main className="w-full pt-[140px] pb-[60px]">
        <Outlet context={{ t, lang, city: c, cityCode: city, base, donateHref }} />
      </main>

      <footer className="bg-gris text-lila tracking-wide pt-9 pb-11 px-[30px] border-t-[3px] border-magenta">
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-display text-white text-xl tracking-wide">{c.org}</div>
          <a href={`mailto:${c.email}`} className="block mt-1 text-turc">
            {c.email}
          </a>
          <div className="mt-3 text-sm font-light leading-relaxed text-lila/90">
            {c.konto}
            <br />
            {c.iban}
            <br />
            {c.cityLine}
          </div>
          {c.instagram && (
            <a
              href={c.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-3 text-turc underline"
            >
              Instagram
            </a>
          )}
          <div className="mt-6 flex flex-col items-center gap-2 text-sm">
            <Link to="/" className="font-display tracking-[0.18em] text-white/90">
              basel | zürich | bern
            </Link>
            <a href="/datenschutz.html" className="text-lila/70 underline">
              {t.footer.privacyLabel || 'AGBs und Datenschutz'}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
