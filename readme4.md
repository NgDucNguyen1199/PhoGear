# BÁO CÁO THUYẾT MINH KỸ THUẬT DỰ ÁN PHOGEAR

**TRƯỜNG ĐẠI HỌC ĐÀ LẠT**  
**KHOA CÔNG NGHỆ THÔNG TIN**  

---

## 📑 MỤC LỤC CHI TIẾT
1. **PHẦN MỞ ĐẦU**
   - 1.1. Lý do chọn đề tài
   - 1.2. Mục tiêu nghiên cứu
   - 1.3. Đối tượng và phạm vi nghiên cứu
2. **CHƯƠNG I: KHẢO SÁT VÀ PHÂN TÍCH HỆ THỐNG**
   - 2.1. Khảo sát thực trạng thị trường bàn phím cơ
   - 2.2. Phân tích yêu cầu chức năng (Functional Requirements)
   - 2.3. Phân tích yêu cầu phi chức năng (Non-functional Requirements)
   - 2.4. Xác định các thực thể và mối quan hệ (ERD)
3. **CHƯƠNG II: THIẾT KẾ KIẾN TRÚC VÀ CÔNG NGHỆ**
   - 3.1. Lựa chọn công nghệ (Next.js 16, React 19, Supabase)
   - 3.2. Kiến trúc Isomorphic và Server Actions
   - 3.3. Giải pháp bảo mật Row Level Security (RLS)
4. **CHƯƠNG III: XÂY DỰNG VÀ CÀI ĐẶT HỆ THỐNG**
   - 4.1. Cấu trúc mã nguồn và Proxy Middleware
   - 4.2. Xây dựng Module Coupons & Marketing
   - 4.3. Xây dựng Module PhoType & Gamification
   - 4.4. Tối ưu hóa hiệu suất (Turbopack & Cloudinary)
5. **CHƯƠNG IV: ĐÁNH GIÁ VÀ KẾT LUẬN**
   - 5.1. Kết quả thử nghiệm và kiểm thử (Vitest)
   - 5.2. Hướng phát triển và mở rộng
6. **TÀI LIỆU THAM KHẢO**

---

## 1. PHẦN MỞ ĐẦU

### 1.1. Lý do chọn đề tài
Thị trường thiết bị ngoại vi, đặc biệt là bàn phím cơ, đã chuyển mình từ một thị trường ngách thành một ngành công nghiệp văn hóa và công nghệ trị giá hàng tỷ USD. Người dùng hiện nay không chỉ tìm kiếm một công cụ nhập liệu mà còn tìm kiếm sự cá nhân hóa (Customization). Việc xây dựng một nền tảng thương mại điện tử chuyên biệt như PhoGear là cần thiết để kết nối nhà cung cấp với cộng đồng người dùng đam mê kỹ thuật.

### 1.2. Mục tiêu nghiên cứu
- Nghiên cứu khả năng ứng dụng của Next.js 16 và React 19 trong việc tối ưu hóa SEO và trải nghiệm người dùng.
- Xây dựng hệ thống quản lý dữ liệu thời gian thực với Supabase.
- Thiết kế các module đặc thù như luyện gõ phím và gợi ý sản phẩm thông minh.

---

## 2. CHƯƠNG I: KHẢO SÁT VÀ PHÂN TÍCH HỆ THỐNG

### 2.2. Phân tích yêu cầu chức năng
Hệ thống được chia thành 3 phân hệ lớn:
1.  **Phân hệ Người dùng:** Cho phép khách hàng tìm kiếm, đặt hàng, quản lý hồ sơ và tham gia diễn đàn. Đặc biệt là tính năng **PhoType** cho phép đo tốc độ gõ phím thực tế.
2.  **Phân hệ Quản trị (Admin):** Cung cấp các công cụ quản lý kho hàng, xử lý đơn hàng, điều phối mã giảm giá và kiểm duyệt nội dung cộng đồng.
3.  **Phân hệ Tự động hóa:** Bao gồm logic tự động tính phí vận chuyển, áp dụng coupon và điều chỉnh giá trong các phiên Flash Sale.

### 2.4. Thiết kế Cơ sở dữ liệu (ERD)
Dữ liệu được tổ chức chặt chẽ trên PostgreSQL:
-   **Table `coupons`:** Lưu trữ logic khuyến mãi phức tạp (min_order, max_discount, usage_limit).
-   **Table `orders`:** Liên kết với `profiles` và `coupons` để quản lý dòng tiền và lịch sử mua sắm.
-   **Table `posts` & `comments`:** Cấu trúc dạng cây (Tree structure) để hỗ trợ thảo luận diễn đàn.

---

## 3. CHƯƠNG II: THIẾT KẾ KIẾN TRÚC VÀ CÔNG NGHỆ

### 3.2. Kiến trúc Isomorphic và Server Actions
PhoGear không sử dụng kiến trúc API REST truyền thống mà tận dụng **Server Actions**. Điều này giúp:
- Giảm số lượng API Endpoint cần bảo trì.
- Tăng tính bảo mật vì logic thực thi trực tiếp trên máy chủ.
- Tự động revalidate dữ liệu qua `revalidatePath`, giúp giao diện luôn cập nhật mới nhất.

---

## 4. CHƯƠNG III: XÂY DỰNG VÀ CÀI ĐẶT HỆ THỐNG

### 4.2. Xây dựng Module Coupons
Module này được thiết kế với cơ chế kiểm tra điều kiện (Validator) đa tầng:
1. Kiểm tra tính tồn tại và trạng thái `is_active`.
2. Kiểm tra thời hạn hiệu lực (`start_date`, `end_date`).
3. Kiểm tra ngưỡng đơn hàng tối thiểu (`min_order_amount`).
4. Kiểm tra giới hạn lượt sử dụng (`usage_limit` vs `usage_count`).

---

## 5. CHƯƠNG IV: ĐÁNH GIÁ VÀ KẾT LUẬN

### 5.1. Kết quả đạt được
Hệ thống đã giải quyết triệt để các lỗi về:
-   **Hydration:** Tối ưu hóa việc render Dialog và Sheet trên React 19.
-   **Payload:** Mở rộng giới hạn Server Actions lên 10MB để xử lý ảnh sản phẩm 4K.
-   **Type Safety:** 100% mã nguồn được kiểm soát bởi TypeScript.

---

## 6. TÀI LIỆU THAM KHẢO
1. Next.js Documentation (2026).
2. React 19 Upgrade Guide.
3. Supabase Row Level Security Patterns.
4. Tailwind CSS v4 Engineering Blog.
