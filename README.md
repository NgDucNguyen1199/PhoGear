# BÁO CÁO DỰ ÁN: HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ VÀ TRẢI NGHIỆM NGƯỜI DÙNG PHOGEAR

<div align="center">
  <img src="public/logo_main.png" alt="PhoGear Logo" width="220" />
  <p><strong>Nền tảng Fullstack tích hợp Giải pháp Thương mại điện tử và Công cụ Phân tích Kỹ năng Luyện gõ phím.</strong></p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-16.2_Turbopack-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Supabase-Backend_as_a_Service-green?style=for-the-badge&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/Vitest-Automated_Testing-6E9F18?style=for-the-badge&logo=vitest" alt="Vitest" />
    <img src="https://img.shields.io/badge/Cloudinary-Image_Optimization-3448C5?style=for-the-badge&logo=cloudinary" alt="Cloudinary" />
  </div>
</div>

---

## 📑 Tóm tắt dự án (Abstract)

**PhoGear** là một ứng dụng web Fullstack hiện đại, chuyên biệt cho thị trường thiết bị ngoại vi cao cấp (Mechanical Keyboards). Dự án không chỉ là một cửa hàng trực tuyến mà còn là một hệ sinh thái cho cộng đồng đam mê bàn phím cơ, tích hợp các công cụ luyện tập và hệ thống bảo mật nghiêm ngặt. Hệ thống tận dụng sức mạnh của **Next.js 16**, **Supabase** và kiến trúc **Proxy** tiên tiến để đảm bảo trải nghiệm người dùng mượt mà và an toàn tuyệt đối.

---

## 🏛️ 1. Kiến trúc Hệ thống (System Architecture)

### 1.1 Tầng Giao diện & Xử lý (Frontend & Logic)
- **Framework:** Next.js 16 (App Router) với engine **Turbopack** cho tốc độ phản hồi cực nhanh.
- **Middleware Evolution:** Chuyển đổi sang convention **Proxy** (`proxy.ts`) để tối ưu hóa việc quản lý session và điều hướng bảo mật.
- **State Management:** **Zustand** (with Persist) quản lý giỏ hàng, danh sách yêu thích và trạng thái ứng dụng.
- **Optimization:** 
  - Tích hợp **Cloudinary** để resize/compress ảnh tự động.
  - **PWA** cho trải nghiệm mobile app native.
  - Cấu hình **Server Actions Body Limit (10MB)** cho phép xử lý các tác vụ admin phức tạp và tải ảnh dung lượng lớn.
  - Tối ưu hóa **React 19 Hydration** cho các thành phần UI (Dialog, Sheet, Select).

### 1.2 Tầng Hạ tầng & Cơ sở dữ liệu (Backend & Database)
- **Supabase BaaS:** Cung cấp hệ thống xác thực (Auth), cơ sở dữ liệu thời gian thực (Realtime DB) và lưu trữ tệp tin (Storage).
- **PostgreSQL:** Hệ quản trị CSDL quan hệ mạnh mẽ với cơ chế **Row Level Security (RLS)** phân quyền dữ liệu đến từng dòng.

---

## 🗄️ 2. Mô hình Dữ liệu (Database Schema)

Hệ thống sử dụng cấu trúc CSDL quan hệ được thiết kế tối ưu cho thương mại điện tử và mạng xã hội thu nhỏ:

### 2.1 Các thực thể chính
- **Profiles:** Mở rộng từ `auth.users`, lưu trữ thông tin người dùng (`full_name`, `avatar_url`, `role`).
- **Products:** Thông tin sản phẩm chi tiết (`price`, `stock`, `variants`, `flash_sale_price`).
- **Categories:** Phân loại sản phẩm (`mechanical`, `keycap`, `switch`).
- **Coupons:** Quản lý mã giảm giá (`code`, `type`, `value`, `min_order_amount`, `usage_limit`).
- **Orders & Order Items:** Quản lý giao dịch, lưu giữ giá tại thời điểm mua, các tùy chọn biến thể (JSONB) và thông tin giảm giá (`coupon_id`, `discount_amount`).
- **Posts & Comments:** Nền tảng diễn đàn với hệ thống trạng thái `pending`, `approved`, `rejected`.
- **System Settings:** Cấu hình toàn cục (tên site, trạng thái Flash Sale, cấu hình MFA).

