import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { OptimizedImage } from './OptimizedImage'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}))

describe('OptimizedImage', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('renders a normal image when CLOUD_NAME is not set', () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = ''
    const src = 'https://example.com/image.jpg'
    render(<OptimizedImage src={src} alt="Test" width={100} height={100} />)
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', src)
  })

  it('renders a Cloudinary Fetch URL when CLOUD_NAME is set', () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'demo'
    const src = 'https://example.com/image.jpg'
    render(<OptimizedImage src={src} alt="Test" width={100} height={100} />)
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', expect.stringContaining('res.cloudinary.com/demo/image/fetch/f_auto,q_auto'))
    expect(img).toHaveAttribute('src', expect.stringContaining(encodeURIComponent(src)))
  })

  it('does not double-wrap if src is already a Cloudinary URL', () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'demo'
    const src = 'https://res.cloudinary.com/demo/image/upload/v1/test.jpg'
    render(<OptimizedImage src={src} alt="Test" width={100} height={100} />)
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', src)
  })
})
