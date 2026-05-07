'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  itemType: 'service' | 'float'
  slug: string
  title: string
  price: number
  variantName?: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  updateQuantity: (itemType: 'service' | 'float', slug: string, quantity: number, variantName?: string) => void
  removeItem: (itemType: 'service' | 'float', slug: string, variantName?: string) => void
  clear: () => void
  count: number
  total: number
}

const STORAGE_KEY = 'nemnovo_cart'
const CartContext = createContext<CartContextType | null>(null)
const itemKey = (item: Pick<CartItem, 'itemType' | 'slug' | 'variantName'>) => `${item.itemType}::${item.slug}::${item.variantName || ''}`

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      setItems([])
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore localStorage errors
    }
  }, [items])

  const count = useMemo(() => items.reduce((sum, it) => sum + it.quantity, 0), [items])
  const total = useMemo(() => items.reduce((sum, it) => sum + it.price * it.quantity, 0), [items])

  const api = useMemo<CartContextType>(() => {
    return {
      items,
      addItem: (item, quantity = 1) =>
        setItems((prev) => {
          const idx = prev.findIndex((x) => itemKey(x) === itemKey(item))
          if (idx === -1) return [...prev, { ...item, quantity: Math.max(1, quantity) }]
          const next = [...prev]
          next[idx] = { ...next[idx], quantity: next[idx].quantity + Math.max(1, quantity) }
          return next
        }),
      updateQuantity: (itemType, slug, quantity, variantName) =>
        setItems((prev) =>
          prev.map((x) => (itemKey(x) === itemKey({ itemType, slug, variantName }) ? { ...x, quantity: Math.max(1, quantity) } : x))
        ),
      removeItem: (itemType, slug, variantName) =>
        setItems((prev) => prev.filter((x) => itemKey(x) !== itemKey({ itemType, slug, variantName }))),
      clear: () => setItems([]),
      count,
      total,
    }
  }, [items, count, total])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
