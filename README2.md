# BÁO CÁO ĐỒ ÁN MÔN HỌC - TRƯỜNG ĐẠI HỌC ĐÀ LẠT

<div align="center">
  <h2>ĐỀ TÀI: XÂY DỰNG HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ VÀ CỘNG ĐỒNG BÀN PHÍM CƠ PHOGEAR</h2>
  <p><strong>Sinh viên thực hiện:</strong> Nguyễn Đức Nguyên</p>
  <p><strong>Mã số sinh viên:</strong> 2212429</p>
</div>

---

## CHƯƠNG 1: TỔNG QUAN DỰ ÁN

### 1.1 Bối cảnh Cách mạng Công nghiệp 4.0 và lý do chọn đề tài
Trong kỷ nguyên của cuộc Cách mạng Công nghiệp 4.0, sự bùng nổ của công nghệ thông tin và Internet đã làm thay đổi sâu sắc mọi khía cạnh của đời sống kinh tế - xã hội. Việc chuyển đổi số không chỉ là xu hướng mà còn là yếu tố sống còn đối với các doanh nghiệp và tổ chức. Trong lĩnh vực thương mại và bán lẻ, đặc biệt là thị trường ngách như thiết bị công nghệ (bàn phím cơ - mechanical keyboards), nhu cầu về một nền tảng tích hợp giữa mua sắm trực tuyến và giao lưu cộng đồng ngày càng cao.

Lý do chọn đề tài **PhoGear**: Hiện tại, các cộng đồng đam mê bàn phím cơ tại Việt Nam thường hoạt động phân tán trên các nền tảng mạng xã hội (Facebook Group, Zalo, Discord) kết hợp với các hình thức mua bán thủ công. Việc này dẫn đến khó khăn trong quản lý thông tin sản phẩm, thiếu tính minh bạch trong giao dịch, và trải nghiệm người dùng không được liền mạch. PhoGear ra đời nhằm số hóa toàn diện quy trình quản lý, tạo ra một hệ sinh thái tập trung giúp nâng cao trải nghiệm mua sắm và tương tác của người dùng.

### 1.2 Định nghĩa các khái niệm kỹ thuật cốt lõi
- **Web Application (Ứng dụng Web):** Là một phần mềm ứng dụng chạy trên nền tảng web, cho phép người dùng tương tác thông qua trình duyệt. Không giống như website tĩnh, Web App có khả năng xử lý nghiệp vụ phức tạp, tương tác dữ liệu thời gian thực.
- **RESTful API (Representational State Transfer API):** Tiêu chuẩn thiết kế kiến trúc cho các dịch vụ web, cho phép các hệ thống phân tán giao tiếp với nhau qua giao thức HTTP. Các thao tác cơ bản (CRUD) được ánh xạ qua các HTTP methods: GET, POST, PUT, DELETE.
- **Relational Database (Cơ sở dữ liệu quan hệ):** Là loại cơ sở dữ liệu lưu trữ và cung cấp quyền truy cập vào các điểm dữ liệu có liên quan với nhau. Dữ liệu được tổ chức thành các bảng (tables) với các hàng và cột, tuân thủ nghiêm ngặt các nguyên tắc chuẩn hóa dữ liệu.

### 1.3 Tính ưu việt của hệ thống so với phương pháp thủ công
Thay vì quản lý hàng hóa qua Excel và chốt đơn qua Zalo, hệ thống PhoGear mang lại các lợi ích vượt trội:
- **Tự động hóa & Độ chính xác:** Tính toán giá trị đơn hàng, quản lý kho bãi tự động, giảm thiểu sai sót do con người (human errors).
- **Phân tích dữ liệu:** Hệ thống lưu trữ tập trung giúp dễ dàng truy xuất, thống kê doanh thu và phân tích hành vi người dùng.
- **Khả năng mở rộng (Scalability):** Sẵn sàng đáp ứng lưu lượng truy cập lớn và mở rộng quy mô kinh doanh mà không cần tăng tương ứng nguồn nhân lực quản lý.

---

## CHƯƠNG 2: KHẢO SÁT VÀ PHÂN TÍCH HỆ THỐNG

### 2.1 Phân tích yêu cầu chức năng (Functional Requirements)

#### Đối tượng: Người dùng thành viên (Customer / Member)
- [x] Đăng ký, đăng nhập, khôi phục mật khẩu.
- [x] Quản lý hồ sơ cá nhân và sổ địa chỉ.
- [x] Tìm kiếm, lọc và xem chi tiết sản phẩm.
- [x] Quản lý giỏ hàng và tiến hành thanh toán (Checkout).
- [x] Theo dõi lịch sử và trạng thái đơn hàng.
- [x] Tham gia thảo luận trên diễn đàn, đăng bài đánh giá sản phẩm (Reviews).
- [x] Đăng ký tham gia các sự kiện (Offline/Online meetup) của cộng đồng.

