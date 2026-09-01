import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, Bookmark, User } from "lucide-react";
import { usePlanner } from "@/lib/planner-context";
import { BRAND, BRAND_MARK } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Overlay, OverlayContent } from "@/components/ui/overlay";

const primaryLinks = [
  { to: "/collection", label: "Collection" },
  { to: "/rooms", label: "Rooms" },
  { to: "/materials", label: "Materials" },
  { to: "/showrooms", label: "Showrooms" },
] as const;

const utilityLinks = [
  { to: "/planner", label: "Planner" },
  { to: "/quote", label: "Quote List" },
] as const;

const navLinkClass =
  "relative rounded-sm text-sm font-medium text-graphite/70 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-graphite after:transition-transform after:duration-200 after:content-[''] hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";

const navLinkActiveClass = "text-graphite after:scale-x-100";

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { quoteItems, openAccountPanel, showAccountPanel, profile } = usePlanner();

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const quoteCount = quoteItems.length;
  const bump = useQuoteBump(quoteCount);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      data-scrolled={scrolled ? "" : undefined}
      className="sticky top-0 z-40 border-b border-walnut/10 bg-ivory/85 backdrop-blur-md transition-[background-color,border-color] duration-200 data-scrolled:border-walnut/20 data-scrolled:bg-ivory/95"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          <span className="grid h-7 w-7 place-items-center rounded-sm bg-walnut text-[10px] font-semibold text-ivory">
            {BRAND_MARK}
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-graphite">
            {BRAND}
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex lg:gap-8">
          {primaryLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={navLinkClass}
              activeProps={{ className: navLinkActiveClass }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <Link
            to="/planner"
            className="rounded-md px-2 py-1.5 text-sm font-medium text-graphite/70 transition-colors hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 lg:px-3"
            activeProps={{ className: "text-graphite" }}
          >
            Planner
          </Link>
          <Link
            to="/quote"
            aria-label={`Quote list, ${quoteCount} ${quoteCount === 1 ? "item" : "items"}`}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-graphite/70 transition-colors hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 lg:px-3"
            activeProps={{ className: "text-graphite" }}
          >
            <Bookmark className="h-4 w-4 lg:hidden" />
            <span className="hidden lg:inline">Quote List</span>
            {quoteCount > 0 && (
              <span
                key={bump}
                className="inline-flex h-4 min-w-4 animate-badge-bump items-center justify-center rounded-full bg-clay px-1 text-[10px] font-semibold text-ivory"
              >
                {quoteCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label={profile ? `Account — ${profile.name}` : "Account"}
            aria-haspopup="dialog"
            aria-expanded={showAccountPanel}
            aria-controls="account-panel"
            onClick={openAccountPanel}
            className="ml-2 grid h-8 w-8 place-items-center rounded-full border border-walnut/15 bg-parchment text-[11px] font-semibold text-graphite/70 transition-colors hover:bg-limestone hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            {profile ? initialsOf(profile.name) : <User className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/quote"
            aria-label={`Quote list, ${quoteCount} ${quoteCount === 1 ? "item" : "items"}`}
            className="relative grid h-9 w-9 place-items-center rounded-md border border-walnut/15 bg-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
          >
            <Bookmark className="h-4 w-4" />
            {quoteCount > 0 && (
              <span
                key={bump}
                className="absolute -right-1 -top-1 grid h-4 min-w-4 animate-badge-bump place-items-center rounded-full bg-clay px-1 text-[10px] font-semibold text-ivory"
              >
                {quoteCount}
              </span>
            )}
          </Link>
          <Overlay open={menuOpen} onOpenChange={setMenuOpen}>
            <button
              type="button"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-md border border-walnut/15 bg-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
            >
              <Menu className="h-4 w-4" />
            </button>
            <OverlayContent variant="top" title="Menu" hideHeader className="p-0">
              <nav className="flex flex-col px-4 py-2">
                {[...primaryLinks, ...utilityLinks].map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-walnut/8 py-3 font-display text-lg font-medium text-graphite"
                    activeProps={{ className: "text-clay" }}
                  >
                    {l.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openAccountPanel();
                  }}
                  aria-haspopup="dialog"
                  aria-controls="account-panel"
                  className="py-3 text-left font-display text-lg font-medium text-graphite"
                >
                  {profile ? `Account — ${profile.name}` : "Account"}
                </button>
              </nav>
            </OverlayContent>
          </Overlay>
        </div>
      </div>
    </header>
  );
}

/** Changes only when the count grows, so the badge animation retriggers on add. */
function useQuoteBump(count: number) {
  const [bump, setBump] = useState(0);
  const previous = useRef(count);
  useEffect(() => {
    if (count > previous.current) setBump((b) => b + 1);
    previous.current = count;
  }, [count]);
  return bump;
}

export function SecondaryNav({
  items,
  active,
  onChange,
  className,
}: {
  items: { label: string; value: string }[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-walnut/10 bg-ivory/70", className)}>
      <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-3 no-scrollbar md:px-8">
        {items.map((i) => (
          <button
            key={i.value}
            type="button"
            aria-current={active === i.value ? "true" : undefined}
            onClick={() => onChange(i.value)}
            className={cn(
              "whitespace-nowrap border-b-2 pb-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50",
              active === i.value
                ? "border-graphite text-graphite"
                : "border-transparent text-graphite/50 hover:text-graphite",
            )}
          >
            {i.label}
          </button>
        ))}
      </div>
    </div>
  );
}
