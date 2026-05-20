# Các khó khăn và lỗi gặp phải trong quá trình xây dựng PhoGear

Dưới đây là danh sách các thách thức kỹ thuật và các lỗi quan trọng đã gặp phải và cách giải quyết trong suốt quá trình phát triển dự án.

## 1. Hệ thống Xác thực & Quản lý Phiên (Authentication & Session)
*   **Lỗi tự động đăng xuất (Admin Auto-Logout):**
    *   *Khó khăn:* Admin thường xuyên bị đăng xuất khi quay lại trang chủ từ trang quản trị.
    *   *Nguyên nhân:* Tệp Middleware bị đặt tên sai thành `proxy.ts`, khiến Next.js không nhận diện và không thực hiện làm mới (refresh) session của Supabase.
    *   *Giải quyết:* Đổi tên thành `src/middleware.ts` và chuẩn hóa hàm `middleware` theo đúng tiêu chuẩn của Next.js.
*   **Xác thực đa lớp (MFA):**
    *   *Khó khăn:* Việc đồng bộ giữa trạng thái đăng nhập AAL1 (mật khẩu) và AAL2 (TOTP) của Supabase để bảo vệ các route nhạy cảm.
    *   *Giải quyết:* Xây dựng trang kiểm tra MFA riêng biệt và tích hợp kiểm tra cấp độ xác thực trong Server Actions.

## 2. Quản lý Dữ liệu & Database (Supabase)
*   **Row Level Security (RLS) phức tạp:**
    *   *Khó khăn:* Thiết lập chính sách RLS cho các bảng có mối quan hệ phức tạp (như `order_items` phụ thuộc vào `orders`).
    *   *Giải quyết:* Sử dụng các câu lệnh `EXISTS` trong SQL để kiểm tra quyền truy cập dựa trên ID người dùng và vai trò admin.
*   **Xử lý tồn kho biến thể (Variants Inventory):**
    *   *Khó khăn:* Tính toán tổng số lượng tồn kho của một sản phẩm dựa trên nhiều biến thể khác nhau (màu sắc, switch) một cách chính xác theo thời gian thực.
    *   *Giải quyết:* Viết các hàm SQL và trigger để tự động cập nhật số lượng tồn kho tổng khi có thay đổi ở bảng biến thể.

## 3. Hiệu suất & Trải nghiệm người dùng (UX/UI)
*   **Tối ưu hóa hình ảnh:**
    *   *Khó khăn:* Việc hiển thị danh sách sản phẩm lớn với hình ảnh chất lượng cao gây chậm trang.
    *   *Giải quyết:* Sử dụng component `next/image` với cơ chế lazy loading và remote patterns để tối ưu dung lượng ảnh từ Supabase Storage.
*   **Đồng bộ trạng thái Giỏ hàng:**
    *   *Khó khăn:* Giỏ hàng bị mất dữ liệu khi người dùng F5 trang.
    *   *Giải quyết:* Sử dụng **Zustand** kết hợp với Middleware `persist` để lưu trữ dữ liệu giỏ hàng vào `localStorage`.

## 4. Tính năng đặc thù (PhoType & Keyboard Finder)
*   **Độ trễ trong Typing Engine:**
    *   *Khó khăn:* Xử lý sự kiện phím nhấn trong trò chơi luyện gõ để đảm bảo tính thời gian thực và độ chính xác cao.
    *   *Giải quyết:* Tối ưu hóa việc render bằng cách hạn chế cập nhật state không cần thiết và sử dụng các hook tối ưu trong React.
*   **Xử lý âm thanh tương tác:**
    *   *Khó khăn:* Âm thanh gõ phím (clicky, linear) đôi khi bị trễ hoặc chồng chéo.
    *   *Giải quyết:* Sử dụng thư viện `use-sound` với cơ chế pre-loading âm thanh.

## 5. Môi trường phát triển (Deployment & Env)
*   **Lỗi biến môi trường:**
    *   *Khó khăn:* Các biến `NEXT_PUBLIC_SUPABASE_URL` đôi khi không được nhận diện trong môi trường production hoặc server-side.
    *   *Giải quyết:* Kiểm tra nghiêm ngặt sự tồn tại của biến môi trường trong tệp khởi tạo client.

---
*Tài liệu này được ghi chép lại nhằm phục vụ quá trình bảo trì và nâng cấp hệ thống trong tương lai.*
