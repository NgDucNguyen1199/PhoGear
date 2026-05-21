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
  - **Real-time Inventory:** Tích hợp **Supabase Realtime** tự động cập nhật tồn kho sản phẩm và biến thể (variants) ngay lập tức.
  - **Optimistic UI:** Sử dụng `useOptimistic` (React 19) cho các hành động tương tác như **Thả tim bài viết** và **Mở giỏ hàng tức thì**.
  - **Deep Skeleton Loading:** Thiết kế Skeleton khớp 1:1 với Layout của Product Card, loại bỏ hiện tượng nhảy giao diện (Layout Shift).
  - **Adaptive Theme:** Tối ưu hóa hiển thị cho cả **Light & Dark Mode** trên toàn bộ module PhoType.

### 1.2 Tầng Hạ tầng & Cơ sở dữ liệu (Backend & Database)
- **Supabase BaaS:** Cung cấp hệ thống xác thực (Auth), cơ sở dữ liệu thời gian thực (Realtime DB) và lưu trữ tệp tin (Storage).
- **PostgreSQL:** Hệ quản trị CSDL quan hệ mạnh mẽ với cơ chế **Row Level Security (RLS)** phân quyền dữ liệu đến từng dòng.

---

## 🗄️ 2. Mô hình Dữ liệu (Database Schema)

Hệ thống sử dụng cấu trúc CSDL quan hệ được thiết kế tối ưu cho thương mại điện tử và mạng xã hội thu nhỏ:

### 2.1 Các thực thể chính
- **Profiles:** Mở rộng từ `auth.users`, lưu trữ thông tin người dùng (`full_name`, `avatar_url`, `role`).
- **Products & Variants:** Quản lý tồn kho chính xác cho từng phiên bản sản phẩm (switch, màu sắc).
- **Coupons:** Quản lý mã giảm giá với các ràng buộc đa tầng.
- **Orders & Order Items:** Tích hợp logic **trừ kho khi mua** và **hoàn kho khi hủy đơn**.
- **Post Likes & Notifications:** Hệ thống tương tác cộng đồng và thông báo thời gian thực.
- **Typing Scores:** Lưu trữ kỷ lục luyện gõ phím phục vụ bảng xếp hạng.

---

## ✨ 3. Các Module Chức năng Cốt lõi

### 🛒 3.1 Thương mại điện tử Nâng cao
- **Precise Inventory Management:** Hệ thống tự động khấu trừ tồn kho cho cả sản phẩm chính và biến thể cụ thể khi đặt hàng thành công.
- **Smart Stock Restoration:** Tự động hoàn trả số lượng vào kho nếu đơn hàng bị hủy bởi Admin hoặc người dùng.
- **Hệ thống Mã giảm giá (Coupons):** 
  - Hỗ trợ đa dạng loại giảm giá: Giảm theo phần trăm (%), giảm số tiền cố định (VND) hoặc Miễn phí vận chuyển (Freeship).
  - Thiết lập điều kiện linh hoạt: Đơn hàng tối thiểu, mức giảm tối đa, giới hạn lượt dùng và thời gian hiệu lực.

### 🔔 3.2 Notification Center (Thời gian thực)
- **Instant Alerts:** Người dùng nhận được thông báo ngay lập tức khi trạng thái đơn hàng thay đổi (Shipped, Delivered) hoặc có tương tác mới.
- **In-app UI:** Trung tâm thông báo tích hợp ngay trên Navbar với hiệu ứng "glowing" cho các tin nhắn chưa đọc.

### 🎮 3.3 Trải nghiệm Người dùng (Gamification)
- **PhoType Engine:** Trình luyện gõ phím chuyên sâu, đo lường WPM và độ chính xác.
  - **Horizontal Global Leaderboard:** Bảng xếp hạng 10fastfingers-style với các bộ lọc: Tất cả thời gian, Theo tháng và Theo tuần.
  - **Personal Insights:** Biểu đồ đường (Line Chart) theo dõi tiến bộ kỹ năng qua thời gian.

---

## 🚀 6. Hướng dẫn Cài đặt & Khởi chạy

### Các bước:
1. **Clone & Setup:** `git clone ...` và `npm install`
2. **Database Setup:** 
   Truy cập **SQL Editor** trong Supabase Dashboard và chạy các tệp tin theo thứ tự:
   - Chạy `supabase/schema.sql` (Cấu trúc nền tảng)
   - Chạy `supabase/coupons_schema.sql` (Hệ thống mã giảm giá)
   - Chạy `supabase/forum_schema.sql` & `supabase/forum_likes.sql` (Hệ thống diễn đàn)
   - Chạy `supabase/typing_scores_schema.sql` (Hệ thống bảng xếp hạng)
   - Chạy `supabase/notifications_schema.sql` (Trung tâm thông báo)
   - Chạy `supabase/add_variant_id_to_order_items.sql` (Quản lý tồn kho biến thể)
   - Chạy `supabase/seed.sql` để có dữ liệu mẫu.

---

<div align="center">
  <p>© 2026 PHO GEAR PROJECT - ALL RIGHTS RESERVED.</p>
</div>
