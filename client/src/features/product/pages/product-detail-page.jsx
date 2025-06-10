import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  Minus,
  ShoppingBag,
  Star,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullscreenLoader } from "@/components/ui/fullscreen-loader";
import { getProductBySlug } from "@/features/product/home-service";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { addToCart } from "@/features/cart/cart-service";
import { toast } from "sonner";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductBySlug(slug);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => Math.max(prev - 1, 1));
  const handleAddToCart = () => {
    if (!product) return;
    const realId = product._id || product.id;
    const realImage = Array.isArray(product.images)
      ? product.images[0]
      : product.images;
    addToCart({
      id: realId,
      name: product.name,
      price: product.price,
      image: realImage,
      quantity,
    });
    toast.success("Đã thêm vào giỏ hàng!");
  };

  if (loading) return <FullscreenLoader />;

  return (
    <section className="max-w-6xl mx-auto p-6 bg-white rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Images */}
        <div>
          <img
            src={product.images}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-xl mb-4"
          />
          {/* <div className="flex gap-4">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className="w-20 h-20 object-cover rounded-lg border hover:ring-2 hover:ring-black"
              />
            ))}
          </div> */}
        </div>

        {/* Right: Product info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-1 text-sm font-medium text-gray-800 mb-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-4 h-4 ${
                    idx < 4 ? "fill-primary stroke-primary" : "stroke-primary"
                  }`}
                />
              ))}
              <span className="ml-2">4.4</span>
              <span className="text-gray-500">&bull;</span>
              <span>24 reviews</span>
              <ChevronRight className="w-4 h-4 ml-1 text-gray-500" />
            </div>

            {/* Price & Quantity on same row */}
            <div className="flex items-center justify-between mb-6">
              {/* Price */}
              <p className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat("vn-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Qty :</span>
                <div className="flex items-center border rounded px-2 py-1">
                  <Button variant="ghost" size="icon" onClick={handleDecrease}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value || "1")))
                    }
                    className="w-10 text-center outline-none"
                  />
                  <Button variant="ghost" size="icon" onClick={handleIncrease}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button className="flex-1 flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 h-12 rounded-md">
                <Zap className="w-4 h-4" />
                <span className="text-base font-medium">Mua Ngay</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-base font-medium">Thêm vào giỏ hàng</span>
              </Button>
            </div>

            {/* Description */}
            <div className="prose text-sm text-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Mô tả sản phẩm</h2>
                {product.description.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription((prev) => !prev)}
                    className="text-sm text-primary underline"
                  >
                    {showFullDescription ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
              </div>

              <ReactQuill
                value={
                  showFullDescription
                    ? product.description
                    : product.description.slice(0, 300) +
                      (product.description.length > 300 ? "..." : "")
                }
                readOnly={true}
                theme="bubble" // hoặc "snow" tùy thích, "bubble" nhẹ hơn
                modules={{ toolbar: false }} // ẩn toolbar khi chỉ xem
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
