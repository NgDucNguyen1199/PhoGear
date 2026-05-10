'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/Logo'
import { useI18n } from '@/components/providers/I18nProvider'

export function Footer() {
  const { t } = useI18n()
  
  return (
    <footer className="mt-auto border-t bg-muted/40 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
              <Logo width={80} height={80} />
            </div>
            <p className="text-sm text-muted-foreground">
              {t.footer.description}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t.footer.products}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products?category=keyboard">{t.footer.keyboards}</Link></li>
              <li><Link href="/products?category=keycap">{t.footer.keycaps}</Link></li>
              <li><Link href="/products?category=switch">{t.footer.switches}</Link></li>
              <li><Link href="/products?category=accessory">{t.footer.accessories}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t.footer.support}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/policy">{t.footer.warranty}</Link></li>
              <li><Link href="/shipping">{t.footer.shipping}</Link></li>
              <li><Link href="/contact">{t.footer.contact}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t.footer.newsletter}</h4>
            <p className="text-xs text-muted-foreground mb-4">{t.footer.newsletterDesc}</p>
            <div className="flex gap-2">
              <input type="email" placeholder={t.footer.emailPlaceholder} className="bg-background border rounded px-3 py-1 text-sm w-full" />
              <Button size="sm">{t.footer.send}</Button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
          © 2026 Pho Gear. {t.footer.rightsReserved}
        </div>
      </div>
    </footer>
  )
}
