import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = "Chọn một mục",
  disabled = false,
}) => {
  const [search, setSearch] = useState("");

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Select
      value={value}
      onValueChange={(val) => {
        onChange(val);
        // Không reset search để giữ input đang nhập
        // Nếu bạn muốn reset khi chọn, có thể bỏ comment dòng dưới:
        // setSearch("");
      }}
      disabled={disabled}
      onOpenChange={(open) => {
        if (open === false) {
          // Khi dropdown đóng, bạn có thể reset search nếu muốn:
          setSearch("");
        }
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* Custom Search Input */}
        <div className="px-2 py-1 sticky top-0 bg-white z-10">
          {/* <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full px-2 py-1 text-sm border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          />
        </div>

        <SelectGroup>
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-muted-foreground">
              Không tìm thấy
            </div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
