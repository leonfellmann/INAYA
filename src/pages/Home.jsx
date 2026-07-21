import { Link, useOutletContext } from 'react-router-dom'
import News from '../components/News'
import Events from '../components/Events'

export default function Home() {
  const { t, lang, city, base } = useOutletContext()

  // Stadtspezifischer Titel + Einleitung (deutsch); andere Sprachen: i18n-Fallback
  const title = lang === 'de' ? city.slogan : t.home.title
  const intro = lang === 'de' ? city.intro : t.home.intro

  return (
    <>
      <div>
        <img src="/assets/bg.svg" alt="" className="w-full" />
      </div>

      <div className="max-w-3xl mx-auto mb-6 pt-[60px]">
        <h1 className="text-h1">{title}</h1>
        <div className="text-content">{intro}</div>
      </div>

      {/* Handlungs-Buttons */}
      <div className="max-w-3xl mx-auto mb-12 px-[30px] flex flex-col gap-4">
        <Link
          to={`${base}/hilfe-geben`}
          className="group flex items-center justify-between bg-turc text-gris border-[3px] border-gris rounded-2xl px-6 py-5 font-bold text-2xl tracking-wide transition-transform hover:-translate-y-1"
        >
          <span>{t.nav.give}</span>
          <span className="w-10 h-10 rounded-full bg-gris text-turc flex items-center justify-center text-xl shrink-0 ml-4">
            →
          </span>
        </Link>
        <Link
          to={`${base}/hilfe-bekommen`}
          className="group flex items-center justify-between bg-lima text-gris border-[3px] border-gris rounded-2xl px-6 py-5 font-bold text-2xl tracking-wide transition-transform hover:-translate-y-1"
        >
          <span>{t.nav.get}</span>
          <span className="w-10 h-10 rounded-full bg-gris text-lima flex items-center justify-center text-xl shrink-0 ml-4">
            →
          </span>
        </Link>
      </div>

      <News t={t} lang={lang} />
      <Events t={t} lang={lang} />
    </>
  )
}
