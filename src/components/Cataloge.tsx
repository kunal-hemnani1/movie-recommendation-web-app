
import { MovieDetail } from "@/types/movieResponseType";
import { ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import HorizontalCarousel from "./HorizontalCarousel";

async function getCatalogeData(
  url: string
): Promise<MovieDetail[] | "error"> {
  try {
    const resp = await fetch(url);

    if (!resp.ok) return "error";

    const data = await resp.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return "error";
  }
}

function ordinal(n: number): string {
  const suffix =
    n % 100 >= 11 && n % 100 <= 13
      ? "th"
      : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";

  return `${n}${suffix}`;
}

export default async function Cataloge({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const details = await getCatalogeData(url);

  return (
    <div className="text-white">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <ChevronRight />
      </div>

      {details !== "error" && (
        <HorizontalCarousel>
          {details.map((movie, idx) => (
            <div
              key={movie.id ?? idx}
              className="shrink-0 snap-start"
            >
              <MovieCard movie={movie} showrank num={idx+1} />
            </div>
          ))}
        </HorizontalCarousel>
      )}
    </div>
  );
}
