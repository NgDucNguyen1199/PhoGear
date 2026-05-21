'use client'

import { useEffect, useState } from 'react'
import { createClient } from './client'
import { Product } from '@/types'

export function useRealtimeProduct(initialProduct: Product) {
  const [product, setProduct] = useState<Product>(initialProduct)
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to changes in the products table for this specific product
    const channel = supabase
      .channel(`realtime-product-${initialProduct.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `id=eq.${initialProduct.id}`,
        },
        (payload) => {
          setProduct((current) => ({
            ...current,
            ...payload.new,
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [initialProduct.id, supabase])

  return product
}

export function useRealtimeProducts(initialProducts: Product[]) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('realtime-products')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setProducts((current) =>
              current.map((p) => (p.id === payload.new.id ? { ...p, ...payload.new } : p))
            )
          } else if (payload.eventType === 'INSERT') {
            setProducts((current) => [payload.new as Product, ...current])
          } else if (payload.eventType === 'DELETE') {
            setProducts((current) => current.filter((p) => p.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  return products
}
