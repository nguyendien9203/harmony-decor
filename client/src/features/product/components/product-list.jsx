import React, { useState, useEffect } from "react";
import SearchBar from "@/features/product/components/search-bar";
import SortSelect from "@/features/product/components/sort-select";
import { PaginationControls } from "@/components/ui/pagination-controls";
import ProductItem from "@/features/product/components/product-item";

import { getAllProducts } from "@/features/product/home-service";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 6,
  });

  // Debounce effect cho search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts({ page, search, sort });
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, sort]);

  return (
    <section
      id="collection"
      className="w-full pt-6 max-w-7xl mx-auto flex flex-col items-center mt-12"
    >
      <h2 className="text-3xl font-semibold mb-8">Bộ sưu tập</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <SearchBar
          search={searchInput}
          setSearch={setSearchInput}
          setPage={setPage}
        />
        <SortSelect sort={sort} setSort={setSort} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-center">
        {products.map((product) => (
          <ProductItem key={product._id} id={product._id} product={product} />
        ))}
      </div>

      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        setPage={setPage}
      />
    </section>
  );
}