### 2.2 Sơ đồ quan hệ (ERD Highlights)
- **1-n:** Một `Category` chứa nhiều `Products`.
- **1-n:** Một `User` có nhiều `Orders`.
- **1-n:** Một `Coupon` có thể được áp dụng cho nhiều `Orders`.
- **n-n:** `Orders` và `Products` thông qua bảng trung gian `Order_Items`.
- **1-n:** Một `Post` có nhiều `Comments`.

---

## ✨ 3. Các Module Chức năng Cốt lõi

### 🛒 3.1 Thương mại điện tử Nâng cao
- **Flash Sale 3.0:** Đếm ngược thời gian thực, tự động điều chỉnh giá và cập nhật tồn kho.
- **Smart Shipping:** Tự động tính phí vận chuyển và áp dụng chính sách Freeship thông minh.
- **Hệ thống Mã giảm giá (Coupons):** 
  - Hỗ trợ đa dạng loại giảm giá: Giảm theo phần trăm (%), giảm số tiền cố định (VND) hoặc Miễn phí vận chuyển (Freeship).
  - Thiết lập điều kiện linh hoạt: Đơn hàng tối thiểu, mức giảm tối đa, giới hạn lượt dùng và thời gian hiệu lực.
  - Quản lý tập trung: Admin có dashboard riêng để theo dõi hiệu quả và trạng thái của từng mã.
- **Order Tracking & Details:** 
  - Khách hàng có thể xem chi tiết hành trình đơn hàng, minh bạch các khoản tạm tính, phí ship và giảm giá.
  - Admin có hộp thoại chi tiết đơn hàng (Modal Detail) để xử lý nhanh chóng mà không cần chuyển trang.
- **Product Management:** Admin có thể quản lý biến thể phức tạp (màu sắc, layout) và upload ảnh đa kênh.

### 📱 3.2 Tối ưu hóa Di động (Mobile UX 2.0)
- **Full Responsive:** Giao diện thích ứng hoàn hảo từ Desktop đến Smartphone.
- **Mobile Menu & Search Overlay:** Thiết kế dành riêng cho thao tác một tay trên điện thoại.
- **Admin Mobile Dashboard:** Quản trị viên có thể duyệt đơn hàng, duyệt bài viết và xem thống kê ngay trên thiết bị di động với các bảng dữ liệu có khả năng cuộn ngang mượt mà.

### 🎮 3.3 Trải nghiệm Người dùng (Gamification)
- **PhoType Engine:** Trình luyện gõ phím chuyên sâu, đo lường WPM và độ chính xác.
  - **Global Leaderboard:** Hệ thống bảng xếp hạng thời gian thực với các bộ lọc: Tất cả thời gian, Theo tháng và Theo tuần.
- **Keyboard Finder:** Hệ thống gợi ý sản phẩm thông minh qua bộ câu hỏi trắc nghiệm trực quan.

### 🛡️ 3.4 Bảo mật & Kiểm thử
- **Multi-Factor Authentication (MFA):** Bảo vệ tài khoản bằng mã TOTP 6 số.
- **Automated Testing:** Hệ thống kiểm thử toàn diện với **Vitest**, đảm bảo các luồng quan trọng (Thanh toán, Xác thực) luôn hoạt động đúng.

---

## 🛠️ 4. Phân tích Kỹ thuật & Công nghệ

| Công nghệ | Vai trò | Ưu điểm |
| :--- | :--- | :--- |
| **Next.js 16** | Core Framework | Middleware/Proxy bảo mật, Turbopack nhanh hơn 700%. |
| **TypeScript** | Language | Hạn chế tối đa lỗi logic thông qua hệ thống Type Safety. |
| **Tailwind CSS 4** | Styling | Tối ưu hóa bundle size, hỗ trợ Dark Mode native. |
| **Cloudinary** | CDN Image | Tự động chọn định dạng WebP/AVIF giúp tải trang cực nhanh. |
| **Vitest** | Testing | Chạy hàng chục bài test đơn vị và tích hợp chỉ trong vài giây. |

