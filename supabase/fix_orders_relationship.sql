-- Sửa lỗi quan hệ giữa bảng orders và profiles để có thể lấy tên khách hàng
-- Hiện tại orders.user_id đang trỏ tới auth.users, chúng ta sẽ chuyển nó trỏ tới public.profiles

ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

ALTER TABLE public.orders
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE SET NULL;
