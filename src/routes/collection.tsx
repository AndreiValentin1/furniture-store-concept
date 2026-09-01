import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SecondaryNav } from "@/components/layout/Header";
import { Overlay, OverlayContent } from "@/components/ui/overlay";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/collection")({
  validateSearch: (search: Record<string, unknown>): { material?: string } => ({
    material: typeof search.material === "string" ? search.material : undefined,
  }),
  head: () => ({
    meta: [
      { title: `Collection — ${BRAND}` },
      {
        name: "description",
        content:
          "Furniture collection filtered by room, material, finish, size and availability. Save pieces to a room or add to your quote list.",
      },
      { property: "og:title", content: `Collection — ${BRAND}` },
      {
        property: "og:description",
        content:
          "Sofas, tables, storage, lighting and more — filterable by room, material and finish.",
      },
    ],
  }),
  component: CollectionPage,
});

const categories = ["All", "Seating", "Tables", "Storage", "Lighting", "Bedroom"] as const;
const roomFilters = ["All rooms", "Living Room", "Dining", "Workspace", "Bedroom"];
const materialFilters = ["All materials", "Wood", "Fabric", "Leather", "Stone", "Metal"];
const availabilityFilters = ["All", "In stock", "Made to order", "Low stock"];

function CollectionPage() {
  const { material: materialParam } = Route.useSearch();
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [room, setRoom] = useState(roomFilters[0]);
  const [material, setMaterial] = useState(
    materialParam && materialFilters.includes(materialParam) ? materialParam : materialFilters[0],
  );
  const [availability, setAvailability] = useState(availabilityFilters[0]);
  const [priceMax, setPriceMax] = useState(4000);
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (room !== "All rooms" && !p.room.includes(room)) return false;
      if (material !== "All materials") {
        const has = p.finishes.some((f) => f.material === material);
        if (!has) return false;
      }
      if (availability !== "All" && p.availability !== availability) return false;
      if (p.fromPrice > priceMax) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.fromPrice - b.fromPrice);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.fromPrice - a.fromPrice);
    return list;
  }, [cat, room, material, availability, priceMax, sort]);

  // Retriggers the result reveal when the filter set changes.
  const filterKey = [cat, room, material, availability, priceMax, sort].join("|");

  return (
    <>
      <SecondaryNav
        items={categories.map((c) => ({ label: c, value: c }))}
        active={cat}
        onChange={(value) => setCat(value as (typeof categories)[number])}
      />
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-editorial text-sm tracking-wide text-clay">Collection</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-graphite md:text-4xl">
              Furniture, tables, lighting and storage.
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-md border border-walnut/15 bg-parchment px-3 py-1.5 text-xs font-medium text-graphite"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-1.5 rounded-md border border-walnut/15 bg-parchment px-3 py-1.5 text-xs font-medium text-graphite lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <aside className={cn("lg:col-span-3", "hidden lg:block")}>
            <FiltersPanel
              room={room}
              setRoom={setRoom}
              material={material}
              setMaterial={setMaterial}
              availability={availability}
              setAvailability={setAvailability}
              priceMax={priceMax}
              setPriceMax={setPriceMax}
            />
          </aside>

          <div className="lg:col-span-9">
            <p key={filterKey} className="mb-4 animate-content-in text-xs text-graphite/60">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </p>
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-walnut/12 bg-card p-10 text-center">
                <p className="text-graphite/70">
                  Nothing matches those filters yet. Try widening the price or material.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p, i) => (
                  <div
                    key={`${filterKey}-${p.slug}`}
                    className="animate-content-in"
                    style={{ animationDelay: `${Math.min(i, 7) * 25}ms` }}
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Overlay open={filtersOpen} onOpenChange={setFiltersOpen}>
        <OverlayContent variant="sheet" title="Filters">
          <div className="mt-4">
            <FiltersPanel
              room={room}
              setRoom={setRoom}
              material={material}
              setMaterial={setMaterial}
              availability={availability}
              setAvailability={setAvailability}
              priceMax={priceMax}
              setPriceMax={setPriceMax}
            />
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="mt-6 w-full rounded-md bg-walnut py-3 text-sm font-medium text-ivory transition-colors hover:bg-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
          >
            Show {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          </button>
        </OverlayContent>
      </Overlay>
    </>
  );
}

function FiltersPanel(props: {
  room: string;
  setRoom: (v: string) => void;
  material: string;
  setMaterial: (v: string) => void;
  availability: string;
  setAvailability: (v: string) => void;
  priceMax: number;
  setPriceMax: (v: number) => void;
}) {
  return (
    <div className="space-y-6 rounded-xl border border-walnut/12 bg-card p-5">
      <FilterGroup title="Room" options={roomFilters} value={props.room} onChange={props.setRoom} />
      <FilterGroup
        title="Material"
        options={materialFilters}
        value={props.material}
        onChange={props.setMaterial}
      />
      <FilterGroup
        title="Availability"
        options={availabilityFilters}
        value={props.availability}
        onChange={props.setAvailability}
      />
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-graphite/60">
          Max price
        </p>
        <input
          type="range"
          min={500}
          max={4000}
          step={100}
          value={props.priceMax}
          onChange={(e) => props.setPriceMax(Number(e.target.value))}
          className="w-full accent-walnut"
        />
        <p className="mt-1 text-xs text-graphite/70">Up to ${props.priceMax.toLocaleString()}</p>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-graphite/60">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              value === o
                ? "border-graphite bg-graphite text-ivory"
                : "border-walnut/15 bg-parchment text-graphite hover:bg-limestone",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
