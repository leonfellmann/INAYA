// Products for the Soli-Shop.
// - priceChf: numeric price in CHF (used by cart + checkout)
// - paylink: optional direct zahls.ch payment link (per size if sizes exist).
//   If set, the shop shows a direct buy button in addition to the cart.
// Replace names/prices/images with real products once they exist.
export const products = [
  {
    id: 'tshirt',
    name: { de: 'INAYA T-Shirt', en: 'INAYA T-Shirt' },
    priceChf: 30,
    image: '/assets/placeholder-tshirt.svg',
    sizes: ['S', 'M', 'L', 'XL'],
    paylinks: {},
  },
  {
    id: 'totebag',
    name: { de: 'INAYA Stofftasche', en: 'INAYA Tote Bag' },
    priceChf: 20,
    image: '/assets/placeholder-bag.svg',
    sizes: null,
    paylink: null,
  },
  {
    id: 'sticker',
    name: { de: 'Sticker-Set', en: 'Sticker Set' },
    priceChf: 5,
    image: '/assets/placeholder-sticker.svg',
    sizes: null,
    paylink: null,
  },
]

export function formatChf(n) {
  return `CHF ${n.toLocaleString('de-CH')}`
}

// zahls.ch donation form — paste the real link once created,
// e.g. https://inaya.zahls.ch/de/donation/...
export const donationLink = 'https://donate.raisenow.io/xwxqm'
