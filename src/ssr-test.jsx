// Smoke test: server-render every route in every language and report errors.
// Run: npx vite build --ssr src/ssr-test.jsx --outDir dist-ssr && node dist-ssr/ssr-test.js
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { LANGUAGES } from './i18n'

const pages = ['', 'hilfe-geben', 'hilfe-bekommen', 'ueber-uns', 'freundinnen', 'shop', 'kontakt']
let failures = 0

// "/" renders empty on the server by design (browser-language redirect happens client-side)
for (const route of LANGUAGES.flatMap((l) => pages.map((p) => `/${l.code}${p ? '/' + p : ''}`))) {
  try {
    const html = renderToString(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    )
    if (!html || html.length < 200) {
      console.log(`SUSPICIOUS (short output ${html.length}): ${route}`)
      failures++
    } else {
      console.log(`OK (${html.length} chars): ${route}`)
    }
  } catch (e) {
    console.log(`FAIL: ${route} -> ${e.message}`)
    failures++
  }
}

console.log(failures === 0 ? '\nALL ROUTES RENDER OK' : `\n${failures} FAILURES`)
process.exit(failures === 0 ? 0 : 1)
