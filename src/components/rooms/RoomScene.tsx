import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bookmark, ArrowRight, Plus } from "lucide-react";
import { toast } from "sonner";

import type { Room } from "@/data/rooms";
import { getProduct } from "@/data/products";
import { usePlanner } from "@/lib/planner-context";
import { Overlay, OverlayContent } from "@/components/ui/overlay";
import { cn } from "@/lib/utils";

const sceneClass: Record<Room["scene"], string> = {
  "warm-living": "placeholder-room",
  "long-dining": "placeholder-showroom",
  "focused-desk": "placeholder-scene",
  "quiet-bed": "placeholder-linen",
};

const sceneCaption: Record<Room["scene"], string> = {
  "warm-living": "Living room · morning light",
  "long-dining": "Dining room · late afternoon",
  "focused-desk": "Home studio · north light",
  "quiet-bed": "Bedroom · low evening light",
};

const finishSwatch: Record<string, string> = {
  oak: "linear-gradient(135deg,#d4b78a,#a67f52)",
  walnut: "linear-gradient(135deg,#6b4a34,#3a251a)",
  boucle: "linear-gradient(135deg,#f2ead9,#dccdb2)",
  "linen-clay": "linear-gradient(135deg,#c9a790,#a67c62)",
  brass: "linear-gradient(135deg,#c8a768,#8a6e3f)",
  cognac: "linear-gradient(135deg,#a06a48,#5c3821)",
  olive: "linear-gradient(135deg,#8a8963,#5f5e40)",
  stone: "linear-gradient(135deg,#d9d0c1,#a89e8a)",
};

