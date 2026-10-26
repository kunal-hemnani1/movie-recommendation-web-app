// "use client"
// import { useRef } from "react";
// import { ChevronRight,ChevronLeft } from "lucide-react";

// export default function HorizontalCarousel({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const scrollRef = useRef<HTMLDivElement>(null);

//   function scroll(direction: "left" | "right") {
//     const container = scrollRef.current;
//     if (!container) return;

//     container.scrollBy({
//       left:
//         (direction === "right" ? 1 : -1) *
//         container.clientWidth * 0.8,
//       behavior: "smooth",
//     });
//   }

//   return (
//     <div className=" relative flex">
//       <button
//         onClick={() => scroll("left")}
//         aria-label="Scroll left"
//         className="sticky left-0 z-10 top-0 bottom-0
//                   bg-black/70 p-2 text-white
//                    opacity-100 transition hover:bg-black
//                    group-hover:opacity-100"
//       >
//         <ChevronLeft size={28} />
//       </button>


//       <div
//         ref={scrollRef}
//         className="flex gap-4 overflow-x-auto py-5 pb-6 
//                    snap-x snap-mandatory scroll-smooth scrollbar-none"
//       >
//         {children}
//       </div>

//       {/* Right arrow */}
//       <button
//         onClick={() => scroll("right")}
//         aria-label="Scroll right"
//         className="absolute right-0 z-10 top-0 bottom-0
//                    rounded-full bg-black/70 p-2 text-white
//                    transition hover:bg-black
//                    opacity-100"
//       >
//         <ChevronRight size={28} />
//       </button>
//     </div>
//   );
// }


"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HorizontalCarousel({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      left:
        (direction === "right" ? 1 : -1) *
        container.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  return (
    <div className="group relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2
                   rounded-full bg-black/70 p-2 text-white
                   opacity-0 transition hover:bg-black
                   group-hover:opacity-100"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto py-5 pb-6
                   snap-x snap-mandatory scroll-smooth scrollbar-none"
      >
        {children}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2
                   rounded-full bg-black/70 p-2 text-white
                   opacity-0 transition hover:bg-black
                   group-hover:opacity-100"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}
