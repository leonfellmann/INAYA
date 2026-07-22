// INAYA hero mark: a grainy electric starburst with a blinking eye.
// Deterministic (fixed seeds) so it renders identically on every load.
// Styling lives in index.css (.inaya-burst-wrap / .inaya-burst / .inaya-grain / .inaya-eye).

function mulberry(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function star(points, rOuter, rInner, jitter, rand) {
  let d = ''
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2
    const r = (i % 2 === 0 ? rOuter : rInner) * (1 - jitter + rand() * jitter * 2)
    d += (i === 0 ? 'M' : 'L') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1) + ' '
  }
  return d + 'Z'
}

function buildRays(seed) {
  const rand = mulberry(seed)
  const rays = []
  for (let i = 0; i < 80; i++) {
    const a = (i / 80) * Math.PI * 2 + (rand() - 0.5) * 0.05
    const major = i % 5 === 0
    const r = major ? 290 + rand() * 45 : 190 + rand() * 70
    const w = major ? 0.005 + rand() * 0.004 : 0.018 + rand() * 0.028
    const base = 4 + rand() * 6
    const x1 = (Math.cos(a - w) * base).toFixed(1)
    const y1 = (Math.sin(a - w) * base).toFixed(1)
    const x2 = (Math.cos(a) * r).toFixed(1)
    const y2 = (Math.sin(a) * r).toFixed(1)
    const x3 = (Math.cos(a + w) * base).toFixed(1)
    const y3 = (Math.sin(a + w) * base).toFixed(1)
    rays.push({ d: `M${x1},${y1} L${x2},${y2} L${x3},${y3} Z`, o: (0.55 + 0.45 * rand()).toFixed(2) })
  }
  return rays
}

const RAYS = buildRays(42)
const CORE = star(20, 178, 74, 0.13, mulberry(7))
const CORE2 = star(16, 124, 48, 0.16, mulberry(19))

export default function StarBurst({ eye = true }) {
  return (
    <div className="inaya-burst-wrap" aria-hidden="true">
      <div className="inaya-burst">
        <svg viewBox="-300 -300 600 600">
          <g fill="#ec00d2">
            {RAYS.map((r, i) => (
              <path key={i} d={r.d} opacity={r.o} />
            ))}
          </g>
          <path d={CORE} fill="#ff00e6" />
          <path d={CORE2} fill="#ff5cf3" opacity="0.85" />
        </svg>
      </div>
      <div className="inaya-grain" />
      {eye && (
        <div className="inaya-eye">
          <div className="blink">
            <svg viewBox="-140 -88 280 150" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              <g fill="none" stroke="#2b17ff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
                <path d="M-120,0 C-70,-52 70,-52 120,0 C70,44 -70,44 -120,0 Z" />
                <path d="M0,-50 L2,-76" />
                <path d="M40,-45 L50,-72" />
                <path d="M70,-35 L86,-59" />
                <path d="M94,-22 L114,-42" />
                <circle cx="0" cy="2" r="30" fill="#2b17ff" stroke="none" />
              </g>
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}
