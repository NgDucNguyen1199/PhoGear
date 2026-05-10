# ⌨️ PhoGear - Mechanical Keyboard E-commerce & Typing Experience

<div align="center">
  <img src="public/logo_main.png" alt="PhoGear Logo" width="180" />
  <p><strong>Nền tảng thương mại điện tử chuyên biệt cho cộng đồng phím cơ, tích hợp trải nghiệm luyện gõ đỉnh cao.</strong></p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Supabase-Full_Backend-green?style=for-the-badge&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-blue?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
    <img src="https://img.shields.io/badge/TypeScript-Strict_Mode-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  </div>
</div>

---

## 📖 1. Tổng quan dự án (Project Overview)
**PhoGear** là một dự án Fullstack Web Application được thiết kế dành riêng cho thị trường ngách là bàn phím cơ (Mechanical Keyboard). Khác với các trang web thương mại điện tử phổ thông, PhoGear tập trung vào tính **cá nhân hóa** sản phẩm thông qua hệ thống quản lý biến thể phức tạp và xây dựng **trải nghiệm người dùng tương tác** thông qua tính năng Sound Test và Typing Game.

Dự án sử dụng kiến trúc **Server-side Rendering (SSR)** với Next.js giúp tối ưu SEO và tốc độ tải trang, kết hợp cùng **Supabase** để quản lý dữ liệu thời gian thực.

---

## 🎯 2. Mục tiêu dự án (Project Goals)
- **Giải quyết bài toán tùy biến**: Xây dựng luồng mua hàng cho phép khách hàng chọn chi tiết từng linh kiện (Switch, Plate, Case).
- **Tăng cường tương tác**: Không chỉ bán hàng, dự án còn là nơi người dùng có thể giải trí và kiểm tra kỹ năng gõ phím.
- **Tối ưu quản trị**: Cung cấp công cụ quản lý kho hàng và theo dõi doanh thu trực quan cho Admin.
- **Trình diễn kỹ năng**: Áp dụng các công nghệ mới nhất như Next.js App Router, Server Actions và Row Level Security (RLS) để xây dựng một ứng dụng thực tế, bảo mật cao.

---

## 📍 3. Mục lục (Table of Contents)
- [✨ Các tính năng chính](#-các-tính-năng-chính-key-features)
- [🔍 Phân tích chức năng](#-phân-tích-chức-năng-functional-analysis)
- [🛠 Tech Stack](#-tech-stack)
- [📂 Cấu trúc dự án](#-cấu-trúc-dự-án)
- [🚀 Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
- [👤 Thông tin liên hệ](#-thông-tin-liên-hệ)

---

## ✨ 4. Các tính năng chính (Key Features)

- 🛒 **E-commerce Core**: Giỏ hàng, Wishlist, tìm kiếm nâng cao và quy trình thanh toán mượt mà.
- 🧩 **Variant Manager**: Hệ thống quản lý linh kiện thông minh, tự động ghép SKU dựa trên lựa chọn của khách hàng.
- 🎮 **Typing Test Game**: Trình mô phỏng luyện gõ phím chuyên nghiệp, tính toán chỉ số WPM và độ chính xác.
- 📊 **Admin Dashboard**: Quản lý toàn diện sản phẩm, danh mục, đơn hàng và thống kê tài chính.
- 🌍 **Multi-language**: Hỗ trợ chuyển đổi ngôn ngữ (i18n) giữa Tiếng Việt và Tiếng Anh.
- 🔐 **Bảo mật**: Xác thực người dùng qua Supabase Auth và phân quyền truy cập dữ liệu qua RLS.

---

## 🔍 5. Phân tích chức năng (Functional Analysis)

### A. Hệ thống Thương mại điện tử
- **Quản lý sản phẩm biến thể**: Sản phẩm được phân cấp từ Sản phẩm gốc -> Phiên bản (Variants). Mỗi biến thể có giá, kho và hình ảnh riêng.
- **Sound Test Integration**: Mỗi sản phẩm hoặc loại switch đều đính kèm file âm thanh thực tế, giúp người dùng "nghe" trước khi mua.
- **Hệ thống lọc (Filtering)**: Lọc đa tầng theo loại kết nối (Wired/Wireless), Layout (60%, 75%, Fullsize), và cảm giác gõ (Linear, Tactile).

### B. Typing Game Engine (Photype)
- **Logic tính toán**: Sử dụng thuật toán so khớp chuỗi để tính toán độ chính xác và tốc độ gõ (Words Per Minute).
- **Gamification**: Người dùng đã đăng nhập có thể lưu lại kỷ lục cá nhân, xem lịch sử tiến bộ qua các lần chơi.

### C. Quản trị viên (Back-office)
- **Inventory Management**: Cảnh báo khi sản phẩm sắp hết hàng.
- **Revenue Analytics**: Biểu đồ hóa dữ liệu doanh thu giúp Admin đưa ra quyết định nhập hàng chính xác.

---

## 🛠 6. Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | **Next.js 15 (App Router)** | Rendering tối ưu, Server Actions cho backend logic. |
| **Language** | **TypeScript** | Đảm bảo tính nhất quán của dữ liệu và giảm thiểu lỗi runtime. |
| **Styling** | **Tailwind CSS + Shadcn UI** | Giao diện hiện đại, responsive và dễ tùy biến. |
| **State** | **Zustand** | Quản lý trạng thái giỏ hàng và wishlist nhẹ nhàng, hiệu quả. |
| **Backend** | **Supabase** | PostgreSQL, Authentication và Storage cho hình ảnh/âm thanh. |
| **Validation** | **Zod** | Xác thực dữ liệu đầu vào cho cả Client và Server. |

---

## 📂 7. Cấu trúc dự án (Directory Structure)
```text
src/
├── actions/      # Logic nghiệp vụ (Server-side logic)
├── app/         # Routes, Layouts và Pages
├── components/  # Reusable UI components
│   ├── admin/   # Giao diện quản trị
│   ├── shop/    # Giao diện bán hàng
│   └── photype/ # Logic trò chơi luyện gõ
├── lib/         # Cấu hình Supabase, i18n và Utils
├── store/       # Quản lý Global State (Zustand)
└── types/       # Định nghĩa kiểu dữ liệu (Interfaces)
```

---

## 🚀 8. Hướng dẫn cài đặt (Installation)

1. **Clone dự án:**
   ```bash
   git clone https://github.com/yourusername/phogear.git
   cd phogear
   ```

2. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường:**
   Tạo file `.env.local` và điền thông tin từ dự án Supabase của bạn:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Chạy ứng dụng:**
   ```bash
   npm run dev
   ```

---

## 👤 9. Thông tin liên hệ (Contact/Author)
- **Tác giả**: [Tên của bạn]
- **Email**: [Email của bạn]
- **LinkedIn**: [Link LinkedIn]
- **Github**: [Link Github]

---
<div align="center">
  <p>Cảm ơn bạn đã ghé thăm PhoGear! Hãy ủng hộ dự án bằng cách tặng một ⭐️ nhé!</p>
</div>
