# BÁO CÁO CHI TIẾT DỰ ÁN: HỆ THỐNG PHOGEAR

## 📑 MỤC LỤC
1. [Tổng quan](#1-tổng-quan)
2. [Khảo sát và phân tích hệ thống](#2-khảo-sát-và-phân-tích-hệ-thống)
3. [Cài đặt hệ thống](#3-cài-đặt-hệ-thống)
4. [Kết luận và hướng phát triển](#4-kết-luận-và-hướng-phát-triển)
5. [Tài liệu tham khảo](#5-tài-liệu-tham khảo)

---

## 1. TỔNG QUAN

### 1.1 Khái niệm
**PhoGear** là một nền tảng thương mại điện tử (E-commerce) thế hệ mới, được thiết kế chuyên biệt cho cộng đồng đam mê bàn phím cơ (Mechanical Keyboards). Không chỉ dừng lại ở việc mua bán, PhoGear còn tích hợp các yếu tố cộng đồng và trò chơi hóa (Gamification) để tạo ra một hệ sinh thái toàn diện cho người dùng.

### 1.2 Các thành phần của hệ thống
Hệ thống bao gồm 4 module chính:
- **PhoShop:** Cửa hàng trực tuyến với đầy đủ tính năng giỏ hàng, thanh toán, mã giảm giá và Flash Sale.
- **PhoType:** Trình luyện gõ phím chuyên nghiệp giúp đo lường chỉ số WPM và độ chính xác.
- **PhoForum:** Diễn đàn thảo luận, nơi người dùng có thể chia sẻ kinh nghiệm và kiến thức.
- **Admin Dashboard:** Hệ thống quản trị tập trung dành cho chủ cửa hàng để quản lý toàn bộ quy trình vận hành.

### 1.3 Ưu và nhược điểm
**Ưu điểm:**
- **Hiệu năng:** Sử dụng Next.js 16 và Turbopack giúp tốc độ tải trang cực nhanh.
- **Trải nghiệm:** Giao diện tối ưu cho di động (Mobile First) và hỗ trợ PWA.
- **Bảo mật:** Cơ chế Row Level Security (RLS) của Supabase bảo vệ dữ liệu ở mức dòng.
- **Tính năng:** Tích hợp nhiều công cụ hỗ trợ người dùng như Keyboard Finder.

**Nhược điểm:**
- Phụ thuộc vào hạ tầng đám mây (Supabase/Cloudinary).
- Đòi hỏi cấu hình ban đầu về Database SQL khá chi tiết.

---

## 2. KHẢO SÁT VÀ PHÂN TÍCH HỆ THỐNG

### 2.1 Tên đề tài
*Xây dựng hệ thống thương mại điện tử và trải nghiệm người dùng tích hợp cho thiết bị ngoại vi PhoGear.*

### 2.2 Phân tích yêu cầu đề tài
Đề tài đặt ra bài toán giải quyết nhu cầu mua sắm thiết bị chuyên biệt kết hợp với việc xây dựng cộng đồng. Yêu cầu hệ thống phải xử lý được các tác vụ thời gian thực (như Flash Sale) và đảm bảo tính nhất quán của dữ liệu đơn hàng.

### 2.3 Mô tả PhoGear
PhoGear đóng vai trò là một "Hub" cho người chơi phím cơ. Tại đây, khách hàng có thể tìm thấy từ những bộ kit bàn phím cao cấp đến những switch hiếm, đồng thời có thể kiểm tra kỹ năng gõ phím của mình ngay trên nền tảng.

### 2.4 Yêu cầu đặt ra
- Giao diện hiện đại, tối giản nhưng đậm chất công nghệ.
- Tốc độ phản hồi dưới 2 giây cho mọi thao tác.
- Hệ thống mã giảm giá linh hoạt và bảo mật.
- Quản lý kho hàng chính xác, tránh tình trạng "over-selling".

### 2.5 Thiết bị và phần mềm
- **Môi trường:** Node.js (v20+), Git.
- **Backend:** Supabase (PostgreSQL, Auth, Storage).
- **Lưu trữ ảnh:** Cloudinary CDN.
- **Công cụ lập trình:** VS Code, Supabase SQL Editor.

### 2.6 Các chức năng chính
- **Người dùng:** Đăng ký/Đăng nhập (MFA), Tìm kiếm sản phẩm, Giỏ hàng, Đặt hàng, Áp dụng coupon, Luyện gõ phím, Đăng bài viết.
- **Quản trị viên:** Quản lý sản phẩm, Quản lý đơn hàng, Thống kê doanh thu, Thiết lập hệ thống, Kiểm duyệt nội dung.

### 2.7 Phân tích và thiết kế hệ thống
Hệ thống được thiết kế theo kiến trúc **Server Components** của Next.js, kết hợp với các **Server Actions** để xử lý logic backend, giúp giảm thiểu JavaScript tải về phía client.

### 2.8 Xác định các thực thể cơ sở dữ liệu
- `profiles`: Thông tin người dùng và phân quyền.
- `products`: Thông tin sản phẩm và biến thể.
- `categories`: Danh mục sản phẩm.
- `coupons`: Mã giảm giá và điều kiện áp dụng.
- `orders` & `order_items`: Chi tiết giao dịch.
- `posts` & `comments`: Dữ liệu diễn đàn.
- `system_settings`: Cấu hình toàn cục.

### 2.9 Biểu đồ thực thể quan hệ (ERD Overview)
- Một **Category** có nhiều **Products**.
- Một **User** tạo nhiều **Orders**.
- Một **Order** bao gồm nhiều **Order_Items**.
- Một **Order** có thể liên kết với một **Coupon**.
- Một **User** có thể đăng nhiều **Posts** và **Comments**.

---

## 3. CÀI ĐẶT HỆ THỐNG

### 3.1 Thư viện và ngôn ngữ sử dụng
- **Ngôn ngữ:** TypeScript (Đảm bảo Type Safety).
- **Frontend:** React 19, Tailwind CSS 4, Framer Motion.
- **Quản lý trạng thái:** Zustand.
- **Testing:** Vitest.
- **UI Components:** Shadcn/UI (Base UI).

### 3.2 Hướng dẫn cài đặt
1. Tải mã nguồn: `git clone https://github.com/NgDucNguyen1199/PhoGear.git`
2. Cài đặt thư viện: `npm install`

### 3.3 Nhập cơ sở dữ liệu
Truy cập Supabase SQL Editor và chạy các script theo thứ tự:
1. `supabase/schema.sql`
2. `supabase/coupons_schema.sql`
3. `supabase/forum_schema.sql`
4. `supabase/seed.sql` (Dữ liệu mẫu)

### 3.4 Cài đặt máy chủ
1. Tạo Project trên Supabase.
2. Cấu hình Authentication (Email/Password).
3. Tạo Storage Buckets: `avatars` và `products` với quyền truy cập public.

### 3.5 Cài đặt và khởi chạy PhoGear
Tạo tệp `.env.local` và điền các thông số:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```
Chạy ứng dụng: `npm run dev`

---

## 4. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 4.1 Kết luận
Dự án PhoGear đã hoàn thành các mục tiêu đề ra, xây dựng được một nền tảng thương mại điện tử hoạt động ổn định, mượt mà với đầy đủ các tính năng hiện đại. Hệ thống đáp ứng tốt các tiêu chuẩn về bảo mật và trải nghiệm người dùng.

### 4.2 Hướng phát triển
- Tích hợp cổng thanh toán trực tuyến (VNPAY, MoMo).
- Xây dựng hệ thống gợi ý sản phẩm dựa trên AI (Machine Learning).
- Phát triển ứng dụng di động Native bằng Flutter để tối ưu hóa trải nghiệm PWA hiện tại.

---

## 5. TÀI LIỆU THAM KHẢO
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React 19 & Server Actions Guide](https://react.dev)
- [Tailwind CSS 4 Documentation](https://tailwindcss.com)
