import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { materials } from "@/data/materials";
import { SecondaryNav } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: `Materials — ${BRAND}` },
      {
        name: "description",
        content:
          "Wood, fabric, leather, stone and metal — with care notes, durability, finishes and sample requests.",
      },
      { property: "og:title", content: `Materials — ${BRAND}` },
      {
        property: "og:description",
        content:
          "Explore the material palette behind every piece, and order swatches before you commit.",
      },
    ],
  }),
  component: MaterialsPage,
});

function MaterialsPage() {
  const [category, setCategory] = useState("all");
  const [requested, setRequested] = useState<string[]>([]);
  const shown = category === "all" ? materials : materials.filter((m) => m.slug === category);

  const requestSample = (slug: string, label: string) => {
    if (requested.includes(slug)) return;
    setRequested((prev) => [...prev, slug]);
    toast(`Sample requested — ${label}. We'd post this to you in a real store.`);
  };

  return (
    <>
      <SecondaryNav
        items={[
          { label: "All", value: "all" },
          ...materials.map((m) => ({ label: m.name, value: m.slug })),
        ]}
        active={category}
        onChange={setCategory}
      />
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-16">
        <div className="mb-10 max-w-2xl">
          <p className="font-editorial text-sm tracking-wide text-clay">Materials</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-graphite md:text-5xl">
            Wood, weave and stone — before you commit.
          </h1>
          <p className="mt-3 text-sm text-graphite/70">
            Every finish behind the collection, with care notes, durability and physical sample
            requests.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-walnut/12 bg-parchment p-5 md:flex md:items-center md:justify-between md:p-6">
          <div>
            <p className="font-display text-lg font-semibold text-graphite">
              Order a full sample kit
            </p>
            <p className="text-sm text-graphite/60">
              10 curated swatches across wood, fabric and stone. Free to plan with; returned at
              delivery.
            </p>
          </div>
          <SampleButton
            requested={requested.includes("sample-kit")}
            onClick={() => requestSample("sample-kit", "full sample kit")}
            className="mt-3 px-5 py-2.5 text-sm md:mt-0"
            label="Request sample kit"
          />
        </div>

        <div className="space-y-16">
          {shown.map((m) => (
            <div key={m.slug} className="grid animate-content-in gap-6 lg:grid-cols-12">
              <div
                className={cn(
                  "group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-walnut/12 transition-[filter] duration-240 hover:brightness-[1.03] lg:col-span-5 lg:aspect-square",
                  m.placeholder,
                )}
              >
                <span className="absolute bottom-3 left-3 rounded-full bg-ivory/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-graphite backdrop-blur-sm">
                  {m.name} · macro
                </span>
              </div>
              <div className="lg:col-span-7">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-clay">
                      {m.compatibleProducts} compatible pieces
                    </p>
                    <h2 className="mt-1 font-display text-3xl font-semibold text-graphite">
                      {m.name}
                    </h2>
                    <p className="text-sm text-graphite/70">{m.tagline}</p>
                  </div>
                </div>
                <p className="mt-4 max-w-2xl text-sm text-graphite/80">{m.description}</p>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-graphite/60">
                    Available finishes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {m.finishes.map((f) => (
                      <div
                        key={f.id}
                        className="rounded-lg border border-walnut/12 bg-card p-3 transition-[border-color,background-color,box-shadow] duration-240 hover:border-walnut/25 hover:bg-parchment hover:shadow-[0_1px_2px_rgba(74,51,37,0.06)]"
                      >
                        <p className="text-sm font-medium text-graphite">{f.name}</p>
                        <p className="text-xs text-graphite/60">{f.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <dl className="mt-5 grid gap-3 border-t border-walnut/10 pt-4 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-graphite/50">Care</dt>
                    <dd className="text-graphite">{m.care}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-graphite/50">
                      Durability
                    </dt>
                    <dd className="text-graphite">{m.durability}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-graphite/50">
                      Showroom
                    </dt>
                    <dd className="text-graphite">{m.showroom}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-2">
                  <SampleButton
                    requested={requested.includes(m.slug)}
                    onClick={() => requestSample(m.slug, m.name)}
                    className="px-4 py-2 text-xs"
                    label="Request sample"
                  />
                  <Link
                    to="/collection"
                    search={{ material: m.name }}
                    className="rounded-md border border-walnut/15 bg-parchment px-4 py-2 text-xs font-medium text-graphite transition-colors hover:bg-limestone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
                  >
                    View compatible pieces
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function SampleButton({
  requested,
  onClick,
  label,
  className,
}: {
  requested: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={requested}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50",
        requested
          ? "border border-olive/40 bg-olive/15 text-olive"
          : "bg-walnut text-ivory hover:bg-graphite",
        className,
      )}
    >
      {requested ? (
        <span className="flex animate-content-in items-center gap-1.5">
          <Check className="h-3.5 w-3.5" /> Sample requested
        </span>
      ) : (
        label
      )}
    </button>
  );
}
