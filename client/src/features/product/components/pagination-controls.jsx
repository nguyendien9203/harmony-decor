import { Button } from "@/components/ui/button";

const PaginationControls = ({ currentPage, totalPages, setPage }) => {
  return (
    <div className="flex justify-center gap-4 mt-8">
      <Button
        variant="outline"
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        Trang trước
      </Button>
      <span className="flex items-center text-sm font-medium">
        Trang {currentPage} / {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Trang sau
      </Button>
    </div>
  );
};

export default PaginationControls;
