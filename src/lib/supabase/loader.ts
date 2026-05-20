export default function supabaseLoader({ src, width, quality }: { src: string, width: number, quality?: number }) {
  if (!src.includes('supabase.co')) {
    return src
  }
  
  const url = new URL(src)
  // Use Supabase built-in image transformation (requires Pro plan or local self-hosting config)
  // Format: https://project.supabase.co/storage/v1/render/image/public/bucket/image.png?width=500&quality=75
  
  // Transform standard public URL to render URL
  if (url.pathname.includes('/storage/v1/object/public/')) {
    url.pathname = url.pathname.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/')
  }
  
  url.searchParams.set('width', width.toString())
  url.searchParams.set('quality', (quality || 75).toString())
  
  return url.toString()
}
