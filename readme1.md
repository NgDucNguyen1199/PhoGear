# NHẬT KÝ PHÁT TRIỂN: CÁC THÁCH THỨC VÀ GIẢI PHÁP KỸ THUẬT

Tài liệu này ghi lại các vấn đề quan trọng phát sinh trong quá trình xây dựng hệ thống PhoGear và các giải pháp đã được áp dụng.

---

## 🔐 1. Hệ thống Xác thực & Bảo mật

### 1.1. Lỗi tự động đăng xuất (Admin Session)
- **Vấn đề:** Admin bị đăng xuất đột ngột khi chuyển đổi giữa các trang quản trị và trang chủ.
- **Nguyên nhân:** File Middleware không được Next.js nhận diện do đặt tên sai (`proxy.ts`).
- **Giải quyết:** Đã chuẩn hóa quy trình xác thực thông qua `src/middleware.ts` (hoặc cấu hình Proxy tương đương) để đảm bảo session luôn được làm mới.

### 1.2. Xác thực đa yếu tố (MFA)
- **Vấn đề:** Đồng bộ hóa cấp độ xác thực (AAL) giữa Supabase Auth và các Server Actions bảo mật.
- **Giải quyết:** Triển khai middleware kiểm tra `aal` và xây dựng trang Setup MFA chuyên biệt.

---

## 📊 2. Quản lý Dữ liệu & Database

### 2.1. Chính sách bảo mật hàng (RLS)
- **Vấn đề:** Các bảng có quan hệ phụ thuộc (như `order_items`) gặp khó khăn trong việc thiết lập chính sách truy cập dựa trên chủ sở hữu đơn hàng.
- **Giải quyết:** Sử dụng các Sub-queries SQL phức tạp (`EXISTS`) trong định nghĩa RLS để kiểm tra quyền truy cập xuyên suốt các bảng liên quan.

### 2.2. Tồn kho biến thể thời gian thực
- **Vấn đề:** Đảm bảo số lượng tồn kho của từng loại Switch/Màu sắc được cập nhật chính xác tuyệt đối khi có đơn hàng mới hoặc đơn hàng bị hủy.
- **Giải quyết:** Xây dựng hệ thống Trigger và Function trong PostgreSQL để tự động hóa việc tính toán và khấu trừ kho.

---

## ⚡ 3. Hiệu suất & Trải nghiệm Người dùng (UX)

### 3.1. Tối ưu hóa Cumulative Layout Shift (CLS)
- **Vấn đề:** Giao diện bị "nhảy" khi dữ liệu từ Supabase được tải về và render.
- **Giải quyết:** Sử dụng giải pháp **Deep Skeleton Loading**, tạo ra các khung xương (Skeletons) có kích thước và cấu trúc khớp hoàn toàn với component thật.

### 3.2. Âm thanh tương tác trong PhoType
- **Vấn đề:** Âm thanh gõ phím bị trễ hoặc không đồng bộ với thao tác của người dùng.
- **Giải quyết:** Sử dụng thư viện `use-sound` với cơ chế `preload` và tối ưu hóa React state để giảm thiểu độ trễ xử lý.

---

## 🌐 4. Môi trường và Triển khai

### 4.1. Quản lý Biến môi trường
- **Vấn đề:** Các biến `NEXT_PUBLIC_*` không khả dụng ở một số môi trường Server-side.
- **Giải quyết:** Thiết lập cơ chế kiểm tra (Validation) nghiêm ngặt tại điểm khởi tạo Supabase Client.

### 4.2. Giới hạn Payload của Server Actions
- **Vấn đề:** Không thể tải lên các tệp tin hình ảnh sản phẩm lớn (trên 1MB).
- **Giải quyết:** Cấu hình `serverActions.bodySizeLimit: '10mb'` trong `next.config.ts`.

---
*Tài liệu này phục vụ cho việc bảo trì và chuyển giao dự án.*
