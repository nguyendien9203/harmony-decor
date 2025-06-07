import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
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
            <li>
              <a href="/" className="hover:underline">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#about" className="hover:underline">
                Về chúng tôi
              </a>
            </li>
            <li>
              <a href="/collection" className="hover:underline">
                Bộ sưu tập
              </a>
            </li>
            <li></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Hỗ trợ</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>
              <a href="/faq" className="hover:underline">
                Câu hỏi thường gặp
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:underline">
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
              <Phone className="w-4 h-4" /> +84 123 456 789
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> harmonydecor101@gmail.com
            </li>
            <li className="flex items-center gap-3 pt-2">
              <a href="#" className="hover:text-white">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white">
                <Instagram className="w-4 h-4" />
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
