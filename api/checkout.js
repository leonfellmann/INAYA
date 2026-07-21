// Vercel serverless function: creates a zahls.ch (Payrexx) payment gateway
// for the cart and returns the payment link.
//
// Setup (Vercel project → Settings → Environment Variables):
//   ZAHLS_INSTANCE   – zahls.ch instance name (e.g. "inaya")
//   ZAHLS_API_SECRET – API secret from the zahls.ch dashboard
//   ZAHLS_API_BASE   – optional, defaults to https://api.zahls.ch/v1.0
//
// Getrennte Konten pro Stadt: optional stadtspezifische Variablen setzen,
// z.B. ZAHLS_INSTANCE_ZU / ZAHLS_API_SECRET_ZU. Fällt auf die generischen
// Variablen zurück, wenn keine stadtspezifischen gesetzt sind.
//
// Until these are set, the endpoint returns 501 and the shop shows
// a friendly "checkout not available yet" message.
import crypto from 'node:crypto'

// Keep prices server-side so the client can't tamper with them.
// Must match src/data/products.js.
const PRICES = {
  tshirt: 30,
  totebag: 20,
  sticker: 5,
}

const VALID_CITIES = ['ba', 'zu', 'be']

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' })
  }

  const { items, lang, city } = req.body || {}
  const cityCode = VALID_CITIES.includes(city) ? city : 'zu'
  const suffix = cityCode.toUpperCase()

  // Stadtspezifisches Konto bevorzugen, sonst generisch
  const instance = process.env[`ZAHLS_INSTANCE_${suffix}`] || process.env.ZAHLS_INSTANCE
  const secret = process.env[`ZAHLS_API_SECRET_${suffix}`] || process.env.ZAHLS_API_SECRET
  const base = process.env.ZAHLS_API_BASE || 'https://api.zahls.ch/v1.0'

  if (!instance || !secret) {
    return res.status(501).json({ error: 'checkout not configured' })
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'empty cart' })
  }

  let totalChf = 0
  const description = []
  for (const item of items) {
    const price = PRICES[item.id]
    const qty = Number(item.qty)
    if (!price || !Number.isInteger(qty) || qty < 1 || qty > 50) {
      return res.status(400).json({ error: 'invalid item' })
    }
    totalChf += price * qty
    description.push(`${qty}x ${item.id}${item.size ? ` (${item.size})` : ''}`)
  }

  const params = {
    amount: Math.round(totalChf * 100), // cents
    currency: 'CHF',
    purpose: `INAYA Soli-Shop ${suffix}: ${description.join(', ')}`.slice(0, 250),
    successRedirectUrl: `https://${req.headers.host}/${cityCode}/${lang || 'de'}/shop?paid=1`,
    failedRedirectUrl: `https://${req.headers.host}/${cityCode}/${lang || 'de'}/shop`,
  }

  // Payrexx/zahls.ch API signature: HMAC-SHA256 over the url-encoded body
  const query = new URLSearchParams(params).toString()
  const signature = crypto.createHmac('sha256', secret).update(query).digest('base64')
  const body = `${query}&ApiSignature=${encodeURIComponent(signature)}`

  try {
    const r = await fetch(`${base}/Gateway/?instance=${encodeURIComponent(instance)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    const data = await r.json()
    const link = data?.data?.[0]?.link
    if (data?.status === 'success' && link) {
      return res.status(200).json({ link })
    }
    console.error('zahls.ch error:', JSON.stringify(data).slice(0, 500))
    return res.status(502).json({ error: 'payment provider error' })
  } catch (e) {
    console.error('checkout failed:', e.message)
    return res.status(502).json({ error: 'payment provider unreachable' })
  }
}
