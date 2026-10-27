
"use client";

import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import type { DiscoverMovie } from "@/types/movieResponseType";

interface MovieGridProps {
  movies: DiscoverMovie[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function MovieGrid({
  movies,
  page,
  totalPages,
  onPageChange,
  loading = false,
}: MovieGridProps) {
  if (loading) {
    return (
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3
                   lg:grid-cols-4 xl:grid-cols-5"
      >
        {Array.from({ length: 10 }, (_, index) => (
          <div
            key={index}
            className="aspect-[2/3] animate-pulse rounded-xl bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <p className="py-16 text-center text-zinc-400">
        No movies found. Try selecting different genres.
      </p>
    );
  }

  return (
    <section>
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3
                   lg:grid-cols-4 xl:grid-cols-5"
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} showrank={false} num={0}/>
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
