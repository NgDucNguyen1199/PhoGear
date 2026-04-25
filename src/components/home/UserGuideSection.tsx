'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Keyboard, 
  Bluetooth, 
  Wifi, 
  Cable, 
  Lightbulb, 
  Download, 
  RefreshCcw, 
  BatteryWarning,
  Info
} from 'lucide-react'
import Link from 'next/link'

const manuals = [
  {
    id: 'yunzii-b75-pro-max',
    name: 'Yunzii B75 Pro Max',
    description: 'Bàn phím cơ 75% Gasket Mount với màn hình LCD và núm xoay đa năng.',
    specs: 'Layout 75% (82 phím) | Pin 4000mAh | Hot-swap 5 pin | Màn hình TFT LCD.',
    connections: {
      bluetooth: 'Gạt công tắc sang BT. Nhấn giữ Fn + 1/2/3 trong 3 giây đến khi đèn nháy nhanh để pair.',
      wireless: 'Gạt công tắc sang 2.4G. Cắm receiver vào máy tính. Nếu không nhận, nhấn giữ Fn + 4.',
      wired: 'Gạt công tắc sang vị trí giữa (USB). Cắm cáp Type-C đi kèm.',
    },
    shortcuts: [
      { keys: 'Fn + \\', action: 'Đổi chế độ LED' },
      { keys: 'Fn + Lên/Xuống', action: 'Tăng/Giảm độ sáng LED' },
      { keys: 'Fn + Trái/Phải', action: 'Tăng/Giảm tốc độ hiệu ứng LED' },
      { keys: 'Fn + Enter', action: 'Bật/Tắt màn hình LCD' },
    ],
    driverLink: '#driver-yunzii-b75-pro-max', // Placeholder link
    reset: 'Nhấn giữ tổ hợp phím Fn + Space trong 5 giây đến khi đèn bàn phím nháy sáng 3 lần.',
  },
  {
    id: 'yunzii-b75-pro',
    name: 'Yunzii B75 Pro',
    description: 'Phiên bản tiêu chuẩn 75% với đệm silicon cao cấp và âm thanh thocky.',
    specs: 'Layout 75% (82 phím) | Pin 4000mAh | Hot-swap 5 pin | Núm xoay volume.',
    connections: {
      bluetooth: 'Gạt công tắc sang BT. Nhấn giữ Fn + Q/W/E trong 3 giây để vào chế độ ghép nối.',
      wireless: 'Gạt công tắc sang 2.4G. Cắm receiver. Ghép nối thủ công: Fn + R.',
      wired: 'Gạt công tắc sang USB và cắm cáp kết nối.',
    },
    shortcuts: [
      { keys: 'Fn + \\', action: 'Chuyển đổi các hiệu ứng LED RGB' },
      { keys: 'Fn + Backspace', action: 'Đổi màu LED đơn sắc' },
      { keys: 'Fn + PgUp/PgDn', action: 'Chỉnh độ sáng/Tốc độ LED' },
      { keys: 'Fn + Win', action: 'Khóa/Mở khóa phím Windows' },
    ],
    driverLink: '#driver-yunzii-b75-pro', // Placeholder link
    reset: 'Nhấn giữ Fn + Esc trong 3-5 giây để khôi phục cài đặt gốc.',
  },
  {
    id: 'cidoo-v68',
    name: 'CIDOO V68',
    description: 'Bàn phím cơ Full Aluminum 65% cao cấp dành cho người chơi hệ "nhôm nguyên khối".',
    specs: 'Layout 65% (67 phím) | Pin 3000mAh | Vỏ nhôm CNC | Switch Matte siêu mượt.',
    connections: {
      bluetooth: 'Nhấn giữ Fn + Z/X/C trong 3 giây. Đèn nút tương ứng sẽ nháy nhanh.',
      wireless: 'Nhấn giữ Fn + V trong 3 giây, sau đó cắm USB Receiver vào máy.',
      wired: 'Nhấn Fn + Space để chuyển sang chế độ kết nối có dây.',
    },
    shortcuts: [
      { keys: 'Fn + Mũi tên Lên/Xuống', action: 'Tăng/Giảm độ sáng nền' },
      { keys: 'Fn + [ hoặc ]', action: 'Điều chỉnh tốc độ nháy LED' },
      { keys: 'Fn + A', action: 'Chuyển đổi layout Mac/Windows' },
    ],
    driverLink: '#driver-cidoo-v68', // Placeholder link
    reset: 'Nhấn giữ đồng thời Fn + Backspace trong 5 giây.',
  }
]

