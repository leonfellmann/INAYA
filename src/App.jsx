import { Routes, Route, Navigate } from 'react-router-dom'
import LanguageChooser from './pages/LanguageChooser'
import Layout from './components/Layout'
import Home from './pages/Home'
import ContentPage from './pages/ContentPage'
import Shop from './pages/Shop'
import Contact from './pages/Contact'
import { CartProvider } from './context/CartContext'
import { LANGUAGES } from './i18n'

const validLangs = LANGUAGES.map((l) => l.code)

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<LanguageChooser />} />
        <Route path="/:lang" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="hilfe-geben" element={<ContentPage section="give" />} />
          <Route path="hilfe-bekommen" element={<ContentPage section="get" />} />
          <Route path="ueber-uns" element={<ContentPage section="about" />} />
          <Route path="freundinnen" element={<ContentPage section="friends" />} />
          <Route path="shop" element={<Shop />} />
          <Route path="kontakt" element={<Contact />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  )
}

export { validLangs }
