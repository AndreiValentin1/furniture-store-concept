import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { BRAND, BRAND_TAGLINE } from "@/lib/brand";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PlannerProvider } from "@/lib/planner-context";
import { AccountPrompt } from "@/components/layout/AccountPrompt";
import { AccountPanel } from "@/components/layout/AccountPanel";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-6xl font-semibold text-graphite">404</h1>
        <p className="mt-3 text-sm text-graphite/70">
          That page has moved or never existed. Head back to the showroom.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-walnut px-5 py-2.5 text-sm font-medium text-ivory hover:bg-graphite"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold text-graphite">This page didn't load</h1>
        <p className="mt-2 text-sm text-graphite/70">
          Something went wrong. Try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-walnut px-4 py-2 text-sm font-medium text-ivory"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-walnut/20 bg-ivory px-4 py-2 text-sm font-medium text-graphite"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${BRAND} — ${BRAND_TAGLINE}` },
      {
        name: "description",
        content:
          "Explore complete interiors, save exact pieces and finishes, build a quote list, and bring your room plan to the showroom.",
      },
      { name: "author", content: BRAND },
      {
        property: "og:title",
        content: `${BRAND} — ${BRAND_TAGLINE}`,
      },
      {
        property: "og:description",
        content:
          "Explore rooms, save furniture and finishes, build a quote, and bring your plan to the showroom.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700&family=Instrument+Serif&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <PlannerProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <AccountPrompt />
        <AccountPanel />
        <Toaster />
      </PlannerProvider>
    </QueryClientProvider>
  );
}
