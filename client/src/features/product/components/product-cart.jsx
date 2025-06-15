import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { addToCart } from "@/features/cart/cart-service";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export default function ProductCard({ id, _id, slug, name, images, price }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    navigate(`/product/${slug}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Không trigger click vào card
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const realId = id || _id;
    addToCart({ id: realId, name, price, image: images, quantity: 1 });
    toast.success("Đã thêm vào giỏ hàng!");
  };

  return (
    <div
      className="rounded-2xl shadow-md overflow-hidden bg-white w-full cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={handleClick}
    >
      <img
        src={images}
        alt={name}
        className="w-full h-[300px] object-cover rounded-t-2xl"
      />

      <div className="flex items-center justify-between px-3 py-3">
        <div className="bg-white px-3 py-1 text-sm font-medium">
          <p>{name}</p>
          <p className="text-gray-500 text-xs">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(price)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full shadow bg-white hover:bg-gray-100"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
