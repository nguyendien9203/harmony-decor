import { useCartStore } from "@/stores/cart-store";

// Lưu và lấy cart từ localStorage
const CART_KEY = "cart";

export function getCartItems() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export const addToCart = (item) => {
  const { addItem } = useCartStore.getState();
  addItem(item);
};

export const removeFromCart = (itemId) => {
  const { removeItem } = useCartStore.getState();
  removeItem(itemId);
};

export const updateCartItemQuantity = (itemId, quantity) => {
  const { updateQuantity } = useCartStore.getState();
  updateQuantity(itemId, quantity);
};

export const clearCart = () => {
  const { clearCart } = useCartStore.getState();
  clearCart();
};

export const getCartTotal = () => {
  const { getTotal } = useCartStore.getState();
  return getTotal();
}; 