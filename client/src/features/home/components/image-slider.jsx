import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import slider1 from "@/assets/slider/slider1.png";
import slider2 from "@/assets/slider/slider2.png";
import slider3 from "@/assets/slider/slider3.png";

const images = [slider1, slider2, slider3];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full rounded-xl shadow-md overflow-hidden">
      {/* Slide wrapper */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <div key={index} className="w-full h-[700px] relative flex-shrink-0">
            <img
              src={img}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover"
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-black/30 flex flex-col items-start justify-center text-white text-left px-4 md:px-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow">
                Trang Trí Bàn Học
              </h2>
              <p className="text-lg md:text-xl mb-6 drop-shadow">
                Khám phá không gian sống hiện đại và tinh tế
              </p>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white hover:bg-white hover:text-black rounded-full shadow-sm transition-colors duration-300"
              >
                Khám phá bộ sưu tập
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
