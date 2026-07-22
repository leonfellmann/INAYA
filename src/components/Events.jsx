import { useEffect, useState } from 'react'
import { formatDate } from './News'

// Upcoming events from public/events.json — past events are hidden automatically.
// ticketUrl (e.g. Eventfrog) shows a ticket button when set.
export default function Events({ t, lang }) {
  const [events, setEvents] = useState(null)

  useEffect(() => {
    fetch('/events.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const today = new Date().toISOString().slice(0, 10)
        setEvents((d?.events || []).filter((e) => e.date >= today))
      })
      .catch(() => setEvents([]))
  }, [])

  if (!events || events.length === 0) return null

  return (
    <div className="max-w-3xl mx-auto mb-12 px-[30px]">
      <h2 className="sec-head mb-5">{t.store.eventsTitle}</h2>
      <ul className="flex flex-col gap-3">
        {events.map((e, i) => (
          <li key={i} className="border-2 border-gris rounded-2xl px-5 py-4 bg-white/50">
            <span className="font-display text-[12px] tracking-[0.08em] text-elektro">
              {formatDate(e.date, lang)}
              {e.time ? ` · ${e.time}` : ''}
              {e.location ? ` · ${e.location}` : ''}
            </span>
            <div className="font-bold text-gris leading-snug mt-1">
              {e.title[lang] || e.title.de}
            </div>
            {e.ticketUrl && (
              <div className="pt-3">
                <a
                  href={e.ticketUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block font-display tracking-wide bg-elektro text-white px-4 py-2 rounded-full text-sm transition-transform hover:-translate-y-0.5"
                >
                  {t.store.tickets}
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
