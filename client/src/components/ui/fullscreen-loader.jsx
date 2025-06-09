import { Loader2 } from "lucide-react";

export const FullscreenLoader = () => (
  <div className="fixed inset-0 bg-white/40 backdrop-blur-xs flex flex-col items-center justify-center z-50">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
    <p className="mt-4 text-sm text-gray-500">Đang xử lý, vui lòng đợi...</p>
  </div>
);
