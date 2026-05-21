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
- **Sinh viên thực hiện:** Nguyễn Đức Nguyên.
- **Mã số sinh viên:** 2212429.
- **Đơn vị đào tạo:** Khoa Công nghệ Thông tin - Trường Đại học Đà Lạt.
- **Thời gian thực hiện:** Năm 2026.

---

## **LỜI NÓI ĐẦU**

Trong bối cảnh chuyển đổi số đang diễn ra mạnh mẽ, thương mại điện tử không còn đơn thuần là việc mua bán trực tuyến mà đã phát triển thành một trải nghiệm cá nhân hóa sâu sắc. Thị trường thiết bị ngoại vi, đặc biệt là bàn phím cơ, đang chứng kiến sự bùng nổ về nhu cầu tùy biến và kết nối cộng đồng.

Dự án **PhoGear** được hình thành với mục tiêu xây dựng một nền tảng không chỉ phục vụ mục đích thương mại mà còn là một hệ sinh thái kỹ thuật, hỗ trợ người dùng từ khâu lựa chọn linh kiện đến việc nâng cao kỹ năng sử dụng. Báo cáo này trình bày chi tiết quá trình khảo sát, phân tích, thiết kế và cài đặt hệ thống PhoGear dựa trên những công nghệ hiện đại nhất hiện nay như Next.js 16, Supabase và kiến trúc Server Components.

---

## **CHƯƠNG I: TỔNG QUAN VỀ DỰ ÁN VÀ THỊ TRƯỜNG**

### **1.1. Khái niệm và Bối cảnh**
Dự án PhoGear là một ứng dụng Web Fullstack (Fullstack Web Application) chuyên biệt cho lĩnh vực thiết bị ngoại vi máy tính cao cấp. Khác với các sàn thương mại điện tử đa ngành, PhoGear tập trung vào ngách thị trường "Mechanical Keyboard" - một cộng đồng đòi hỏi sự chi tiết, tính thẩm mỹ và hiệu năng cao.

### **1.2. Mục tiêu dự án**
- **Về mặt kỹ thuật:** Áp dụng kiến trúc Next.js 16 (App Router) để tối ưu hóa hiệu suất và SEO. Sử dụng Supabase làm giải pháp Backend-as-a-Service (BaaS) để quản lý dữ liệu thời gian thực.
- **Về mặt trải nghiệm:** Tích hợp công cụ luyện gõ phím (PhoType) và hệ thống gợi ý (Keyboard Finder) để tăng tính tương tác.
- **Về mặt quản lý:** Xây dựng Dashboard thông minh hỗ trợ quản trị viên theo dõi doanh thu và điều phối chuỗi cung ứng mã giảm giá.

### **1.3. Ưu điểm của hệ thống PhoGear**
- **Kiến trúc Serverless:** Giảm thiểu chi phí vận hành máy chủ vật lý, tăng khả năng mở rộng (Scalability).
- **Tốc độ phản hồi:** Sử dụng engine Turbopack cho phép thời gian build và phản hồi giao diện nhanh hơn 700% so với Webpack truyền thống.
- **Bảo mật dữ liệu:** Hệ thống xác thực đa nhân tố (MFA) kết hợp với Row Level Security (RLS) đảm bảo dữ liệu người dùng được bảo vệ tuyệt đối ở mức nhân cơ sở dữ liệu.
- **Tính năng độc bản:** Module PhoType tích hợp đo lường WPM (Words Per Minute) là điểm nhấn khác biệt so với các đối thủ cạnh tranh.

### **1.4. Nhược điểm và Thách thức**
- **Phụ thuộc bên thứ ba:** Hệ thống phụ thuộc nhiều vào Supabase và Cloudinary, đòi hỏi kết nối internet ổn định và quản lý chi phí API.
- **Độ phức tạp của Schema:** Việc quản lý các biến thể sản phẩm (variants) và mã giảm giá (coupons) đòi hỏi logic xử lý SQL phức tạp.

---

## **CHƯƠNG II: KHẢO SÁT VÀ PHÂN TÍCH HỆ THỐNG**

