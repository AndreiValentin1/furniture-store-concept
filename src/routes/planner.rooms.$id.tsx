import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { savedRooms, measurements } from "@/data/planner";
import { rooms as roomData } from "@/data/rooms";
import { products } from "@/data/products";
import { usePlanner } from "@/lib/planner-context";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/planner/rooms/$id")({
  loader: ({ params }) => {
    const saved = savedRooms.find((r) => r.id === params.id);
    if (!saved) throw notFound();
    const room = roomData.find((r) => r.slug === saved.roomSlug);
    if (!room) throw notFound();
    return { savedId: saved.id, savedName: saved.name };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Room not found" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${loaderData.savedName} — Planner — ${BRAND}` },
        { name: "description", content: `Saved room plan: ${loaderData.savedName}` },
        { property: "og:title", content: `${loaderData.savedName} — Saved room` },
      ],
    };
  },
  component: SavedRoomPage,
});

function SavedRoomPage() {
  const { id } = Route.useParams();
  const saved = savedRooms.find((r) => r.id === id)!;
  const room = roomData.find((r) => r.slug === saved.roomSlug)!;
  const [notes, setNotes] = useState(saved.note);
  const { addManyToQuote } = usePlanner();
  const navigate = useNavigate();
  const savedProducts = room.hotspots
    .map((h) => products.find((p) => p.slug === h.productSlug))
    .filter(Boolean) as typeof products;
  const relevantMeasurements = measurements.filter((m) => m.room === room.category);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <Link
        to="/planner"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-graphite/60 hover:text-graphite"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to planner
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-clay">Saved room</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-graphite md:text-4xl">
            {saved.name}
          </h1>
          <p className="mt-1 text-sm text-graphite/70">
            Updated {saved.updated} · {saved.pieceCount} pieces
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const items = savedProducts.map((p) => ({
                productSlug: p.slug,
                finishId: p.finishes[0]?.id,
                quantity: 1,
                roomAssociation: saved.name,
              }));
              addManyToQuote(items);
              toast(`${items.length} pieces from ${saved.name} added to your quote list.`);
              navigate({ to: "/quote" });
            }}
            className="rounded-md bg-walnut px-4 py-2 text-sm font-medium text-ivory transition-colors hover:bg-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
          >
            Request room quote
          </button>
          <Link
            to="/rooms"
            className="rounded-md border border-walnut/15 bg-parchment px-4 py-2 text-sm font-medium text-graphite transition-colors hover:bg-limestone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
          >
            Continue editing
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div
            className={cn(
              "aspect-[4/3] w-full rounded-2xl border border-walnut/12",
              room.scene === "warm-living"
                ? "placeholder-room"
                : room.scene === "long-dining"
                  ? "placeholder-showroom"
                  : room.scene === "focused-desk"
                    ? "placeholder-scene"
                    : "placeholder-linen",
            )}
          />

          <div className="mt-6">
            <h2 className="mb-3 font-display text-lg font-semibold">Saved pieces</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {savedProducts.map((p) => (
                <Link
                  key={p.slug}
                  to="/collection/$slug"
                  params={{ slug: p.slug }}
                  className="flex items-center gap-3 rounded-xl border border-walnut/12 bg-card p-3 shadow-[0_1px_2px_rgba(74,51,37,0.06)] transition-[transform,box-shadow] duration-240 hover:shadow-[0_8px_24px_-12px_rgba(74,51,37,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 motion-safe:hover:-translate-y-0.5"
                >
                  <span className={cn("h-14 w-14 shrink-0 rounded-md", p.imageTint)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-graphite">{p.name}</p>
                    <p className="text-xs text-graphite/60">
                      {p.finishes[0].name} · from {p.currency}
                      {p.fromPrice.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-xl border border-walnut/12 bg-card p-4">
            <p className="text-[10px] uppercase tracking-widest text-graphite/50">
              Selected finishes
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {saved.finishes.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-walnut/15 bg-parchment px-2.5 py-1 text-xs"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-walnut/12 bg-card p-4">
            <p className="text-[10px] uppercase tracking-widest text-graphite/50">
              Room dimensions
            </p>
            <p className="mt-1 text-sm text-graphite">{room.dimensions}</p>
            {relevantMeasurements.length > 0 && (
              <ul className="mt-3 space-y-2 border-t border-walnut/10 pt-3 text-sm">
                {relevantMeasurements.map((m) => (
                  <li key={m.id} className="flex justify-between">
                    <span className="text-graphite/60">{m.label}</span>
                    <span className="text-graphite">{m.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-walnut/12 bg-card p-4">
            <p className="text-[10px] uppercase tracking-widest text-graphite/50">Quote status</p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              <span className="rounded-full bg-clay/15 px-2 py-0.5 text-[10px] font-medium text-clay">
                Draft
              </span>
              <span className="text-graphite/70">Quote not requested yet</span>
            </p>
          </div>

          <div className="rounded-xl border border-walnut/12 bg-card p-4">
            <label className="text-[10px] uppercase tracking-widest text-graphite/50">
              Room notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-md border border-walnut/15 bg-parchment p-3 text-sm text-graphite outline-none focus:border-walnut"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
