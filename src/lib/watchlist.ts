import { apiFetch } from "@/lib/api";

// Call this from a movie details page or MovieCard's "Add to watchlist" action.
// The movie object should come from your existing TMDB-backed API response.
export type MovieForWatchlist = {
  id: number;
  title: string;
  overview?: string | null;
  poster_path?: string | null;
  release_date?: string | null;
  vote_average?: number | null;
};

export async function addMovieToWatchlist(movie: MovieForWatchlist) {
  return apiFetch("/api/watchlist", {
    method: "POST",
    body: JSON.stringify({
      id: movie.id,
      title: movie.title,
      overview: movie.overview ?? "",
      poster_path: movie.poster_path ?? null,
      release_date: movie.release_date || null,
      vote_average: movie.vote_average ?? null,
    }),
  });
}

export async function removeMovieFromWatchlist(movieId: number) {
  return apiFetch(`/api/watchlist/${movieId}`, { method: "DELETE" });
}