### **2.1. Phân tích yêu cầu đề tài**
Dự án được phân tích dựa trên 3 nhóm yêu cầu cốt lõi:
1. **Yêu cầu hệ thống (System Requirements):** Đảm bảo hoạt động trên môi trường Web, hỗ trợ đa thiết bị (Responsive), tích hợp PWA (Progressive Web App).
2. **Yêu cầu chức năng (Functional Requirements):** Đặt hàng, thanh toán, quản lý kho, diễn đàn cộng đồng, luyện gõ phím.
3. **Yêu cầu phi chức năng (Non-functional Requirements):** Tính bảo mật, tính sẵn sàng (Availability), khả năng bảo trì (Maintainability) và tốc độ tải trang.

### **2.2. Mô tả chi tiết hệ thống PhoGear**
PhoGear hoạt động như một hệ sinh thái khép kín:
- **Tầng khách hàng:** Duyệt sản phẩm -> Tư vấn qua Finder -> Mua hàng -> Nhận ưu đãi qua Coupon -> Tham gia diễn đàn -> Luyện gõ phím.
- **Tầng quản trị:** Theo dõi đơn hàng -> Cập nhật kho hàng -> Tạo mã giảm giá -> Kiểm duyệt nội dung diễn đàn -> Cấu hình hệ thống.

### **2.3. Thiết bị và Phần mềm sử dụng**
- **Hệ điều hành:** Windows/Linux/MacOS.
- **Ngôn ngữ lập trình:** TypeScript (phiên bản 5.x).
- **Framework chính:** Next.js 16.2.4 (React 19).
- **Cơ sở dữ liệu:** PostgreSQL (Managed by Supabase).
- **Thư viện UI:** Tailwind CSS 4, Lucide Icons, Shadcn/UI (Base UI).
- **Công cụ kiểm thử:** Vitest 4.x.

### **2.4. Phân tích chức năng (Functional Analysis)**

#### **2.4.1. Module Thương mại điện tử (PhoShop)**
- **Quản lý sản phẩm:** Hiển thị danh sách, chi tiết, đánh giá và sản phẩm liên quan.
- **Giỏ hàng & Thanh toán:** Xử lý logic tính tiền, phí vận chuyển và áp dụng mã giảm giá.
- **Flash Sale:** Đồng hồ đếm ngược thời gian thực (Real-time Countdown) và giới hạn tồn kho trong thời gian khuyến mãi.

#### **2.4.2. Module Luyện gõ phím (PhoType)**
- Xử lý sự kiện bàn phím ở mức thấp (low-level keyboard events) để đo tốc độ gõ.
- Tính toán chỉ số WPM và Accuracy dựa trên thuật toán so khớp chuỗi văn bản.
- Lưu trữ lịch sử luyện tập của người dùng vào cơ sở dữ liệu.

#### **2.4.3. Module Quản trị (Admin Dashboard)**
- **Thống kê:** Biểu đồ doanh thu (Revenue Chart), phân bổ danh mục (Category Distribution) bằng thư viện Recharts.
- **Coupon Management:** Tạo mã giảm giá theo % hoặc số tiền cố định, thiết lập ngày bắt đầu/kết thúc và giới hạn sử dụng.

### **2.5. Phân tích và Thiết kế hệ thống (System Design)**

#### **2.5.1. Kiến trúc ứng dụng**
PhoGear áp dụng mô hình **Isomorphic Web Application**:
- **Server-Side Rendering (SSR):** Cho các trang sản phẩm và tin tức để tối ưu SEO.
- **Client-Side Rendering (CSR):** Cho các thành phần tương tác như giỏ hàng và game luyện gõ phím.
- **Server Actions:** Thay thế cho API Endpoints truyền thống, giúp giao tiếp trực tiếp giữa Client và Database một cách bảo mật.

#### **2.5.2. Xác định các thực thể Cơ sở dữ liệu (ERD)**
1. **Profiles (Người dùng):** `id (UUID)`, `full_name`, `avatar_url`, `role (admin/customer)`.
2. **Products (Sản phẩm):** `id`, `name`, `price`, `stock_quantity`, `is_flash_sale`, `variants (JSONB)`.
3. **Categories (Danh mục):** `id`, `name`, `slug`, `description`.
4. **Orders (Đơn hàng):** `id`, `user_id`, `total_amount`, `status`, `coupon_id`.
5. **Coupons (Mã giảm giá):** `id`, `code`, `type`, `value`, `min_order_amount`, `usage_limit`.
6. **Posts (Bài viết):** `id`, `author_id`, `title`, `content`, `status (pending/approved)`.

