
"use client";

import type { GenreOption } from "@/types/movieResponseType";

interface GenreFilterProps {
  genres: GenreOption[];
  selectedGenres: number[];
  onChange: (ids: number[]) => void;
}

export default function GenreFilter({
  genres,
  selectedGenres,
  onChange,
}: GenreFilterProps) {
  function toggleGenre(id: number) {
    onChange(
      selectedGenres.includes(id)
        ? selectedGenres.filter((genreId) => genreId !== id)
        : [...selectedGenres, id]
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => {
        const selected = selectedGenres.includes(genre.id);

        return (
          <button
            key={genre.id}
            type="button"
            aria-pressed={selected}
            onClick={() => toggleGenre(genre.id)}
            className={`rounded-md border px-3 py-1.5 text-sm
                        font-medium transition-all duration-200
                        focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-amber-400 ${
              selected
                ? "border-amber-400 bg-amber-400/20 text-amber-300"
                : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-amber-400 hover:bg-amber-400/10 hover:text-amber-300"
            }`}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}
