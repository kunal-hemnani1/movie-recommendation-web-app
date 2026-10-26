
"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = Math.max(
    1,
    Math.min(page - 2, totalPages - 4)
  );

  const end = Math.min(totalPages, start + 4);

  const pages = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  );

  return (
    <nav
      aria-label="Movie pagination"
      className="flex flex-wrap items-center justify-center gap-2 py-8"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border border-zinc-700 px-3 py-2 text-sm
                   text-zinc-300 transition hover:border-amber-400
                   hover:text-amber-300 disabled:cursor-not-allowed
                   disabled:opacity-40"
      >
        Previous
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          aria-current={pageNumber === page ? "page" : undefined}
          onClick={() => onPageChange(pageNumber)}
          className={`min-w-10 rounded-lg border px-3 py-2 text-sm
                      font-medium transition ${
            pageNumber === page
              ? "border-amber-400 bg-amber-400/20 text-amber-300"
              : "border-zinc-700 text-zinc-300 hover:border-amber-400"
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border border-zinc-700 px-3 py-2 text-sm
                   text-zinc-300 transition hover:border-amber-400
                   hover:text-amber-300 disabled:cursor-not-allowed
                   disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
