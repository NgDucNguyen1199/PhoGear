# ⌨️ PhoGear - Cửa hàng Bàn phím Cơ Cao cấp

PhoGear là một nền tảng thương mại điện tử hiện đại chuyên cung cấp các dòng bàn phím cơ, linh kiện và phụ kiện máy tính cao cấp. Dự án được xây dựng với mục tiêu mang lại trải nghiệm mua sắm mượt mà, trực quan và tích hợp các công cụ hỗ trợ người dùng tìm kiếm sản phẩm phù hợp nhất.

![PhoGear Logo](/public/logo_main.png)

## 🌟 Tính năng nổi bật

### 🛒 Trải nghiệm mua sắm (Shop)
- **Duyệt sản phẩm đa dạng**: Danh sách sản phẩm được cập nhật liên tục với hình ảnh chất lượng cao.
- **Tìm kiếm thông minh**: Tìm kiếm theo tên sản phẩm với gợi ý thời gian thực (Real-time suggestions).
- **Lọc theo danh mục**: Dễ dàng phân loại sản phẩm theo thương hiệu, loại switch, hoặc kích thước.
- **Giỏ hàng & Wishlist**: Quản lý danh sách sản phẩm yêu thích và chuẩn bị thanh toán một cách tiện lợi.
- **Hệ thống đánh giá**: Người dùng có thể để lại nhận xét và điểm số cho từng sản phẩm.

### 🛠️ Công cụ tương tác
- **Keyboard Finder**: Công cụ trắc nghiệm thông minh giúp người dùng tìm thấy chiếc bàn phím "chân ái" dựa trên nhu cầu sử dụng (văn phòng, gaming, coding).
- **PhoType**: Trò chơi luyện gõ phím ngay trên trình duyệt, giúp người dùng kiểm tra tốc độ (WPM) và độ chính xác của mình.

### 🛡️ Quản trị hệ thống (Admin Dashboard)
- **Quản lý kho hàng**: Thêm, sửa, xóa sản phẩm và quản lý các phiên bản (variants) linh hoạt.
- **Quản lý đơn hàng**: Theo dõi trạng thái đơn hàng và thông tin khách hàng.
- **Quản lý người dùng**: Phân quyền và quản lý tài khoản thành viên.
- **Quản lý danh mục**: Tổ chức cây danh mục sản phẩm khoa học.

### 🌍 Tiện ích khác
- **Đa vùng & Ngôn ngữ**: Hỗ trợ chuyển đổi vùng và ngôn ngữ linh hoạt.
- **Giao diện hiện đại**: Hỗ trợ Dark Mode, thiết kế Responsive hoàn hảo trên mọi thiết bị.
- **Hiệu ứng mượt mà**: Sử dụng Framer Motion và Canvas Confetti cho các tương tác người dùng.

## 🚀 Công nghệ sử dụng

### Frontend
- **Next.js 15+ (App Router)**: Framework mạnh mẽ cho React với hỗ trợ Server Components.
- **React 19**: Phiên bản mới nhất của thư viện UI phổ biến.
- **TypeScript**: Đảm bảo an toàn kiểu dữ liệu và giảm thiểu lỗi runtime.
- **Tailwind CSS & Shadcn/UI**: Xây dựng giao diện nhanh chóng, đẹp mắt và dễ tùy biến.
- **Framer Motion**: Xử lý các hiệu ứng chuyển động và animation.
- **Zustand**: Quản lý state giỏ hàng và wishlist một cách nhẹ nhàng, hiệu quả.

### Backend & Database
- **Supabase**: Backend-as-a-Service mạnh mẽ.
  - **PostgreSQL**: Lưu trữ dữ liệu quan hệ ổn định.
  - **Auth**: Quản lý đăng nhập/đăng ký người dùng.
  - **Storage**: Lưu trữ hình ảnh sản phẩm.
- **Server Actions**: Xử lý logic phía server một cách an toàn và trực tiếp từ component.

## 🛠️ Cài đặt và Chạy thử

### 1. Clone dự án
```bash
git clone https://github.com/NgDucNguyen1199/PhoGear.git
cd PhoGear
```

### 2. Cài đặt Dependencies
```bash
npm install
# hoặc
yarn install
```

### 3. Cấu hình biến môi trường
Tạo file `.env.local` ở thư mục gốc và thêm các thông tin từ Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Chạy Development Server
```bash
npm run dev
```
Truy cập [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 📂 Cấu trúc thư mục chính
- `/src/actions`: Các Server Actions xử lý logic backend.
- `/src/app`: Cấu trúc trang (Pages) và layouts theo App Router.
- `/src/components`: Thư viện components (UI, Layout, Shop, Admin).
- `/src/lib`: Cấu hình Supabase client và các hàm tiện ích (utils).
- `/src/store`: Quản lý state toàn cục với Zustand.
- `/supabase`: Chứa các script SQL và schema của database.

## 🤝 Đóng góp
Nếu bạn có ý tưởng hoặc phát hiện lỗi, hãy mở một Issue hoặc gửi Pull Request. Chúng tôi luôn hoan nghênh sự đóng góp từ cộng đồng!

---
**PhoGear** - Nâng tầm trải nghiệm gõ phím của bạn. 🚀
