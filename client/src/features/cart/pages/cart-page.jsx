import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronRight, ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

const CartPage = () => {
  const {
    cart,
    increment,
    decrement,
    removeFromCart,
    removeSelectedItems,
    clearCart,
    toggleSelectItem,
    toggleSelectAll,
  } = useCart();

  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedItems = cart.filter((item) => item.selected);

  const handleIncrease = (id) => increment(id);
  const handleDecrease = (id) => decrement(id);

  const handleRemove = (id) => removeFromCart(id);
  const handleClear = () => clearCart();

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center">
        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Giỏ hàng của bạn trống
        </h2>
        <p className="text-gray-600 mb-6">
          Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.
        </p>
        <Button asChild>
          <Link to="/">Tiếp tục mua sắm</Link>
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
                    checked={cart.every((item) => item.selected)}
                    onCheckedChange={(checked) => toggleSelectAll(checked)}
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
                      checked={item.selected}
                      onCheckedChange={(checked) =>
                        toggleSelectItem(item.id, checked)
                      }
                    />
                  </td>
                  <td className="p-3 flex items-center gap-3 min-w-[180px]">
                    {item.images && (
                      <img
                        src={item.images}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border"
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
                    <div className="flex items-center justify-center border border-gray-300 rounded-md px-1 py-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDecrease(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-2 h-2" />
                      </Button>

                      <span className="w-8 text-center font-medium select-none">
                        {item.quantity < 10
                          ? `0${item.quantity}`
                          : item.quantity}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleIncrease(item.id)}
                      >
                        <Plus className="w-2 h-2" />
                      </Button>
                    </div>
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClear}>
              Xóa toàn bộ
            </Button>
            <Button
              variant="outline"
              onClick={() => removeSelectedItems()}
              disabled={selectedItems.length === 0}
            >
              Xóa đã chọn
            </Button>
          </div>
          <div className="text-sm font-bold text-black bg-gray-100 rounded-lg px-6 py-2">
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
              if (selectedItems.length === 0) return;
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
