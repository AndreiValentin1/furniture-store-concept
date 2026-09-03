import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

import { products } from "./src/data/products";
import { savedRooms } from "./src/data/planner";

// GitHub Pages serves the site from a repository subpath. Vite's `base` is the single
// source of truth: TanStack Start derives the router basepath from it, so <Link>,
// prerendered paths and asset URLs all follow. Override with BASE_PATH to host elsewhere.
const PAGES_BASE = "/furniture-store-concept/";

// Dynamic routes have no static path to discover, so they are derived from the mock data.
const dynamicPages = [
  ...products.map((product) => ({ path: `/collection/${product.slug}` })),
  ...savedRooms.map((room) => ({ path: `/planner/rooms/${room.id}` })),
];

export default defineConfig(({ command }) => ({
  base: process.env.BASE_PATH ?? (command === "build" ? PAGES_BASE : "/"),
  server: {
    host: "::",
    port: 8080,
  },
  css: {
    transformer: "lightningcss",
  },
  resolve: {
    alias: { "@": new URL("./src", import.meta.url).pathname },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
      // src/server.ts wraps the SSR handler to recover errors h3 would otherwise swallow.
      server: { entry: "server" },
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoStaticPathsDiscovery: true,
        failOnError: true,
      },
      pages: dynamicPages,
    }),
    viteReact(),
  ],
}));