export function UserGuideSection() {
  const [activeTab, setActiveTab] = useState(manuals[0].id)

  return (
    <section className="py-20 bg-background border-t">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-3">
            <Info className="h-8 w-8 text-primary" /> Hướng Dẫn Sử Dụng
          </h2>
          <p className="text-lg text-muted-foreground">
            Làm chủ ngay chiếc bàn phím cơ của bạn với các thao tác kết nối, phím tắt và phần mềm tùy chỉnh.
          </p>
        </div>

        {/* Cảnh báo quan trọng */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-8 flex gap-4 items-start text-amber-700 dark:text-amber-400">
          <BatteryWarning className="h-6 w-6 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Lưu ý quan trọng về sạc pin</h4>
            <p className="text-sm">
              <strong>Tuyệt đối KHÔNG</strong> sử dụng củ sạc điện thoại (đặc biệt là sạc nhanh) để sạc bàn phím. Chỉ sạc bằng cách cắm trực tiếp cáp vào cổng USB của máy tính/laptop để tránh gây cháy nổ bo mạch (IC).
            </p>
          </div>
        </div>

        <Tabs defaultValue={manuals[0].id} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <TabsList className="bg-muted/50 p-1">
              {manuals.map((manual) => (
                <TabsTrigger 
                  key={manual.id} 
                  value={manual.id}
                  className="rounded-md px-6 font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  {manual.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {manuals.map((manual) => (
            <TabsContent key={manual.id} value={manual.id} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl text-primary">{manual.name}</CardTitle>
                  <CardDescription className="text-base text-foreground/80 font-medium">
                    {manual.specs}
                  </CardDescription>
                  <p className="text-muted-foreground">{manual.description}</p>
                </CardHeader>
                <CardContent className="px-0">
                  
                  <Accordion defaultValue={['connections']} className="w-full">
                    
                    {/* Kết nối */}
                    <AccordionItem value="connections" className="border-muted">
                      <AccordionTrigger className="text-lg font-bold hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-5 w-5 text-blue-500" /> Các chế độ kết nối
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                        <div className="flex items-start gap-3">
                          <Bluetooth className="h-5 w-5 mt-0.5 text-indigo-500 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-foreground">Bluetooth: </span>
                            <span className="text-muted-foreground">{manual.connections.bluetooth}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Wifi className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-foreground">Không dây 2.4G (Receiver): </span>
                            <span className="text-muted-foreground">{manual.connections.wireless}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Cable className="h-5 w-5 mt-0.5 text-orange-500 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-foreground">Cắm dây (Wired): </span>
                            <span className="text-muted-foreground">{manual.connections.wired}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Phím tắt */}
                    <AccordionItem value="shortcuts" className="border-muted">
                      <AccordionTrigger className="text-lg font-bold hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-amber-500" /> Tổ hợp phím tắt (LED & Media)
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <ul className="space-y-3">
                          {manual.shortcuts.map((shortcut, idx) => (
                            <li key={idx} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                              <kbd className="inline-flex items-center justify-center rounded border bg-muted px-2 py-1 text-sm font-bold font-mono text-muted-foreground shadow-sm">
                                {shortcut.keys}
                              </kbd>
                              <span className="text-muted-foreground text-sm">{shortcut.action}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Reset */}
                    <AccordionItem value="reset" className="border-muted">
                      <AccordionTrigger className="text-lg font-bold hover:no-underline">
                        <div className="flex items-center gap-2">
                          <RefreshCcw className="h-5 w-5 text-red-500" /> Cách Reset (Khôi phục cài đặt gốc)
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 text-muted-foreground">
                        {manual.reset}
                      </AccordionContent>
                    </AccordionItem>

                    {/* Software */}
                    <AccordionItem value="software" className="border-muted border-b-0">
                      <AccordionTrigger className="text-lg font-bold hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Download className="h-5 w-5 text-purple-500" /> Phần mềm tùy chỉnh (Driver)
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <p className="text-muted-foreground mb-4">
                          Tải phần mềm chính hãng để tùy biến LED RGB, keymap (gán phím) và thiết lập macro.
                        </p>
                        <Link href={manual.driverLink} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" /> Tải Driver cho {manual.name}
                          </Button>
                        </Link>
                      </AccordionContent>
                    </AccordionItem>

                  </Accordion>

                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
