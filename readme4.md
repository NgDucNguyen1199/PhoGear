# BÁO CÁO THUYẾT MINH KỸ THUẬT DỰ ÁN PHOGEAR

**TRƯỜNG ĐẠI HỌC ĐÀ LẠT**  
**KHOA CÔNG NGHỆ THÔNG TIN**  

---

## 📑 MỤC LỤC CHI TIẾT
1. **PHẦN MỞ ĐẦU**
   - 1.1. Lý do chọn đề tài
   - 1.2. Mục tiêu nghiên cứu
2. **CHƯƠNG I: KHẢO SÁT VÀ PHÂN TÍCH HỆ THỐNG**
   - 2.1. Phân tích yêu cầu chức năng mở rộng
   - 2.2. Xác định các thực thể mới (Inventory & Social)
3. **CHƯƠNG II: THIẾT KẾ KIẾN TRÚC VÀ CÔNG NGHỆ**
   - 3.1. Ứng dụng Real-time & Optimistic Updates
   - 3.2. Giải pháp Deep Skeleton Loading
4. **CHƯƠNG III: XÂY DỰNG VÀ CÀI ĐẶT HỆ THỐNG**
   - 4.1. Hệ thống quản lý tồn kho biến thể (Variant-level Inventory)
   - 4.2. Trung tâm thông báo tập trung (Notification Center)
   - 4.3. Bảng xếp hạng PhoType đa chiều
5. **CHƯƠNG IV: ĐÁNH GIÁ VÀ KẾT LUẬN**
   - 5.1. Kết quả giải quyết bài toán hiệu suất & UX
6. **TÀI LIỆU THAM KHẢO**

---

## 2. CHƯƠNG I: KHẢO SÁT VÀ PHÂN TÍCH HỆ THỐNG

### 2.1. Phân tích yêu cầu chức năng mở rộng
Hệ thống hiện tại đã được nâng cấp để hỗ trợ các quy trình nghiệp vụ phức tạp:
- **Tồn kho chính xác:** Đảm bảo khi khách hàng chọn một switch cụ thể (VD: Red Switch), chỉ số lượng của biến thể đó bị giảm trừ trong kho.
- **Tương tác xã hội:** Người dùng có thể thả tim bài viết, nhận thông báo đẩy (push notifications) khi Admin thay đổi trạng thái đơn hàng.

---

## 3. CHƯƠNG II: THIẾT KẾ KIẾN TRÚC VÀ CÔNG NGHỆ

### 3.1. Ứng dụng Real-time & Optimistic Updates
Dự án áp dụng mô hình **Cập nhật tức thời**:
- **Supabase Realtime:** Sử dụng WebSockets để truyền tải thay đổi dữ liệu từ Postgres đến trực tiếp trình duyệt người dùng mà không cần reload.
- **Optimistic UI:** Khi người dùng thực hiện các thao tác nhẹ (like, add to cart), giao diện sẽ giả định thành công và cập nhật ngay lập tức, mang lại cảm giác mượt mà tuyệt đối.

### 3.2. Giải pháp Deep Skeleton Loading
Để đạt điểm số **Lighthouse Core Web Vitals** tối ưu, hệ thống sử dụng Skeletons khớp 1:1 với kích thước Product Card thật, giúp triệt tiêu chỉ số CLS (Cumulative Layout Shift) - một trong những tiêu chí đánh giá trải nghiệm người dùng quan trọng nhất của Google.

---

## 4. CHƯƠNG III: XÂY DỰNG VÀ CÀI ĐẶT HỆ THỐNG

### 4.1. Hệ thống quản lý tồn kho biến thể
Logic trừ kho được thực hiện qua Server Action bảo mật:
- Khi tạo đơn hàng (`createOrder`), hệ thống xác định `variant_id`.
- Thực hiện cập nhật đồng thời ở bảng `products` (tổng kho) và `product_variants` (kho chi tiết).
- Hỗ trợ hoàn kho tự động (`Smart Restoration`) khi đơn hàng chuyển sang trạng thái `cancelled`.

### 4.3. Bảng xếp hạng PhoType đa chiều
Module PhoType được tái cấu trúc bố cục ngang theo phong cách **10fastfingers**, tập trung tối đa vào khu vực gõ. Bảng xếp hạng hỗ trợ:
- Lọc theo thời gian: Tuần (Weekly), Tháng (Monthly), Tất cả (All-time).
- Glassmorphism UI: Hiệu ứng làm mờ nền hiện đại, hỗ trợ hoàn hảo cho cả Light Mode và Dark Mode.

---

## 5. CHƯƠNG IV: ĐÁNH GIÁ VÀ KẾT LUẬN

### 5.1. Kết quả giải quyết bài toán hiệu suất & UX
Hệ thống đã loại bỏ hoàn toàn các lỗi về Hydration và vượt ngưỡng giới hạn Payload (nâng lên 10MB). Trải nghiệm người dùng được nâng tầm nhờ vào sự kết hợp giữa Real-time và Optimistic Updates.

---

## 6. TÀI LIỆU THAM KHẢO
1. Next.js Documentation (2026).
2. Supabase Realtime & Postgres Replication Guide.
3. React 19 useOptimistic API Reference.
4. Google Search Central - Core Web Vitals Optimization.