#### Đối tượng: Quản trị viên (Administrator)
- [x] Quản lý người dùng: Phân quyền, khóa/mở khóa tài khoản.
- [x] Quản lý danh mục và sản phẩm (CRUD sản phẩm, quản lý biến thể - variants).
- [x] Quản lý đơn hàng: Cập nhật trạng thái giao hàng, xử lý hoàn trả.
- [x] Thống kê, báo cáo doanh thu và tài chính.
- [x] Quản lý nội dung (Kiểm duyệt bài viết diễn đàn, đánh giá).
- [x] Tổ chức và quản lý thông tin các sự kiện cộng đồng.

### 2.2 Các module hệ thống chi tiết
1. **Module Quản lý Người dùng:** Xử lý xác thực (Authentication) bằng JWT, phân quyền (Authorization) theo Role-Based Access Control (RBAC).
2. **Module Sản phẩm & Biến thể:** Cho phép cấu hình sâu các thuộc tính sản phẩm (VD: Switch type, Keycap profile, Layout) với mức giá và tồn kho riêng biệt.
3. **Module Đơn hàng & Tài chính:** Quản lý vòng đời đơn hàng từ Pending -> Processing -> Shipped -> Completed. Tích hợp thanh toán và tính toán chi phí vận chuyển.
4. **Module Diễn đàn & Sự kiện:** Tạo không gian tương tác với các chủ đề thảo luận, cho phép người dùng đăng ký các sự kiện (group buy, offline meetup).

### 2.3 Cấu trúc Cơ sở dữ liệu (Database Schema)
Hệ thống được thiết kế với 14 bảng dữ liệu cốt lõi, đảm bảo chuẩn hóa dữ liệu tối thiểu ở mức 3NF.

| STT | Tên Bảng | Ý nghĩa / Chức năng chính | Mối quan hệ chính (Relationships) |
|---|---|---|---|
| 1 | `Users` | Lưu trữ thông tin tài khoản, mật khẩu (hash) | 1-n với `Orders`, `Posts`, `Reviews` |
| 2 | `Roles` | Phân quyền hệ thống (Admin, User, Moderator) | 1-n với `Users` |
| 3 | `Categories` | Danh mục sản phẩm (Bàn phím, Switch, Keycap) | 1-n với `Products` |
| 4 | `Products` | Thông tin chung của sản phẩm (Tên, Mô tả) | 1-n với `Product_Variants`, `Reviews` |
| 5 | `Product_Variants`| Biến thể cụ thể (Màu sắc, Loại switch, Giá, Tồn kho)| 1-n với `Order_Items` |
| 6 | `Orders` | Thông tin tổng quan đơn hàng (Trạng thái, Tổng tiền) | 1-n với `Order_Items`, 1-1 với `Payments` |
| 7 | `Order_Items` | Chi tiết các mặt hàng trong một đơn hàng | n-1 với `Orders`, n-1 với `Product_Variants` |
| 8 | `Payments` | Giao dịch thanh toán (Cổng thanh toán, Trạng thái) | 1-1 với `Orders` |
| 9 | `Events` | Các sự kiện, Group Buy do Admin tổ chức | 1-n với `Event_Registrations` |
| 10 | `Event_Registrations`| Danh sách người dùng đăng ký tham gia sự kiện | n-1 với `Users`, n-1 với `Events` |
| 11 | `Forums` | Các chuyên mục của diễn đàn cộng đồng | 1-n với `Posts` |
| 12 | `Posts` | Bài viết thảo luận của người dùng | 1-n với `Comments`, n-1 với `Forums` |
| 13 | `Comments` | Bình luận trong các bài viết diễn đàn | n-1 với `Posts`, n-1 với `Users` |
| 14 | `Reviews` | Đánh giá, chấm điểm (rating) sản phẩm | n-1 với `Products`, n-1 với `Users` |

---

## CHƯƠNG 3: CÀI ĐẶT VÀ TRIỂN KHAI

### 3.1 Tech Stack & Lý do lựa chọn
- **Frontend: React (Vite, Tailwind CSS)**
  - *Lý do:* React cung cấp kiến trúc component-based, dễ dàng tái sử dụng mã nguồn. Vite mang lại tốc độ build cực nhanh ở môi trường development. Tailwind CSS giúp styling giao diện linh hoạt, chuẩn hóa và phản hồi nhanh (responsive).
- **Backend: Node.js (Express)**
  - *Lý do:* Node.js với mô hình Non-blocking I/O rất phù hợp cho ứng dụng web có nhiều thao tác truy xuất dữ liệu. Express là framework nhẹ, linh hoạt, dễ dàng thiết lập các middleware.
