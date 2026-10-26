
"use client";

import RankedMovieRow from "@/components/RankedMovieRow";
import Pagination from "@/components/Pagination";
import type { MovieListItem } from "@/types/movie";

interface MovieRankedListProps {
  movies: MovieListItem[];
  page: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  pageSize?: number;
}

export default function MovieRankedList({
  movies,
  page,
  totalPages,
  totalResults,
  onPageChange,
  loading = false,
  pageSize = 20,
}: MovieRankedListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-xl bg-zinc-900"
          />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <p className="py-20 text-center text-zinc-400">
        No movies found.
      </p>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between text-sm text-zinc-400">
        <span>
          {totalResults.toLocaleString()} movies
        </span>
        <span>
          Page {page} of {totalPages}
        </span>
      </div>

      <div>
        {movies.map((movie, index) => (
          <RankedMovieRow
            key={movie.id}
            movie={movie}
            rank={(page - 1) * pageSize + index + 1}
          />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
}
