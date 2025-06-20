import React, { useState, useEffect } from "react";
import Logo from "@/assets/harmony-decor.svg";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { NAVIGATION_MENU } from "@/constants/navigation";
import { ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/contexts/cart-context";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const productCount = cart.length;

  return (
    <header className="sticky top-0 z-50 py-1 px-6 bg-white">
      <div className="container mx-auto w-full flex items-center justify-between px-4 lg:px-[130px] h-[100px]">
        {/* Left Section: Logo and Navigation Menu */}
        <div className="flex items-center gap-10 h-full">
          {/* Logo */}
          <div>
            <a href="/">
              <img
                src={Logo}
                alt="Harmony Decor"
                className="w-28 object-contain transition-transform duration-300"
              />
            </a>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-6 h-full items-center text-sm font-medium text-black">
            {NAVIGATION_MENU.map(({ label, path }, index) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={index}
                  to={path}
                  className={`h-full flex items-center transition-colors text-gray-700 hover:text-black hover:font-semibold cursor-pointer ${
                    isActive ? "text-black font-semibold" : ""
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Cart and Menu Icons */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => navigate("/cart")}
            >
              <ShoppingBag className="w-5 h-5" />
            </Button>

            {productCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {productCount}
              </span>
            )}
          </div>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                {isMobile &&
                  NAVIGATION_MENU.map(({ label, path }, index) => (
                    <DropdownMenuItem asChild key={index}>
                      <Link to={path}>{label}</Link>
                    </DropdownMenuItem>
                  ))}

                {isMobile && <DropdownMenuSeparator />}

                <DropdownMenuItem asChild>
                  <Link to="/orders">Đơn hàng</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Hồ sơ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                >
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="rounded-full" asChild>
              <Link to="/login">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
