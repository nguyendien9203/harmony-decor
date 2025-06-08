import { Input } from "@/components/ui/input";

const SearchBar = ({ search, setSearch, setPage }) => {
  return (
    <Input
      type="text"
      placeholder="Tìm sản phẩm..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
      className="w-full sm:max-w-sm"
    />
  );
};

export default SearchBar;
