import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FullscreenLoader } from "@/components/ui/fullscreen-loader";

import {
  getProvinces,
  getDistrictsByProvinceId,
  getWardsByDistrictId,
  validateDiscountCode,
} from "@/features/checkout/checkout-service";
import { createOrder } from "@/features/order/order-service";
import { createPayment } from "@/features/payment/payment-service";
import { useCart } from "@/contexts/cart-context";
import { useBuyNow } from "@/contexts/buy-now-context";

import clsx from "clsx";
import { toast } from "sonner";
import { ChevronLeft, ShoppingCart } from "lucide-react";

const checkoutSchema = z.object({
  recipientName: z.string().min(1, "Vui lòng nhập họ tên người nhận"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .min(10, "Số điện thoại ít nhất 10 số")
    .max(15, "Số điện thoại tối đa 15 số")
    .regex(/^\d+$/, "Số điện thoại chỉ được chứa số"),
  street: z.string().min(1, "Vui lòng nhập địa chỉ cụ thể (số nhà, đường)"),
  province: z.coerce.number({
    required_error: "Vui lòng chọn tỉnh/thành phố",
    invalid_type_error: "Tỉnh/thành phố không hợp lệ",
  }),
  district: z.coerce.number({
    required_error: "Vui lòng chọn quận/huyện",
    invalid_type_error: "Quận/huyện không hợp lệ",
  }),
  ward: z.coerce.number({
    required_error: "Vui lòng chọn phường/xã",
    invalid_type_error: "Phường/xã không hợp lệ",
  }),
  note: z.string().optional(),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "ONLINE_PAYMENT"], {
    required_error: "Vui lòng chọn phương thức thanh toán",
  }),
});

