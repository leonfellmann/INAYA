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
      {/* Hero */}
      <section className="relative overflow-hidden bg-lila px-[30px] pt-[64px] pb-[44px] isolate">
        <div className="hero-grain" aria-hidden="true" />
        <svg
          className="pointer-events-none absolute -right-12 -top-10 w-[210px] max-w-[55%] opacity-90 z-0"
          viewBox="-100 -100 200 200"
          aria-hidden="true"
        >
          <g fill="#ff00e6">
            <path d="M0,-94 L11,-17 L46,-82 L17,-12 L88,-42 L19,0 L88,42 L17,12 L46,82 L11,17 L0,94 L-11,17 L-46,82 L-17,12 L-88,42 L-19,0 L-88,-42 L-17,-12 L-46,-82 L-11,-17 Z" />
            <circle r="30" fill="#ff5cf3" />
          </g>
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="font-display uppercase tracking-[0.22em] text-[12px] text-magenta">
            {city.cityLine}
          </div>
          <h1 className="font-display text-elektro leading-[0.84] text-[19vw] sm:text-8xl mt-1">
            {city.name}
          </h1>
          <p className="mt-5 max-w-[32ch] text-gris font-semibold text-lg leading-snug">
            {title}
          </p>
        </div>
      </section>

      <div className="bg-magenta w-full h-[3px]"></div>

      {/* Einleitung */}
      <div className="max-w-3xl mx-auto mb-8 pt-[46px]">
        <div className="text-content">{intro}</div>
      </div>

      {/* Handlungs-Buttons */}
      <div className="max-w-3xl mx-auto mb-14 px-[30px] flex flex-col gap-4">
        <Link
          to={`${base}/hilfe-geben`}
          className="group flex items-center justify-between bg-turc text-gris border-[3px] border-gris rounded-2xl px-6 py-5 font-display text-2xl tracking-wide transition-transform hover:-translate-y-1"
        >
          <span>{t.nav.give}</span>
          <span className="w-11 h-11 rounded-full bg-gris text-turc flex items-center justify-center text-xl shrink-0 ml-4 transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
        <Link
          to={`${base}/hilfe-bekommen`}
          className="group flex items-center justify-between bg-lima text-gris border-[3px] border-gris rounded-2xl px-6 py-5 font-display text-2xl tracking-wide transition-transform hover:-translate-y-1"
        >
          <span>{t.nav.get}</span>
          <span className="w-11 h-11 rounded-full bg-gris text-lima flex items-center justify-center text-xl shrink-0 ml-4 transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      <News t={t} lang={lang} />
      <Events t={t} lang={lang} />
    </>
  )
}
