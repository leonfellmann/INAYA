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
    <div className="max-w-3xl mx-auto mb-10">
      <h2 className="text-h1">{t.store.eventsTitle}</h2>
      <ul>
        {events.map((e, i) => (
          <li key={i} className="text-content bg-white/40 mx-[30px] mb-4 p-4">
            <span className="font-semibold text-browndark">
              {formatDate(e.date, lang)}
              {e.time ? ` · ${e.time}` : ''}
              {e.location ? ` · ${e.location}` : ''}
            </span>
            <br />
            <b>{e.title[lang] || e.title.de}</b>
            {e.ticketUrl && (
              <div className="pt-2">
                <a href={e.ticketUrl} target="_blank" rel="noreferrer" className="btn-donate">
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
