
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import MovieRankedList from "@/components/MovieRankedList";
import {
  API_BASE_URL,
  movieCategories,
  isMovieCategory,
} from "@/lib/movieCategories";

import type {
  MovieListItem,
  MovieListResponse,
} from "@/types/movie";

const regions = [
  { value: "all", label: "Worldwide" },
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "JP", label: "Japan" },
];

export default function Page(){
  return <Suspense>
     <MovieCategoryPage></MovieCategoryPage>
  </Suspense>
}

export function MovieCategoryPage() {
  const params = useParams<{ category: string }>();
  const category = params.category;

  const [timeWindow, setTimeWindow] = useState<"day" | "week">("day");
  const [movies, setMovies] = useState<MovieListItem[]>([]);
  const [page, setPage] = useState(1);
  const [region, setRegion] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  const validCategory = isMovieCategory(category);

  const config = validCategory
    ? movieCategories[category]
    : null;

  useEffect(() => {
    if (!config) return;

    const controller = new AbortController();

    async function fetchMovies() {
      setLoading(true);
      setError(null);

      try {
        const url = new URL(
          `${API_BASE_URL}${config!.endpoint}`
        );
        if (category === "trending") {
            url.searchParams.set("timeWindow", timeWindow);
        }
        url.searchParams.set("page", String(page));
        url.searchParams.set("region", region);

        const response = await fetch(url.toString(), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: MovieListResponse = await response.json();

        if (!Array.isArray(data.results)) {
          throw new Error("Invalid API response");
        }

        if (controller.signal.aborted) return;

        setMovies(data.results);
        setTotalPages(data.total_pages);
        setTotalResults(data.total_results);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load movies."
        );

        setMovies([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchMovies();

    return () => controller.abort();
  }, [config, page, region, retry, category, timeWindow]);

  if (!config) {
    return (
      <main className="p-10 text-center text-white">
        <h1 className="text-2xl font-bold">
          Movie category not found
        </h1>
        <Link href="/movies/toprated" className="text-amber-400">
          Browse Top Rated Movies
        </Link>
      </main>
    );
  }

  function changePage(nextPage: number) {
    setPage(nextPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function changeRegion(value: string) {
    setRegion(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            {config.title}
          </h1>

          <p className="mt-3 text-zinc-400">
            {config.description}
          </p>
        </header>

        {/* Category navigation */}
        <nav className="mb-8 flex flex-wrap gap-2">
          {Object.entries(movieCategories).map(
            ([key, value]) => (
              <Link
                key={key}
                href={`/movies/${key}`}
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  key === category
                    ? "border-amber-400 bg-amber-400/15 text-amber-300"
                    : "border-zinc-700 text-zinc-400 hover:border-amber-400"
                }`}
              >
                {value.title}
              </Link>
            )
          )}
        </nav>

        

        {/* Region selector */}
        <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-6">
          <h2 className="text-lg font-semibold flex-1">
            Movie Rankings
          </h2>

          {category === "trending" && (
            <select
                value={timeWindow}
                onChange={(e) => {
                setTimeWindow(e.target.value as "day" | "week");
                setPage(1);
                }}
                className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white mx-2"
            >
                <option value="day">Trending Today</option>
                <option value="week">Trending This Week</option>
            </select>
            )}

          <select
            value={region}
            onChange={(event) =>
              changeRegion(event.target.value)
            }
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white outline-none focus:border-amber-400"
          >
            {regions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error ? (
          <div className="rounded-lg border border-red-900 p-6 text-red-300">
            <p>{error}</p>

            <button
              onClick={() => setRetry((value) => value + 1)}
              className="mt-3 text-sm underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <MovieRankedList
            movies={movies}
            page={page}
            totalPages={totalPages}
            totalResults={totalResults}
            onPageChange={changePage}
            loading={loading}
          />
        )}
      </div>
    </main>
  );
}
