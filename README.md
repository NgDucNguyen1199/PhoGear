# BÁO CÁO DỰ ÁN: XÂY DỰNG HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ VÀ TRẢI NGHIỆM NGƯỜI DÙNG CHUYÊN BIỆT PHOGEAR

<div align="center">
  <img src="public/logo_main.png" alt="PhoGear Logo" width="220" />
  <p><strong>Nền tảng Fullstack tích hợp Giải pháp Thương mại điện tử và Công cụ Phân tích Kỹ năng Luyện gõ phím.</strong></p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-16.2_Turbopack-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Supabase-Backend_as_a_Service-green?style=for-the-badge&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/TypeScript-Strict_Type_Safety-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-Modern_UI-06B6D4?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  </div>
</div>

---

## 📑 Tóm tắt dự án (Abstract)

**PhoGear** là một ứng dụng web Fullstack hiện đại, được thiết kế nhằm tối ưu hóa quy trình thương mại điện tử trong thị trường ngách là thiết bị ngoại vi cao cấp (Mechanical Keyboards). Dự án tích hợp các module tương tác nâng cao như **PhoType** (Typing Engine), **Forum Hub** (Diễn đàn cộng đồng) và hệ thống bảo mật đa lớp (**Multi-Factor Authentication - MFA**). Hệ thống tận dụng sức mạnh của kiến trúc **Next.js 16** với cơ chế **Proxy Engine** mới nhất để đảm bảo hiệu suất và bảo mật dữ liệu tuyệt đối.

---

## 🏛️ 1. Kiến trúc Hệ thống (System Architecture)

### 1.1 Tầng Giao diện & Xử lý (Frontend & Logic)
- **Next.js 16 (App Router):** Sử dụng Turbopack để tăng tốc độ phát triển và deploy. Triển khai cơ chế **Proxy** thay thế cho Middleware truyền thống.
- **Server Actions:** Xử lý nghiệp vụ phức tạp trực tiếp trên server (MFA, Forum Moderation, Order Verification).
- **State Management:** Sử dụng **Zustand** với cơ chế Persist để duy trì giỏ hàng và danh sách yêu thích giữa các phiên làm việc.

### 1.2 Tầng Hạ tầng & Cơ sở dữ liệu (Backend & Database)
- **Supabase BaaS:** Hạt nhân lưu trữ và xác thực.
  - **PostgreSQL:** Cơ sở dữ liệu quan hệ với Row Level Security (RLS) cho bài viết và đơn hàng.
  - **Supabase Storage:** Quản lý kho ảnh sản phẩm (Public Bucket) và ảnh đại diện người dùng với phân quyền Admin nghiêm ngặt.

---

## ✨ 2. Các Module Chức năng Cốt lõi

### 🛒 2.1 Module Thương mại điện tử (E-commerce Core)
- **Hệ thống Flash Sale 3.0:** Quản lý chương trình khuyến mãi giờ vàng với bộ đếm ngược thời gian thực, tự động khôi phục giá gốc khi hết giờ và giới hạn số lượng bán.
- **Chính sách Vận chuyển Thông minh:** Tự động tính phí vận chuyển (30,000đ) và áp dụng **Freeship cho đơn từ 800,000đ** (kèm thông báo nhắc nhở mua thêm).
- **Quản lý Sản phẩm Linh hoạt:** Hỗ trợ sản phẩm có biến thể hoặc không có biến thể. Tích hợp tính năng **Upload ảnh trực tiếp từ máy tính** lên Cloud.
- **Tính ổn định cao:** Đã xử lý triệt để các lỗi hiển thị đối tượng (React Child Error) cho các trường dữ liệu động.

### 💬 2.2 PhoGear Forum Hub (Community)
- **Diễn đàn Chia sẻ:** Nơi thành viên đăng bài viết chia sẻ kinh nghiệm build phím với bộ sưu tập ảnh thực tế (Gallery) và hệ thống bình luận thời gian thực.
- **Hệ thống Phê duyệt (Moderation):** Bài viết mới được giữ ở trạng thái "Pending" và chỉ hiển thị sau khi được Admin phê duyệt trong trang quản trị.
- **Phân quyền truy cập:** Khách vãng lai chỉ được xem, chỉ thành viên chính thức mới có quyền đăng bài và bình luận.

### 🎮 2.3 Trình mô phỏng & Trắc nghiệm (User Experience)
- **Keyboard Finder 2.0:** Công cụ trắc nghiệm đa bước với minh họa layout bằng SVG trực quan và hiệu ứng âm thanh clicky tương tác.
- **PhoType Engine:** Trò chơi luyện gõ phím chuyên nghiệp với bảng xếp hạng thần tốc (Leaderboard).

### 🛡️ 2.4 Quản trị & Bảo mật (Admin & Security)
- **Admin Dashboard 2.0:** Hệ thống phân tích kinh doanh với biểu đồ doanh thu Recharts, quản lý bài viết diễn đàn và cài đặt hệ thống tập trung.
- **Multi-Factor Authentication (MFA):** Bảo vệ tài khoản bằng mã TOTP 6 số qua ứng dụng Authenticator, bắt buộc đối với tài khoản quản trị.

---

## 🛠️ 3. Phân tích Kỹ thuật & Công nghệ

| Công nghệ | Vai trò trong hệ thống | Ưu điểm chính |
| :--- | :--- | :--- |
| **Next.js 16** | Framework chính | Hiệu năng vượt trội, cơ chế Proxy bảo mật hơn. |
| **TypeScript** | Ngôn ngữ phát triển | Type Safety tuyệt đối, đảm bảo dữ liệu luôn đúng định dạng chuỗi. |
| **Supabase** | Backend | Xác thực mạnh mẽ, Storage ổn định, Database thời gian thực. |
| **Framer Motion** | Animation | Hiệu ứng chuyển cảnh, thanh tiến trình Flash Sale và Gallery ảnh mượt mà. |

---

## 🔐 4. An toàn & Bảo mật Dữ liệu

1. **Server-side Verification:** Giá sản phẩm và phí vận chuyển luôn được kiểm tra lại trên Server trước khi tạo đơn hàng, chống gian lận giá sale.
2. **Row Level Security:** Đảm bảo người dùng không thể can thiệp vào bài viết hoặc đơn hàng của người khác.
3. **Secure Proxy:** Quản lý session người dùng thông qua tầng Proxy bảo mật của Next.js 16.

---

## 🚀 5. Hướng dẫn Cài đặt & Khởi chạy

### Yêu cầu tiên quyết:
- Node.js 20+ và tài khoản Supabase.

### Các bước thực hiện:
1. **Khởi tạo:** `git clone https://github.com/NgDucNguyen1199/PhoGear.git`
2. **Cài đặt:** `npm install`
3. **Biến môi trường:** Cấu hình `NEXT_PUBLIC_SUPABASE_URL` và `ANON_KEY` trong `.env.local`.
4. **Database:** Chạy toàn bộ script trong thư mục `/supabase` (Đặc biệt là `forum_schema.sql`, `products_storage.sql` và `flash_sale_settings.sql`).
5. **Chạy thử:** `npm run dev`

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
