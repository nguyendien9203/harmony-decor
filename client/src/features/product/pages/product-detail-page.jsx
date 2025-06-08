import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullscreenLoader } from "@/components/ui/fullscreen-loader";
import { getProductBySlug } from "@/features/product/home-service";
import ReactMarkdown from "react-markdown";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

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

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    // Logic to add product to cart
    console.log(`Added ${quantity} of ${product.name} to cart`);
  };

  if (loading) {
    return <FullscreenLoader />;
  }

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product image */}
        <div className="flex-shrink-0 w-full md:w-1/2">
          <img
            src={product.images}
            alt={product.name}
            className="w-full h-auto rounded-2xl object-cover"
          />
        </div>

        {/* Product details */}
        <div className="flex flex-col justify-between w-full md:w-1/2">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <ReactMarkdown>{product.description}</ReactMarkdown>

            <p className="text-2xl font-semibold mb-4 text-red-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium">Số lượng:</span>
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
                  className="w-12 text-center outline-none"
                />
                <Button variant="ghost" size="icon" onClick={handleIncrease}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Add to cart button */}
          <Button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Thêm vào giỏ hàng
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
