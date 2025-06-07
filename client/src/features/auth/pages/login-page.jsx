import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-sm mt-10">
        <CardHeader>
          <CardTitle>Đăng nhập tài khoản của bạn</CardTitle>
          <CardDescription>
            Nhập email và mật khẩu để đăng nhập vào tài khoản của bạn.
          </CardDescription>
          <CardAction>
            <Button variant="link" asChild>
              <Link to="/register">Đăng ký</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <a
                    href="forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full rounded-full">
            Đăng nhập
          </Button>
          <Button variant="outline" className="w-full rounded-full">
            Đăng nhập với Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
