import { useOutletContext } from 'react-router-dom'
import News from '../components/News'
import Events from '../components/Events'

export default function Home() {
  const { t, lang } = useOutletContext()

  return (
    <>
      <div>
        <img src="/assets/bg.svg" alt="" className="w-full" />
      </div>

      <div className="max-w-3xl mx-auto mb-10 pt-[80px]">
        <h1 className="text-h1">{t.home.title}</h1>
        <div className="text-content">{t.home.intro}</div>
      </div>

      <News t={t} lang={lang} />
      <Events t={t} lang={lang} />
    </>
  )
}
