import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Minus,
  ShoppingBag,
  Star,
  Zap,
  Pencil,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

import { FullscreenLoader } from "@/components/ui/fullscreen-loader";
import {
  getProductBySlug,
  addProductReview,
  updateProductReview,
} from "@/features/product/home-service";

import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { useBuyNow } from "@/contexts/buy-now-context";
import { formatCurrency, formatDateTime } from "@/utils/format";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { setBuyNowItem } = useBuyNow();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

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

  const isOutOfStock = product?.status === "OUT_OF_STOCK";

  const handleIncrease = () => setQuantity((prev) => prev + 1);

  const handleDecrease = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handleAddToCart = () => {
    if (!product) return;

    const item = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      images: product.images,
    };

    addToCart(item);
  };

  const handleBuyNow = () => {
    if (!product) return;

    const item = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      images: product.images,
    };

    setBuyNowItem(item);
    navigate("/checkout");
  };

  const averageRating =
    product?.reviews?.length > 0
      ? (
          product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : 0;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.warning("Vui lòng đánh giá và viết nhận xét");
      return;
    }

    setSubmitting(true);
    try {
      let response;
      if (editingReviewId) {
        response = await updateProductReview(product._id, editingReviewId, {
          rating,
          comment,
        });
        toast.success("Đã cập nhật đánh giá");
      } else {
        response = await addProductReview(product._id, { rating, comment });
        toast.success("Gửi đánh giá thành công");
      }

      // reset form
      setComment("");
      setRating(0);
      setEditingReviewId(null);
      setProduct(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi gửi đánh giá"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <FullscreenLoader />;

  return (
    <section className="max-w-6xl mx-auto p-6 bg-white rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Images */}
        <div className="relative">
          <img
            src={product.images}
            alt={product.name}
            className={`w-full h-[400px] object-cover rounded-xl mb-4 ${
              isOutOfStock ? "opacity-60 grayscale" : ""
            }`}
          />
          {isOutOfStock && (
            <Badge
              variant="destructive"
              className="absolute top-2 right-2 text-white"
            >
              Hết hàng
            </Badge>
          )}
        </div>

        {/* Right: Product info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Total rating */}
            <div className="flex items-center gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-5 h-5 ${
                    idx < Math.round(averageRating)
                      ? "fill-yellow-500 stroke-yellow-500"
                      : "stroke-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600">{averageRating} / 5</span>
              <span className="text-sm text-gray-500 ml-2">
                ({product.reviews?.length || 0} đánh giá)
              </span>
            </div>

            {/* Price & Quantity on same row */}
            <div className="flex items-center justify-between mb-6">
              {/* Price */}
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Qty :</span>
                <div className="flex items-center justify-center border border-gray-300 rounded-md px-1 py-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDecrease}
                    className="text-lg font-bold px-2 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>

                  <span className="w-8 text-center font-medium text-lg select-none">
                    {quantity < 10 ? `0${quantity}` : quantity}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleIncrease}
                    className="text-lg font-bold px-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button
                className="flex-1 flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 h-12 rounded-md cursor-pointer"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                <Zap className="w-4 h-4" />
                <span className="text-base font-medium">Mua Ngay</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-md cursor-pointer0"
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
                    className="text-sm text-primary underline cursor-pointer"
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
                theme="bubble"
                modules={{ toolbar: false }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Danh sách đánh giá */}
      <div className="space-y-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700">Mô tả sản phẩm</h2>
        {product.reviews?.length === 0 ? (
          <p className="text-gray-500">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
        ) : (
          product.reviews?.map((review, i) => (
            <div key={i} className="border-b pb-4 relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar>
                    <AvatarImage src={review.userId?.avatar} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {review.userId?.name || "Người dùng"}
                    </p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`w-4 h-4 ${
                            j < review.rating
                              ? "fill-yellow-500 stroke-yellow-500"
                              : "stroke-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ba chấm nếu đúng user */}
                {user && review.userId?._id === user._id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-500"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setRating(review.rating);
                          setComment(review.comment);
                          setEditingReviewId(review._id); // cần tạo state
                        }}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <p className="text-sm text-gray-700">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDateTime(review.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Form gửi đánh giá */}
      {user ? (
        <div className="border p-4 rounded-xl">
          <h3 className="font-semibold mb-2">Viết đánh giá của bạn</h3>

          {/* Rating chọn sao */}
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((val) => (
              <Star
                key={val}
                onClick={() => setRating(val)}
                className={`w-6 h-6 cursor-pointer ${
                  val <= rating
                    ? "fill-yellow-500 stroke-yellow-500"
                    : "stroke-gray-300"
                }`}
              />
            ))}
            <span className="text-sm">{rating} sao</span>
          </div>

          {/* Comment input */}
          <Textarea
            placeholder="Nhận xét của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-3"
          />

          <Button onClick={(e) => handleSubmitReview(e)} disabled={submitting}>
            Gửi đánh giá
          </Button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Vui lòng đăng nhập để đánh giá</p>
      )}
    </section>
  );
};

export default ProductDetailPage;
