
"use client";

import { useEffect, useState } from "react";
import GenreFilter from "@/components/GenreFilter";
import MovieGrid from "@/components/MovieGrid";
import type {
  DiscoverMovie,
  DiscoverResponse,
  GenreOption,
} from "@/types/movieResponseType";

const API_URL =
  "https://vigilant-waffle-v64wxqxg659jcpjx6-8000.app.github.dev/discover";

const genreList: GenreOption[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Abenteuer" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export default function Page() {
  const [genres, setGenres] = useState<number[]>([]);
  const [movies, setMovies] = useState<DiscoverMovie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(page),
      });

      if (genres.length > 0) {
        params.set("genres", genres.join(","));
      }

      try {
        const response = await fetch(
          `${API_URL}?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch movies (${response.status})`
          );
        }

        const data: DiscoverResponse = await response.json();

        setMovies(data.results ?? []);
        setPage(data.page ?? page);
        setTotalPages(data.total_pages ?? 1);
        setTotalResults(data.total_results ?? 0);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
        setMovies([]);
        setTotalPages(1);
        setTotalResults(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => controller.abort();
  }, [genres, page]);

  function handleGenreChange(ids: number[]) {
    setGenres(ids);
    setPage(1);
  }

  function handlePageChange(nextPage: number) {
    if (nextPage >= 1 && nextPage <= totalPages) {
      setPage(nextPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Discover Movies
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Explore movies and find your next favorite.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Filter by genre</h2>

          <GenreFilter
            genres={genreList}
            selectedGenres={genres}
            onChange={handleGenreChange}
          />

          {genres.length > 0 && (
            <button
              type="button"
              onClick={() => handleGenreChange([])}
              className="text-sm text-amber-300 hover:text-amber-200"
            >
              Clear filters
            </button>
          )}
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">
              {genres.length > 0 ? "Filtered Movies" : "Popular Movies"}
            </h2>

            <span className="text-sm text-zinc-400">
              {loading
                ? "Loading..."
                : `${totalResults.toLocaleString()} movies`}
            </span>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-900 bg-red-950/30 p-4 text-red-300">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => {
                  // Trigger another request with the same filters.
                  setPage((current) => current);
                  setGenres((current) => [...current]);
                }}
                className="mt-2 underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <MovieGrid
              movies={movies}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </section>
      </div>
    </main>
  );
}
