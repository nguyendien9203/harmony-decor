import React from "react";
import ImageSlider from "@/features/home/components/image-slider";
import MostPopular from "@/features/home/components/most-popular";
import AboutUs from "@/features/home/components/about-us";

const HomePage = () => {
  return (
    <>
      <ImageSlider />
      <MostPopular />
      <AboutUs />
    </>
  );
};

export default HomePage;
