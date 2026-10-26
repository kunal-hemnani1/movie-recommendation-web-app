
export interface MovieListItem {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
}

export interface MovieListResponse {
  page: number;
  results: MovieListItem[];
  total_pages: number;
  total_results: number;
}

export type MovieCategory =
  | "toprated"
  | "popular"
  | "nowplaying"
  | "upcoming"
  | "trending";
