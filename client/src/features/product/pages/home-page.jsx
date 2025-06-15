import React from "react";
import ImageSlider from "@/features/product/components/image-slider";
import ProductList from "@/features/product/components/product-list";
import AboutUs from "@/features/product/components/about-us";
import Collection from "@/components/ui/collection";

const HomePage = () => {
  return (
    <>
      <ImageSlider />
      <ProductList />
      <AboutUs />
      <Collection />
    </>
  );
};

export default HomePage;
