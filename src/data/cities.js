// Stadt-Konfiguration für die drei INAYA-Sub-Sites.
// Jede Stadt hat eigene Spendendaten, Kontakt und (nur Zürich) einen Soli-Shop.
// Alle Daten von inaya-soli.ch übernommen (Stand 2026-07).

export const CITIES = {
  ba: {
    code: 'ba',
    name: 'Basel',
    label: 'Basel',
    org: 'Verein INAYA Basel',
    email: 'inaya-basel@immerda.ch',
    konto: 'Konto: 15-809915-6',
    iban: 'IBAN: CH07 0900 0000 1580 9915 6',
    cityLine: '4054 Basel',
    // Titel-Wortlaut (Basel nutzt "genderqueeren")
    slogan: 'Solidarisch mit geflüchteten Frauen & genderqueeren Menschen',
    // Deutscher Einleitungstext (stadtspezifisch)
    intro:
      'INAYA Basel ist eine lokale, staatlich unabhängige Struktur, die sich direkt mit geflüchteten Frauen und genderqueeren Menschen solidarisiert. Es werden alternative Unterstützungsstrukturen aufgebaut, solidarische Netzwerke geschaffen und Beziehungen gepflegt. Eine Priorität ist dabei die Umverteilung von benötigtem Geld von denjenigen, die genug haben, zu jenen, die zu wenig Geld haben. So sollen Grundbedürfnisse sicher und langfristig gedeckt werden. Der Aufbau solidarischer, gemeinschaftlicher und umverteilender Strukturen ist Teil einer grundlegenden Kritik am vorherrschenden repressiven Migrations- und Asylsystem; ein System, das Menschen aktiv Möglichkeiten für eine sichere Lebensgrundlage verweigert, von der Gesellschaft ausschliesst und isoliert. Deswegen INAYA!',
    onlineDonation: null, // Basel hat (noch) keinen RaiseNow-Link
    // TODO: Bild lokal ablegen (public/assets/twint-basel.png) und Pfad ändern.
    // Vorläufig von der bestehenden Live-Seite verlinkt:
    twintQr: 'https://inaya-soli.ch/ba/de/assets/qr.png',
    bankQr: null,
    hasShop: false,
    friendsLabel: 'Freund:innen',
    instagram: null,
  },
  zu: {
    code: 'zu',
    name: 'Zürich',
    label: 'Zürich',
    org: 'Verein Inaya Zürich',
    email: 'inaya-zuerich@immerda.ch',
    konto: 'Konto: 16-23816-2',
    iban: 'IBAN: CH63 0900 0000 1602 3816 2',
    cityLine: '8005 Zürich',
    slogan: 'Solidarisch mit geflüchteten Frauen & genderqueeren Menschen',
    intro:
      'INAYA ist eine lokal basierte Struktur für geflüchtete Frauen und genderqueere Menschen. Sie möchte sich direkt solidarisieren. Eine Priorität ist dabei eine Umverteilung von benötigtem Geld von denjenigen, die genug haben, zu jenen, die zu wenig Geld haben. So sollen Grundbedürfnisse sicher und langfristig gedeckt werden. Für geflüchtete Frauen und genderqueere Menschen sind bestehende Unterstützungsstrukturen nicht vorhanden oder schwer zugänglich. Deswegen INAYA!',
    onlineDonation: 'https://donate.raisenow.io/xwxqm',
    twintQr: '/assets/qrtwintZH.jpg',
    bankQr: '/assets/qr-code_bankkontoZH.jpeg',
    hasShop: true,
    friendsLabel: 'Freund:innen',
    instagram: null,
  },
  be: {
    code: 'be',
    name: 'Bern',
    label: 'Bern',
    org: 'Verein INAYA Bern',
    email: 'inaya-bern@immerda.ch',
    konto: 'Konto: 16-431765-1',
    iban: 'IBAN: CH76 0900 0000 1643 1765 1',
    cityLine: '3000 Bern',
    // Bern nutzt "queeren" statt "genderqueeren"
    slogan: 'Solidarisch mit geflüchteten Frauen & queeren Menschen',
    intro:
      'INAYA Bern ist eine lokale Struktur, die sich mit geflüchteten queeren Menschen und Frauen solidarisiert und sie direkt unterstützt. Eine Priorität stellt die Umverteilung von Geld dar, von Denjenigen, die genug haben, zu Jenen, die zu wenig haben. So sollen Grundbedürfnisse nachhaltig gedeckt werden. Für geflüchtete queere Personen und Frauen sind bestehende Unterstützungsstrukturen nicht vorhanden oder nur schwer zugänglich. Deswegen braucht es INAYA!',
    onlineDonation: null,
    // TODO: Bild lokal ablegen (public/assets/twint-bern.png) und Pfad ändern.
    // Vorläufig von der bestehenden Live-Seite verlinkt:
    twintQr: 'https://inaya-soli.ch/be/de/assets/qr-lila.png',
    bankQr: null,
    hasShop: false,
    friendsLabel: 'Netzwerk',
    instagram: 'https://www.instagram.com/inayabern',
  },
}

export const CITY_CODES = Object.keys(CITIES) // ['ba','zu','be']

export const CITY_ORDER = ['ba', 'zu', 'be']

export function getCity(code) {
  return CITIES[code] || null
}

export function isValidCity(code) {
  return CITY_CODES.includes(code)
}

// RaiseNow-Spendenlink inkl. Sprachparameter (nur wo vorhanden)
export function onlineDonationHref(city, lang) {
  if (!city?.onlineDonation) return null
  const rn = { de: 'de', fr: 'fr', it: 'it', en: 'en' }[lang] || 'en'
  return `${city.onlineDonation}?lng=${rn}`
}
