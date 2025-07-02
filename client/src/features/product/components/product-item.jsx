import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/cart-context";
import { formatCurrency } from "@/utils/format";

export default function ProductItem({ product }) {
  const { name, price, images, slug, status } = product;
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const isOutOfStock = status === "OUT_OF_STOCK";

  const handleClick = () => {
    navigate(`/product/${slug}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const item = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      images: product.images,
    };
    addToCart(item);
  };

  return (
    <div
      className="relative rounded-2xl shadow-md overflow-hidden bg-white w-full cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={handleClick}
    >
      <img
        src={images}
        alt={name}
        className={`w-full h-[300px] object-cover rounded-t-2xl ${
          isOutOfStock ? "opacity-60 grayscale" : ""
        }`}
      />

      {/* Out of stock */}
      {isOutOfStock && (
        <Badge
          variant="destructive"
          className="absolute top-2 right-2 text-white"
        >
          Hết hàng
        </Badge>
      )}

      <div className="flex items-start justify-between px-3 py-3">
        <div className="bg-white px-3 py-1 text-sm font-medium">
          <p>{name}</p>
          <p className="text-gray-500 text-xs">{formatCurrency(price)}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full shadow bg-white hover:bg-gray-100 cursor-pointer transition-colors duration-300"
            onClick={(e) => handleAddToCart(e)}
            disabled={isOutOfStock}
          >
            <ShoppingBag className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
