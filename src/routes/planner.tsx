import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { usePlanner } from "@/lib/planner-context";
import {
  savedRooms,
  measurements,
  quoteDrafts,
  appointments,
  savedMaterialIds,
} from "@/data/planner";
import { rooms } from "@/data/rooms";
import { getProduct } from "@/data/products";
import { ArrowRight, Bookmark } from "lucide-react";
import { useReveal } from "@/lib/use-reveal";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: `Planner — ${BRAND}` },
      {
        name: "description",
        content:
          "Your saved rooms, measurements, quote drafts, showroom visits and saved materials in one workspace.",
      },
      { property: "og:title", content: `Planner — ${BRAND}` },
      {
        property: "og:description",
        content:
          "A furniture planning workspace — saved rooms, measurements, quotes and appointments.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const {
    savedProducts,
    savedRooms: mySavedRoomSlugs,
    quoteItems,
    profile,
    openAccountPanel,
  } = usePlanner();
  const reveal = useReveal<HTMLDivElement>();

  const mySavedRooms = mySavedRoomSlugs
    .map((slug) => rooms.find((r) => r.slug === slug))
    .filter((r): r is (typeof rooms)[number] => Boolean(r));
  const mySavedPieces = savedProducts
    .map((slug) => getProduct(slug))
    .filter((p): p is NonNullable<ReturnType<typeof getProduct>> => Boolean(p));

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-editorial text-sm tracking-wide text-clay">Planning desk</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-graphite md:text-5xl">
            {profile
              ? `${profile.name.split(" ")[0]}'s rooms, quotes and measurements.`
              : "Your rooms, quotes and measurements."}
          </h1>
          <p className="mt-2 text-sm text-graphite/70">
            {profile
              ? `Saved to this browser as ${profile.name}.`
              : "Guest planner · saved to this browser."}{" "}
            <button
              type="button"
              onClick={openAccountPanel}
              className="font-medium text-graphite underline underline-offset-4 transition-colors hover:text-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
            >
              {profile ? "Edit your details" : "Add your details"}
            </button>
          </p>
        </div>
        <Link
          to="/showrooms"
          className="rounded-md bg-walnut px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
        >
          Book a showroom visit
        </Link>
      </div>

      {/* Snapshot */}
      <div
        ref={reveal.ref}
        className={cn("mb-10 grid grid-cols-2 gap-3 md:grid-cols-4", reveal.className)}
      >
        {[
          { label: "Saved rooms", value: mySavedRooms.length + savedRooms.length },
          { label: "Saved pieces", value: savedProducts.length },
          { label: "Quote lines", value: quoteItems.length },
          { label: "Upcoming visit", value: appointments[0]?.date ?? "—" },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{ "--reveal-delay": `${i * 40}ms` } as React.CSSProperties}
            className="rounded-xl border border-walnut/12 bg-card p-4 shadow-[0_1px_2px_rgba(74,51,37,0.06)]"
          >
            <p className="text-[10px] uppercase tracking-widest text-graphite/50">{s.label}</p>
            <p
              key={String(s.value)}
              className="mt-3 animate-content-in font-display text-2xl font-semibold text-graphite"
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {(mySavedRooms.length > 0 || mySavedPieces.length > 0) && (
        <section className="mb-10">
          <SectionHeader title="Saved by you" />
          <div className="rounded-xl border border-walnut/12 bg-card p-4">
            {mySavedRooms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mySavedRooms.map((r) => (
                  <Link
                    key={r.slug}
                    to="/rooms"
                    className="flex items-center gap-2 rounded-full border border-walnut/12 bg-parchment px-3 py-1.5 text-xs font-medium text-graphite transition-colors hover:bg-limestone"
                  >
                    <Bookmark className="h-3 w-3 fill-clay text-clay" /> {r.name}
                  </Link>
                ))}
              </div>
            )}
            {mySavedPieces.length > 0 && (
              <div className={cn("flex flex-wrap gap-2", mySavedRooms.length > 0 && "mt-3")}>
                {mySavedPieces.map((p) => (
                  <Link
                    key={p.slug}
                    to="/collection/$slug"
                    params={{ slug: p.slug }}
                    className="flex items-center gap-2 rounded-full border border-walnut/12 px-3 py-1.5 text-xs text-graphite transition-colors hover:bg-parchment"
                  >
                    <span className={cn("h-4 w-4 rounded-full", p.imageTint)} /> {p.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          {/* Saved rooms */}
          <section>
            <SectionHeader title="Saved rooms" href="/rooms" cta="Explore more rooms" />
            <div className="grid gap-4 sm:grid-cols-2">
              {savedRooms.map((r) => {
                const roomData = rooms.find((x) => x.slug === r.roomSlug)!;
                return (
                  <Link
                    key={r.id}
                    to="/planner/rooms/$id"
                    params={{ id: r.id }}
                    className="group rounded-xl border border-walnut/12 bg-card p-3 shadow-[0_1px_2px_rgba(74,51,37,0.06)] transition-[transform,box-shadow,border-color] duration-240 hover:border-walnut/20 hover:shadow-[0_8px_24px_-12px_rgba(74,51,37,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 motion-safe:hover:-translate-y-0.5"
                  >
                    <div
                      className={cn(
                        "aspect-[4/3] w-full rounded-lg",
                        roomData.scene === "warm-living"
                          ? "placeholder-room"
                          : roomData.scene === "long-dining"
                            ? "placeholder-showroom"
                            : roomData.scene === "focused-desk"
                              ? "placeholder-scene"
                              : "placeholder-linen",
                      )}
                    />
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-graphite">{r.name}</p>
                        <p className="text-xs text-graphite/60">
                          {r.pieceCount} pieces · {r.updated}
                        </p>
                      </div>
                      <span className="text-xs text-graphite/40">→</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-graphite/60">{r.note}</p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Quote drafts */}
          <section>
            <SectionHeader title="Quote drafts" href="/quote" cta="Open quote list" />
            <div className="rounded-xl border border-walnut/12 bg-card">
              {quoteDrafts.map((q, i) => (
                <div
                  key={q.id}
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-3 p-4",
                    i > 0 && "border-t border-walnut/10",
                  )}
                >
                  <div>
                    <p className="font-medium text-graphite">{q.name}</p>
                    <p className="text-xs text-graphite/60">
                      {q.items} items · updated {q.updated}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        q.status === "Ready for review"
                          ? "bg-olive/15 text-olive"
                          : q.status === "Finish selection pending"
                            ? "bg-clay/15 text-clay"
                            : "bg-parchment text-graphite",
                      )}
                    >
                      {q.status}
                    </span>
                    <Link
                      to="/quote"
                      className="rounded-sm text-xs font-medium text-graphite underline underline-offset-4 transition-colors hover:text-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
                    >
                      Continue
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent activity */}
          <section>
            <SectionHeader title="Recent activity" />
            <ul className="space-y-3 text-sm">
              {[
                "Saved Hove Modular Sofa in Linen Clay",
                "Added Column Floor Lamp to Q2-092",
                "Booked showroom visit — London · Oct 12",
                "Requested Bouclé Ivory sample",
              ].map((a, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 border-l-2 border-clay/40 pl-3 text-graphite/70"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                  {a}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-8 lg:col-span-4">
          {/* Measurements */}
          <section>
            <SectionHeader title="Measurements" />
            <Measurements />
          </section>

          {/* Appointments */}
          <section>
            <SectionHeader title="Showroom visits" href="/showrooms" cta="Book a visit" />
            <div className="space-y-3">
              {appointments.map((a) => (
                <div key={a.id} className="rounded-xl border border-walnut/12 bg-card p-4">
                  <div className="flex items-baseline justify-between">
                    <p className="font-display text-lg font-semibold text-graphite">
                      {a.date} · {a.time}
                    </p>
                    <span className="text-[10px] uppercase tracking-widest text-clay">
                      confirmed
                    </span>
                  </div>
                  <p className="text-sm text-graphite/70">{a.city}</p>
                  <p className="mt-2 text-xs text-graphite/60">{a.purpose}</p>
                  {a.attachedRoom && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-graphite/60">
                      <Bookmark className="h-3 w-3" /> Attached: {a.attachedRoom}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Saved materials */}
          <section>
            <SectionHeader title="Saved materials" href="/materials" cta="All materials" />
            <div className="flex flex-wrap gap-2 rounded-xl border border-walnut/12 bg-card p-4">
              {savedMaterialIds.map((id) => (
                <div
                  key={id}
                  className="flex items-center gap-2 rounded-full border border-walnut/10 bg-parchment px-2 py-1 text-xs"
                >
                  <span
                    className="h-4 w-4 rounded-full ring-1 ring-walnut/15"
                    style={{
                      background:
                        id === "oak"
                          ? "linear-gradient(135deg,#d4b78a,#a67f52)"
                          : id === "walnut"
                            ? "linear-gradient(135deg,#6b4a34,#3a251a)"
                            : id === "boucle"
                              ? "linear-gradient(135deg,#f2ead9,#dccdb2)"
                              : "linear-gradient(135deg,#c9a790,#a67c62)",
                    }}
                  />
                  {id}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

type PlannerLink = "/rooms" | "/quote" | "/showrooms" | "/materials" | "/collection";

function SectionHeader({ title, href, cta }: { title: string; href?: PlannerLink; cta?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h2 className="font-display text-xl font-semibold text-graphite">{title}</h2>
      {href && cta && (
        <Link
          to={href}
          className="flex items-center gap-1 rounded-sm text-xs font-medium text-graphite hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
        >
          {cta} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

function Measurements() {
  const [rows, setRows] = useState(measurements);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ room: "", label: "", value: "" });

  const canSave = draft.label.trim() !== "" && draft.value.trim() !== "";

  return (
    <div className="rounded-xl border border-walnut/12 bg-card shadow-[0_1px_2px_rgba(74,51,37,0.06)]">
      {rows.map((m, i) => (
        <div
          key={m.id}
          className={cn(
            "flex items-center justify-between p-3",
            i > 0 && "border-t border-walnut/10",
            i >= measurements.length && "animate-content-in",
          )}
        >
          <div>
            <p className="text-xs text-graphite/50">{m.room || "Unassigned"}</p>
            <p className="text-sm font-medium text-graphite">{m.label}</p>
          </div>
          <span className="text-sm font-medium text-graphite">{m.value}</span>
        </div>
      ))}

      {adding ? (
        <form
          className="animate-content-in space-y-2 border-t border-walnut/10 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSave) return;
            setRows((prev) => [
              ...prev,
              {
                id: `m-${Date.now()}`,
                room: draft.room.trim(),
                label: draft.label.trim(),
                value: draft.value.trim(),
              },
            ]);
            setDraft({ room: "", label: "", value: "" });
            setAdding(false);
            toast("Measurement added to your planner for this session.");
          }}
        >
          <input
            value={draft.room}
            onChange={(e) => setDraft({ ...draft, room: e.target.value })}
            placeholder="Room (e.g. Living Room)"
            className="w-full rounded-md border border-walnut/15 bg-parchment px-2 py-1.5 text-xs text-graphite outline-none transition-colors focus:border-walnut"
          />
          <input
            value={draft.label}
            onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            placeholder="What you measured (e.g. Sofa wall)"
            className="w-full rounded-md border border-walnut/15 bg-parchment px-2 py-1.5 text-xs text-graphite outline-none transition-colors focus:border-walnut"
          />
          <input
            value={draft.value}
            onChange={(e) => setDraft({ ...draft, value: e.target.value })}
            placeholder="Measurement (e.g. 320 cm)"
            className="w-full rounded-md border border-walnut/15 bg-parchment px-2 py-1.5 text-xs text-graphite outline-none transition-colors focus:border-walnut"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!canSave}
              className="flex-1 rounded-md bg-walnut py-1.5 text-xs font-medium text-ivory transition-colors hover:bg-graphite disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-md border border-walnut/15 px-3 py-1.5 text-xs font-medium text-graphite transition-colors hover:bg-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="w-full border-t border-walnut/10 py-2 text-xs font-medium text-graphite transition-colors hover:bg-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
        >
          + Add measurement
        </button>
      )}
    </div>
  );
}
