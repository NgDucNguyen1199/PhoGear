# BÁO CÁO DỰ ÁN: XÂY DỰNG HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ VÀ TRẢI NGHIỆM NGƯỜI DÙNG CHUYÊN BIỆT PHOGEAR

<div align="center">
  <img src="public/logo_main.png" alt="PhoGear Logo" width="220" />
  <p><strong>Nền tảng Fullstack tích hợp Giải pháp Thương mại điện tử và Công cụ Phân tích Kỹ năng Luyện gõ phím.</strong></p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-15.0_App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Supabase-Backend_as_a_Service-green?style=for-the-badge&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/TypeScript-Strict_Type_Safety-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-Modern_UI-06B6D4?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  </div>
</div>

---

## 📑 Tóm tắt dự án (Abstract)

**PhoGear** là một ứng dụng web Fullstack hiện đại, được thiết kế nhằm tối ưu hóa quy trình thương mại điện tử trong thị trường ngách là thiết bị ngoại vi cao cấp (Mechanical Keyboards). Dự án tích hợp các module tương tác nâng cao như **PhoType** (Typing Engine), công cụ trắc nghiệm **Keyboard Finder** và hệ thống bảo mật đa lớp (**Multi-Factor Authentication - MFA**). Hệ thống tận dụng sức mạnh của kiến trúc **Server-side Rendering (SSR)** và **Edge Computing** để đảm bảo tốc độ truy cập tối ưu và tính bảo mật dữ liệu tuyệt đối.

---

## 🏛️ 1. Kiến trúc Hệ thống (System Architecture)

Hệ thống được xây dựng trên mô hình kiến trúc **Modern Web Stack**, tách biệt rõ rệt giữa giao diện người dùng và logic nghiệp vụ:

### 1.1 Tầng Giao diện & Xử lý (Frontend & Logic)
- **Next.js 15 (App Router):** Sử dụng mô hình Hybrid Rendering để tối ưu hóa hiệu năng.
- **Server Actions:** Xử lý đột biến dữ liệu an toàn trực tiếp trên server (MFA, Profile Updates, Order Search).
- **State Management:** Sử dụng **Zustand** kết hợp cơ chế Persist để quản lý giỏ hàng và danh sách yêu thích (Wishlist).

### 1.2 Tầng Hạ tầng & Cơ sở dữ liệu (Backend & Database)
- **Supabase BaaS:** Hạt nhân lưu trữ và xác thực.
  - **PostgreSQL:** Cơ sở dữ liệu quan hệ với Row Level Security (RLS) nghiêm ngặt.
  - **Supabase Auth:** Triển khai **MFA (TOTP)** chuẩn công nghiệp.
  - **Supabase Storage:** Quản lý tài nguyên đa phương tiện và ảnh đại diện (Avatar) người dùng.

---

## ✨ 2. Các Module Chức năng Cốt lõi

### 🛒 2.1 Module Thương mại điện tử (E-commerce Core)
- **Quản lý Sản phẩm Biến thể:** Hệ thống Product-Variant linh hoạt cho phép tùy biến linh kiện.
- **Bộ lọc & Tìm kiếm Nâng cao:** Tích hợp thanh trượt (Drawer) cho sản phẩm và hệ thống tìm kiếm đa năng (Search/Filter/Sort) cho lịch sử đơn hàng.
- **Giỏ hàng & Wishlist:** Trải nghiệm mua sắm liền mạch với khả năng đồng bộ dữ liệu thời gian thực.

### 🎮 2.2 Trình mô phỏng & Trắc nghiệm (User Experience)
- **Keyboard Finder:** Công cụ trắc nghiệm thông minh tích hợp ngay tại trang chủ giúp định hướng sản phẩm cho người dùng.
- **PhoType Engine:** Trò chơi luyện gõ phím chuyên nghiệp, phân tích tốc độ (WPM) và độ chính xác (Accuracy).

### 🛡️ 2.3 Bảo mật & Cá nhân hóa (Security & Profile)
- **Xác thực 2 lớp (MFA):** Bảo vệ tài khoản tuyệt đối qua mã xác thực 6 số (TOTP) từ điện thoại.
- **Profile Dashboard:** Giao diện cá nhân hóa với khả năng tải lên ảnh đại diện, đổi mật khẩu và quản lý đơn hàng chuyên sâu.
- **Login History:** Hệ thống ghi lại lịch sử truy cập (IP, Thiết bị) phục vụ mục đích giám sát bảo mật cho quản trị viên.

---

## 🛠️ 3. Phân tích Kỹ thuật & Công nghệ

| Công nghệ | Vai trò trong hệ thống | Ưu điểm chính |
| :--- | :--- | :--- |
| **TypeScript** | Ngôn ngữ phát triển | Type Safety, giảm thiểu 90% lỗi logic runtime. |
| **Tailwind CSS** | Styling | Utility-first, giao diện Responsive mượt mà trên mọi thiết bị. |
| **Base UI** | UI Library | Thành phần giao diện tuân thủ chuẩn Accessibility (Popover, Dialog, Sheet). |
| **Framer Motion** | Animation | Hiệu ứng chuyển động cao cấp cho các Tab và Modal. |

---

## 🔐 4. An toàn & Bảo mật Dữ liệu

1. **Row Level Security (RLS):** Người dùng chỉ có quyền truy cập và sửa đổi dữ liệu thuộc sở hữu cá nhân.
2. **MFA Enforcement:** Tùy chọn bắt buộc xác thực 2 lớp đối với tài khoản quản trị viên.
3. **Secure Storage:** Ảnh đại diện được lưu trữ trong bucket riêng tư, chỉ cho phép truy cập qua Public URL an toàn.

---

## 🚀 5. Hướng dẫn Cài đặt & Khởi chạy

### Yêu cầu tiên quyết:
- Node.js 18+ và tài khoản Supabase.

### Các bước thực hiện:
1. **Khởi tạo:** `git clone https://github.com/NgDucNguyen1199/PhoGear.git`
2. **Cài đặt:** `npm install`
3. **Biến môi trường:** Cấu hình `NEXT_PUBLIC_SUPABASE_URL` và `ANON_KEY` trong `.env.local`.
4. **Database:** Chạy script trong thư mục `/supabase` (ưu tiên `schema.sql`).
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
