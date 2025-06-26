import { Separator } from "@/components/ui/separator";
import { Facebook, Mail, Phone } from "lucide-react";
import { NAVIGATION_MENU } from "@/constants/navigation";
import { useScrollToSection } from "@/hooks/use-scroll-to";

export default function Footer() {
  const { handleMenuClick } = useScrollToSection();
  return (
    <footer className="bg-black text-white px-6 py-10">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4 md:px-8 ">
        {/* Logo + Description */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Harmony Decor</h2>
          <p className="text-sm text-gray-300">
            Nền tảng mô phỏng bàn học 3D, giúp bạn thỏa sức sáng tạo không gian
            cá nhân.
          </p>
        </div>

        {/* Menu */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Menu</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            {NAVIGATION_MENU.map(({ label, id }, index) => (
              <li
                key={index}
                onClick={() => handleMenuClick(id)}
                className="cursor-pointer hover:underline"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Hỗ trợ</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>
              <a href="/privacy-policy" className="hover:underline">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="/terms-of-service" className="hover:underline">
                Điều khoản dịch vụ
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Liên hệ</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> +84 988 043 093
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> harmonydecor101@gmail.com
            </li>
            <li>
              <a
                href="https://www.facebook.com/harmonydecor.space"
                className="hover:text-white flex items-center gap-2 text-gray-300 hover:underline"
              >
                <Facebook className="w-4 h-4" /> Harmony Decor
              </a>
            </li>
          </ul>
        </div>
      </div>

      <Separator className="my-6 bg-gray-700" />

      <div className="text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Harmony Decor. All rights reserved.
      </div>
    </footer>
  );
}
