import React, { useState, useEffect } from "react";
import Logo from "@/assets/harmony-decor-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { getAccountMenuItems, NAVIGATION_MENU } from "@/constants/navigation";
import { ShoppingBag, Menu, Lightbulb as BulbOutlined } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/contexts/cart-context";
import { useScrollToSection } from "@/hooks/use-scroll-to";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const { handleMenuClick } = useScrollToSection();
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
  const menuItems = getAccountMenuItems(logout, navigate);

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
            {NAVIGATION_MENU.map(({ label, id }, index) => (
              <span
                key={index}
                onClick={() => handleMenuClick(id)}
                className="h-full flex items-center cursor-pointer transition-colors text-gray-700 hover:text-black hover:font-semibold"
              >
                {label}
              </span>
            ))}
          </nav>
        </div>

        {/* Right Section: Cart and Menu Icons */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => {
                navigate("/decor-3d");
              }}
              alt="3D Decor"
            >
              <BulbOutlined className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full ml-3"
              onClick={() => navigate("/cart")}
            >
              <ShoppingBag className="w-5 h-5" />
            </Button>

            {productCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-0.5 -right-0.5 text-white w-4 h-4 flex items-center justify-center text-[10px] font-semibold rounded-full"
              >
                {productCount}
              </Badge>
            )}
          </div>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 z-50">
                {isMobile &&
                  NAVIGATION_MENU.map(({ label, id }, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => handleMenuClick(id)}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}

                {isMobile && <DropdownMenuSeparator />}

                {/* <DropdownMenuItem asChild>
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
                </DropdownMenuItem> */}

                {menuItems.map(({ label, path, onClick }, index) =>
                  onClick ? (
                    <DropdownMenuItem
                      key={index}
                      onClick={onClick}
                      className="cursor-pointer"
                    >
                      {label}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem key={index} asChild>
                      <Link to={`/${path}`} className="w-full cursor-pointer">
                        {label}
                      </Link>
                    </DropdownMenuItem>
                  )
                )}
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
