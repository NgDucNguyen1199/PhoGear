import { getProducts, getCategories, getFlashSaleProducts } from '@/actions/products'
import { getProfile } from '@/actions/auth'
import { getSystemSettings } from '@/actions/admin_settings'
import HomePageClient from './home-client'

export default async function HomePage() {
  const [
    heroProducts, 
    allProducts, 
    flashSaleProducts, 
    categories, 
    profile, 
    settings
  ] = await Promise.all([
    getProducts(5),
    getProducts(16),
    getFlashSaleProducts(),
    getCategories(),
    getProfile(),
    getSystemSettings()
  ])

  return (
    <HomePageClient 
      initialHeroProducts={heroProducts || []}
      initialNewProducts={allProducts?.slice(0, 8) || []}
      initialFlashSaleProducts={flashSaleProducts || []}
      initialBestSellers={allProducts?.slice(8, 12) || []}
      initialCategories={categories || []}
      initialProfile={profile}
      initialSettings={settings}
    />
  )
}
