import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { rooms } from "@/data/rooms";
import { RoomScene } from "@/components/rooms/RoomScene";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: `Rooms — ${BRAND}` },
      {
        name: "description",
        content:
          "Explore complete room scenes with shoppable hotspots. Save rooms, add pieces to your quote list, and bring your plan to the showroom.",
      },
      { property: "og:title", content: `Rooms — ${BRAND}` },
      {
        property: "og:description",
        content: "Shoppable interior scenes for living, dining, workspace and bedroom.",
      },
    ],
  }),
  component: RoomsPage,
});

function RoomsPage() {
  const [slug, setSlug] = useState(rooms[0].slug);
  const room = rooms.find((r) => r.slug === slug)!;
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-clay">
            Virtual showroom
          </p>
          <h1
            key={room.slug}
            className="mt-2 animate-content-in font-display text-3xl font-semibold text-graphite md:text-5xl"
          >
            {room.name}
          </h1>
          <p
            key={`${room.slug}-tagline`}
            className="mt-2 animate-content-in text-sm text-graphite/70"
          >
            {room.tagline}
          </p>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Room scenes"
        className="mb-6 flex gap-2 overflow-x-auto no-scrollbar"
      >
        {rooms.map((r) => (
          <button
            key={r.slug}
            type="button"
            role="tab"
            aria-selected={slug === r.slug}
            onClick={() => setSlug(r.slug)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
              slug === r.slug
                ? "border-graphite bg-graphite text-ivory"
                : "border-walnut/15 bg-parchment text-graphite hover:bg-limestone",
            )}
          >
            {r.name}
          </button>
        ))}
      </div>

      <RoomScene room={room} showRelated />
    </section>
  );
}
