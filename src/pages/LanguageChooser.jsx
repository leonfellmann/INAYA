import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom'
import { LANGUAGES } from '../i18n'
import { isValidCity, getCity } from '../data/cities'

const codes = LANGUAGES.map((l) => l.code)

// Browser-Sprache auf unsere Sprachcodes mappen
function detectBrowserLang() {
  for (const bl of navigator.languages || [navigator.language || '']) {
    const two = bl.toLowerCase().slice(0, 2)
    const mapped = { tr: 'tu', sq: 'al', ckb: 'ku', kmr: 'ku' }[two] || two
    if (codes.includes(mapped)) return mapped
  }
  return null
}

export default function LanguageChooser() {
  const { city } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  // Über den Sprach-Button im Menü geöffnet → Auswahl immer anzeigen
  const forced = location.state?.chooser === true
  const [show, setShow] = useState(forced)
  const valid = isValidCity(city)

  useEffect(() => {
    if (!valid || forced) return
    let saved = null
    try {
      saved = localStorage.getItem('inaya-lang')
    } catch {
      /* Privatmodus etc. */
    }
    const target = (codes.includes(saved) && saved) || detectBrowserLang()
    if (target) navigate(`/${city}/${target}`, { replace: true })
    else setShow(true)
  }, [valid, forced, navigate, city])

  if (!valid) return <Navigate to="/" replace />
  if (!show) return null

  const c = getCity(city)

  return (
    <div className="bg-lila min-h-screen w-full">
      <div className="max-w-3xl mx-auto mb-10 text-center pt-10 bg-repeat bg-center bg-[url('/assets/patron.svg')]">
        <img src="/assets/kleininaya.svg" className="w-[420px] max-w-[85%] inline-block" alt="INAYA" />
        <div className="text-browndark font-bold tracking-widest pt-3 text-lg">{c.name}</div>
      </div>

      <div className="bg-lima w-full h-2"></div>
      <div className="bg-turc w-full h-2"></div>

      <ul className="text-5xl font-bold text-gris py-[80px] px-[70px] tracking-wide leading-normal text-center bg-lila">
        {LANGUAGES.map((l) => (
          <li key={l.code} className="hover:opacity-60 transition-opacity pb-2">
            <Link
              to={`/${city}/${l.code}`}
              onClick={() => {
                try {
                  localStorage.setItem('inaya-lang', l.code)
                } catch {
                  /* ignore */
                }
              }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="text-center pb-10 bg-lila">
        <Link to="/" className="text-gris underline font-semibold tracking-wide">
          ← andere Stadt wählen
        </Link>
      </div>

      <footer className="bg-gris text-lila font-extralight tracking-wide py-[30px] px-[30px]">
        <ul className="max-w-3xl mx-auto mb-10 text-center">
          <li>
            <a href={`mailto:${c.email}`}>
              {c.org} // {c.email}
            </a>
          </li>
          <li>{c.konto}</li>
          <li>{c.iban}</li>
          <li>{c.cityLine}</li>
        </ul>
      </footer>
    </div>
  )
}
