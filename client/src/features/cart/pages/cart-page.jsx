import React, { useEffect, useState } from "react";
import {
  getCartItems,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "@/features/cart/cart-service";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ChevronRight } from "lucide-react";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = getCartItems();
    setCart(items);
    setSelected(items.map((item) => item.id));
  }, []);

  const handleRemove = (id) => {
    removeFromCart(id);
    const items = getCartItems();
    setCart(items);
    setSelected((prev) => prev.filter((sid) => sid !== id));
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    updateCartItem(id, quantity);
    setCart(getCartItems());
  };

  const handleClear = () => {
    clearCart();
    setCart([]);
    setSelected([]);
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === cart.length) {
      setSelected([]);
    } else {
      setSelected(cart.map((item) => item.id));
    }
  };

  const selectedItems = cart.filter((item) => selected.includes(item.id));
  const total = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Giỏ hàng của bạn đang trống
        </h2>
        <Button asChild className="mt-4" onClick={() => navigate("/")}>
          <Link
            to="/"
            className="text-blue-600 underline hover:text-blue-800 transition"
          >
            Quay lại mua sắm
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 flex flex-col items-center min-h-[60vh]">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Giỏ hàng của bạn
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full mb-6 text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-950">
                <th className="p-3 font-semibold text-center">
                  <Checkbox
                    checked={selected.length === cart.length && cart.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="p-3 font-semibold text-left">Sản phẩm</th>
                <th className="p-3 font-semibold text-center">Giá</th>
                <th className="p-3 font-semibold text-center">Số lượng</th>
                <th className="p-3 font-semibold text-center">Thành tiền</th>
                <th className="p-3 font-semibold text-center">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-b-0 transition"
                >
                  <td className="p-3 text-center">
                    <Checkbox
                      checked={selected.includes(item.id)}
                      onCheckedChange={() => handleSelect(item.id)}
                    />
                  </td>
                  <td className="p-3 flex items-center gap-3 min-w-[180px]">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg border"
                      />
                    )}
                    <span className="font-medium text-gray-800">
                      {item.name}
                    </span>
                  </td>
                  <td className="p-3 text-center text-gray-700">
                    {new Intl.NumberFormat("vn-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price)}
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                      className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-center focus:ring-2 focus:ring-black/30 outline-none transition"
                    />
                  </td>
                  <td className="p-3 text-center font-semibold text-gray-900">
                    {new Intl.NumberFormat("vn-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price * item.quantity)}
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <Button variant="outline" onClick={handleClear}>
            Xóa toàn bộ
          </Button>
          <div className="text-2xl font-bold text-black bg-gray-100 rounded-lg px-6 py-2">
            Tổng:{" "}
            {new Intl.NumberFormat("vn-VN", {
              style: "currency",
              currency: "VND",
            }).format(total)}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 justify-end">
          <Button variant="outline" onClick={() => navigate("/")}>
            Tiếp tục mua sắm
          </Button>
          <Button
            onClick={() => {
              navigate("/checkout", { state: { items: selectedItems } });
            }}
            disabled={selectedItems.length === 0}
          >
            Thanh toán
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
