'use client'

import { useEffect } from 'react'

const RECENTLY_VIEWED_KEY = 'phogear_recently_viewed'
const MAX_RECENT_ITEMS = 10

export function useProductViewHistory(productId: string) {
  useEffect(() => {
    if (!productId) return

    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY)
    let history: string[] = stored ? JSON.parse(stored) : []

    // Remove existing if any, and add to start
    history = history.filter(id => id !== productId)
    history.unshift(productId)

    // Keep only the latest N items
    if (history.length > MAX_RECENT_ITEMS) {
      history = history.slice(0, MAX_RECENT_ITEMS)
    }

    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(history))
  }, [productId])
}

export function getRecentlyViewedIds(): string[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(RECENTLY_VIEWED_KEY)
  return stored ? JSON.parse(stored) : []
}
