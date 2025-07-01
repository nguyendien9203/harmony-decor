import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Pencil, CheckCheck, Lock, User } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { FullscreenLoader } from "@/components/ui/fullscreen-loader";
import { toast } from "sonner";

import clsx from "clsx";
import { changePassword } from "@/features/auth/auth-service";
import { updateUserInfo } from "@/features/user/user-service";

// Zod schema for form validation
const schema = z
  .object({
    currentPassword: z.string().min(8, "Mật khẩu hiện tại ít nhất 8 ký tự"),
    newPassword: z.string().min(8, "Mật khẩu mới ít nhất 8 ký tự"),
    confirmPassword: z.string().min(8, "Xác nhận mật khẩu ít nhất 8 ký tự"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu mới không khớp",
    path: ["confirmPassword"],
  });

const infoSchema = z.object({
  name: z.string().min(2, "Họ tên ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .min(10, "Ít nhất 10 số")
    .max(15, "Tối đa 15 số")
    .regex(/^\d+$/, "Chỉ chứa số"),
  avatar: z.instanceof(FileList).optional(),
});

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    watch: watchInfo,
    reset: resetInfo,
    formState: { errors: infoErrors },
  } = useForm({
    resolver: zodResolver(infoSchema),
    mode: "onChange",
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
      email: user.email || "",
    },
  });

  useEffect(() => {
    resetInfo({
      name: user.name || "",
      phone: user.phone || "",
      email: user.email || "",
      avatar: null,
    });
  }, [user]);

  useEffect(() => {
    const file = watchInfo("avatar")?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }
  }, [watchInfo("avatar")]);

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await changePassword(
        user.email,
        data.currentPassword,
        data.newPassword
      );
      toast.success(response?.message || "Đổi mật khẩu thành công!");
      reset();
    } catch (error) {
      toast.error(error?.message || "Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const onUpdateInfo = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      if (data.avatar && data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }

      const response = await updateUserInfo(formData);

      toast.success(response?.message || "Cập nhật thành công!");
      setUser(response.data);
      setPreview("");
    } catch (error) {
      setPreview("");
      toast.error(error?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <FullscreenLoader />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold">Hồ sơ</h2>

      {/* Thông tin cá nhân */}
      <Card className="bg-white shadow-none">
        <CardHeader className="flex flex-row justify-between items-center">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <User className="w-4 h-4" />
            Thông tin cá nhân
          </h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-1" /> Sửa
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Cập nhật thông tin cá nhân</DialogTitle>
              </DialogHeader>

              <form
                onSubmit={handleSubmitInfo(onUpdateInfo)}
                className="space-y-4"
                noValidate
              >
                <div className="flex flex-col gap-6">
                  {/* Avatar */}
                  <div className="grid gap-2">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={
                            preview ||
                            user.avatar ||
                            "https://i.pravatar.cc/100"
                          }
                          alt="avatar"
                        />
                        <AvatarFallback>AVT</AvatarFallback>
                      </Avatar>

                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        {...registerInfo("avatar")}
                      />
                    </div>
                  </div>

                  {/* Họ tên */}
                  <div className="grid gap-2">
                    <Label htmlFor="name">Họ tên</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className={clsx({ "border-red-500": infoErrors.name })}
                      {...registerInfo("name")}
                    />
                    <p className="text-red-600 text-sm min-h-[1.5rem]">
                      {infoErrors.name?.message}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      className={clsx({ "border-red-500": infoErrors.email })}
                      {...registerInfo("email")}
                    />
                    <p className="text-red-600 text-sm min-h-[1.5rem]">
                      {infoErrors.email?.message}
                    </p>
                  </div>

                  {/* Số điện thoại */}
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0123456789"
                      className={clsx({ "border-red-500": infoErrors.phone })}
                      {...registerInfo("phone")}
                    />
                    <p className="text-red-600 text-sm min-h-[1.5rem]">
                      {infoErrors.phone?.message}
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" className="rounded-full w-full">
                    Lưu thay đổi
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar và trạng thái xác thực */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={user.avatar || "https://i.pravatar.cc/100"}
                alt="avatar"
              />
              <AvatarFallback>RR</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">
                {user.name || "Không xác định"}
              </h2>
              {user.verified ? (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCheck className="w-4 h-4" />
                  Đã xác thực
                </p>
              ) : (
                <p className="text-sm text-gray-500">Chưa xác thực</p>
              )}
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="text-gray-400">Email</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-gray-400">Số điện thoại</p>
              <p>{user.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Đổi mật khẩu */}
      <Card className="bg-white shadow-none">
        <CardHeader className="flex flex-row justify-between items-center">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Đổi mật khẩu
          </h3>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại"
                  {...register("currentPassword")}
                  className={clsx(errors.currentPassword && "border-red-500")}
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  {...register("newPassword")}
                  className={clsx(errors.newPassword && "border-red-500")}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Xác nhận mật khẩu mới"
                  {...register("confirmPassword")}
                  className={clsx(errors.confirmPassword && "border-red-500")}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 mt-4">
            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={
                loading ||
                !watch("newPassword") ||
                !watch("confirmPassword") ||
                watch("newPassword") !== watch("confirmPassword")
              }
            >
              Đặt lại mật khẩu
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
