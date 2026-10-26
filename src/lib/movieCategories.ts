
import type { MovieCategory } from "@/types/movie";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://vigilant-waffle-v64wxqxg659jcpjx6-8000.app.github.dev";

export const movieCategories: Record<
  MovieCategory,
  { title: string; description: string; endpoint: string }
> = {
  toprated: {
    title: "Top Rated Movies",
    description: "Discover the highest-rated movies of all time.",
    endpoint: "/toprated",
  },
    trending: {
        title: "Trending Movies",
        description: "Discover movies trending right now.",
        endpoint: "/trending",
    },
  popular: {
    title: "Popular Movies",
    description: "Explore movies everyone is watching.",
    endpoint: "/popular",
  },
  nowplaying: {
    title: "Now Playing",
    description: "Explore movies currently playing in theaters.",
    endpoint: "/nowplaying",
  },
  upcoming: {
    title: "Upcoming Movies",
    description: "Discover movies coming soon.",
    endpoint: "/upcomming",
  },
};

export function isMovieCategory(
  value: string
): value is MovieCategory {
  return value in movieCategories;
}
