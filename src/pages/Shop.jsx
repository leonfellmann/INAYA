import { useState } from 'react'
import { useOutletContext, Navigate } from 'react-router-dom'
import { products, donationLink, formatChf } from '../data/products'
import { useCart } from '../context/CartContext'
import DonationMeter from '../components/DonationMeter'

export default function Shop() {
  const { t, lang, city, cityCode, base } = useOutletContext()
  const s = t.store

  // Soli-Shop gibt es nur in Städten mit hasShop (aktuell Zürich)
  if (!city.hasShop) return <Navigate to={base} replace />

  return (
    <div className="max-w-3xl mx-auto mb-10">
      <h1 className="text-h1">{s.title}</h1>
      <div className="text-content">{s.intro}</div>

      {/* products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-[30px] pb-[40px]">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} s={s} lang={lang} />
        ))}
      </div>

      <Cart s={s} lang={lang} cityCode={cityCode} />

      {/* donations */}
      <div className="bg-lima py-[30px] mb-10">
        <h2 className="text-h2 pt-[10px]">{s.donationTitle}</h2>
        <div className="text-content">{s.donationText}</div>
        <DonationMeter lang={lang} />
        <div className="px-[30px] pb-[20px]">
          <a href={donationLink} target="_blank" rel="noreferrer" className="btn-donate font-semibold">
            {s.donationButton}
          </a>
        </div>
        <div className="text-contentbold pt-[10px]">{s.bankTitle}</div>
        <div className="text-content">
          {city.org}
          <br />
          {city.iban}
        </div>
        <div className="px-[30px] flex gap-6 flex-wrap">
          {city.bankQr && (
            <a href={city.onlineDonation ? `${city.onlineDonation}?lng=${lang}` : undefined}>
              <img src={city.bankQr} className="w-[160px]" alt="Bank QR-Code" />
            </a>
          )}
          {city.twintQr && (
            <img src={city.twintQr} className="w-[160px]" alt="TWINT QR-Code" />
          )}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, s, lang }) {
  const cart = useCart()
  const name = product.name[lang] || product.name.de
  const [size, setSize] = useState(product.sizes ? product.sizes[1] || product.sizes[0] : null)

  const directLink = product.sizes ? product.paylinks?.[size] : product.paylink

  return (
    <div className="bg-white/60 p-4 flex flex-col">
      <img src={product.image} alt={name} className="w-full aspect-square object-cover mb-3" />
      <div className="font-semibold text-gris">{name}</div>
      <div className="text-browndark pb-3">{formatChf(product.priceChf)}</div>

      <div className="mt-auto flex flex-col gap-2">
        {product.sizes && (
          <div>
            <div className="text-sm text-gris pb-1">{s.size}</div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSize(sz)}
                  className={`px-3 py-1 border border-gris ${size === sz ? 'bg-gris text-white' : 'bg-white/70 text-gris'}`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => cart.add(product.id, size)} className="btn-shop">
          {s.addToCart}
        </button>
        {directLink && (
          <a href={directLink} target="_blank" rel="noreferrer" className="btn-donate text-center">
            {s.buy}
          </a>
        )}
      </div>
    </div>
  )
}

function Cart({ s, lang, cityCode }) {
  const cart = useCart()
  const [status, setStatus] = useState('idle') // idle | busy | unavailable | error

  if (cart.items.length === 0) return null

  const lines = cart.items.map((item) => {
    const p = products.find((x) => x.id === item.id)
    return { ...item, product: p, lineTotal: p.priceChf * item.qty }
  })
  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0)

  async function checkout() {
    setStatus('busy')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          city: cityCode,
          items: cart.items.map((i) => ({ id: i.id, size: i.size, qty: i.qty })),
        }),
      })
      if (res.status === 501) return setStatus('unavailable')
      if (!res.ok) return setStatus('error')
      const { link } = await res.json()
      if (link) window.location.href = link
      else setStatus('error')
    } catch {
      setStatus('unavailable')
    }
  }

  return (
    <div className="bg-white/50 mx-[30px] mb-[40px] p-4">
      <h2 className="text-xl font-bold text-gris pb-3">{s.cartTitle}</h2>
      <ul className="flex flex-col gap-2 pb-3">
        {lines.map((l) => (
          <li key={l.id + (l.size || '')} className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-gris grow">
              {l.product.name[lang] || l.product.name.de}
              {l.size ? ` (${l.size})` : ''}
            </span>
            <span className="flex items-center gap-1">
              <button onClick={() => cart.setQty(l.id, l.size, l.qty - 1)} className="px-2 border border-gris">−</button>
              <span className="px-2">{l.qty}</span>
              <button onClick={() => cart.setQty(l.id, l.size, l.qty + 1)} className="px-2 border border-gris">+</button>
            </span>
            <span className="w-24 text-right">{formatChf(l.lineTotal)}</span>
            <button onClick={() => cart.remove(l.id, l.size)} className="text-browndark underline text-sm">
              {s.remove}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-gris pt-3">
        <span className="font-bold text-gris">
          {s.total}: {formatChf(total)}
        </span>
        <button onClick={checkout} disabled={status === 'busy'} className="btn-donate font-semibold disabled:opacity-50">
          {s.checkout}
        </button>
      </div>
      {(status === 'unavailable' || status === 'error') && (
        <div className="bg-lima mt-3 p-3 text-gris">{s.checkoutUnavailable}</div>
      )}
    </div>
  )
}
