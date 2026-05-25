import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/actions/auth'
import { redirect, notFound } from 'next/navigation'

export default async function InvoicePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile) {
    redirect('/login')
  }

  // Lấy thông tin đơn hàng để kiểm tra quyền
  const { data: order, error } = await supabase
    .from('orders')
    .select('user_id')
    .eq('id', id)
    .single()

  if (error || !order) {
    notFound()
  }

  // Bảo mật: Chỉ chủ đơn hàng hoặc Admin mới được xem
  if (order.user_id !== profile.id && profile.role !== 'admin') {
    redirect('/orders')
  }

  // Trang này thực tế sẽ tự động trigger download hoặc hiển thị giao diện hóa đơn HTML
  // Ở đây tôi redirect về trang quản lý đơn hàng kèm thông báo nếu truy cập trực tiếp bằng trình duyệt
  // vì file DOCX đã được xử lý qua Server Action.
  
  // Tuy nhiên, để đúng yêu cầu "trang hóa đơn", tôi sẽ render một giao diện hóa đơn đơn giản ở đây
  const { data: fullOrder } = await supabase
    .from('orders')
    .select(`
        *,
        profiles (full_name, avatar_url),
        order_items (
            *,
            products (name, brand)
        )
    `)
    .eq('id', id)
    .single()

  return (
    <div className="min-h-screen bg-white p-8 font-serif text-black max-w-4xl mx-auto border shadow-lg my-10">
      <div className="flex justify-between items-start mb-12 border-b-2 border-blue-700 pb-8">
        <div>
          <h1 className="text-4xl font-black text-blue-700 tracking-tighter">PHO GEAR</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Mechanical Keyboard Store</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold uppercase">Hóa Đơn</h2>
          <p className="font-mono text-sm">#{fullOrder?.id.toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-2">Người bán:</h3>
          <p className="font-bold">Pho Gear Việt Nam</p>
          <p className="text-sm text-gray-600">123 Đường Bàn Phím, Quận 1, TP. HCM</p>
          <p className="text-sm text-gray-600">Email: contact@phogear.com</p>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-2">Người mua:</h3>
          <p className="font-bold">{fullOrder?.profiles?.full_name}</p>
          <p className="text-sm text-gray-600">{fullOrder?.shipping_address}</p>
          <p className="text-sm text-gray-600">SĐT: {fullOrder?.phone_number}</p>
        </div>
      </div>

      <table className="w-full mb-12 border-collapse">
        <thead>
          <tr className="bg-blue-50 text-blue-700 uppercase text-[10px] font-black tracking-widest text-left">
            <th className="p-4 border-b">Sản phẩm</th>
            <th className="p-4 border-b text-center">Số lượng</th>
            <th className="p-4 border-b text-right">Đơn giá</th>
            <th className="p-4 border-b text-right">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {fullOrder?.order_items.map((item: any) => (
            <tr key={item.id} className="border-b text-sm">
              <td className="p-4">{item.products?.name}</td>
              <td className="p-4 text-center">{item.quantity}</td>
              <td className="p-4 text-right">{item.price_at_time.toLocaleString('vi-VN')}đ</td>
              <td className="p-4 text-right">{(item.price_at_time * item.quantity).toLocaleString('vi-VN')}đ</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tạm tính:</span>
            <span>{(fullOrder?.total_amount + (fullOrder?.discount_amount || 0)).toLocaleString('vi-VN')}đ</span>
          </div>
          <div className="flex justify-between text-sm text-red-600">
            <span>Giảm giá:</span>
            <span>-{fullOrder?.discount_amount.toLocaleString('vi-VN')}đ</span>
          </div>
          <div className="flex justify-between text-lg font-black border-t-2 border-black pt-2 uppercase">
            <span>Tổng cộng:</span>
            <span>{fullOrder?.total_amount.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-8 border-t text-center text-xs text-gray-400 italic">
        Đây là hóa đơn điện tử được tạo tự động từ hệ thống Pho Gear.
        Cảm ơn quý khách đã ủng hộ!
      </div>
      
      <div className="mt-8 no-print flex justify-center">
         <button onClick={() => window.print()} className="bg-blue-700 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-800 transition-colors">
            In hóa đơn
         </button>
      </div>
    </div>
  )
}
