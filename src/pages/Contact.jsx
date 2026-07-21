import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FORMSPREE_ENDPOINT, CONTACT_EMAIL } from '../data/config'

export default function Contact() {
  const { t } = useOutletContext()
  const s = t.store
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function onSubmit(e) {
    e.preventDefault()
    if (!FORMSPREE_ENDPOINT) return
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.target),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto mb-10">
      <h1 className="text-h1">{s.contactTitle}</h1>
      <div className="text-content">{s.contactIntro}</div>

      {status === 'sent' ? (
        <div className="text-h2 bg-turc mx-[30px] p-4">{s.sent}</div>
      ) : FORMSPREE_ENDPOINT ? (
        <form onSubmit={onSubmit} className="px-[30px] flex flex-col gap-4 max-w-xl">
          <label className="flex flex-col gap-1 text-gris font-semibold">
            {s.nameLabel}
            <input type="text" name="name" className="p-3 bg-white/70 border border-browndark" />
          </label>
          <label className="flex flex-col gap-1 text-gris font-semibold">
            {s.emailLabel}
            <input type="email" name="email" required className="p-3 bg-white/70 border border-browndark" />
          </label>
          <label className="flex flex-col gap-1 text-gris font-semibold">
            {s.messageLabel}
            <textarea name="message" required rows="6" className="p-3 bg-white/70 border border-browndark"></textarea>
          </label>
          <div>
            <button type="submit" disabled={status === 'sending'} className="btn-donate font-semibold disabled:opacity-50">
              {s.send}
            </button>
          </div>
          {status === 'error' && (
            <div className="bg-lima p-3 text-gris">
              {s.sendError}{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-semibold">
                {CONTACT_EMAIL}
              </a>
            </div>
          )}
        </form>
      ) : (
        // no form endpoint configured yet → friendly mailto fallback
        <div className="text-h2 px-[30px]">
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
            {CONTACT_EMAIL}
          </a>
        </div>
      )}
    </div>
  )
}
