import { Loader2 } from "lucide-react";
import React from "react";

export default function Loader({ className = "w-4 h-4" }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}
