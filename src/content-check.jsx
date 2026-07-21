import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

const checks = [
  ['/de/hilfe-geben', [
    ['contains correct Konto once in main+footer', (h) => (h.match(/16-23816-2/g) || []).length >= 2],
    ['no broken ku/tu Konto typo', (h) => !h.includes('16-23816-26') && !h.includes('15-23816-2')],
    ['no old Basel TWINT', (h) => !h.includes('Inaya-Basel')],
    ['TWINT block present', (h) => h.includes('qrtwintZH.jpg')],
    ['bank QR present', (h) => h.includes('qr-code_bankkontoZH.jpeg')],
    ['thanks section after bank block', (h) => h.indexOf('qrtwintZH.jpg') < h.indexOf('Danke')],
    ['no duplicate IBAN in extracted sections (only GiveExtras+footer+popup areas)', (h) => (h.match(/CH63 0900 0000 1602 3816 2/g) || []).length <= 3],
  ]],
  ['/ar/hilfe-geben', [
    ['rtl set', (h) => h.includes('dir="rtl"')],
    ['no old Basel TWINT', (h) => !h.includes('Inaya-Basel')],
  ]],
  ['/de/shop', [
    ['3 products', (h) => h.includes('T-Shirt') && h.includes('Stofftasche') && h.includes('Sticker')],
    ['add to cart button', (h) => h.includes('In den Warenkorb')],
    ['sizes selectable', (h) => h.includes('>XL<')],
    ['donation link', (h) => h.includes('donate.raisenow.io')],
  ]],
  ['/fr/shop', [
    ['french strings', (h) => h.includes('Ajouter au panier')],
    ['fr raisenow lng', (h) => h.includes('lng=fr')],
  ]],
  ['/en', [
    ['no placeholder notice anymore', (h) => !h.includes('not yet available in your language')],
    ['real english content', (h) => h.includes('In solidarity with refugee women')],
  ]],
  ['/ru/ueber-uns', [
    ['russian about text', (h) => h.includes('Почему INAYA')],
  ]],
  ['/fa', [
    ['farsi rtl', (h) => h.includes('dir="rtl"')],
    ['farsi content', (h) => h.includes('همبستگی')],
  ]],
  ['/it/hilfe-bekommen', [
    ['italian get text', (h) => h.includes('Ho bisogno di sostegno')],
  ]],
  ['/al/hilfe-geben', [
    ['albanian give text', (h) => h.includes('Dua të mbështes')],
  ]],
  ['/es', [
    ['spanish home (was Kurdish before!)', (h) => h.includes('Solidarias con mujeres refugiadas')],
  ]],
  ['/de/kontakt', [
    ['contact page with mailto fallback', (h) => h.includes('Kontakt') && h.includes('mailto:inaya-zuerich@immerda.ch')],
  ]],
  ['/de', [
    ['no placeholder notice', (h) => !h.includes('noch nicht in deiner Sprache')],
    ['home intro', (h) => h.includes('lokal basierte Struktur')],
  ]],
  ['/de/freundinnen', [
    ['friends links open new tab', (h) => h.includes('target="_blank"')],
  ]],
]

let fail = 0
for (const [route, tests] of checks) {
  const html = renderToString(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>)
  for (const [name, fn] of tests) {
    const ok = fn(html)
    if (!ok) fail++
    console.log(`${ok ? 'PASS' : 'FAIL'} ${route} :: ${name}`)
  }
}
console.log(fail ? `${fail} FAILURES` : 'ALL CONTENT CHECKS PASS')
