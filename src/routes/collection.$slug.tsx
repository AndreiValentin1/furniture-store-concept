import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { getProduct, products } from "@/data/products";
import { usePlanner } from "@/lib/planner-context";
import { cn } from "@/lib/utils";
import { Bookmark, Plus, ArrowLeft, Ruler, Truck, PackageOpen, ShieldCheck } from "lucide-react";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/collection/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { slug: product.slug, name: product.name, tagline: product.tagline };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: `Piece not found — ${BRAND}` }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: [
        { title: `${loaderData.name} — ${BRAND}` },
        { name: "description", content: loaderData.tagline },
        { property: "og:title", content: `${loaderData.name} — ${BRAND}` },
        { property: "og:description", content: loaderData.tagline },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug)!;
  const [finishId, setFinishId] = useState(product.finishes[0]?.id);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const { addToQuote, toggleProduct, savedProducts } = usePlanner();
  const saved = savedProducts.includes(product.slug);
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);
  const finishName = product.finishes.find((f) => f.id === finishId)?.name;

  const views = [
    { label: "Full view", tint: product.imageTint },
    { label: "Material", tint: materialTint(product.materials[0]) },
    { label: "In room", tint: "placeholder-room" },
    { label: "Scale", tint: "placeholder-product" },
  ];
  const view = views[galleryIdx] ?? views[0];

  const addWithFinish = () => {
    addToQuote({ productSlug: product.slug, finishId, quantity: 1 });
    toast(`${product.name}${finishName ? ` · ${finishName}` : ""} added to your quote list.`);
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
        <Link
          to="/collection"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-graphite/60 hover:text-graphite"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to collection
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-8 md:px-8 md:py-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div
            key={view.label}
            className={cn(
              "relative aspect-[4/3] w-full animate-content-in overflow-hidden rounded-2xl border border-walnut/12",
              view.tint,
            )}
          >
            <span className="absolute bottom-3 left-3 rounded-full bg-ivory/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-graphite backdrop-blur-sm">
              {product.name} · {view.label}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {views.map((v, i) => (
              <button
                key={v.label}
                type="button"
                aria-label={v.label}
                aria-pressed={galleryIdx === i}
                onClick={() => setGalleryIdx(i)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50",
                  v.tint,
                  galleryIdx === i ? "border-graphite" : "border-walnut/12 hover:border-walnut/30",
                )}
              >
                <span className="absolute inset-x-0 bottom-0 bg-ivory/80 py-0.5 text-[9px] font-medium uppercase tracking-wider text-graphite">
                  {v.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-clay">
            {product.category} · {product.room.join(" · ")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-graphite md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-graphite/70">{product.tagline}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-[10px] uppercase tracking-widest text-graphite/50">
              {product.type === "quote" ? "From" : "Price"}
            </span>
            <span className="font-display text-2xl font-semibold text-graphite">
              {product.currency}
              {product.fromPrice.toLocaleString()}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                product.availability === "In stock"
                  ? "bg-olive/15 text-olive"
                  : product.availability === "Low stock"
                    ? "bg-rust/15 text-rust"
                    : "bg-parchment text-graphite",
              )}
            >
              {product.availability}
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-y-3 border-y border-walnut/10 py-4 text-sm">
            <dt className="flex items-center gap-1.5 text-graphite/60">
              <Ruler className="h-3.5 w-3.5" /> Dimensions
            </dt>
            <dd className="text-right text-graphite">{product.dimensions}</dd>
            <dt className="text-graphite/60">Materials</dt>
            <dd className="text-right text-graphite">{product.materials.join(", ")}</dd>
            <dt className="flex items-center gap-1.5 text-graphite/60">
              <Truck className="h-3.5 w-3.5" /> Delivery
            </dt>
            <dd className="text-right text-graphite">6–8 weeks · white-glove</dd>
            <dt className="flex items-center gap-1.5 text-graphite/60">
              <PackageOpen className="h-3.5 w-3.5" /> Assembly
            </dt>
            <dd className="text-right text-graphite">Included on delivery</dd>
            <dt className="flex items-center gap-1.5 text-graphite/60">
              <ShieldCheck className="h-3.5 w-3.5" /> Warranty
            </dt>
            <dd className="text-right text-graphite">10 years, structural</dd>
            <dt className="text-graphite/60">Showroom</dt>
            <dd className="text-right text-graphite">{product.showroom.join(", ")}</dd>
          </dl>

          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-graphite/60">
              Finish
            </p>
            <div className="flex flex-wrap gap-2">
              {product.finishes.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFinishId(f.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs",
                    finishId === f.id
                      ? "border-graphite bg-parchment text-graphite"
                      : "border-walnut/15 text-graphite/70 hover:text-graphite",
                  )}
                >
                  <span
                    className="h-4 w-4 rounded-full ring-1 ring-inset ring-walnut/20"
                    style={{ background: f.swatch }}
                  />
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={addWithFinish}
              className="flex-1 rounded-md bg-walnut px-5 py-3 text-sm font-medium text-ivory transition-colors hover:bg-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
            >
              Add to quote list
            </button>
            <button
              type="button"
              aria-pressed={saved}
              onClick={() => {
                toggleProduct(product.slug);
                toast(
                  saved
                    ? `${product.name} removed from saved.`
                    : `${product.name}${finishName ? ` · ${finishName}` : ""} saved.`,
                );
              }}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-md border px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50",
                saved
                  ? "border-clay/40 bg-clay/10 text-clay"
                  : "border-walnut/15 bg-parchment text-graphite hover:bg-limestone",
              )}
            >
              <Bookmark
                className={cn(
                  "h-4 w-4 transition-transform duration-150",
                  saved && "scale-110 fill-clay",
                )}
              />
              {saved ? "Saved" : "Save to room"}
            </button>
          </div>
          <Link
            to="/showrooms"
            className="mt-2 block text-center text-xs font-medium text-graphite underline underline-offset-4"
          >
            Book a showroom visit to see this piece
          </Link>

          {product.seenIn && (
            <div className="mt-6 rounded-xl border border-walnut/10 bg-parchment p-4">
              <p className="text-[10px] uppercase tracking-widest text-clay">Seen in this room</p>
              <Link
                to="/rooms"
                className="mt-1 flex items-center justify-between text-sm font-medium text-graphite"
              >
                <span>Open {product.seenIn.replace(/-/g, " ")}</span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8 md:pb-24">
        <h2 className="mb-6 font-display text-2xl font-semibold text-graphite">Fits well with</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {related.map((p) => (
            <Link
              key={p.slug}
              to="/collection/$slug"
              params={{ slug: p.slug }}
              className="group rounded-xl border border-walnut/12 bg-card p-3 shadow-[0_1px_2px_rgba(74,51,37,0.06)] transition-[transform,box-shadow] duration-240 hover:shadow-[0_8px_24px_-12px_rgba(74,51,37,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 motion-safe:hover:-translate-y-0.5"
            >
              <div className={cn("aspect-[4/3] w-full rounded-lg", p.imageTint)} />
              <p className="mt-3 font-medium text-graphite">{p.name}</p>
              <p className="text-xs text-graphite/60">
                From {p.currency}
                {p.fromPrice.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Mobile sticky action */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-walnut/12 bg-ivory/95 p-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={addWithFinish}
          className="w-full rounded-md bg-walnut py-3 text-sm font-medium text-ivory"
        >
          Add to quote list — from {product.currency}
          {product.fromPrice.toLocaleString()}
        </button>
      </div>
    </>
  );
}

function materialTint(material?: string) {
  switch (material) {
    case "Oak":
    case "Wood":
      return "placeholder-oak";
    case "Walnut":
      return "placeholder-walnut";
    case "Linen":
    case "Fabric":
      return "placeholder-linen";
    case "Bouclé":
      return "placeholder-boucle";
    case "Leather":
      return "placeholder-leather";
    case "Stone":
    case "Limestone":
      return "placeholder-stone";
    case "Brass":
    case "Metal":
      return "placeholder-metal";
    default:
      return "placeholder-product";
  }
}
