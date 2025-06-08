import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ slug, name, images, price }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${slug}`);
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
          >
            <ShoppingBag className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
