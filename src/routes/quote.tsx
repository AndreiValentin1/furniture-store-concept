import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePlanner } from "@/lib/planner-context";
import { getProduct } from "@/data/products";
import { cn } from "@/lib/utils";
import { Trash2, ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: `Quote list — ${BRAND}` },
      {
        name: "description",
        content:
          "Review saved pieces, selected finishes, room notes and measurements before requesting a quote.",
      },
      { property: "og:title", content: `Quote list — ${BRAND}` },
      {
        property: "og:description",
        content: "Build your quote list with rooms, finishes, quantities and notes.",
      },
    ],
  }),
  component: QuotePage,
});

function QuotePage() {
  const { quoteItems, removeFromQuote, updateQuote, profile } = usePlanner();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    contact: "email",
    city: "",
    message: "",
    wantsVisit: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [removing, setRemoving] = useState<string[]>([]);

  // Prefill once the stored profile has hydrated, without clobbering typing.
  useEffect(() => {
    if (!profile) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || profile.name,
      email: prev.email || profile.email || "",
    }));
  }, [profile]);

  const removeWithCollapse = (slug: string) => {
    setRemoving((prev) => [...prev, slug]);
    window.setTimeout(() => {
      removeFromQuote(slug);
      setRemoving((prev) => prev.filter((s) => s !== slug));
    }, 220);
  };

  const subtotal = quoteItems.reduce((sum, i) => {
    const p = getProduct(i.productSlug);
    return sum + (p ? p.fromPrice * i.quantity : 0);
  }, 0);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!form.name.trim()) nextErrors.name = "Please add your name";
    if (!form.email.trim()) nextErrors.email = "Please add your email";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="mx-auto max-w-2xl animate-content-in px-4 py-20 text-center md:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-clay">Quote requested</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-graphite">
          Thank you, {form.name.split(" ")[0]}.
        </h1>
        <p className="mt-4 text-graphite/70">
          In a live store this is where we'd confirm your list and reply within two working days at{" "}
          <span className="font-medium text-graphite">{form.email}</span>, suggesting showroom times
          in {form.city || "your area"}.
        </p>
        <p className="mt-4 rounded-lg border border-dashed border-walnut/25 bg-parchment/60 p-3 text-xs text-graphite/70">
          This is a design concept — nothing was sent, and no details left your browser.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/planner"
            className="rounded-md bg-walnut px-5 py-2.5 text-sm font-medium text-ivory hover:bg-graphite"
          >
            Open planner
          </Link>
          <Link
            to="/collection"
            className="rounded-md border border-walnut/15 bg-parchment px-5 py-2.5 text-sm font-medium text-graphite"
          >
            Keep browsing
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-8">
        <p className="font-editorial text-sm tracking-wide text-clay">Quote list</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-graphite md:text-5xl">
          Review your list before requesting a quote.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-graphite/70">
          Some pieces are made to order and depend on finish selection. We'll confirm dimensions,
          delivery windows and total pricing in your quote.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {quoteItems.length === 0 ? (
            <div className="rounded-xl border border-walnut/12 bg-card p-10 text-center">
              <p className="text-graphite/70">
                Your quote list is empty. Add pieces from the collection or a room scene.
              </p>
              <Link
                to="/collection"
                className="mt-4 inline-block rounded-md bg-walnut px-4 py-2 text-sm font-medium text-ivory"
              >
                Browse collection
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-walnut/10 rounded-xl border border-walnut/12 bg-card">
              {quoteItems.map((item) => {
                const p = getProduct(item.productSlug);
                if (!p) return null;
                const isRemoving = removing.includes(p.slug);
                return (
                  <div
                    key={item.productSlug}
                    className={cn(
                      "flex flex-col gap-4 overflow-hidden p-4 transition-[opacity,max-height,padding] duration-[220ms] ease-out-soft sm:flex-row",
                      isRemoving ? "max-h-0 py-0 opacity-0" : "max-h-[40rem] opacity-100",
                    )}
                  >
                    <Link
                      to="/collection/$slug"
                      params={{ slug: p.slug }}
                      className={cn(
                        "aspect-[4/3] w-full shrink-0 rounded-md sm:h-24 sm:w-32",
                        p.imageTint,
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-graphite">{p.name}</p>
                          <p className="text-xs text-graphite/60">{p.dimensions}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-widest text-clay">
                            {p.type === "quote" ? "Made to order" : "Ready to order"} ·{" "}
                            {p.showroom.join(", ")}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            removeWithCollapse(p.slug);
                            toast(`${p.name} removed from your quote list.`);
                          }}
                          aria-label={`Remove ${p.name}`}
                          className="rounded-md p-1 text-graphite/40 transition-colors hover:text-rust focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        <label className="text-xs">
                          <span className="text-graphite/50">Finish</span>
                          <select
                            value={item.finishId}
                            onChange={(e) => updateQuote(p.slug, { finishId: e.target.value })}
                            className="mt-1 w-full rounded-md border border-walnut/15 bg-parchment px-2 py-1.5 text-graphite"
                          >
                            {p.finishes.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="text-xs">
                          <span className="text-graphite/50">Quantity</span>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuote(p.slug, { quantity: Math.max(1, Number(e.target.value)) })
                            }
                            className="mt-1 w-full rounded-md border border-walnut/15 bg-parchment px-2 py-1.5 text-graphite"
                          />
                        </label>
                        <label className="text-xs">
                          <span className="text-graphite/50">Room</span>
                          <input
                            value={item.roomAssociation ?? ""}
                            onChange={(e) =>
                              updateQuote(p.slug, { roomAssociation: e.target.value })
                            }
                            placeholder="e.g. Living Room"
                            className="mt-1 w-full rounded-md border border-walnut/15 bg-parchment px-2 py-1.5 text-graphite"
                          />
                        </label>
                      </div>
                      <label className="mt-3 block text-xs">
                        <span className="text-graphite/50">Notes / measurements</span>
                        <textarea
                          value={item.notes ?? ""}
                          onChange={(e) => updateQuote(p.slug, { notes: e.target.value })}
                          rows={2}
                          placeholder="e.g. fits under 320 cm wall"
                          className="mt-1 w-full rounded-md border border-walnut/15 bg-parchment px-2 py-1.5 text-graphite"
                        />
                      </label>
                      <div className="mt-2 flex items-baseline justify-between text-sm">
                        <span className="text-graphite/60">From</span>
                        <span
                          key={item.quantity}
                          className="animate-content-in font-medium text-graphite"
                        >
                          {p.currency}
                          {(p.fromPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-between p-4 text-sm">
                <span className="text-graphite/60">Estimated subtotal (from prices)</span>
                <span
                  key={subtotal}
                  className="animate-content-in font-display text-lg font-semibold text-graphite"
                >
                  ${subtotal.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <form onSubmit={onSubmit} className="rounded-xl border border-walnut/12 bg-card p-5">
            <h2 className="font-display text-xl font-semibold text-graphite">Request quote</h2>
            <p className="mt-1 text-xs text-graphite/60">We'll reply within two working days.</p>

            <div className="mt-4 space-y-3">
              <Field
                label="Name"
                required
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                error={errors.name}
              />
              <Field
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                error={errors.email}
              />
              <Field
                label="Phone (optional)"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
              />
              <label className="block text-xs">
                <span className="text-graphite/60">Preferred contact</span>
                <select
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="mt-1 w-full rounded-md border border-walnut/15 bg-parchment px-3 py-2 text-sm text-graphite"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </label>
              <Field
                label="City / delivery area"
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
              />
              <label className="block text-xs">
                <span className="text-graphite/60">Message</span>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1 w-full rounded-md border border-walnut/15 bg-parchment px-3 py-2 text-sm text-graphite"
                />
              </label>
              <label className="flex items-start gap-2 text-xs text-graphite/70">
                <input
                  type="checkbox"
                  checked={form.wantsVisit}
                  onChange={(e) => setForm({ ...form, wantsVisit: e.target.checked })}
                  className="mt-0.5 accent-walnut"
                />
                I'd also like showroom visit times
              </label>
            </div>

            <button
              type="submit"
              disabled={quoteItems.length === 0}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-walnut py-3 text-sm font-medium text-ivory hover:bg-graphite disabled:opacity-40"
            >
              Request quote <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <Link
              to="/showrooms"
              className="mt-2 block text-center text-xs font-medium text-graphite underline underline-offset-4"
            >
              Or book a showroom visit
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="block text-xs">
      <span className="text-graphite/60">
        {label} {required && <span className="text-clay">·</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-1 w-full rounded-md border bg-parchment px-3 py-2 text-sm text-graphite outline-none transition-colors focus:border-walnut",
          error ? "border-rust" : "border-walnut/15",
        )}
      />
      {error && (
        <span className="mt-1 block animate-content-in text-[10px] text-rust">{error}</span>
      )}
    </label>
  );
}
