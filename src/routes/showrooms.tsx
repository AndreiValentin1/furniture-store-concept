import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { usePlanner } from "@/lib/planner-context";
import { showrooms } from "@/data/showrooms";
import { cn } from "@/lib/utils";
import { MapPin, Clock, Phone, Check } from "lucide-react";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/showrooms")({
  head: () => ({
    meta: [
      { title: `Showrooms & visits — ${BRAND}` },
      {
        name: "description",
        content:
          "Locations, opening hours, and booking for London, Copenhagen and New York. Bring your saved room, measurements and materials.",
      },
      { property: "og:title", content: `Showrooms — ${BRAND}` },
      {
        property: "og:description",
        content: "Book a showroom visit with your saved room plan in hand.",
      },
    ],
  }),
  component: ShowroomsPage,
});

function ShowroomsPage() {
  const { profile } = usePlanner();
  const [city, setCity] = useState(showrooms[0].id);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    purpose: "Review saved room and finishes",
    message: "",
    attach: {
      room: true,
      quote: true,
      measurements: true,
      materials: false,
    },
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // Prefill once the stored profile has hydrated, without clobbering typing.
  useEffect(() => {
    if (!profile) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || profile.name,
      email: prev.email || profile.email || "",
    }));
  }, [profile]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Please add your name";
    if (!form.email.trim()) next.email = "Please add your email";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitted(true);
  };

  if (submitted) {
    const showroom = showrooms.find((s) => s.id === city)!;
    return (
      <section className="mx-auto max-w-2xl animate-content-in px-4 py-20 text-center md:px-8">
        <div className="mx-auto grid h-12 w-12 animate-ring-in place-items-center rounded-full bg-olive/15 text-olive">
          <Check className="h-5 w-5" />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-clay">
          Visit requested
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-graphite">
          See you at {showroom.city}.
        </h1>
        <p className="mt-4 text-graphite/70">
          In a live store we'd confirm the appointment within a working day at {form.email}, with
          your saved room and quote list waiting for you at the showroom.
        </p>
        <p className="mt-4 rounded-lg border border-dashed border-walnut/25 bg-parchment/60 p-3 text-xs text-graphite/70">
          This is a design concept — nothing was sent, and no details left your browser.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">
      <div className="mb-10 max-w-2xl">
        <p className="font-editorial text-sm tracking-wide text-clay">Showrooms</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-graphite md:text-5xl">
          Come see the pieces you've saved.
        </h1>
        <p className="mt-3 text-sm text-graphite/70">
          Book a visit and bring your room plan, quote list or measurements along. Our team will lay
          everything out for you.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          {showrooms.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={city === s.id}
              onClick={() => setCity(s.id)}
              className={cn(
                "block w-full rounded-xl border p-5 text-left transition-[background-color,border-color,box-shadow] duration-240 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50",
                city === s.id
                  ? "border-walnut/40 bg-parchment shadow-[0_1px_2px_rgba(74,51,37,0.06)]"
                  : "border-walnut/12 bg-card hover:border-walnut/25 hover:bg-parchment/50",
              )}
            >
              <div className="flex items-baseline justify-between">
                <p className="font-display text-xl font-semibold text-graphite">{s.city}</p>
                {city === s.id && (
                  <span className="animate-content-in text-[10px] uppercase tracking-widest text-clay">
                    selected
                  </span>
                )}
              </div>
              <p className="mt-2 flex items-start gap-2 text-sm text-graphite/70">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {s.address}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-graphite/70">
                <Clock className="h-3.5 w-3.5 shrink-0" /> {s.hours}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-graphite/70">
                <Phone className="h-3.5 w-3.5 shrink-0" /> {s.phone}
              </p>
              <p className="mt-3 text-xs text-graphite/60">{s.note}</p>
            </button>
          ))}
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-walnut/12 bg-card p-5 lg:col-span-7"
        >
          <h2 className="font-display text-xl font-semibold text-graphite">Book a visit</h2>
          <p key={city} className="mt-1 animate-content-in text-xs text-graphite/60">
            {showrooms.find((s) => s.id === city)?.city}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
              label="Phone"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            <label className="block text-xs">
              <span className="text-graphite/60">Purpose</span>
              <select
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                className="mt-1 w-full rounded-md border border-walnut/15 bg-parchment px-3 py-2 text-sm text-graphite"
              >
                <option>Review saved room and finishes</option>
                <option>Full room planning consultation</option>
                <option>Materials and swatch review</option>
                <option>Product review — specific piece</option>
              </select>
            </label>
            <Field
              label="Preferred date"
              type="date"
              value={form.date}
              onChange={(v) => setForm({ ...form, date: v })}
            />
            <Field
              label="Preferred time"
              type="time"
              value={form.time}
              onChange={(v) => setForm({ ...form, time: v })}
            />
          </div>

          <label className="mt-3 block text-xs">
            <span className="text-graphite/60">Message</span>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1 w-full rounded-md border border-walnut/15 bg-parchment px-3 py-2 text-sm text-graphite"
            />
          </label>

          <div className="mt-4 rounded-lg border border-walnut/10 bg-parchment p-3">
            <p className="text-[10px] uppercase tracking-widest text-graphite/60">
              Attach to your visit
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["room", "Saved room — Warm Neutral Living"],
                  ["quote", "Quote list — Q2-092"],
                  ["measurements", "Saved measurements"],
                  ["materials", "Saved material swatches"],
                ] as const
              ).map(([k, label]) => (
                <label key={k} className="flex items-center gap-2 text-xs text-graphite/80">
                  <input
                    type="checkbox"
                    checked={form.attach[k]}
                    onChange={(e) =>
                      setForm({ ...form, attach: { ...form.attach, [k]: e.target.checked } })
                    }
                    className="accent-walnut"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-md bg-walnut py-3 text-sm font-medium text-ivory hover:bg-graphite"
          >
            Request visit
          </button>
        </form>
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