- **Cơ sở dữ liệu: PostgreSQL**
  - *Lý do:* Hệ quản trị CSDL quan hệ mạnh mẽ, mã nguồn mở, hỗ trợ tốt các truy vấn phức tạp, đảm bảo tính toàn vẹn dữ liệu (ACID) cao, rất cần thiết cho module tài chính và đơn hàng.
- **ORM: Prisma**
  - *Lý do:* Prisma cung cấp trải nghiệm Developer tối ưu với Auto-generated Type-safe query builder, giúp tránh các lỗi runtime liên quan đến database và quản lý migration dễ dàng.

### 3.2 Cơ chế Bảo mật (Security)
- **Xác thực & Phân quyền:** Sử dụng **JWT (JSON Web Token)**. Token được lưu trữ an toàn, có thời hạn (expiration) ngắn và cơ chế Refresh Token.
- **Mã hóa:** Mật khẩu người dùng được băm (hash) bằng thuật toán **bcrypt** với salt rounds phù hợp, đảm bảo an toàn ngay cả khi lộ database.
- **Bảo mật Header:** Sử dụng **Helmet** middleware trong Express để thiết lập các HTTP headers bảo mật (CSP, X-Frame-Options, X-XSS-Protection).
- **Tuân thủ OWASP:** Ngăn chặn SQL Injection thông qua Prisma ORM, chống XSS bằng cách sanitize dữ liệu đầu vào, áp dụng Rate Limiting để phòng chống DDoS/Brute-force.

### 3.3 Quy trình Kiểm thử (Testing)
Dự án áp dụng mô hình kiểm thử đa lớp:
- **Unit Test (Jest):** Kiểm thử các hàm logic độc lập (VD: thuật toán tính tổng tiền, mã hóa mật khẩu).
- **Integration Test (Supertest):** Kiểm thử các API endpoint, đảm bảo sự liên kết chính xác giữa Route - Controller - Database.
- **E2E Test (Playwright/Cypress):** Giả lập luồng thao tác của người dùng cuối (từ đăng nhập, thêm vào giỏ hàng, đến thanh toán) trên giao diện thực tế.

### 3.4 Hướng dẫn Cài đặt & Khởi chạy (Setup Guide)

Yêu cầu môi trường: `Node.js >= 18`, `Docker & Docker Compose`.

```bash
# 1. Clone repository
git clone https://github.com/nguyenducnguyen/phogear.git
cd phogear

# 2. Cấu hình biến môi trường
cp .env.example .env
# Chỉnh sửa file .env với thông tin cấu hình phù hợp

# 3. Khởi chạy Database bằng Docker Compose
docker-compose up -d

# 4. Cài đặt các thư viện phụ thuộc
npm install

# 5. Khởi tạo Database Schema với Prisma
npx prisma migrate dev --name init
npx prisma generate

# 6. Seed dữ liệu mẫu (Tùy chọn)
npm run seed

# 7. Khởi chạy ứng dụng môi trường Development
npm run dev
```

---

## CHƯƠNG 4: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 4.1 Kết quả đạt được
- 🚀 **Hoàn thiện hệ thống API:** Thiết kế và triển khai đầy đủ các RESTful API phục vụ nghiệp vụ e-commerce và cộng đồng.
- 🎨 **Giao diện Responsive:** Giao diện người dùng hiện đại, tối ưu trải nghiệm trên cả thiết bị di động (Mobile) và máy tính để bàn (Desktop).
- 🔒 **Bảo mật & Ổn định:** Áp dụng thành công các tiêu chuẩn bảo mật cơ bản, luồng xác thực hoạt động ổn định và an toàn.

### 4.2 Hạn chế hiện tại
- Hệ thống chưa được kiểm thử tải (Stress Test) với lượng người dùng lớn (CCU cao).
- Quản lý hình ảnh (media files) hiện tại đang phụ thuộc vào server local, chưa tích hợp các giải pháp lưu trữ cloud chuyên nghiệp (như AWS S3 hay Cloudinary).
- Hệ thống gợi ý sản phẩm (Recommendation) vẫn đang dừng ở mức cơ bản (theo danh mục).

### 4.3 Hướng phát triển (Roadmap tương lai)
- **Tích hợp Real-time Notifications:** Sử dụng WebSockets (Socket.io) để thông báo trạng thái đơn hàng và tin nhắn diễn đàn theo thời gian thực.
- **Phát triển Mobile App:** Xây dựng ứng dụng di động đa nền tảng bằng React Native kết nối trực tiếp với backend API hiện tại.
- **AI Analytics Dashboard:** Ứng dụng Machine Learning để phân tích hành vi người tiêu dùng, dự đoán xu hướng bán hàng và cung cấp hệ thống gợi ý (Recommendation System) thông minh hơn cho khách hàng.

---
*Đà Lạt, tháng 5 năm 2026.*