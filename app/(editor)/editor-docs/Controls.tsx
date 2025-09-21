"use client";

import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Material } from "@prisma/client";

interface DocControlsProps {
  totalPages: number;
  materials: Material[];
}

export default function Controls({ totalPages, materials }: DocControlsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("q") || "";
  const materialFilter = searchParams.get("material") || "all";

  const [searchTerm, setSearchTerm] = useState(query);

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, searchParams]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== query) {
        handleSearch(searchTerm);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, query, handleSearch]);

  const handleLimitChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", value);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleMaterialChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (value && value !== "all") {
      params.set("material", value);
    } else {
      params.delete("material");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const createPageURL = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return "#";
    }
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPaginationItems = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage > totalPages - 4) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const paginationItems = getPaginationItems(page, totalPages);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Input
          placeholder="Cari materi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-[300px]"
        />
        <Select value={materialFilter} onValueChange={handleMaterialChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter peminatan" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Peminatan</SelectItem>
              {materials.map((material) => (
                <SelectItem key={material.id} value={material.id}>
                  {material.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            Item per halaman
          </p>
          <Select value={String(limit)} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((val) => (
                <SelectItem key={val} value={String(val)}>
                  {val}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={createPageURL(page - 1)}
                  aria-disabled={page <= 1}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {paginationItems.map((item, index) =>
                item === "..." ? (
                  <PaginationItem key={`${item}-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href={createPageURL(item as number)}
                      isActive={page === item}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  href={createPageURL(page + 1)}
                  aria-disabled={page >= totalPages}
                  className={
                    page >= totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
