"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationControlsProps) {
  return (
    <Pagination className="mt-8 justify-end">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(currentPage - 1);
                console.log("Previous page:", currentPage - 1);
              }}
            />
          </PaginationItem>
        )}
        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href="#"
              isActive={currentPage === index + 1}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(index + 1);
                console.log("Current page:", index + 1);
              }}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(currentPage + 1);
                console.log("Next page:", currentPage + 1);
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
