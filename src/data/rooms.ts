export interface Hotspot {
  id: string;
  x: number; // percent
  y: number;
  productSlug: string;
}

export interface Room {
  slug: string;
  name: string;
  category: "Living Room" | "Dining" | "Workspace" | "Bedroom" | "Outdoor";
  tagline: string;
  tags: string[];
  dimensions: string;
  paletteFinishes: string[]; // finish ids
  hotspots: Hotspot[];
  relatedSlugs: string[];
  scene: "warm-living" | "long-dining" | "focused-desk" | "quiet-bed";
}

export const rooms: Room[] = [
  {
    slug: "warm-neutral-living",
    name: "Warm Neutral Living",
    category: "Living Room",
    tagline: "A low, layered sitting room for a compact apartment.",
    tags: ["compact apartment", "warm neutral", "family living"],
    dimensions: "Recommended 4.2 × 3.6 m",
    paletteFinishes: ["oak", "linen-clay", "boucle", "stone"],
    hotspots: [
      { id: "h1", x: 32, y: 58, productSlug: "hove-modular-sofa" },
      { id: "h2", x: 62, y: 66, productSlug: "pond-coffee-table" },
      { id: "h3", x: 78, y: 42, productSlug: "column-floor-lamp" },
      { id: "h4", x: 18, y: 70, productSlug: "solace-lounge-chair" },
    ],
    relatedSlugs: ["nord-credenza", "brook-armchair"],
    scene: "warm-living",
  },
  {
    slug: "long-table-dining",
    name: "Long Table Dining",
    category: "Dining",
    tagline: "Table-first dining, sized for weeknight and weekend.",
    tags: ["gathering", "warm oak", "linen light"],
    dimensions: "Recommended 5.0 × 3.2 m",
    paletteFinishes: ["oak", "walnut", "linen-clay"],
    hotspots: [
      { id: "h1", x: 46, y: 62, productSlug: "atelier-oak-dining-table" },
      { id: "h2", x: 72, y: 40, productSlug: "column-floor-lamp" },
      { id: "h3", x: 22, y: 46, productSlug: "nord-credenza" },
    ],
    relatedSlugs: ["solace-lounge-chair"],
    scene: "long-dining",
  },
  {
    slug: "focused-workspace",
    name: "Focused Workspace",
    category: "Workspace",
    tagline: "A quiet corner for a home studio.",
    tags: ["home office", "warm oak", "shelved"],
    dimensions: "Recommended 3.4 × 2.8 m",
    paletteFinishes: ["oak", "olive", "brass"],
    hotspots: [
      { id: "h1", x: 40, y: 60, productSlug: "atelier-oak-desk" },
      { id: "h2", x: 72, y: 50, productSlug: "vaultline-storage" },
      { id: "h3", x: 20, y: 68, productSlug: "column-floor-lamp" },
    ],
    relatedSlugs: ["brook-armchair"],
    scene: "focused-desk",
  },
  {
    slug: "quiet-bedroom",
    name: "Quiet Bedroom",
    category: "Bedroom",
    tagline: "Low bed, soft wall, warm light.",
    tags: ["restful", "linen", "low-lit"],
    dimensions: "Recommended 4.0 × 3.4 m",
    paletteFinishes: ["linen-clay", "oak", "cognac"],
    hotspots: [
      { id: "h1", x: 48, y: 60, productSlug: "field-bed-frame" },
      { id: "h2", x: 78, y: 50, productSlug: "brook-armchair" },
      { id: "h3", x: 20, y: 46, productSlug: "column-floor-lamp" },
    ],
    relatedSlugs: ["nord-credenza"],
    scene: "quiet-bed",
  },
];

export function getRoom(slug: string) {
  return rooms.find((r) => r.slug === slug);
}
