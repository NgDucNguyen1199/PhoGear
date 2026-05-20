import { describe, it, expect } from 'vitest'
import { generateSKU } from './sku'

describe('SKU Utility', () => {
  it('should generate a correct SKU for simple names', () => {
    const sku = generateSKU('Yunzii B75 Pro', 'White Heart')
    expect(sku).toBe('YB75P-WH')
  })

  it('should handle names with numbers correctly', () => {
    const sku = generateSKU('Akko 3068', 'Black Pink')
    expect(sku).toBe('A3068-BP')
  })

  it('should handle single word names', () => {
    const sku = generateSKU('Keychron', 'Blue')
    expect(sku).toBe('K-B')
  })

  it('should remove special characters', () => {
    const sku = generateSKU('MonsGeek M1W!', 'Purple @ Gradient')
    expect(sku).toBe('MGM1W-PG')
  })
})
