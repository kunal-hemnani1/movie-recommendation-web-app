"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";

const BASE_URL =
  "https://vigilant-waffle-v64wxqxg659jcpjx6-8000.app.github.dev";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const [input, setInput] = useState(query);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keep the search input synchronized with the URL.
  useEffect(() => {
    setInput(query);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function searchMovies() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          name: query.trim(),
          page: String(page),
        });

        const response = await fetch(
          `${BASE_URL}/search?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to search for movies.");
        }

        const result = await response.json();

        if (!result || !Array.isArray(result.results)) {
          throw new Error(
            typeof result === "string"
              ? result
              : "Unexpected response from the movie API."
          );
        }

        setData(result);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
          setData(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    searchMovies();

    return () => controller.abort();
  }, [query, page]);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handlePageChange(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));

    router.push(`/search?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {query && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Results for &ldquo;{query}&rdquo;
          </h2>

          {data && (
            <p className="mt-1 text-sm text-gray-400">
              {data.total_results.toLocaleString()} movies found
            </p>
          )}
        </div>
      )}

      {loading && (
        <div className="py-16 text-center text-gray-400">
          Searching movies...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-900 bg-red-950/30 p-5 text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && !query && (
        <div className="py-16 text-center text-gray-400">
          Enter a movie title to get started.
        </div>
      )}

      {!loading && !error && query && data?.results.length === 0 && (
        <div className="py-16 text-center">
          <h3 className="text-xl font-semibold text-white">
            No movies found
          </h3>
          <p className="mt-2 text-gray-400">
            Try another title or check your spelling.
          </p>
        </div>
      )}

      {!loading && !error && data && data.results.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {data.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showrank={false} num={0} />
            ))}
          </div>

          {data.total_pages > 1 && (
            <div className="mt-10">
              <Pagination
                page={data.page}
                totalPages={Math.min(data.total_pages, 500)}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-gray-400">
          Loading search...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}