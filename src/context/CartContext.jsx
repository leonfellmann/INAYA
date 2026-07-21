import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

// key: productId + size; value: { id, size, qty }
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('inaya-cart') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('inaya-cart', JSON.stringify(items))
    } catch {
      /* ignore */
    }
  }, [items])

  function add(id, size) {
    setItems((prev) => {
      const key = (x) => x.id === id && x.size === size
      const found = prev.find(key)
      if (found) return prev.map((x) => (key(x) ? { ...x, qty: x.qty + 1 } : x))
      return [...prev, { id, size, qty: 1 }]
    })
  }

  function remove(id, size) {
    setItems((prev) => prev.filter((x) => !(x.id === id && x.size === size)))
  }

  function setQty(id, size, qty) {
    if (qty < 1) return remove(id, size)
    setItems((prev) => prev.map((x) => (x.id === id && x.size === size ? { ...x, qty } : x)))
  }

  function clear() {
    setItems([])
  }

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