export function RoomScene({ room, showRelated = false }: { room: Room; showRelated?: boolean }) {
  const [activeId, setActiveId] = useState<string | null>(room.hotspots[0]?.id ?? null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { addManyToQuote, toggleRoom, savedRooms } = usePlanner();
  const active = room.hotspots.find((h) => h.id === activeId);
  const activeProduct = active ? getProduct(active.productSlug) : undefined;
  const savedRoom = savedRooms.includes(room.slug);

  // A new scene starts on its own first hotspot.
  useEffect(() => {
    setActiveId(room.hotspots[0]?.id ?? null);
    setSheetOpen(false);
  }, [room.slug, room.hotspots]);

  const requestRoomQuote = () => {
    const items = room.hotspots
      .map((h) => getProduct(h.productSlug))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => ({
        productSlug: p.slug,
        finishId: p.finishes[0]?.id,
        quantity: 1,
        roomAssociation: room.name,
      }));
    addManyToQuote(items);
    toast(`${items.length} pieces from ${room.name} added to your quote list.`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-8">
        <div
          key={room.slug}
          className={cn(
            "relative aspect-[4/3] w-full animate-scene-in overflow-hidden rounded-2xl border border-walnut/12 md:aspect-[16/10]",
            sceneClass[room.scene],
          )}
        >
          <div className="absolute inset-x-4 top-4 flex flex-wrap items-center gap-2">
            {room.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-ivory/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-graphite backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="absolute bottom-4 left-4 rounded-lg bg-graphite/85 px-3 py-1.5 text-[11px] text-ivory">
            <p className="opacity-80">{sceneCaption[room.scene]}</p>
          </div>
          <div className="absolute bottom-4 right-4 rounded-lg bg-graphite/85 px-3 py-2 text-[11px] text-ivory">
            <p className="opacity-70">{room.dimensions}</p>
          </div>

          {room.hotspots.map((h, idx) => {
            const product = getProduct(h.productSlug);
            const isActive = activeId === h.id;
            return (
              <button
                key={h.id}
                type="button"
                aria-label={product ? `View ${product.name}` : `Hotspot ${idx + 1}`}
                aria-pressed={isActive}
                onClick={() => {
                  setActiveId(h.id);
                  setSheetOpen(true);
                }}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                className={cn(
                  "absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[11px] font-semibold ring-2 ring-ivory/70 transition-[transform,background-color] duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay/60",
                  isActive
                    ? "animate-ring-in bg-clay text-ivory ring-4 ring-clay/35"
                    : "animate-hotspot bg-ivory text-graphite",
                )}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-graphite/70">
            <span>{room.hotspots.length} pieces in this scene</span>
            <span className="h-1 w-1 rounded-full bg-graphite/30" />
            <div className="flex items-center gap-1">
              {room.paletteFinishes.slice(0, 4).map((id) => (
                <span
                  key={id}
                  title={id}
                  className="h-3 w-3 rounded-full ring-1 ring-walnut/15"
                  style={{ background: finishSwatch[id] ?? finishSwatch.stone }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                toggleRoom(room.slug);
                toast(
                  savedRoom
                    ? `${room.name} removed from your planner.`
                    : `${room.name} saved to your planner.`,
                );
              }}
              aria-pressed={savedRoom}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50",
                savedRoom
                  ? "border-clay/40 bg-clay/10 text-clay"
                  : "border-walnut/15 bg-parchment text-graphite hover:bg-limestone",
              )}
            >
              <Bookmark
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-150",
                  savedRoom && "scale-110 fill-clay",
                )}
              />
              {savedRoom ? "Room saved" : "Save room"}
            </button>
            <button
              type="button"
              onClick={requestRoomQuote}
              className="rounded-md bg-walnut px-3 py-1.5 text-xs font-medium text-ivory transition-colors hover:bg-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
            >
              Add room to quote
            </button>
            <Link
              to="/showrooms"
              className="rounded-md border border-walnut/15 bg-ivory px-3 py-1.5 text-xs font-medium text-graphite transition-colors hover:bg-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
            >
              Book visit with this room
            </Link>
          </div>
        </div>
      </div>

      <aside className="hidden lg:col-span-4 lg:block">
        {activeProduct && (
          <div className="sticky top-24 rounded-xl border border-walnut/12 bg-card p-4 shadow-[0_1px_2px_rgba(74,51,37,0.06)]">
            <ProductPanel key={activeProduct.slug} product={activeProduct} roomName={room.name} />
          </div>
        )}
        {showRelated && (
          <div className="mt-4 rounded-xl border border-walnut/12 bg-card p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-graphite/60">
              Also fits well
            </p>
            <ul className="space-y-2">
              {room.relatedSlugs.map((s) => {
                const p = getProduct(s);
                if (!p) return null;
                return (
                  <li key={s}>
                    <Link
                      to="/collection/$slug"
                      params={{ slug: p.slug }}
                      className="flex items-center justify-between gap-3 rounded-md border border-walnut/12 p-2 transition-colors hover:bg-parchment"
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn("h-10 w-10 rounded", p.imageTint)} />
                        <div>
                          <p className="text-sm font-medium text-graphite">{p.name}</p>
                          <p className="text-xs text-graphite/50">
                            {p.currency}
                            {p.fromPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-graphite/40" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </aside>

      <div className="lg:hidden">
        <Overlay open={sheetOpen} onOpenChange={setSheetOpen}>
          <OverlayContent variant="sheet" title={activeProduct?.name ?? "Piece"} hideHeader>
            {activeProduct && (
              <ProductPanel key={activeProduct.slug} product={activeProduct} roomName={room.name} />
            )}
          </OverlayContent>
        </Overlay>
      </div>
    </div>
  );
}

function ProductPanel({
  product,
  roomName,
}: {
  product: NonNullable<ReturnType<typeof getProduct>>;
  roomName: string;
}) {
  const [finishId, setFinishId] = useState(product.finishes[0]?.id);
  const { addToQuote, toggleProduct, savedProducts } = usePlanner();
  const saved = savedProducts.includes(product.slug);
  const finishName = product.finishes.find((f) => f.id === finishId)?.name;

  return (
    <div className="animate-content-in">
      <div className={cn("aspect-[4/3] w-full overflow-hidden rounded-lg", product.imageTint)} />
      <p className="mt-3 text-[10px] font-medium uppercase tracking-widest text-clay">
        In {roomName}
      </p>
      <h3 className="mt-1 font-display text-xl font-semibold text-graphite">{product.name}</h3>
      <p className="text-xs text-graphite/60">{product.tagline}</p>

      <dl className="mt-3 grid grid-cols-2 gap-y-2 text-xs">
        <dt className="text-graphite/50">From</dt>
        <dd className="text-right font-medium text-graphite">
          {product.currency}
          {product.fromPrice.toLocaleString()}
        </dd>
        <dt className="text-graphite/50">Dimensions</dt>
        <dd className="text-right text-graphite">{product.dimensions}</dd>
        <dt className="text-graphite/50">Availability</dt>
        <dd className="text-right text-graphite">{product.availability}</dd>
      </dl>

      <div className="mt-3">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-graphite/50">Finish</p>
        <div className="flex flex-wrap gap-2">
          {product.finishes.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFinishId(f.id)}
              aria-pressed={finishId === f.id}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50",
                finishId === f.id
                  ? "border-graphite bg-parchment text-graphite"
                  : "border-walnut/15 text-graphite/60 hover:text-graphite",
              )}
            >
              <span
                className="h-3 w-3 rounded-full ring-1 ring-inset ring-walnut/20"
                style={{ background: f.swatch }}
              />
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            toggleProduct(product.slug);
            toast(saved ? `${product.name} removed from saved.` : `${product.name} saved.`);
          }}
          aria-pressed={saved}
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
          />{" "}
          Save to room
        </button>
        <button
          type="button"
          onClick={() => {
            addToQuote({
              productSlug: product.slug,
              finishId,
              quantity: 1,
              roomAssociation: roomName,
            });
            toast(
              `${product.name}${finishName ? ` · ${finishName}` : ""} added to your quote list.`,
            );
          }}
          className="flex items-center justify-center gap-1.5 rounded-md bg-walnut py-2 text-xs font-medium text-ivory transition-colors hover:bg-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
        >
          <Plus className="h-3.5 w-3.5" /> Add to quote
        </button>
      </div>
      <Link
        to="/collection/$slug"
        params={{ slug: product.slug }}
        className="mt-2 block text-center text-xs font-medium text-graphite underline underline-offset-4"
      >
        View product details
      </Link>
    </div>
  );
}