---

## 📖 5. Hướng dẫn Sử dụng & Các trường hợp điển hình (Use Cases)

Dự án phục vụ hai đối tượng chính với các quy trình nghiệp vụ chuyên biệt:

### 5.1 Đối với Khách hàng (End Users)
- **Khám phá & Tìm kiếm:** Người dùng có thể duyệt sản phẩm theo danh mục hoặc sử dụng công cụ **Keyboard Finder** để nhận gợi ý bàn phím phù hợp với nhu cầu thông qua bộ câu hỏi trực quan.
- **Trải nghiệm PhoType:** Truy cập module **Photype** để kiểm tra tốc độ gõ phím (WPM) và độ chính xác. Hệ thống sẽ lưu trữ lịch sử để người dùng theo dõi sự tiến bộ.
- **Mua sắm thông minh:** 
  - Săn hàng giảm giá trong các đợt **Flash Sale** với đồng hồ đếm ngược thời gian thực.
  - Áp dụng **Mã giảm giá (Coupons)** tại trang Checkout để tối ưu chi phí.
- **Quản lý đơn hàng:** Theo dõi trạng thái đơn hàng từ lúc `Pending` đến khi `Delivered` với thông tin chi tiết về sản phẩm và thanh toán.

### 5.2 Đối với Quản trị viên (Admin)
- **Quản lý Sản phẩm & Tồn kho:** Thêm mới, chỉnh sửa thông tin sản phẩm, quản lý biến thể (variants) và cập nhật số lượng tồn kho theo thời gian thực.
- **Điều phối Đơn hàng:** Dashboard Admin cung cấp cái nhìn tổng thể về doanh thu, biểu đồ tăng trưởng và danh sách đơn hàng cần xử lý. Admin có thể cập nhật trạng thái đơn hàng (Shipped, Cancelled, etc.)
- **Marketing & Khuyến mãi:** Tạo và quản lý các chiến dịch mã giảm giá (Phần trăm, Số tiền cố định, Freeship) với các ràng buộc về thời gian và giới hạn sử dụng.
- **Kiểm duyệt Diễn đàn:** Duyệt hoặc từ chối các bài viết/bình luận từ cộng đồng để đảm bảo môi trường thảo luận văn minh.

---

## 🚀 6. Hướng dẫn Cài đặt & Khởi chạy

### Yêu cầu:
- Node.js 20+
- Tài khoản Supabase và Cloudinary.

### Các bước:
1. **Clone:** `git clone https://github.com/NgDucNguyen1199/PhoGear.git`
2. **Setup:** `npm install`
3. **Database Setup:** 
   Hệ thống yêu cầu các bảng dữ liệu trong Supabase. Truy cập **SQL Editor** trong Supabase Dashboard và chạy các tệp tin theo thứ tự:
   - Chạy `supabase/schema.sql` (Cấu trúc nền tảng)
   - Chạy `supabase/coupons_schema.sql` (Hệ thống mã giảm giá)
   - Chạy `supabase/forum_schema.sql` (Hệ thống diễn đàn)
   - Chạy `supabase/typing_scores_schema.sql` (Hệ thống bảng xếp hạng gõ phím)
   - Chạy các tệp `.sql` còn lại trong thư mục `supabase/` để kích hoạt đầy đủ tính năng.
   - Chạy `supabase/seed.sql` để có dữ liệu mẫu.
4. **Environment:** Tạo `.env.local` với các biến:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
4. **Build & Test:**
   - Chạy test: `npm test`
   - Build production: `npm run build`
5. **Run:** `npm run dev`

---

## 👤 Thông tin Tác giả

- **Họ và tên:** Nguyễn Đức Nguyên (MSSV: 2212429)
- **Trường:** Đại học Đà Lạt
- **Email:** [2212429@dlu.edu.vn](mailto:2212429@dlu.edu.vn)
- **Github:** [NgDucNguyen1199](https://github.com/NgDucNguyen1199)

---
<div align="center">
  <p>© 2026 PHO GEAR PROJECT - ALL RIGHTS RESERVED.</p>
</div>
