'use client'

import Image, { ImageProps } from 'next/image'

/**
 * OptimizedImage component that can be extended to use specialized CDNs like Cloudinary or Imgix.
 * Currently uses Next.js built-in optimization but is architected for easy CDN integration.
 */
export function OptimizedImage({ src, alt, ...props }: ImageProps) {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  let finalSrc = src

  // Use Cloudinary Fetch if available and src is a remote URL
  if (CLOUD_NAME && typeof src === 'string' && src.startsWith('http')) {
    // Only fetch if it's not already a Cloudinary URL
    if (!src.includes('res.cloudinary.com')) {
      const encodedUrl = encodeURIComponent(src)
      // f_auto: automatic format (webp, avif, etc.)
      // q_auto: automatic quality
      // w_auto: automatic width (if supported by client hints, otherwise we use Next.js width)
      finalSrc = `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/f_auto,q_auto/${encodedUrl}`
    }
  }

  return (
    <Image
      src={finalSrc}
      alt={alt}
      {...props}
      quality={props.quality || 85}
    />
  )
}
