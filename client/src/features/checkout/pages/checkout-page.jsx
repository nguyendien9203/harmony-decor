import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
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

import { clearCart } from "@/features/cart/cart-service";
import { createOrder } from "@/features/order/order-service";
import {
  getProvinces,
  getDistrictsByProvinceId,
  getWardsByDistrictId,
} from "@/features/checkout/checkout-service";

import clsx from "clsx";
import { toast } from "sonner";

const checkoutSchema = z.object({
  recipientName: z.string().min(1, "Vui lòng nhập họ tên người nhận"),
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
  const location = useLocation();
  const navigate = useNavigate();
  const items = location.state?.items || [];

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

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
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
    try {
      setSubmitting(true);
      const orderData = {
        items: items.map(({ id, quantity, price }) => ({
          productId: id,
          quantity,
          price,
        })),
        shippingAddress: {
          recipientName: data.recipientName,
          phone: data.phone,
          street: data.street,
          province: data.province,
          district: data.district,
          ward: data.ward,
          note: data.note || "",
          city: data.province,
        },
        paymentMethod: data.paymentMethod,
        totalAmount: total,
      };

      const response = await createOrder(orderData);
      toast.success(response?.message || "Đặt hàng thành công!");
      clearCart();
      navigate("/order-success", { state: { orderId: response.orderId } });
    } catch (error) {
      toast.error("Lỗi đặt hàng", {
        description: error?.message || "Đặt hàng thất bại! Vui lòng thử lại.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <FullscreenLoader />;

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

              <div className="grid gap-2">
                <Input
                  placeholder="Số điện thoại"
                  {...register("phone")}
                  className={clsx({ "border-red-500": errors.phone })}
                />
                <p className="text-red-600 text-sm">{errors.phone?.message}</p>
              </div>

              <div className="grid gap-2">
                <Input
                  placeholder="Số nhà, đường"
                  {...register("street")}
                  className={clsx({ "border-red-500": errors.street })}
                />
                <p className="text-red-600 text-sm">{errors.street?.message}</p>
              </div>

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

            <Textarea
              rows={3}
              placeholder="Ghi chú cho đơn hàng (tuỳ chọn)"
              {...register("note")}
            />
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

      <div className="col-span-2 lg:col-span-1 h-full flex flex-col">
        <Card className="shadow-none flex flex-col flex-grow">
          <CardHeader>
            <CardTitle>Tóm tắt đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow">
            <div className="space-y-3 divide-y flex-grow mb-4">
              {items.map(({ id, name, image, price }) => (
                <div key={id} className="flex justify-between items-center">
                  <div className="flex gap-3 items-center justify-center">
                    {image && (
                      <img
                        src={image}
                        alt={name}
                        className="w-14 h-14 rounded-lg object-cover border"
                      />
                    )}
                    <div className="text-sm">
                      <div className="font-semibold text-gray-800 mb-1">
                        {name}
                      </div>
                      <div className="text-gray-500">
                        {price.toLocaleString()}₫
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              <div className="flex justify-between font-bold text-sm">
                <span>Tổng cộng</span>
                <span>
                  {total.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full mt-4"
              >
                {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default CheckoutPage;
