-- Thêm chính sách (policy) cho phép người dùng INSERT vào bảng order_items
CREATE POLICY "Users can insert own order items" ON public.order_items 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_id AND user_id = auth.uid()
    )
);

-- Thêm policy cho phép admin có thể chỉnh sửa/xóa order_items (đề phòng trường hợp cần thiết sau này)
CREATE POLICY "Admins can update order items" ON public.order_items 
FOR UPDATE 
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete order items" ON public.order_items 
FOR DELETE 
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
