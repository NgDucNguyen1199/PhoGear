# BÁO CÁO DỰ ÁN: XÂY DỰNG HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ VÀ TRẢI NGHIỆM NGƯỜI DÙNG CHUYÊN BIỆT PHOGEAR

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

**PhoGear** là một ứng dụng web Fullstack hiện đại, được thiết kế nhằm tối ưu hóa quy trình thương mại điện tử trong thị trường ngách là thiết bị ngoại vi cao cấp (Mechanical Keyboards). Dự án tích hợp các module tương tác nâng cao như **PhoType** (Typing Engine), **Forum Hub** (Diễn đàn cộng đồng) và hệ thống bảo mật đa lớp (**Multi-Factor Authentication - MFA**). Hệ thống tận dụng sức mạnh của kiến trúc **Next.js 16** với cơ chế **Proxy** (Middleware mới) và **Turbopack** để đảm bảo hiệu suất và bảo mật dữ liệu tuyệt đối.

---

## 🏛️ 1. Kiến trúc Hệ thống (System Architecture)

### 1.1 Tầng Giao diện & Xử lý (Frontend & Logic)
- **Next.js 16 (App Router):** Sử dụng Turbopack để tối ưu tốc độ build. Triển khai cơ chế **Proxy** (`proxy.ts`) chuẩn hóa theo convention mới để quản lý session và bảo mật.
- **Server Actions:** Xử lý nghiệp vụ phức tạp trực tiếp trên server (MFA, Forum Moderation, Order Verification, Product Management).
- **State Management:** Sử dụng **Zustand** với cơ chế Persist để duy trì giỏ hàng và danh sách yêu thích giữa các phiên làm việc.
- **PWA Support:** Hỗ trợ Offline mode và trải nghiệm như ứng dụng di động trên smartphone.

### 1.2 Tầng Hạ tầng & Cơ sở dữ liệu (Backend & Database)
- **Supabase BaaS:** Hạt nhân lưu trữ và xác thực.
- **Cloudinary Integration:** Tự động tối ưu hóa, nén và thay đổi kích thước hình ảnh thông qua CDN để giảm tải băng thông và tăng tốc độ tải trang.

---

## ✨ 2. Các Module Chức năng Cốt lõi

### 🛒 2.1 Module Thương mại điện tử (E-commerce Core)
- **Hệ thống Flash Sale 3.0:** Quản lý chương trình khuyến mãi giờ vàng với bộ đếm ngược thời gian thực.
- **Chính sách Vận chuyển Thông minh:** Tự động tính phí vận chuyển và áp dụng **Freeship cho đơn từ 800,000đ**.
- **Xác thực Đơn hàng:** Kiểm tra giá và phí vận chuyển tại Server để chống gian lận.

### 📱 2.2 Tối ưu hóa Trải nghiệm Người dùng (UX/UI Evolution)
- **Mobile Responsive 2.0:** Giao diện được thiết kế lại hoàn toàn cho thiết bị di động với Mobile Menu Slide-out và Search Overlay chuyên dụng.
- **Dark Mode Support:** Hỗ trợ chế độ tối (Dark Mode) giúp bảo vệ mắt và tiết kiệm pin trên các thiết bị màn hình OLED.
- **Personalized Recommendations:** Hệ thống gợi ý sản phẩm dựa trên sở thích và lịch sử xem của người dùng.

### 🛡️ 2.3 Bảo mật & Quản trị nâng cao
- **Multi-Factor Authentication (MFA):** Bảo vệ tài khoản bằng mã TOTP (Google Authenticator/Authy).
- **Automated Testing Suite:** Hệ thống kiểm thử tự động với **Vitest** và **React Testing Library**, bao phủ các luồng quan trọng như Checkout, MFA và SKU generation.

---

## 🛠️ 3. Phân tích Kỹ thuật & Công nghệ

| Công nghệ | Vai trò trong hệ thống | Ưu điểm chính |
| :--- | :--- | :--- |
| **Next.js 16** | Framework chính | Hiệu năng vượt trội, cơ chế Proxy bảo mật và Turbopack build thần tốc. |
| **Vitest** | Automated Testing | Tốc độ chạy test cực nhanh, tương thích hoàn hảo với Next.js 16. |
| **Cloudinary** | Image Delivery | Tự động chọn định dạng (WebP/AVIF) và chất lượng phù hợp nhất (f_auto, q_auto). |
| **Tailwind CSS 4** | Styling | Kiến trúc CSS hiện đại, tối ưu hóa kích thước file bundle. |

---

## 🔐 4. An toàn & Bảo mật Dữ liệu

1. **Server-side Verification:** Chống gian lận giá sale bằng cách xác thực tại Server Actions.
2. **Secure Proxy:** Quản lý session người dùng thông qua tầng Proxy bảo mật của Next.js 16.
3. **MFA Enforcement:** Bắt buộc xác thực 2 lớp cho các thao tác nhạy cảm và quyền Admin.

---

## 🚀 5. Hướng dẫn Cài đặt & Khởi chạy

### Yêu cầu tiên quyết:
- Node.js 20+ và tài khoản Supabase, Cloudinary.

### Các bước thực hiện:
1. **Khởi tạo:** `git clone https://github.com/NgDucNguyen1199/PhoGear.git`
2. **Cài đặt:** `npm install`
3. **Biến môi trường:** Cấu hình các biến trong `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (Tùy chọn cho image optimization)
4. **Kiểm thử:** `npm test` để chạy toàn bộ suite test tự động.
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
