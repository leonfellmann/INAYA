import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CITY_ORDER, CITIES } from '../data/cities'

// Einstiegsseite: animiertes Auge ("das wachende Auge") in der körnigen
// Stern-Ästhetik des Kampagnen-Sujets, danach Auswahl der Stadt.
// Jede Stadt ist eine eigene Sub-Site (/ba, /zu, /be).
export default function CityChooser() {
  const raysRef = useRef(null)
  const coreRef = useRef(null)
  const core2Ref = useRef(null)
  const eyeRef = useRef(null)

  useEffect(() => {
    // spiky star polygon (K points, outer/inner radius, jitter)
    const star = (K, ro, ri, jit) => {
      let p = ''
      for (let i = 0; i < K * 2; i++) {
        const a = (i / (K * 2)) * Math.PI * 2
        const rr = (i % 2 === 0 ? ro : ri) * (1 - jit + Math.random() * jit * 2)
        p += (i === 0 ? 'M' : 'L') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1) + ' '
      }
      return p + 'Z'
    }
    if (coreRef.current) coreRef.current.setAttribute('d', star(20, 178, 74, 0.13))
    if (core2Ref.current) core2Ref.current.setAttribute('d', star(16, 124, 48, 0.16))

    // long spiky points around the star
    const g = raysRef.current
    if (g) {
      const N = 80
      let s = ''
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.05
        const major = i % 5 === 0
        const r = major ? 290 + Math.random() * 45 : 190 + Math.random() * 70
        const w = major ? 0.005 + Math.random() * 0.004 : 0.018 + Math.random() * 0.028
        const base = 4 + Math.random() * 6
        const x1 = (Math.cos(a - w) * base).toFixed(1)
        const y1 = (Math.sin(a - w) * base).toFixed(1)
        const x2 = (Math.cos(a) * r).toFixed(1)
        const y2 = (Math.sin(a) * r).toFixed(1)
        const x3 = (Math.cos(a + w) * base).toFixed(1)
        const y3 = (Math.sin(a + w) * base).toFixed(1)
        s += `<path d="M${x1},${y1} L${x2},${y2} L${x3},${y3} Z" opacity="${(0.55 + 0.45 * Math.random()).toFixed(2)}"/>`
      }
      g.innerHTML = s
    }

    // eye: open on load, then blink every few seconds
    const eye = eyeRef.current
    const timers = []
    if (eye) {
      timers.push(setTimeout(() => { eye.style.transform = 'scaleY(1)' }, 400))
      const blink = () => {
        eye.style.transform = 'scaleY(.06)'
        timers.push(setTimeout(() => { eye.style.transform = 'scaleY(1)' }, 120))
      }
      const loop = () => {
        timers.push(setTimeout(() => { blink(); loop() }, 2200 + Math.random() * 2000))
      }
      loop()
    }
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="iz" aria-label="INAYA Startseite">
      <div className="burst" aria-hidden="true">
        <svg viewBox="-300 -300 600 600" xmlns="http://www.w3.org/2000/svg">
          <g ref={raysRef} className="rays" fill="#ec00d2" />
          <g className="core">
            <path ref={coreRef} fill="#ff00e6" />
            <path ref={core2Ref} fill="#ff5cf3" opacity="0.85" />
          </g>
        </svg>
      </div>

      <div className="grain" aria-hidden="true" />

      <div className="stack">
        <svg className="eye" viewBox="-140 -88 280 150" role="img" aria-label="Ein blinzelndes Auge">
          <g ref={eyeRef} className="eyeParts" fill="none" stroke="#2b17ff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
            <path d="M-120,0 C-70,-52 70,-52 120,0 C70,44 -70,44 -120,0 Z" />
            <path d="M0,-50 L2,-76" />
            <path d="M40,-45 L50,-72" />
            <path d="M70,-35 L86,-59" />
            <path d="M94,-22 L114,-42" />
            <circle cx="0" cy="2" r="30" fill="#2b17ff" stroke="none" />
          </g>
        </svg>

        {/* INAYA logo (brand asset, tinted electric blue via .iz .logo path) */}
        <svg className="logo" viewBox="0 0 708 190" role="img" aria-label="INAYA">
          <path d="M36,1.3h37.5v187.3H36V1.3z" />
          <path d="M223.4,1.3v187.3h-37.5L148.4,95v93.7H111V1.3h37.5L185.9,95V1.3H223.4z" />
          <path d="M485.7,1.3l-37.5,74.9v112.4h-37.5V76.3l-37.4-75h37.5l18.7,37.5l18.7-37.5C448.2,1.3,485.7,1.3,485.7,1.3z" />
          <path d="M635.5,1.3H673v131.1h-37.5V1.3z M635.5,151.2H673v37.5h-37.5V151.2z" />
          <path d="M544.7,101.9c-4,0-7.2,3.2-7.2,7.2s3.2,7.2,7.2,7.2s7.2-3.2,7.2-7.2S548.7,101.9,544.7,101.9z" />
          <path d="M560.6,1.3h-37.5l-37.5,187.3h37.5l7.5-37.5h22.5l7.5,37.5h37.5L560.6,1.3z M540.9,121.7c-17.3,0-22.9-12.2-22.9-12.2s6.4-12.6,22.1-12.9v-7.3h3.9v7.4c2.4,0.1,4.6,0.4,6.5,0.9l2.4-7l3.7,1.3l-2.3,6.7c1.9,0.7,3.5,1.5,4.9,2.3l3.4-6.3l3.4,1.9l-3.7,6.8c3.2,3.1,3.9,6.2,3.9,6.2S558.2,121.7,540.9,121.7z" />
          <path d="M335.8,1.3h-37.5l-37.5,187.3h37.5l7.5-37.5h22.5l7.5,37.5h37.5L335.8,1.3z M318.2,121.7c-17.3,0-25.2-12.2-25.2-12.2s0.6-3,3.9-6.2l-3.7-6.8l3.4-1.9l3.4,6.3c1.4-0.8,2.9-1.6,4.9-2.3l-2.3-6.7l3.7-1.3l2.4,7c1.9-0.4,4.1-0.7,6.5-0.9v-7.4h3.9v7.3c15.6,0.3,22.1,12.9,22.1,12.9S335.5,121.7,318.2,121.7z" />
          <path d="M314.4,101.9c-4,0-7.2,3.2-7.2,7.2s3.2,7.2,7.2,7.2s7.2-3.2,7.2-7.2S318.4,101.9,314.4,101.9z" />
        </svg>

        <div className="cs">
          {CITY_ORDER.map((code) => (
            <Link key={code} className="ct" to={`/${code}`}>
              {CITIES[code].name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
