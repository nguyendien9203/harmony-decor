import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PaginationControls = ({ currentPage, totalPages, setPage }) => {
  return (
    <Pagination className="flex justify-center mt-6 w-full overflow-x-auto">
      <PaginationContent className="flex flex-wrap justify-center gap-2">
        {/* Prev */}
        <PaginationItem>
          <Button
            variant="outline"
            size="sm"
            className="px-2 sm:px-4 text-xs sm:text-sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Trang trước</span>
          </Button>
        </PaginationItem>

        {/* Page numbers (hidden on mobile) */}
        <div className="hidden sm:flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                onClick={() => setPage(i + 1)}
                isActive={currentPage === i + 1}
                className="text-sm"
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </div>

        {/* Next */}
        <PaginationItem>
          <Button
            variant="outline"
            size="sm"
            className="px-2 sm:px-4 text-xs sm:text-sm"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <span className="hidden sm:inline">Trang sau</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