const paymentMethods = [
  { value: "CASH_ON_DELIVERY", label: "Thanh toán khi nhận hàng" },
  { value: "ONLINE_PAYMENT", label: "Thanh toán online" },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { buyNowItem } = useBuyNow();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const items = location.state?.items || [];

  const itemsToCheckout = buyNowItem ? [buyNowItem] : items;

  // Fetch provinces
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    (async () => {
      if (!selectedProvinceId) return;
      setLoading(true);
      try {
        const data = await getDistrictsByProvinceId(selectedProvinceId);
        setDistricts(data);
        setSelectedDistrictId("");
        setWards([]);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedProvinceId]);

  // Fetch wards when district changes
  useEffect(() => {
    (async () => {
      if (!selectedDistrictId) return;
      setLoading(true);
      try {
        const data = await getWardsByDistrictId(selectedDistrictId);
        setWards(data);
      } catch (error) {
        console.error("Error fetching wards:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedDistrictId]);

  // Calculate total price of items in the cart
  const total = itemsToCheckout.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Handle discount code application
  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    const code = discountCode.trim().toUpperCase();
    if (!code) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const response = await validateDiscountCode(code, total);

      const { amount, type } = response;
      let discountAmount = 0;

      if (type === "PERCENT") {
        discountAmount = (total * amount) / 100;
      } else if (type === "FIXED") {
        discountAmount = amount;
      }

      setDiscountAmount(discountAmount);
      toast.success("Áp dụng mã giảm giá thành công!");
    } catch (error) {
      setDiscountAmount(0);
      console.error("Error applying discount code:", error);
      toast.error("Lỗi áp dụng mã giảm giá", {
        description:
          error?.response?.data?.message ||
          "Mã giảm giá không hợp lệ hoặc đã hết hạn.",
      });
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      paymentMethod: "CASH_ON_DELIVERY",
    },
  });

  const onSubmit = async (data) => {
    if (submitting) return;

    setSubmitting(true);
    try {
      const totalAmount = total - discountAmount;

      const orderData = {
        items: itemsToCheckout.map(({ id, quantity, price }) => ({
          productId: id,
          quantity,
          price,
        })),
        shippingAddress: {
          recipientName: data.recipientName,
          email: data.email,
          phone: data.phone,
          street: data.street,
          province: data.province,
          district: data.district,
          ward: data.ward,
          city: data.province,
        },
        total: total,
        discountCode: discountCode || null,
        discountAmount: discountAmount,
        totalAmount: totalAmount || 0,
        paymentMethod: data.paymentMethod,
        note: data.note || "",
      };

      const response = await createOrder(orderData);
      if (response.status === 201) {
        if (response.order.paymentMethod === "ONLINE_PAYMENT") {
          const paymentResponse = await createPayment(
            totalAmount,
            response.order._id
          );
          if (paymentResponse.status === 200) {
            window.location.href = paymentResponse.vnpUrl;
          } else {
            toast.error("Lỗi tạo thanh toán", {
              description: paymentResponse.data.message || "Vui lòng thử lại.",
            });
          }
        } else {
          // Redirect to order success page
          toast.success("Đặt hàng thành công!", {
            description: "Bạn sẽ nhận được email xác nhận đơn hàng.",
          });
          navigate("/order-success", {
            state: { order: response.order },
          });
        }
        clearCart();
      }
    } catch (error) {
      toast.error("Lỗi đặt hàng", {
        description:
          error?.response?.data?.message ||
          "Đặt hàng thất bại! Vui lòng thử lại.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <FullscreenLoader />;

  if (!buyNowItem && cart.length === 0) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center">
        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Không có sản phẩm để thanh toán
        </h2>
        <p className="text-gray-600 mb-6">
          Hãy chọn sản phẩm để mua hoặc thêm vào giỏ hàng.
        </p>
        <Button asChild>
          <Link to="/">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      className="mx-12 md:mx-0 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="col-span-2 space-y-6">
        {/* Thông tin giao hàng */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Thông tin giao hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 mb-4">
              {/* Row 1: Recipient Name */}
              <div className="grid gap-2">
                <Input
                  placeholder="Họ tên người nhận"
                  {...register("recipientName")}
                  className={clsx({ "border-red-500": errors.recipientName })}
                />
                <p className="text-red-600 text-sm">
                  {errors.recipientName?.message}
                </p>
              </div>

              {/* Row 2: Email and Phone Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Input
                    placeholder="Email"
                    {...register("email")}
                    className={clsx({ "border-red-500": errors.email })}
                  />
                  <p className="text-red-600 text-sm">
                    {errors.email?.message}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Input
                    placeholder="Số điện thoại"
                    {...register("phone")}
                    className={clsx({ "border-red-500": errors.phone })}
                  />
                  <p className="text-red-600 text-sm">
                    {errors.phone?.message}
                  </p>
                </div>
              </div>

              {/* Row 3: Province, District, Ward */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Province */}
                <div className="grid gap-2">
                  <Select
                    onValueChange={(val) => {
                      setValue("province", Number(val));
                      setSelectedProvinceId(val);
                    }}
                    value={watch("province")?.toString()}
                  >
                    <SelectTrigger
                      className={clsx("w-full", {
                        "border-red-500": errors.province,
                      })}
                    >
                      <SelectValue placeholder="Chọn tỉnh/thành phố" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(({ code, name }) => (
                        <SelectItem key={code} value={code.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <p className="text-red-600 text-sm">
                    {errors.province?.message}
                  </p>
                </div>

                {/* District */}
                <div className="grid gap-2">
                  <Select
                    onValueChange={(val) => {
                      setValue("district", Number(val));
                      setSelectedDistrictId(val);
                    }}
                    value={watch("district")?.toString()}
                    disabled={!selectedProvinceId}
                  >
                    <SelectTrigger
                      className={clsx("w-full", {
                        "border-red-500": errors.district,
                      })}
                    >
                      <SelectValue placeholder="Chọn quận/huyện" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map(({ code, name }) => (
                        <SelectItem key={code} value={code.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-red-600 text-sm">
                    {errors.district?.message}
                  </p>
                </div>

                {/* Ward */}
                <div className="grid gap-2">
                  <Select
                    onValueChange={(val) => setValue("ward", Number(val))}
                    value={watch("ward")?.toString()}
                    disabled={!selectedDistrictId}
                  >
                    <SelectTrigger
                      className={clsx("w-full", {
                        "border-red-500": errors.ward,
                      })}
                    >
                      <SelectValue placeholder="Chọn phường/xã" />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map(({ code, name }) => (
                        <SelectItem key={code} value={code.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-red-600 text-sm">{errors.ward?.message}</p>
                </div>
              </div>

              {/* Row 4: Street Address */}
              <div className="grid gap-2">
                <Input
                  placeholder="Số nhà, đường"
                  {...register("street")}
                  className={clsx({ "border-red-500": errors.street })}
                />
                <p className="text-red-600 text-sm">{errors.street?.message}</p>
              </div>

              {/* Row 5: Note */}
              <Textarea
                rows={3}
                placeholder="Ghi chú cho đơn hàng (tuỳ chọn)"
                {...register("note")}
                onChange={(e) => setValue("note", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Phương thức thanh toán */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Phương thức thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={watch("paymentMethod")}
              onValueChange={(value) => setValue("paymentMethod", value)}
            >
              {paymentMethods.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={value} />
                  <label
                    htmlFor={value}
                    className="text-sm font-medium leading-none"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-2 lg:col-span-1 h-full flex flex-col w-full overflow-hidden">
        <Card className="shadow-none flex flex-col flex-grow w-full overflow-hidden">
          <CardHeader>
            <CardTitle>Tóm tắt đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow">
            {/* Cart Items */}
            <div className="space-y-3 divide-y flex-grow mb-4">
              {itemsToCheckout.map(({ id, name, images, price, quantity }) => (
                <div key={id} className="flex justify-between items-center">
                  <div className="flex gap-3 items-center w-full">
                    {/* Product Image*/}
                    {images && (
                      <img
                        src={images}
                        alt={name}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    )}

                    {/* Product Info */}
                    <div className="flex flex-col justify-between w-full h-full">
                      {/* Name */}
                      <div className="font-semibold text-gray-800 mb-1 text-sm">
                        {name}
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>
                          {price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                        <span>x{quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Discount code input */}
            <div className="mb-4">
              <div className="flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  className="flex-grow"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <Button
                  variant="secondary"
                  onClick={(e) => handleApplyDiscount(e)}
                  disabled={submitting}
                >
                  Áp dụng
                </Button>
              </div>
            </div>

            {/* Total summary */}
            <div className="border-t pt-4 space-y-2 text-sm md:mt-auto">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>
                  {total.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-xs">
                  <span>Mã giảm giá</span>
                  <span>
                    -
                    {discountAmount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm">
                <span>Tổng cộng</span>
                <span>
                  {(total - discountAmount).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>

              <div className="flex justify-between mt-4 w-full">
                <Button
                  variant="outline"
                  className="w-auto border-none shadow-none"
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Quay lại
                </Button>
                <Button type="submit" disabled={submitting} className="w-2/3">
                  Đặt hàng
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default CheckoutPage;
