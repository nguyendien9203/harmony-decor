import { Button } from "@/components/ui/button";
import ProductCard from "@/features/home/components/product-cart";

// Sample product data
const products = [
  {
    id: 1,
    name: "Green English Ivy Vine",
    price: 24.99,
    imageUrl: "/images/ivy1.jpg",
  },
  { id: 2, name: "Fiddle Leaf Fig", price: 34.99, imageUrl: "/images/fig.jpg" },
  { id: 3, name: "Snake Plant", price: 19.99, imageUrl: "/images/snake.jpg" },
  // { id: 4, name: "Peace Lily", price: 29.99, imageUrl: "/images/lily.jpg" },
  // { id: 5, name: "ZZ Plant", price: 14.99, imageUrl: "/images/zz.jpg" },
  // { id: 6, name: "Aloe Vera", price: 12.99, imageUrl: "/images/aloe.jpg" },
  // { id: 7, name: "Spider Plant", price: 17.99, imageUrl: "/images/spider.jpg" },
  // { id: 8, name: "Rubber Plant", price: 22.99, imageUrl: "/images/rubber.jpg" },
];

export default function MostPopular() {
  return (
    <section className="w-full p-6 max-w-7xl mx-auto flex flex-col items-center mt-12">
      <h2 className="text-3xl font-semibold mb-8">Phổ biến nhất</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-center">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <Button variant="outline" size="lg" className="rounded-full mt-7">
        Xem tất cả
      </Button>
    </section>
  );
}
