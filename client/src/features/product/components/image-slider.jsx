import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SLIDERS } from "@/constants/slides";
import { useScrollToSection } from "@/hooks/use-scroll-to";
import { useLocation } from "react-router-dom";

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const { handleMenuClick } = useScrollToSection();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollToId = params.get("scrollTo");

    if (scrollToId) {
      const element = document.getElementById(scrollToId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <section
      id="home"
      className="relative w-full rounded-none md:rounded-2xl overflow-hidden"
    >
      {/* Slide wrapper */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDERS.map((slide, index) => (
          <div key={index} className="w-full h-[700px] relative flex-shrink-0">
            <img
              src={slide.image}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover"
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-black/30 flex flex-col items-start justify-center text-white text-left px-4 md:px-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl mb-6 drop-shadow">
                {slide.description}
              </p>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white hover:bg-white hover:text-black rounded-full shadow-sm transition-colors duration-300"
                onClick={() => handleMenuClick(slide.sectionId)}
              >
                {slide.buttonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {SLIDERS.map((_, index) => (
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
