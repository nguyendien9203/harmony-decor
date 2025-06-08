import React from "react";
import Logo from "@/assets/harmony-decor.svg";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { NAVIGATION_MENU } from "@/constants/navigation";
import { ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnchorClick = (e, path) => {
    const targetId = path.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      e.preventDefault(); // Ngăn chuyển trang
      element.scrollIntoView({ behavior: "smooth" });
      // Thêm hash vào URL nếu cần
      window.history.pushState(null, "", path);
    }
  };

  // Handle redirect to login page
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 py-1 px-6 bg-white">
      <div className="container mx-auto px-4 flex items-center justify-between">
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
            {NAVIGATION_MENU.map(({ label, path, isAnchor }, index) => {
              if (isAnchor) {
                return (
                  <a
                    key={index}
                    href={path}
                    onClick={(e) => handleAnchorClick(e, path)}
                    className="h-full flex items-center transition-colors text-gray-700 hover:text-black hover:font-semibold cursor-pointer"
                  >
                    {label}
                  </a>
                );
              } else {
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
              }
            })}
          </nav>
        </div>

        {/* Right Section: Cart and Menu Icons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white shadow-sm"
          >
            <ShoppingBag className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            className="rounded-full px-6 font-medium shadow-sm"
            onClick={handleLoginClick}
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
