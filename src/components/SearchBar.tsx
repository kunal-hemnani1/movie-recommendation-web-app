
"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <form
      action="/search"
      method="GET"
      className="flex w-full max-w-2xl items-center gap-3
                 rounded-sm border border-white/10
                 bg-zinc-900 px-4 py-3
                 transition focus-within:border-red-500/60"
    >
      <Search size={21} className="shrink-0 text-zinc-400" />

      <input
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className="min-w-0 flex-1 bg-transparent text-sm
                   text-white outline-none placeholder:text-zinc-500"
      />

      {query && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setQuery("")}
          className="text-zinc-400 transition hover:text-white"
        >
          <X size={18} />
        </button>
      )}

      <button
        type="submit"
        onClick={()=>{}}
        className="rounded-xl bg-red-600 px-4 py-2 text-sm
                   font-semibold text-white transition
                   hover:bg-red-500"
      >
        Search
      </button>
    </form>
  );
}
