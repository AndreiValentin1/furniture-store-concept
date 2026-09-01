import type { Product } from "@/data/products";
import { Link } from "@tanstack/react-router";
import { Bookmark, Plus } from "lucide-react";
import { toast } from "sonner";
import { usePlanner } from "@/lib/planner-context";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { savedProducts, toggleProduct, addToQuote } = usePlanner();
  const saved = savedProducts.includes(product.slug);
  return (
    <div className="group flex h-full flex-col rounded-xl border border-walnut/12 bg-card p-3 shadow-[0_1px_2px_rgba(74,51,37,0.06)] transition-[transform,box-shadow,border-color] duration-240 hover:border-walnut/20 hover:shadow-[0_8px_24px_-12px_rgba(74,51,37,0.25)] focus-within:border-walnut/20 motion-safe:hover:-translate-y-0.5">
      <Link
        to="/collection/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
      >
        <div
          className={cn(
            "aspect-[4/5] w-full transition-transform duration-240 ease-out-soft motion-safe:group-hover:scale-[1.03]",
            product.imageTint,
          )}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
          <span className="rounded-full bg-ivory/85 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-graphite backdrop-blur-sm">
            {product.category}
          </span>
          <span className="rounded-full bg-ivory/85 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-graphite backdrop-blur-sm">
            {product.availability}
          </span>
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to="/collection/$slug"
              params={{ slug: product.slug }}
              className="block truncate font-display text-base font-semibold text-graphite"
            >
              {product.name}
            </Link>
            <p className="truncate text-xs text-graphite/60">{product.materials.join(" · ")}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-graphite/50">
              {product.type === "quote" ? "From" : ""}
            </p>
            <p className="text-sm font-semibold text-graphite">
              {product.currency}
              {product.fromPrice.toLocaleString()}
            </p>
          </div>
        </div>
        <p className="text-xs text-graphite/50">{product.dimensions}</p>
        <div className="mt-1 flex items-center gap-1.5">
          {product.finishes.slice(0, 4).map((f) => (
            <span
              key={f.id}
              title={f.name}
              className="h-3.5 w-3.5 rounded-full ring-1 ring-inset ring-walnut/15"
              style={{ background: f.swatch }}
            />
          ))}
          {product.finishes.length > 4 && (
            <span className="text-[10px] text-graphite/50">+{product.finishes.length - 4}</span>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          aria-pressed={saved}
          onClick={() => {
            toggleProduct(product.slug);
            toast(saved ? `${product.name} removed from saved.` : `${product.name} saved.`);
          }}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-md border py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50",
            saved
              ? "border-clay/40 bg-clay/10 text-clay"
              : "border-walnut/15 bg-parchment text-graphite hover:bg-limestone",
          )}
        >
          <Bookmark
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-150",
              saved && "scale-110 fill-clay",
            )}
          />
          {saved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            addToQuote({
              productSlug: product.slug,
              finishId: product.finishes[0]?.id,
              quantity: 1,
            });
            toast(`${product.name} added to your quote list.`);
          }}
          className="flex items-center justify-center gap-1.5 rounded-md bg-walnut py-2 text-xs font-medium text-ivory transition-colors hover:bg-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
        >
          <Plus className="h-3.5 w-3.5" /> Quote
        </button>
      </div>
    </div>
  );
}