---

## **CHƯƠNG III: CÀI ĐẶT VÀ TRIỂN KHAI HỆ THỐNG**

### **3.1. Ngôn ngữ và Thư viện lập trình**
- **TypeScript:** Sử dụng để định nghĩa Interface/Type cho toàn bộ hệ thống, giảm thiểu lỗi runtime.
- **Zustand:** Thư viện quản lý trạng thái (State Management) nhỏ gọn, thay thế cho Redux để quản lý giỏ hàng.
- **Supabase SSR:** Thư viện hỗ trợ quản lý session và cookies trong môi trường Next.js App Router.

### **3.2. Hướng dẫn cài đặt chi tiết**

#### **Bước 1: Chuẩn bị môi trường**
Yêu cầu Node.js phiên bản 20 trở lên. Thực hiện lệnh:
```bash
git clone https://github.com/NgDucNguyen1199/PhoGear.git
cd PhoGear
npm install
```

#### **Bước 2: Cấu hình Cơ sở dữ liệu**
1. Đăng nhập vào Supabase Console.
2. Tại mục **SQL Editor**, thực thi các script trong thư mục `/supabase` theo trình tự:
   - `schema.sql`: Khởi tạo các bảng cốt lõi.
   - `coupons_schema.sql`: Cấu trúc hệ thống khuyến mãi.
   - `forum_schema.sql`: Cấu trúc diễn đàn.
   - `system_settings.sql`: Cấu hình hệ thống.
   - `seed.sql`: Nạp dữ liệu mẫu để kiểm thử.

#### **Bước 3: Thiết lập biến môi trường**
Tạo tệp `.env.local` với nội dung:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
```

#### **Bước 4: Khởi chạy hệ thống**
```bash
npm run dev
```
Ứng dụng sẽ khả dụng tại địa chỉ `http://localhost:3000`.

---

## **CHƯƠNG IV: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN**

### **4.1. Kết quả đạt được**
- Xây dựng thành công nền tảng PhoGear với hiệu suất cao, đạt điểm số Lighthouse tối ưu.
- Triển khai hệ thống mã giảm giá (Coupons) hoạt động ổn định, có logic kiểm tra điều kiện chặt chẽ.
- Hoàn thiện module PhoType với khả năng xử lý Real-time chính xác.
- Hệ thống quản trị (Admin) trực quan, cho phép điều phối dữ liệu một cách dễ dàng.

### **4.2. Hướng phát triển tương lai**
1. **Thanh toán tích hợp:** Kết nối với các cổng thanh toán nội địa (VNPAY) và quốc tế (Stripe).
2. **Mobile App:** Sử dụng React Native hoặc Flutter để chuyển đổi hệ thống thành ứng dụng di động thực thụ.
3. **AI Recommendation:** Sử dụng các dịch vụ Machine Learning của Supabase để gợi ý sản phẩm dựa trên hành vi người dùng.
4. **Hệ thống Rank:** Bổ sung bảng xếp hạng (Leaderboard) toàn cầu cho module PhoType để tăng tính cạnh tranh.

---

## **TÀI LIỆU THAM KHẢO**

1.  **Next.js Documentation** - https://nextjs.org/docs (Truy cập lần cuối: 2026).
2.  **Supabase & PostgreSQL Guide** - https://supabase.com/docs.
3.  **Tailwind CSS Documentation** - https://tailwindcss.com/docs.
4.  **React 19 Experimental Features** - https://react.dev.
5.  **Cơ sở dữ liệu nâng cao** - Tài liệu giảng dạy Khoa CNTT, Đại học Đà Lạt.

---

<div align="right">
*Đà Lạt, ngày 21 tháng 05 năm 2026*  
**Người lập báo cáo**  

*(Đã ký)*  

**Nguyễn Đức Nguyên**
</div>
