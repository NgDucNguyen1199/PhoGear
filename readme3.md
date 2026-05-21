<div align="center">

**TRƯỜNG ĐẠI HỌC ĐÀ LẠT**  
**KHOA CÔNG NGHỆ THÔNG TIN**  
---o0o---

**BÁO CÁO THUYẾT MINH KỸ THUẬT DỰ ÁN TỐT NGHIỆP**

**ĐỀ TÀI: NGHIÊN CỨU VÀ XÂY DỰNG NỀN TẢNG THƯƠNG MẠI ĐIỆN TỬ TÍCH HỢP TRẢI NGHIỆM NGƯỜI DÙNG PHOGEAR**

</div>

---

**CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM**  
**Độc lập - Tự do - Hạnh phúc**

---

**THÔNG TIN CHUNG VỀ DỰ ÁN**
- **Tên dự án:** PhoGear - Mechanical Keyboard Ecosystem.
- **Sinh viên thực hiện:** Nguyễn Đức Nguyên (MSSV: 2212429).
- **Đơn vị đào tạo:** Khoa Công nghệ Thông tin - Trường Đại học Đà Lạt.
- **Thời gian hoàn thiện:** Năm 2026.

---

## **LỜI NÓI ĐẦU**

Trong bối cảnh công nghệ Web không ngừng phát triển, việc xây dựng một nền tảng thương mại điện tử không chỉ dừng lại ở chức năng mua bán mà còn phải tích hợp các yếu tố tương tác thời gian thực (Real-time) và trải nghiệm cá nhân hóa. Dự án **PhoGear** được phát triển nhằm ứng dụng các công nghệ tiên tiến nhất của hệ sinh thái React/Next.js để giải quyết bài toán kinh doanh thiết bị ngoại vi chuyên biệt.

---

## **CHƯƠNG I: TỔNG QUAN VỀ DỰ ÁN**

### **1.1. Mục tiêu và Phạm vi**
Dự án tập trung vào việc tối ưu hóa quy trình từ khâu khám phá sản phẩm đến khâu hậu mãi, tích hợp các tính năng giải trí (Gamification) để giữ chân người dùng.

### **1.2. Các cải tiến kỹ thuật đột phá**
- **Real-time Synchronization:** Sử dụng Supabase Realtime để đồng bộ hóa tồn kho và thông báo ngay lập tức.
- **Optimistic UI Updates:** Áp dụng hook `useOptimistic` của React 19 để triệt tiêu độ trễ cảm nhận khi người dùng tương tác.
- **Precision Inventory:** Hệ thống quản lý kho đa tầng cho cả sản phẩm chính và các biến thể chi tiết.

---

## **CHƯƠNG II: KHẢO SÁT VÀ PHÂN TÍCH HỆ THỐNG**

### **2.1. Phân tích chức năng nâng cao**
1. **Module Thương mại:** Đặt hàng, trừ kho thời gian thực, hoàn kho khi hủy đơn, áp dụng coupon linh hoạt.
2. **Module Thông báo:** Hệ thống Notification Center thông báo trạng thái đơn hàng và tương tác cộng đồng 24/7.
3. **Module PhoType:** Trình luyện gõ với bảng xếp hạng toàn cầu (Global Leaderboard) lọc theo Tuần/Tháng.

### **2.2. Thiết kế Cơ sở dữ liệu mở rộng**
- `notifications`: Lưu trữ thông báo người dùng.
- `typing_scores`: Lưu trữ dữ liệu thi đấu tốc độ gõ.
- `post_likes`: Quản lý tương tác bài viết diễn đàn.

---

## **CHƯƠNG III: CÀI ĐẶT VÀ TRIỂN KHAI**

### **3.1. Quy trình thiết lập Database**
Các kỹ sư cần thực thi các tệp SQL theo đúng trình tự sau để đảm bảo tính toàn vẹn dữ liệu:
1. `schema.sql` -> 2. `coupons_schema.sql` -> 3. `forum_schema.sql` -> 4. `forum_likes.sql` -> 5. `typing_scores_schema.sql` -> 6. `notifications_schema.sql` -> 7. `add_variant_id_to_order_items.sql`.

### **3.2. Cấu hình Hiệu suất**
- Thiết lập `bodySizeLimit: '10mb'` trong `next.config.ts` để hỗ trợ Server Actions tải ảnh lớn.
- Tối ưu hóa CLS (Cumulative Layout Shift) bằng hệ thống **Deep Skeleton Loading**.

---

## **CHƯƠNG IV: KẾT LUẬN**

### **4.1. Kết quả đạt được**
Hệ thống đã đạt được độ ổn định cao, hỗ trợ tốt cả Light & Dark Mode, và cung cấp trải nghiệm mua sắm - luyện tập liền mạch.

### **4.2. Hướng phát triển**
- Tích hợp cổng thanh toán chính thức (Stripe/VNPAY).
- Xây dựng mobile app native bằng công nghệ PWA nâng cao.

---

<div align="right">
*Đà Lạt, ngày 21 tháng 05 năm 2026*  
**Người lập báo cáo**  

*(Đã ký)*  

**Nguyễn Đức Nguyên**
</div>
