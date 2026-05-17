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

**PhoGear** là một ứng dụng web Fullstack hiện đại, được thiết kế nhằm tối ưu hóa quy trình thương mại điện tử trong thị trường ngách là thiết bị ngoại vi cao cấp (Mechanical Keyboards). Dự án không chỉ dừng lại ở một nền tảng bán hàng truyền thống mà còn tích hợp các module tương tác nâng cao như **PhoType** (Typing Engine) và hệ thống bảo mật đa lớp (**Multi-Factor Authentication - MFA**). Hệ thống tận dụng sức mạnh của kiến trúc **Server-side Rendering (SSR)** và **Edge Computing** để đảm bảo tốc độ truy cập tối ưu và tính toàn vẹn dữ liệu ở quy mô lớn.

---

## 🏛️ 1. Kiến trúc Hệ thống (System Architecture)

Hệ thống được xây dựng trên mô hình kiến trúc **Modern Web Stack**, tách biệt rõ rệt giữa giao diện người dùng và logic nghiệp vụ:

### 1.1 Tầng Giao diện & Xử lý (Frontend & Logic)
- **Next.js 15 (App Router):** Sử dụng mô hình Hybrid Rendering (kết hợp Client và Server Components) để tối ưu hóa hiệu năng và SEO.
- **Server Actions:** Xử lý các tác vụ đột biến dữ liệu trực tiếp trên server, giảm thiểu mã nguồn phía client và tăng cường bảo mật.
- **State Management:** Sử dụng **Zustand** để quản lý trạng thái giỏ hàng và danh sách yêu thích với cơ chế Persist dữ liệu dưới Local Storage.

### 1.2 Tầng Hạ tầng & Cơ sở dữ liệu (Backend & Database)
- **Supabase BaaS:** Đóng vai trò là hạt nhân của hệ thống backend.
  - **PostgreSQL:** Hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ với tính năng Row Level Security (RLS).
  - **Supabase Auth:** Quản lý vòng đời người dùng và xác thực bảo mật.
  - **Supabase Storage:** Lưu trữ và phục vụ tài nguyên đa phương tiện (hình ảnh sản phẩm, âm thanh switch).

---

## ✨ 2. Các Module Chức năng Cốt lõi

### 🛒 2.1 Module Thương mại điện tử (E-commerce Core)
Hệ thống quản lý sản phẩm dựa trên cấu trúc **Product-Variant**, cho phép mỗi sản phẩm gốc có nhiều phiên bản linh kiện (Switch, Layout, Color) với mức giá và tồn kho riêng biệt. Quy trình thanh toán được thiết kế tối giản nhưng vẫn đảm bảo đầy đủ các bước xác thực thông tin vận chuyển.

### 🎮 2.2 Trình mô phỏng Luyện gõ (Typing Engine - PhoType)
Một module đặc biệt được thiết kế để phân tích kỹ năng người dùng. Sử dụng thuật toán so khớp chuỗi thời gian thực để tính toán các chỉ số:
- **WPM (Words Per Minute):** Tốc độ gõ phím chuẩn hóa.
- **Accuracy:** Độ chính xác dựa trên tỷ lệ lỗi ký tự.
- **Persistence:** Kết quả được lưu trữ vào hệ thống Bảng vàng (Typing Scores) để theo dõi tiến trình cá nhân.

### 🛡️ 2.3 Hệ thống Bảo mật & Quản trị (Security & Admin)
- **Xác thực 2 lớp (MFA):** Tích hợp tiêu chuẩn bảo mật cao cấp nhất của Supabase, cho phép người dùng sử dụng ứng dụng xác thực (Authenticator App) qua giao thức **TOTP**.
- **Admin Dashboard:** Cung cấp công cụ quản trị toàn diện từ quản lý danh mục, đơn hàng đến phân tích lịch sử đăng nhập hệ thống nhằm phát hiện các hành vi bất thường.

---

