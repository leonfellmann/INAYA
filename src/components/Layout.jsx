import { useState, useEffect } from 'react'
import { Outlet, Link, useParams, useLocation, Navigate } from 'react-router-dom'
import { getDict, LANGUAGES, isComplete } from '../i18n'
import { useCart } from '../context/CartContext'

const validLangs = LANGUAGES.map((l) => l.code)

export default function Layout() {
  const { lang } = useParams()
  const location = useLocation()
  const cart = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)

  // close overlays on navigation
  useEffect(() => {
    setMenuOpen(false)
    setPopupOpen(false)
  }, [location.pathname])

  // remember the visitor's language for the auto-redirect on "/"
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

  if (!validLangs.includes(lang)) return <Navigate to="/" replace />

  const t = getDict(lang)

  return (
    <div
      dir={t.meta.dir}
      className="text-body bg-gradient-to-b from-purple-300 to-lila w-full min-h-screen"
    >
      {/* menu overlay */}
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full bg-browndark text-2xl font-bold tracking-wide leading-none pt-[60px] pb-[30px] px-[30px] z-50">
          <div className="absolute top-7 right-7">
            <button onClick={() => setMenuOpen(false)} className="w-[80px]" aria-label="Menü schliessen">
              <img src="/assets/zu.svg" alt="" />
            </button>
          </div>
          <ul className="pt-[70px]">
            <li className="text-turc pb-[30px]">
              <Link to={`/${lang}/hilfe-geben`}>{t.nav.give}</Link>
            </li>
            <li className="text-lima pb-[30px]">
              <Link to={`/${lang}/hilfe-bekommen`}>{t.nav.get}</Link>
            </li>
            <li className="text-lila pb-[30px]">
              <Link to={`/${lang}/ueber-uns`}>{t.nav.about}</Link>
            </li>
            <li className="text-lila pb-[30px]">
              <Link to={`/${lang}/freundinnen`}>{t.nav.friends}</Link>
            </li>
            <li className="text-lima pb-[30px]">
              <Link to={`/${lang}/shop`}>
                {t.store.title}
                {cartCount > 0 && (
                  <span className="inline-block bg-turc text-gris text-base rounded-full px-2 ml-2 align-middle">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            <li className="text-turc pb-[30px]">
              <Link to={`/${lang}/kontakt`}>{t.store.contactTitle}</Link>
            </li>
            <li>
              <Link to="/" state={{ chooser: true }}>
                <div className="w-[200px]">
                  <img src="/assets/boca.svg" alt="Sprache wählen / choose language" />
                </div>
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* contact / donate popup */}
      {popupOpen && (
        <div className="fixed top-0 left-0 w-full bg-turc text-browndark font-bold tracking-wide leading-normal pt-[60px] pb-[30px] px-[30px] z-50">
          <div className="px-[30px] max-w-3xl mx-auto mb-10">
            <div className="text-browndark">
              <span className="font-normal text-gris">{t.contactPopup.writeUs}</span>
              <br />
              <a href={`mailto:${t.contactPopup.email}`}>{t.contactPopup.email}</a>
            </div>
            <div className="pt-[30px]">
              <span className="font-normal text-gris">{t.contactPopup.donateTo}</span>
              <br />
              {t.footer.orgLine.split('//')[0].trim()}
              <br />
              {t.footer.account}
              <br />
              {t.footer.iban}
              <br />
              {t.footer.city}
            </div>
            <div className="pt-[10px]">
              <a href={t.contactPopup.onlineDonationHref} className="underline">
                {t.contactPopup.onlineDonation}
              </a>
            </div>
            <div className="absolute top-7 right-7">
              <button onClick={() => setPopupOpen(false)} className="w-[80px]" aria-label="Schliessen">
                <img src="/assets/zu.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* header */}
      <header className="bg-lila px-[30px] pt-[5px] pb-[5px] w-full fixed z-40">
        <div className="py-2">
          <div className="w-[180px]">
            <Link to={`/${lang}`}>
              <img src="/assets/kleininaya.svg" alt="INAYA" />
            </Link>
          </div>
          <div className="w-[180px] text-browndark font-semibold p-2">
            <a href="https://inaya-soli.ch">basel | zürich | bern</a>
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

      {/* translation notice for languages without full translation */}
      {!isComplete(lang) && (
        <div className="pt-[140px] -mb-[110px] px-[30px]">
          <div className="max-w-3xl mx-auto bg-lima text-gris text-sm px-4 py-2">
            {t.store.translationNote}
          </div>
        </div>
      )}

      <main className="w-full pt-[140px] pb-[60px]">
        <Outlet context={{ t, lang }} />
      </main>

      <footer className="bg-purple-800 text-purple-300 font-extralight tracking-wide py-[30px] px-[30px]">
        <ul className="max-w-3xl mx-auto mb-10 text-center">
          <li>
            <a href={`mailto:${t.contactPopup.email}`}>{t.footer.orgLine}</a>
          </li>
          <li>{t.footer.account}</li>
          <li>{t.footer.iban}</li>
          <li>{t.footer.city}</li>
          <li className="pt-4">
            <a href="/datenschutz.html">{t.footer.privacyLabel || 'AGBs und Datenschutz'}</a>
          </li>
        </ul>
      </footer>
    </div>
  )
}
