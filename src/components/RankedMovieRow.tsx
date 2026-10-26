
import Link from "next/link";
import type { MovieListItem } from "@/types/movie";

interface RankedMovieRowProps {
  movie: MovieListItem;
  rank: number;
}

const IMAGE_URL = "https://image.tmdb.org/t/p/w342";

export default function RankedMovieRow({
  movie,
  rank,
}: RankedMovieRowProps) {
  const poster = movie.poster_path
    ? `${IMAGE_URL}${movie.poster_path}`
    : null;

  const year = movie.release_date?.slice(0, 4) || "N/A";

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group block border-b border-zinc-800 py-6
                 transition-colors hover:bg-zinc-900/50"
    >
      <article className="flex items-center gap-4 sm:gap-8">
        {/* Serial number */}
        <div className="w-9 shrink-0 self-start pt-1 sm:w-16">
          <span
            className="text-2xl font-bold tracking-tight
                       text-zinc-600 transition-colors
                       group-hover:text-amber-400 sm:text-4xl"
          >
            {String(rank).padStart(2, "0")}
          </span>
        </div>

        {/* Movie details */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <h2
              className="text-lg font-semibold leading-tight
                         text-white transition-colors
                         group-hover:text-amber-400 sm:text-2xl"
            >
              {movie.title}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
              <span>{year}</span>
              <span className="text-zinc-700">•</span>
              <span className="uppercase">
                {movie.original_language}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-amber-400">
              ★ {movie.vote_average.toFixed(1)}
            </span>

            <span className="text-xs text-zinc-500">
              {movie.vote_count.toLocaleString()} votes
            </span>
          </div>

          {/* Overview */}
          <p className="line-clamp-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:line-clamp-4">
            {movie.overview || "No description available."}
          </p>

          <span className="text-sm font-medium text-amber-400">
            View movie details →
          </span>
        </div>

        {/* Poster on right */}
        <div
          className="w-28 shrink-0 overflow-hidden rounded-lg
                     bg-zinc-800 shadow-lg sm:w-40 md:w-48"
        >
          {poster ? (
            <img
              src={poster}
              alt={`${movie.title} poster`}
              loading="lazy"
              className="aspect-[2/3] w-full object-cover
                         transition-transform duration-300
                         group-hover:scale-105"
            />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center p-3 text-center text-xs text-zinc-500">
              No poster
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