## 🛠️ 3. Phân tích Kỹ thuật & Công nghệ

| Công nghệ | Vai trò trong hệ thống | Lý do lựa chọn |
| :--- | :--- | :--- |
| **TypeScript** | Ngôn ngữ phát triển | Đảm bảo tính nhất quán của dữ liệu (Type Safety) và giảm thiểu 90% lỗi logic trong quá trình phát triển. |
| **React 19** | Thư viện UI | Cung cấp các tính năng Concurrent Rendering mới nhất, giúp giao diện phản hồi mượt mà hơn. |
| **Tailwind CSS** | Styling | Xây dựng giao diện Responsive nhanh chóng dựa trên hệ thống Utility-first, tối ưu kích thước file CSS. |
| **Shadcn UI** | UI Components | Thư viện component được thiết kế theo tiêu chuẩn Accessibility (WAI-ARIA). |
| **Zod** | Validation | Xác thực dữ liệu đầu vào nghiêm ngặt từ cả phía Client và Server. |

---

## 🔐 4. An toàn & Bảo mật Dữ liệu

Dự án tuân thủ nghiêm ngặt các nguyên tắc bảo mật hiện đại:
1. **Row Level Security (RLS):** Thiết lập các chính sách truy cập dữ liệu trực tiếp trong database, đảm bảo người dùng chỉ có thể truy cập dữ liệu của chính họ.
2. **JWT & Session Management:** Quản lý phiên làm việc thông qua token được mã hóa và lưu trữ an toàn trong HttpOnly Cookies.
3. **Audit Logging:** Hệ thống tự động ghi lại lịch sử đăng nhập (IP, User Agent) để phục vụ mục đích kiểm tra và bảo mật.

---

## 🚀 5. Hướng dẫn Cài đặt & Khởi chạy

### Yêu cầu tiên quyết:
- Node.js phiên bản 18.x trở lên.
- Một dự án Supabase đã được cấu hình.

### Các bước thực hiện:
1. **Khởi tạo mã nguồn:**
   ```bash
   git clone https://github.com/NgDucNguyen1199/PhoGear.git
   cd PhoGear
   ```

2. **Cài đặt thư viện phụ thuộc:**
   ```bash
   npm install
   ```

3. **Thiết lập biến môi trường:**
   Tạo tệp `.env.local` với cấu trúc sau:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Triển khai Cơ sở dữ liệu:**
   Truy cập mục **SQL Editor** trong Supabase Dashboard, sao chép và chạy nội dung tệp `supabase/schema.sql` để khởi tạo cấu trúc bảng và chính sách bảo mật.

5. **Khởi chạy môi trường phát triển:**
   ```bash
   npm run dev
   ```

---

## 🎓 6. Kết luận & Hướng phát triển

Dự án **PhoGear** đã thành công trong việc xây dựng một hệ sinh thái thương mại điện tử chuyên sâu cho cộng đồng bàn phím cơ. Trong tương lai, hệ thống sẽ tiếp tục được nâng cấp với các tính năng:
- **Real-time Chat:** Hỗ trợ tư vấn khách hàng trực tiếp qua WebSocket.
- **AI Recommendation:** Gợi ý sản phẩm dựa trên hành vi mua sắm và sở thích gõ phím của người dùng.
- **Progressive Web App (PWA):** Tối ưu hóa trải nghiệm trên thiết bị di động như một ứng dụng native.

---

## 👤 Thông tin Tác giả

- **Họ và tên:** Nguyễn Đức Nguyên
- **Mã số sinh viên:** 2212429
- **Trường:** Đại học Đà Lạt
- **Email:** [2212429@dlu.edu.vn](mailto:2212429@dlu.edu.vn)
- **Github:** [NgDucNguyen1199](https://github.com/NgDucNguyen1199)

---
<div align="center">
  <p>© 2026 PHO GEAR PROJECT - ALL RIGHTS RESERVED.</p>
</div>
