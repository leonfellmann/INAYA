import { Link } from 'react-router-dom'
import { CITY_ORDER, CITIES } from '../data/cities'

// Einstiegsseite: Auswahl der Stadt (Basel / Zürich / Bern).
// Jede Stadt ist eine eigene Sub-Site mit getrennter Spendenstruktur.
const CITY_COLORS = {
  ba: { bg: 'bg-turc', text: 'text-gris' },
  zu: { bg: 'bg-lila', text: 'text-gris' },
  be: { bg: 'bg-lima', text: 'text-gris' },
}

export default function CityChooser() {
  return (
    <div className="bg-lila min-h-screen w-full">
      <div className="max-w-3xl mx-auto text-center pt-16 pb-10 px-6 bg-repeat bg-center bg-[url('/assets/patron.svg')]">
        <img
          src="/assets/kleininaya.svg"
          className="w-[320px] max-w-[80%] inline-block"
          alt="INAYA"
        />
        <div className="text-browndark font-bold tracking-widest pt-4 text-lg">
          basel | zürich | bern
        </div>
      </div>

      <div className="bg-lima w-full h-2"></div>
      <div className="bg-turc w-full h-2"></div>

      <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-6">
        <div className="text-center text-gris font-semibold tracking-wide text-lg pb-2">
          Wähle deine Stadt
        </div>
        {CITY_ORDER.map((code) => {
          const c = CITIES[code]
          const col = CITY_COLORS[code]
          return (
            <Link
              key={code}
              to={`/${code}`}
              className={`${col.bg} ${col.text} border-[3px] border-gris rounded-2xl px-8 py-6 flex items-center justify-between font-bold text-3xl tracking-wide transition-transform hover:-translate-y-1`}
            >
              <span>{c.name}</span>
              <span className="w-11 h-11 rounded-full bg-gris text-white flex items-center justify-center text-2xl">
                →
              </span>
            </Link>
          )
        })}
      </div>

      <footer className="bg-gris text-lila font-extralight tracking-wide py-[30px] px-[30px]">
        <ul className="max-w-3xl mx-auto text-center">
          <li>INAYA — solidarisch mit geflüchteten Frauen &amp; genderqueeren Menschen</li>
          <li className="pt-2">basel | zürich | bern</li>
        </ul>
      </footer>
    </div>
  )
}
