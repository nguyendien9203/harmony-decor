import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SortSelect = ({ sort, setSort }) => {
  return (
    <Select value={sort} onValueChange={setSort}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Sắp xếp theo giá" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="asc">Giá tăng dần</SelectItem>
        <SelectItem value="desc">Giá giảm dần</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SortSelect;
