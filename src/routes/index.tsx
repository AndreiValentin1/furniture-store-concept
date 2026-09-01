import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { products } from "@/data/products";
import { rooms } from "@/data/rooms";
import { materials } from "@/data/materials";
import { ProductCard } from "@/components/product/ProductCard";
import { RoomScene } from "@/components/rooms/RoomScene";
import { ArrowRight, Ruler } from "lucide-react";
import { toast } from "sonner";
import { usePlanner } from "@/lib/planner-context";
import { useReveal } from "@/lib/use-reveal";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BRAND} — Explore rooms, save pieces, build a quote` },
      {
        name: "description",
        content:
          "A furniture showroom you can plan through: browse curated interiors, save finishes, build a quote list and bring it to the showroom.",
      },
      { property: "og:title", content: `${BRAND} — Furniture showroom & planning` },
      {
        property: "og:description",
        content:
          "Explore complete interiors, save pieces and finishes, and bring your room plan to the showroom.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <HomeHero />
      <RoomExplorationPreview />
      <FeaturedIndividualPieces />
      <MaterialIntegrityPreview />
      <PlanningDeskPreview />
      <ShowroomCTA />
      <ServiceStrip />
    </>
  );
}

function HomeHero() {
  const room = rooms[0];
  const [active, setActive] = useState(room.hotspots[0].id);
  const hotspot = room.hotspots.find((h) => h.id === active) ?? room.hotspots[0];
  const product = products.find((p) => p.slug === hotspot.productSlug)!;
  return (
    <section className="grain relative overflow-hidden border-b border-walnut/10 bg-parchment">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 md:px-8 md:pb-24 md:pt-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          {/* Room scene */}
          <div className="lg:col-span-8">
            <div className="relative aspect-[4/3] w-full animate-scene-in overflow-hidden rounded-2xl border border-walnut/12 placeholder-room md:aspect-[16/10]">
              <div className="absolute left-4 top-4 rounded-full bg-ivory/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-graphite backdrop-blur-sm">
                {room.tags[0]}
              </div>
              <div className="absolute bottom-4 left-4 rounded-lg bg-graphite/85 px-3 py-1.5 text-[11px] text-ivory">
                <p className="flex items-center gap-1.5 opacity-80">
                  <Ruler className="h-3 w-3" /> {room.dimensions}
                </p>
              </div>
              {room.hotspots.map((h, idx) => {
                const spotProduct = products.find((p) => p.slug === h.productSlug);
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setActive(h.id)}
                    style={
                      {
                        left: `${h.x}%`,
                        top: `${h.y}%`,
                        "--reveal-delay": `${300 + idx * 60}ms`,
                      } as React.CSSProperties
                    }
                    aria-label={spotProduct ? `Select ${spotProduct.name}` : `Hotspot ${idx + 1}`}
                    aria-pressed={active === h.id}
                    className={cn(
                      "hero-reveal absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[11px] font-semibold ring-2 ring-ivory/70 transition-[transform,background-color] duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/60",
                      active === h.id
                        ? "bg-clay text-ivory ring-4 ring-clay/35"
                        : "animate-hotspot bg-ivory text-graphite",
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Planning card overlap */}
          <div
            className="hero-reveal lg:col-span-4 lg:-ml-10 lg:mt-8"
            style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
          >
            <div className="rounded-2xl border border-walnut/12 bg-ivory p-5 shadow-[0_20px_50px_-30px_rgba(74,51,37,0.45)]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-clay">
                Selected in this scene
              </p>
              <div key={product.slug} className="mt-2 flex animate-content-in items-start gap-3">
                <div className={cn("h-16 w-16 shrink-0 rounded-md", product.imageTint)} />
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-semibold text-graphite">
                    {product.name}
                  </p>
                  <p className="text-xs text-graphite/60">
                    {product.finishes[0].name} · from {product.currency}
                    {product.fromPrice.toLocaleString()}
                  </p>
                </div>
              </div>

              <div
                className="hero-reveal mt-4"
                style={{ "--reveal-delay": "420ms" } as React.CSSProperties}
              >
                <p className="mb-2 text-[10px] uppercase tracking-widest text-graphite/50">
                  Room palette
                </p>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {[
                    { n: "Natural Oak", s: "linear-gradient(135deg,#d4b78a,#a67f52)" },
                    { n: "Smoked Walnut", s: "linear-gradient(135deg,#6b4a34,#3a251a)" },
                    { n: "Bouclé Ivory", s: "linear-gradient(135deg,#f2ead9,#dccdb2)" },
                    { n: "Linen Clay", s: "linear-gradient(135deg,#c9a790,#a67c62)" },
                  ].map((f) => (
                    <div key={f.n} className="flex shrink-0 flex-col items-center gap-1">
                      <span
                        className="h-8 w-8 rounded-full ring-1 ring-walnut/15"
                        style={{ background: f.s }}
                      />
                      <span className="text-[9px] text-graphite/60">{f.n.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <PlanSummary />

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to="/rooms"
                  className="flex items-center justify-center gap-2 rounded-md bg-walnut px-4 py-2.5 text-sm font-medium text-ivory hover:bg-graphite"
                >
                  Explore rooms <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/planner"
                    className="rounded-md border border-walnut/15 bg-parchment px-3 py-2 text-center text-sm font-medium text-graphite hover:bg-limestone"
                  >
                    Start a room plan
                  </Link>
                  <Link
                    to="/showrooms"
                    className="rounded-md border border-walnut/15 bg-parchment px-3 py-2 text-center text-sm font-medium text-graphite hover:bg-limestone"
                  >
                    Book a visit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="hero-reveal mt-12 max-w-3xl lg:mt-16"
          style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
        >
          <p className="font-editorial text-sm tracking-wide text-clay">
            A showroom you can plan through
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-graphite md:text-6xl">
            Build the room before you visit it.
          </h1>
          <p className="mt-5 max-w-xl text-base text-graphite/70 md:text-lg">
            Explore complete interiors, save exact pieces and finishes, and bring your room plan to
            the showroom.
          </p>
        </div>
      </div>
    </section>
  );
}

function PlanSummary() {
  const { savedProducts, savedRooms, quoteItems, profile } = usePlanner();
  const parts = [
    `${savedProducts.length} saved ${savedProducts.length === 1 ? "piece" : "pieces"}`,
    `${savedRooms.length} saved ${savedRooms.length === 1 ? "room" : "rooms"}`,
    `${quoteItems.length} on the quote list`,
  ];
  return (
    <div className="mt-4 rounded-lg border border-walnut/12 bg-parchment p-3 text-xs text-graphite/80">
      <p className="flex items-center justify-between">
        <span className="text-graphite/60">Your plan</span>
        <span className="text-[10px] uppercase tracking-widest text-clay">
          {profile ? profile.name : "Guest"}
        </span>
      </p>
      <p key={parts.join()} className="mt-1 animate-content-in font-medium text-graphite">
        {parts.join(" · ")}
      </p>
    </div>
  );
}

function RoomExplorationPreview() {
  const [slug, setSlug] = useState(rooms[0].slug);
  const room = rooms.find((r) => r.slug === slug)!;
  return (
    <section className="border-b border-walnut/10 bg-ivory">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-clay">
              Room exploration
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-graphite md:text-4xl">
              Shoppable rooms, hotspot by hotspot.
            </h2>
            <p className="mt-3 text-sm text-graphite/70">
              Tap a piece in the scene to open its details. Save the room, or add anything to your
              quote list.
            </p>
          </div>
          <Link
            to="/rooms"
            className="flex items-center gap-1.5 text-sm font-medium text-graphite underline-offset-4 hover:underline"
          >
            Open full showroom <ArrowRight className="h-3.5 w-3.5" />
          </Link>
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

        <RoomScene room={room} />
      </div>
    </section>
  );
}

function FeaturedIndividualPieces() {
  const featured = products.slice(0, 4);
  const reveal = useReveal<HTMLDivElement>();
  return (
    <section className="border-b border-walnut/10 bg-parchment/50">
      <div
        ref={reveal.ref}
        className={cn("mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-24", reveal.className)}
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-clay">
              Individual pieces
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-graphite md:text-4xl">
              Pieces we return to.
            </h2>
          </div>
          <Link
            to="/collection"
            className="flex items-center gap-1.5 text-sm font-medium text-graphite underline-offset-4 hover:underline"
          >
            View full collection <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MaterialIntegrityPreview() {
  const [requested, setRequested] = useState<string[]>([]);
  const reveal = useReveal<HTMLDivElement>();
  return (
    <section className="border-b border-walnut/10 bg-limestone/70">
      <div
        ref={reveal.ref}
        className={cn("mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-24", reveal.className)}
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-clay">
              Material integrity
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-graphite md:text-4xl">
              Wood, weave, weight — before you commit.
            </h2>
          </div>
          <Link
            to="/materials"
            className="flex items-center gap-1.5 text-sm font-medium text-graphite underline-offset-4 hover:underline"
          >
            Browse all materials <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {materials.slice(0, 4).map((m) => (
            <div
              key={m.slug}
              className="group overflow-hidden rounded-xl border border-walnut/12 bg-ivory transition-shadow duration-240 hover:shadow-[0_8px_24px_-12px_rgba(74,51,37,0.25)]"
            >
              <div
                className={cn(
                  "aspect-[4/3] w-full transition-[filter] duration-240 group-hover:brightness-[1.03]",
                  m.placeholder,
                )}
              />
              <div className="p-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-graphite">{m.name}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-graphite/50">
                    {m.compatibleProducts} pieces
                  </span>
                </div>
                <p className="mt-1 text-xs text-graphite/60">{m.tagline}</p>
                <div className="mt-3 flex gap-2">
                  <Link
                    to="/materials"
                    className="flex-1 rounded-md border border-walnut/15 bg-parchment py-1.5 text-center text-xs font-medium text-graphite transition-colors hover:bg-limestone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
                  >
                    View material
                  </Link>
                  <button
                    type="button"
                    disabled={requested.includes(m.slug)}
                    onClick={() => {
                      setRequested((prev) => [...prev, m.slug]);
                      toast(`Sample requested — ${m.name}. We'd post this to you in a real store.`);
                    }}
                    className={cn(
                      "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50",
                      requested.includes(m.slug)
                        ? "border border-olive/40 bg-olive/15 text-olive"
                        : "bg-walnut text-ivory hover:bg-graphite",
                    )}
                  >
                    {requested.includes(m.slug) ? "Sample requested" : "Request sample"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanningDeskPreview() {
  const { savedRooms, savedProducts, quoteItems } = usePlanner();
  const reveal = useReveal<HTMLDivElement>();
  const cards = [
    {
      label: "Saved rooms",
      value: String(savedRooms.length),
      note: savedRooms.length ? "Open the planner to review them" : "Save a room to start planning",
    },
    {
      label: "Saved pieces",
      value: String(savedProducts.length),
      note: savedProducts.length ? "Ready to add to a quote" : "Save pieces from any room or card",
    },
    {
      label: "Quote list",
      value: String(quoteItems.length),
      note: "Finishes and quantities editable before you send",
    },
    { label: "Next visit", value: "Oct 12", note: "London · 10:30 · Review dining suite" },
    { label: "Living room wall", value: "320 cm", note: "Saved from measurement notes" },
  ];
  return (
    <section className="grain relative border-b border-walnut/10 bg-[color:var(--walnut)] text-ivory">
      <div
        ref={reveal.ref}
        className={cn("mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-24", reveal.className)}
      >
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-oak">
              Planning desk
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
              Your rooms, quotes and measurements — one workspace.
            </h2>
            <p className="mt-4 text-sm text-ivory/70">
              Everything you've saved so far, ready to bring to the showroom.
            </p>
            <Link
              to="/planner"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-ivory px-5 py-2.5 text-sm font-medium text-graphite hover:bg-parchment"
            >
              Open planner <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {cards.map((c, i) => (
              <div
                key={c.label}
                style={{ "--reveal-delay": `${i * 40}ms` } as React.CSSProperties}
                className="flex flex-col justify-between rounded-xl border border-ivory/12 bg-ivory/5 p-5 backdrop-blur-sm transition-colors duration-240 hover:border-ivory/25 hover:bg-ivory/10"
              >
                <span className="text-[10px] uppercase tracking-widest text-ivory/50">
                  {c.label}
                </span>
                <p
                  key={c.value}
                  className="mt-6 animate-content-in font-display text-3xl font-semibold text-ivory"
                >
                  {c.value}
                </p>
                <p className="mt-3 text-xs text-ivory/60">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowroomCTA() {
  const reveal = useReveal<HTMLDivElement>();
  return (
    <section className="border-b border-walnut/10 bg-ivory">
      <div
        ref={reveal.ref}
        className={cn(
          "mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 md:px-8 md:py-24",
          reveal.className,
        )}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl placeholder-showroom md:aspect-auto">
          <span className="absolute bottom-3 left-3 rounded-full bg-ivory/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-graphite backdrop-blur-sm">
            London showroom · Bermondsey
          </span>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-clay">
            Bring your plan to us
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-graphite md:text-4xl">
            Visit a showroom with your saved room in hand.
          </h2>
          <p className="mt-4 max-w-md text-sm text-graphite/70">
            Our team will lay out the pieces you've saved, walk through finishes in person, and help
            you finalise measurements and delivery.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/showrooms"
              className="rounded-md bg-walnut px-5 py-2.5 text-sm font-medium text-ivory hover:bg-graphite"
            >
              Book a showroom visit
            </Link>
            <Link
              to="/quote"
              className="rounded-md border border-walnut/20 bg-parchment px-5 py-2.5 text-sm font-medium text-graphite hover:bg-limestone"
            >
              Send us your quote list
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceStrip() {
  const items = [
    { label: "Planning consultation", body: "Weekly sessions in each showroom." },
    { label: "Delivery & assembly", body: "White-glove, no visible boxes." },
    { label: "Material samples", body: "Order swatches before you commit." },
    { label: "Care & repair", body: "Lifetime care notes for every piece." },
  ];
  return (
    <section className="bg-parchment">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-4 md:px-8">
        {items.map((i) => (
          <div key={i.label} className="border-l border-walnut/15 pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-graphite">
              {i.label}
            </p>
            <p className="mt-1 text-xs text-graphite/60">{i.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
