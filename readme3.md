<div align="center">

**TRƯỜNG ĐẠI HỌC ĐÀ LẠT**  
**KHOA CÔNG NGHỆ THÔNG TIN**  
---o0o---

**BÁO CÁO THUYẾT MINH KỸ THUẬT DỰ ÁN TỐT NGHIỆP**

**ĐỀ TÀI: NGHIÊN CỨU VÀ XÂY DỰNG NỀN TẢNG THƯƠNG MẠI ĐIỆN TỬ TÍCH HỢP TRẢI NGHIỆM NGƯỜI DÙNG PHOGEAR**

</div>

---

**THÔNG TIN CHUNG VỀ DỰ ÁN**
- **Tên dự án:** PhoGear - Mechanical Keyboard Ecosystem.
- **Sinh viên thực hiện:** Nguyễn Đức Nguyên.
- **Thời gian hoàn thiện:** Năm 2026.

---

## **LỜI NÓI ĐẦU**

Dự án **PhoGear** được phát triển nhằm ứng dụng các công nghệ hiện đại nhất trong hệ sinh thái Web để giải quyết bài toán kinh doanh thiết bị ngoại vi chuyên biệt. Không chỉ dừng lại ở thương mại điện tử, dự án còn tập trung vào việc xây dựng cộng đồng thông qua các tính năng tương tác thời gian thực và trò chơi hóa (Gamification).

---

## **CHƯƠNG I: TỔNG QUAN VỀ DỰ ÁN**

### **1.1. Mục tiêu và Phạm vi**
- Xây dựng hệ thống bán hàng đa biến thể với quản lý tồn kho chính xác.
- Tích hợp công cụ luyện gõ phím chuyên sâu để tăng tính tương tác.
- Đảm bảo hiệu suất tối ưu và bảo mật dữ liệu người dùng.

### **1.2. Công nghệ chủ đạo**
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4.
- **Backend:** Supabase (Auth, Realtime, Storage, Edge Functions).
- **Database:** PostgreSQL với RLS (Row Level Security).

---

## **CHƯƠNG II: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG**

### **2.1. Phân tích chức năng**
1. **Module Thương mại:** Giỏ hàng thông minh, thanh toán, quản lý mã giảm giá, Flash Sales.
2. **Module Cộng đồng:** Diễn đàn thảo luận, hệ thống Like và thông báo thời gian thực.
3. **Module PhoType:** Typing Engine với âm thanh thực tế, bảng xếp hạng toàn cầu.

### **2.2. Thiết kế Cơ sở dữ liệu**
Hệ thống sử dụng mô hình dữ liệu quan hệ chặt chẽ, hỗ trợ các quy trình nghiệp vụ phức tạp như trừ kho biến thể tự động và hoàn kho khi hủy đơn.

---

## **CHƯƠNG III: CÀI ĐẶT VÀ TRIỂN KHAI**

### **3.1. Quy trình thiết lập Database**
Thực thi các tệp SQL theo trình tự: `schema.sql` -> `variants_v2_schema.sql` -> `coupons_schema.sql` -> `forum_schema.sql` -> `typing_scores_schema.sql` -> `notifications_schema.sql`.

### **3.2. Giải pháp tối ưu hóa**
- **Deep Skeleton Loading:** Giảm thiểu CLS.
- **Optimistic UI:** Tăng tốc độ phản hồi cảm nhận của người dùng.
- **Server Actions Body Limit:** Hỗ trợ xử lý dữ liệu lớn.

---

## **CHƯƠNG IV: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN**

### **4.1. Kết quả đạt được**
Hệ thống hoạt động ổn định, đáp ứng tốt các yêu cầu về tính năng và trải nghiệm người dùng.

### **4.2. Hướng phát triển**
- Tích hợp thanh toán điện tử (Stripe/VNPAY).
- Mở rộng hệ thống gợi ý sản phẩm dựa trên AI.

---

<div align="right">
*Đà Lạt, năm 2026*  
**Người lập báo cáo**  
**Nguyễn Đức Nguyên**
</div>
