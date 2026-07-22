import { Link, useOutletContext } from 'react-router-dom'
import News from '../components/News'
import Events from '../components/Events'
import StarBurst from '../components/StarBurst'

// Manifest-Statement (deutsch fest, andere Sprachen: lokalisierter Slogan aus i18n)
const MANIFEST_DE =
  'Wir sind eine solidarische Unterstützungsstruktur für geflüchtete Frauen und LGBTIQA+ Personen.'

export default function Home() {
  const { t, lang, city, base } = useOutletContext()

  const hero = lang === 'de' ? MANIFEST_DE : t.home.title
  const intro = lang === 'de' ? city.intro : t.home.intro

  return (
    <>
      {/* Hero: Auge zentriert im rotierenden Stern, Statement darunter */}
      <section className="relative overflow-hidden bg-lila px-[22px] pt-[34px] pb-[46px] isolate">
        <StarBurst />
        <div className="relative z-10 text-center mt-[30px]">
          <h1 className="font-display uppercase text-elektro text-[28px] sm:text-4xl leading-[1.0] tracking-tight">
            {hero}
          </h1>
        </div>
      </section>

      <div className="bg-magenta w-full h-[3px]"></div>

      {/* Handlungs-Buttons (Pillen) */}
      <div className="max-w-3xl mx-auto pt-[30px] px-[24px] flex flex-col gap-[14px]">
        <Link
          to={`${base}/hilfe-geben`}
          className="group flex items-center justify-between bg-turc text-gris rounded-full px-[26px] py-[18px] font-display text-lg uppercase tracking-wide transition-transform hover:-translate-y-1"
        >
          <span>{t.nav.give}</span>
          <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
        </Link>
        <Link
          to={`${base}/hilfe-bekommen`}
          className="group flex items-center justify-between bg-lima text-gris rounded-full px-[26px] py-[18px] font-display text-lg uppercase tracking-wide transition-transform hover:-translate-y-1"
        >
          <span>{t.nav.get}</span>
          <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* Einleitung */}
      <div className="max-w-3xl mx-auto pt-[22px] pb-[8px]">
        <div className="text-content text-center">{intro}</div>
      </div>

      <News t={t} lang={lang} />
      <Events t={t} lang={lang} />
    </>
  )
}
