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

export function addToCart(item) {
  const cart = getCartItems();
  const idx = cart.findIndex((p) => p.id === item.id);
  if (idx > -1) {
    cart[idx].quantity += item.quantity || 1;
  } else {
    cart.push({ ...item, quantity: item.quantity || 1 });
  }
  setCartItems(cart);
}

export function removeFromCart(id) {
  const cart = getCartItems().filter((item) => item.id !== id);
  setCartItems(cart);
}

export function updateCartItem(id, quantity) {
  const cart = getCartItems().map((item) =>
    item.id === id ? { ...item, quantity } : item
  );
  setCartItems(cart);
}

export function clearCart() {
  setCartItems([]);
} 