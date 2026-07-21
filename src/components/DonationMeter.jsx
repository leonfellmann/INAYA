import { useEffect, useState } from 'react'

// Donation goal thermometer, driven by public/donation-goal.json.
export default function DonationMeter({ lang }) {
  const [goal, setGoal] = useState(null)

  useEffect(() => {
    fetch('/donation-goal.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setGoal(d?.enabled ? d : null))
      .catch(() => setGoal(null))
  }, [])

  if (!goal || !goal.goalChf) return null

  const pct = Math.min(100, Math.round((goal.currentChf / goal.goalChf) * 100))
  const label = goal.label?.[lang] || goal.label?.de || ''

  return (
    <div className="px-[30px] pb-[30px]">
      <div className="font-semibold text-gris pb-1">
        {label}: CHF {goal.currentChf.toLocaleString('de-CH')} / {goal.goalChf.toLocaleString('de-CH')}
      </div>
      <div className="w-full h-6 bg-white/60 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-turc transition-all" style={{ width: `${pct}%` }}></div>
      </div>
      <div className="text-sm text-browndark pt-1">{pct}%</div>
    </div>
  )
}
