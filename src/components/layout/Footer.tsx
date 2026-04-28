'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/40 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
              <Logo width={80} height={80} />
            </div>
            <p className="text-sm text-muted-foreground">
              Cửa hàng bàn phím cơ cao cấp tại Việt Nam. 
              Nâng tầm trải nghiệm gõ phím của người Việt.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Sản phẩm</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products?category=keyboard">Bàn phím</Link></li>
              <li><Link href="/products?category=keycap">Keycap</Link></li>
              <li><Link href="/products?category=switch">Switch</Link></li>
              <li><Link href="/products?category=accessory">Phụ kiện</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/policy">Chính sách bảo hành</Link></li>
              <li><Link href="/shipping">Vận chuyển</Link></li>
              <li><Link href="/contact">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Đăng ký nhận tin</h4>
            <p className="text-xs text-muted-foreground mb-4">Nhận thông báo về sản phẩm mới và khuyến mãi.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email của bạn" className="bg-background border rounded px-3 py-1 text-sm w-full" />
              <Button size="sm">Gửi</Button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
          © 2026 Pho Gear. Tất cả quyền được bảo lưu. Thiết kế bởi Đồ án Tốt nghiệp.
        </div>
      </div>
    </footer>
  )
}
