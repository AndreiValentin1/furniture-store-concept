import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { BRAND } from "@/lib/brand";

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  if (joined) {
    return (
      <p className="animate-content-in text-sm text-graphite/70">
        Thanks — in a live store we'd send occasional notes on new arrivals. Nothing was sent here.
      </p>
    );
  }

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setJoined(true);
        toast("Added to the mailing list — this is a concept, so nothing was sent.");
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@studio.com"
        aria-label="Email address"
        className="flex-1 border-b border-walnut/20 bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-graphite/40 focus:border-walnut"
      />
      <button
        type="submit"
        className="rounded-sm px-1 text-sm font-semibold text-graphite transition-colors hover:text-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
      >
        Join
      </button>
    </form>
  );
}

const service = [
  { title: "Planning Consultation", body: "Weekly sessions in every showroom." },
  { title: "Delivery & Assembly", body: "White-glove delivery, no visible boxes." },
  { title: "Material Samples", body: "Order swatches before you commit." },
  { title: "Care & Repair Support", body: "Lifetime care notes and repair kits." },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-walnut/10 bg-parchment">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-8 border-b border-walnut/10 pb-12 md:grid-cols-4">
          {service.map((s) => (
            <div key={s.title} className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-clay">
                {s.title}
              </span>
              <p className="text-sm text-graphite/70">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-4">
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-graphite/60">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-graphite/80">
              <li>
                <Link to="/rooms">Rooms</Link>
              </li>
              <li>
                <Link to="/collection">Collection</Link>
              </li>
              <li>
                <Link to="/materials">Materials</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-graphite/60">
              Planning
            </h4>
            <ul className="space-y-2 text-sm text-graphite/80">
              <li>
                <Link to="/planner">Planner</Link>
              </li>
              <li>
                <Link to="/quote">Quote list</Link>
              </li>
              <li>
                <Link to="/showrooms">Book a visit</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-graphite/60">
              Showrooms
            </h4>
            <ul className="space-y-2 text-sm text-graphite/80">
              <li>London — Bermondsey</li>
              <li>Copenhagen — Vesterbro</li>
              <li>New York — Soho</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-graphite/60">
              Notes on new arrivals
            </h4>
            <NewsletterSignup />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-walnut/10 pt-6 text-xs text-graphite/50 md:flex-row md:items-center">
          <p>© 2026 {BRAND} Showroom · Concept</p>
          <div className="flex gap-6">
            <a href="#">Instagram</a>
            <a href="#">Pinterest</a>
            <a href="#">Trade programme</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
