const BASE_URL = 'https://vigilant-waffle-v64wxqxg659jcpjx6-8000.app.github.dev'


import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import Cataloge from "@/components/Cataloge";

export default function Page() {
  return (
    <div>
        <Suspense fallback={<p className="text-zinc-400">Loading movies...</p>}>
          <div className="flex flex-col gap-12">
            <section id="trending" className="scroll-mt-8">
              <Cataloge title="Trending" url={`${BASE_URL}/trending`} />
            </section>

            <section id="top-rated" className="scroll-mt-8">
              <Cataloge title="Top Rated" url={`${BASE_URL}/toprated`} />
            </section>

            <section id="popular" className="scroll-mt-8">
              <Cataloge title="Popular" url={`${BASE_URL}/popular`} />
            </section>

            <section id="now-playing" className="scroll-mt-8">
              <Cataloge title="Now Playing" url={`${BASE_URL}/nowplaying`} />
            </section>

            <section id="upcoming" className="scroll-mt-8">
              <Cataloge title="Upcoming" url={`${BASE_URL}/upcomming`} />
            </section>
          </div>
        </Suspense>
    </div>
  );
}
