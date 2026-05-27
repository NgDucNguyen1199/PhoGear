# BÁO CÁO DỰ ÁN: HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ VÀ TRẢI NGHIỆM NGƯỜI DÙNG PHOGEAR

<div align="center">
  <img src="public/logo_main.png" alt="PhoGear Logo" width="220" />
  <p><strong>Nền tảng Fullstack tích hợp Giải pháp Thương mại điện tử và Công cụ Phân tích Kỹ năng Luyện gõ phím.</strong></p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-16.2_Turbopack-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Supabase-Backend_as_a_Service-green?style=for-the-badge&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vitest-Automated_Testing-6E9F18?style=for-the-badge&logo=vitest" alt="Vitest" />
  </div>
</div>

---

## 📑 Tóm tắt dự án (Abstract)

**PhoGear** là một ứng dụng web Fullstack hiện đại, chuyên biệt cho thị trường thiết bị ngoại vi cao cấp (Bàn phím cơ). Dự án không chỉ là một cửa hàng trực tuyến mà còn là một hệ sinh thái cho cộng đồng đam mê, tích hợp các công cụ luyện tập, diễn đàn thảo luận và hệ thống bảo mật đa lớp. Hệ thống tận dụng sức mạnh của **Next.js 16**, **React 19**, **Supabase** và kiến trúc tối ưu để đảm bảo trải nghiệm người dùng mượt mà và hiệu suất vượt trội.

---

## 🏛️ 1. Kiến trúc Hệ thống (System Architecture)

### 1.1 Tầng Giao diện & Xử lý (Frontend & Logic)
- **Framework:** Next.js 16 (App Router) với engine **Turbopack**.
- **State Management:** **Zustand** (với Persist) quản lý giỏ hàng và danh sách yêu thích.
- **Styling:** **Tailwind CSS 4.0** kết hợp với **Shadcn UI** và **Framer Motion**.
- **Optimization:** 
  - **PWA Support:** Trải nghiệm như ứng dụng mobile native.
  - **Optimistic UI:** Sử dụng `useOptimistic` (React 19) cho các hành động tương tác như Like bài viết và Giỏ hàng.
  - **Deep Skeleton Loading:** Triệt tiêu hiện tượng nhảy giao diện (CLS) bằng hệ thống Skeleton chuẩn 1:1.
  - **Multi-language (i18n):** Hỗ trợ đa ngôn ngữ linh hoạt.

### 1.2 Tầng Hạ tầng & Cơ sở dữ liệu (Backend & Database)
- **Supabase BaaS:** Quản lý Authentication (MFA), Realtime DB, và Storage.
- **PostgreSQL:** Hệ thống RLS (Row Level Security) nghiêm ngặt bảo vệ dữ liệu.
- **Security:** Tích hợp **Rate Limiting** và **Audit Logs** để theo dõi hoạt động hệ thống.

---

## ✨ 2. Các Module Chức năng Cốt lõi

### 🛒 2.1 Thương mại điện tử Nâng cao
- **Smart Inventory:** Quản lý tồn kho chi tiết đến từng biến thể (Switch, màu sắc). Tự động hoàn kho khi hủy đơn.
- **Flash Sales & Coupons:** Hệ thống giảm giá theo thời gian thực và mã khuyến mãi đa tầng (Giảm %, cố định, Freeship).
- **Product Discovery:** Bộ lọc thông minh, tìm kiếm toàn văn (Full-text search) và Keyboard Finder giúp tìm sản phẩm phù hợp.

### 🔔 2.2 Notification Center (Real-time)
- Thông báo tức thời khi trạng thái đơn hàng thay đổi hoặc có tương tác mới trên diễn đàn.
- Hiệu ứng thông báo trực quan trên thanh Navbar.

### 🎮 2.3 Photype Engine (Gamification)
- Trình luyện gõ phím chuyên nghiệp đo lường WPM và độ chính xác.
- **Global Leaderboard:** Bảng xếp hạng thế giới theo Tuần, Tháng và Mọi thời đại.
- **Typing Sounds:** Âm thanh gõ phím thực tế (Blue clicky, Creamy linear, Spacebar).

### 🛡️ 2.4 Quản trị hệ thống (Admin Dashboard)
- Quản lý sản phẩm, đơn hàng, người dùng và cài đặt hệ thống toàn diện.
- Biểu đồ thống kê doanh thu và phân bổ danh mục sản phẩm.

---

## 🗄️ 3. Mô hình Dữ liệu (Database Schema)

Hệ thống sử dụng PostgreSQL với các thực thể chính:
- **Profiles & Roles:** Phân quyền người dùng (User/Admin).
- **Products & Variants:** Cấu trúc sản phẩm đa biến thể.
- **Orders & Order Items:** Quy trình xử lý đơn hàng và tồn kho.
- **Flash Sales:** Quản lý các chương trình khuyến mãi chớp nhoáng.
- **Forum & Likes:** Hệ thống tương tác cộng đồng.
- **Audit Logs:** Ghi lại các thay đổi quan trọng của hệ thống.

---

## 🚀 4. Hướng dẫn Cài đặt & Khởi chạy

### Yêu cầu hệ thống:
- Node.js 20+
- Tài khoản Supabase

### Các bước cài đặt:
1. **Clone project:**
   ```bash
   git clone <repository-url>
   npm install
   ```

2. **Thiết lập biến môi trường (.env):**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

3. **Cấu hình Database (Supabase SQL Editor):**
   Chạy các file SQL trong thư mục `supabase/` theo thứ tự sau:
   - `schema.sql` (Nền tảng)
   - `variants_v2_schema.sql` (Cấu trúc biến thể mới)
   - `coupons_schema.sql`, `flash_sale_schema.sql`
   - `forum_schema.sql`, `forum_likes.sql`
   - `typing_scores_schema.sql`, `notifications_schema.sql`
   - `rate_limiting.sql`, `audit_logs.sql`
   - `seed.sql` (Dữ liệu mẫu)

4. **Chạy ứng dụng:**
   ```bash
   npm run dev
   ```

---

## 🛠️ 5. Xử lý sự cố (Troubleshooting)

Chi tiết về các thách thức kỹ thuật và cách giải quyết có thể xem tại: [CHALLENGES.md](./readme1.md)

---
<div align="center">
  <p>© 2026 PHO GEAR PROJECT - ALL RIGHTS RESERVED.</p>
</div>
