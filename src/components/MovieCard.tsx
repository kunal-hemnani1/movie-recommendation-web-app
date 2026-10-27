
"use client"
import type { DiscoverMovie, MovieDetail, RecommendedMovieDetail } from "@/types/movieResponseType";
import { useRouter } from "next/navigation";
import { addMovieToWatchlist } from "@/lib/watchlist";
interface MovieCardProps {
  movie: MovieDetail | RecommendedMovieDetail | DiscoverMovie;
  onClick?: (movie: MovieDetail) => void;
  showrank: boolean;
  num: number;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

export default function MovieCard({
  movie,
  onClick,
  showrank,
  num
}: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "N/A";

  const rating = Number(movie.vote_average);
  const router = useRouter()

  return (
    <article
      onClick={() => router.push(`/movie/${movie.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.(movie);
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className="
        group w-full max-w-full cursor-pointer overflow-hidden
        rounded-xl border border-white/20 bg-zinc-950 p-2
        text-white shadow-md transition duration-200
        hover:-translate-y-1 hover:border-white/40 hover:shadow-xl
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-amber-400 relative
      "
    >



      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-800">
          {
          showrank && <p className="absolute ordinal text-6xl z-199 left-2 bottom-2 font-bold opacity-50">
            {num}
          </p>
          }
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            loading="lazy"
            className="
              h-full w-full object-cover transition duration-300
              hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-zinc-400">
            No poster available
          </div>
        )}

        {/* Rating badge */}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/75 px-2 py-1 text-xs font-semibold backdrop-blur">
          <span className="text-amber-400">★</span>
          <span>
            {Number.isFinite(rating) ? rating.toFixed(1) : "N/A"}
          </span>
        </div>
        

        {/* Release year */}
        <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-2 py-1 text-xs text-zinc-200 backdrop-blur">
          {year}
        </span>
      </div>

      {/* Movie details */}
      <div className="space-y-1 px-1 pb-1 pt-3">
        <h3
          className="line-clamp-2 min-h-10 text-sm font-semibold leading-5"
          title={movie.title}
        >
          {movie.title}
        </h3>


        <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
          <span className="truncate">
            {movie.runtime > 0
              ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
              : "Runtime N/A"}
          </span>

          <span className="shrink-0">
            {movie.vote_count.toLocaleString()} votes
          </span>
        </div>

        {movie.genres?.length > 0 && (
          <p className="truncate pt-1 text-xs text-zinc-500">
            {movie.genres
              .slice(0, 2)
              .map((genre) => genre.name)
              .join(" · ")}
          </p>
        )}
      </div>
    </article>
  );
}
