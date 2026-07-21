import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LANGUAGES } from '../i18n'

const codes = LANGUAGES.map((l) => l.code)

// map browser languages to our language codes
function detectBrowserLang() {
  for (const bl of navigator.languages || [navigator.language || '']) {
    const two = bl.toLowerCase().slice(0, 2)
    const mapped = { tr: 'tu', sq: 'al', ckb: 'ku', kmr: 'ku' }[two] || two
    if (codes.includes(mapped)) return mapped
  }
  return null
}

export default function LanguageChooser() {
  const location = useLocation()
  const navigate = useNavigate()
  // when opened via the in-site language button, always show the chooser
  const forced = location.state?.chooser === true
  const [show, setShow] = useState(forced)

  useEffect(() => {
    if (forced) return
    let saved = null
    try {
      saved = localStorage.getItem('inaya-lang')
    } catch {
      /* private mode etc. */
    }
    const target = (codes.includes(saved) && saved) || detectBrowserLang()
    if (target) navigate(`/${target}`, { replace: true })
    else setShow(true)
  }, [forced, navigate])

  if (!show) return null

  return (
    <div className="bg-lila min-h-screen w-full">
      <div className="max-w-3xl mx-auto mb-10 text-center pt-10 bg-repeat bg-center bg-[url('/assets/patron.svg')]">
        <img src="/assets/Zurich.svg" className="w-[450px] inline-block" alt="INAYA Zürich" />
      </div>

      <div className="bg-lima w-full h-2"></div>
      <div className="bg-turc w-full h-2"></div>

      <ul className="text-5xl font-bold text-gris py-[100px] px-[70px] tracking-wide leading-normal text-center bg-lila">
        {LANGUAGES.map((l) => (
          <li key={l.code} className="hover:opacity-60 transition-opacity">
            <Link
              to={`/${l.code}`}
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

      <footer className="bg-gris text-lila font-extralight tracking-wide py-[30px] px-[30px]">
        <ul className="max-w-3xl mx-auto mb-10 text-center">
          <li>
            <a href="mailto:inaya-zuerich@immerda.ch">
              Verein Inaya Zürich // inaya-zuerich@immerda.ch
            </a>
          </li>
          <li>Konto: 16-23816-2</li>
          <li>IBAN: CH63 0900 0000 1602 3816 2</li>
          <li>8005 Zürich</li>
        </ul>
      </footer>
    </div>
  )
}
