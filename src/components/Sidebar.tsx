
import Link from "next/link";
import {
  House,
  TrendingUp,
  Star,
  Clapperboard,
  CalendarDays,
  Compass,
  Home,
  Bookmark,
  Bolt,
} from "lucide-react";
import AuthButton from "./AuthButton";

const links = [
  {label: "Home",href:"/home",icon: Home},
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Trending", href: "/movies/trending", icon: TrendingUp },
  { label: "Top Rated", href: "/movies/toprated", icon: Star },
  { label: "Popular", href: "/movies/popular", icon: House },
  { label: "Now Playing", href: "/movies/now-playing", icon: Clapperboard },
  { label: "Upcoming", href: "/movies/upcoming", icon: CalendarDays },
  { label : "Watchlist", href:"/watchlist",icon:Bookmark},
  { label: "Preferences", href:"/preferences", icon:Bolt}
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col
                      border-r border-white/10 bg-zinc-950
                      px-5 py-8">
      <Link href="/" className="mb-10 text-2xl font-extrabold tracking-tight">
        <span className="text-red-500">CINE</span>
        <span className="text-white">VERSE</span>
      </Link>

      <p className="mb-4 px-3 text-xs font-semibold uppercase
                    tracking-widest text-zinc-500">
        Menu
      </p>

      <nav className="flex flex-col gap-2">
        <AuthButton></AuthButton>
        {links.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-3 rounded-xl px-3 py-3
                       text-sm font-medium text-zinc-400
                       transition hover:bg-white/5 hover:text-white"
          >
            <Icon size={19} />
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-auto pt-10">
        <p className="px-3 text-xs text-zinc-600">
          Discover your next favourite movie.
        </p>
      </div>
    </aside>
  );
}
