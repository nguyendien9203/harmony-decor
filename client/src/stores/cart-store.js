import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Thêm sản phẩm vào giỏ hàng
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);
        
        if (existingItem) {
          // Nếu sản phẩm đã tồn tại, tăng số lượng
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          // Nếu sản phẩm chưa tồn tại, thêm mới
          set({ items: [...items, item] });
        }
      },

      // Xóa sản phẩm khỏi giỏ hàng
      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      // Cập nhật số lượng sản phẩm
      updateQuantity: (itemId, quantity) => {
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        });
      },

      // Xóa toàn bộ giỏ hàng
      clearCart: () => {
        set({ items: [] });
      },

      // Tính tổng tiền
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage', // Tên key trong localStorage
    }
  )
); 