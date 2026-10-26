"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch, clearSession, getToken } from "@/lib/api";

type WatchlistMovie = {
  id: number;
  movie_id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number | null;
  added_at: string;
};

const imageUrl = (path: string | null) => path ? `https://image.tmdb.org/t/p/w342${path}` : null;

export default function WatchlistPage() {
  const [movies, setMovies] = useState<WatchlistMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState<number | null>(null);

  async function load() {
    if (!getToken()) { window.location.href = "/login?next=%2Fwatchlist"; return; }
    setLoading(true); setError("");
    try { setMovies(await apiFetch("/api/watchlist")); }
    catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load watchlist.";
      if (message.toLowerCase().includes("token") || message.toLowerCase().includes("auth")) { clearSession(); window.location.href = "/login?next=%2Fwatchlist"; return; }
      setError(message);
    } finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  async function remove(movieId: number) {
    setRemoving(movieId); setError("");
    try { await apiFetch(`/api/watchlist/${movieId}`, { method: "DELETE" }); setMovies((current) => current.filter((movie) => movie.movie_id !== movieId)); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to remove movie."); }
    finally { setRemoving(null); }
  }

  return <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 text-white sm:px-6">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Your collection</p><h1 className="text-3xl font-bold sm:text-4xl">My Watchlist</h1><p className="mt-2 text-gray-400">Only you can access movies saved to your account.</p></div><Link href="/preferences" className="rounded-lg border border-gray-700 px-4 py-2 text-sm hover:border-blue-400">Edit genre preferences</Link></div>
    {error && <p role="alert" className="mb-5 rounded-lg border border-red-900 bg-red-950/40 p-3 text-red-300">{error}</p>}
    {loading ? <p className="py-16 text-center text-gray-400">Loading your watchlist…</p> : movies.length === 0 ? <section className="rounded-2xl border border-dashed border-gray-700 px-5 py-16 text-center"><h2 className="text-xl font-semibold">Your watchlist is empty</h2><p className="mt-2 text-gray-400">Browse movies and add the ones you want to watch later.</p><Link href="/popular" className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500">Explore popular movies</Link></section> : <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{movies.map((movie) => <article key={movie.movie_id} className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900"><Link href={`/movie/${movie.movie_id}`} aria-label={`View ${movie.title}`} className="block">{imageUrl(movie.poster_path) ? <img src={imageUrl(movie.poster_path)!} alt={`${movie.title} poster`} loading="lazy" className="aspect-[2/3] w-full object-cover" /> : <div className="flex aspect-[2/3] items-center justify-center bg-gray-800 p-4 text-center text-gray-400">No poster available</div>}</Link><div className="p-3"><h2 className="line-clamp-2 min-h-12 font-semibold">{movie.title}</h2><div className="mt-1 flex justify-between gap-2 text-xs text-gray-400"><span>{movie.release_date?.slice(0, 4) || "Release date unknown"}</span><span>{movie.vote_average != null ? `★ ${movie.vote_average.toFixed(1)}` : "—"}</span></div><button disabled={removing === movie.movie_id} onClick={() => void remove(movie.movie_id)} className="mt-3 w-full rounded-lg border border-red-900 px-3 py-2 text-sm text-red-300 hover:bg-red-950/50 disabled:opacity-50">{removing === movie.movie_id ? "Removing…" : "Remove"}</button></div></article>)}</div>}
  </main>;
}
