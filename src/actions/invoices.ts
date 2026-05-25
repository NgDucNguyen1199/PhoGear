'use server'

import { createClient } from '@/lib/supabase/server'
import { 
    Document, 
    Packer, 
    Paragraph, 
    TextRun, 
    Table, 
    TableRow, 
    TableCell, 
    WidthType, 
    AlignmentType,
    BorderStyle,
    VerticalAlign
} from 'docx'

/**
 * Server Action để tạo file hóa đơn DOCX
 */
export async function generateInvoiceDocx(orderId: string) {
  const supabase = await createClient()

  // 1. Lấy thông tin đơn hàng chi tiết
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles (full_name, avatar_url),
      order_items (
        *,
        products (name, brand)
      )
    `)
    .eq('id', orderId)
    .single()

  if (error || !order) {
    throw new Error('Không tìm thấy đơn hàng')
  }

  // 2. Định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  // 3. Tạo tài liệu DOCX
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header: Logo & Title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "PHO GEAR - CỬA HÀNG BÀN PHÍM CƠ CHUYÊN NGHIỆP",
              bold: true,
              size: 32,
              color: "1d4ed8" // Blue-700
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: "HÓA ĐƠN BÁN HÀNG",
              bold: true,
              size: 40,
            }),
          ],
        }),

        // Thông tin đơn hàng
        new Paragraph({
          children: [
            new TextRun({ text: `Mã đơn hàng: `, bold: true }),
            new TextRun(order.id.toUpperCase()),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Ngày đặt: `, bold: true }),
            new TextRun(new Date(order.created_at).toLocaleDateString('vi-VN')),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Khách hàng: `, bold: true }),
            new TextRun(order.profiles?.full_name || 'Khách vãng lai'),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Địa chỉ: `, bold: true }),
            new TextRun(order.shipping_address),
          ],
        }),
        new Paragraph({
          spacing: { after: 400 },
          children: [
            new TextRun({ text: `Số điện thoại: `, bold: true }),
            new TextRun(order.phone_number),
          ],
        }),

        // Bảng sản phẩm
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            // Header Row
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Sản phẩm", bold: true })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Số lượng", bold: true })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Đơn giá", bold: true })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Thành tiền", bold: true })] })] }),
              ],
            }),
            // Data Rows
            ...order.order_items.map((item: any) => new TableRow({
              children: [
                new TableCell({ children: [new Paragraph(item.products?.name || 'Sản phẩm')] }),
                new TableCell({ children: [new Paragraph(item.quantity.toString())] }),
                new TableCell({ children: [new Paragraph(formatCurrency(item.price_at_time))] }),
                new TableCell({ children: [new Paragraph(formatCurrency(item.price_at_time * item.quantity))] }),
              ],
            })),
          ],
        }),

        // Footer: Tổng cộng
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 400 },
          children: [
            new TextRun({ text: `Tạm tính: `, bold: true }),
            new TextRun(formatCurrency(order.total_amount + (order.discount_amount || 0))),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: `Giảm giá: `, bold: true }),
            new TextRun(`- ${formatCurrency(order.discount_amount || 0)}`),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ 
              text: `TỔNG CỘNG: ${formatCurrency(order.total_amount)}`, 
              bold: true,
              size: 28,
              color: "b91c1c" // Red-700
            }),
          ],
        }),

        // Lời cảm ơn
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 800 },
          children: [
            new TextRun({ text: "Cảm ơn quý khách đã tin tưởng Pho Gear!", italics: true }),
          ],
        }),
      ],
    }],
  });

  // 4. Export sang base64 để gửi về Client
  const buffer = await Packer.toBuffer(doc);
  return {
    base64: buffer.toString('base64'),
    fileName: `HoaDon_PhoGear_${order.id.slice(0, 8).toUpperCase()}.docx`
  };
}
