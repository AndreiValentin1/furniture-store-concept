export type ProductType = "ready" | "quote";

export interface Finish {
  id: string;
  name: string;
  swatch: string; // css color or gradient
  material: string;
}

export interface Product {
  slug: string;
  name: string;
  category: "Seating" | "Tables" | "Storage" | "Lighting" | "Decor" | "Bedroom";
  room: string[]; // e.g. ["Living Room", "Workspace"]
  fromPrice: number;
  currency: string;
  dimensions: string;
  materials: string[];
  finishes: Finish[];
  availability: "In stock" | "Made to order" | "Low stock";
  showroom: string[];
  type: ProductType;
  placeholder: "product" | "room";
  imageTint: string; // css class
  tagline: string;
  seenIn?: string; // room slug
}

const oak: Finish = {
  id: "oak",
  name: "Natural Oak",
  swatch: "linear-gradient(135deg,#d4b78a,#a67f52)",
  material: "Wood",
};
const walnut: Finish = {
  id: "walnut",
  name: "Smoked Walnut",
  swatch: "linear-gradient(135deg,#6b4a34,#3a251a)",
  material: "Wood",
};
const boucle: Finish = {
  id: "boucle",
  name: "Bouclé Ivory",
  swatch: "linear-gradient(135deg,#f2ead9,#dccdb2)",
  material: "Fabric",
};
const linenClay: Finish = {
  id: "linen-clay",
  name: "Linen Clay",
  swatch: "linear-gradient(135deg,#c9a790,#a67c62)",
  material: "Fabric",
};
const olive: Finish = {
  id: "olive",
  name: "Muted Olive",
  swatch: "linear-gradient(135deg,#8a8963,#5f5e40)",
  material: "Fabric",
};
const stone: Finish = {
  id: "stone",
  name: "Honed Limestone",
  swatch: "linear-gradient(135deg,#d9d0c1,#a89e8a)",
  material: "Stone",
};
const cognac: Finish = {
  id: "cognac",
  name: "Cognac Leather",
  swatch: "linear-gradient(135deg,#a06a48,#5c3821)",
  material: "Leather",
};
const brass: Finish = {
  id: "brass",
  name: "Brushed Brass",
  swatch: "linear-gradient(135deg,#c8a768,#8a6e3f)",
  material: "Metal",
};

export const products: Product[] = [
  {
    slug: "hove-modular-sofa",
    name: "Hove Modular Sofa",
    category: "Seating",
    room: ["Living Room"],
    fromPrice: 2400,
    currency: "$",
    dimensions: "W 260 · D 96 · H 78 cm",
    materials: ["Bouclé", "Linen", "Oak base"],
    finishes: [boucle, linenClay, olive],
    availability: "Made to order",
    showroom: ["London", "Copenhagen"],
    type: "quote",
    placeholder: "product",
    imageTint: "placeholder-product",
    tagline: "Low, wide seat with deep cushioning.",
    seenIn: "warm-neutral-living",
  },
  {
    slug: "atelier-oak-dining-table",
    name: "Atelier Oak Dining Table",
    category: "Tables",
    room: ["Dining"],
    fromPrice: 3200,
    currency: "$",
    dimensions: "L 220 · W 92 · H 74 cm",
    materials: ["Solid oak"],
    finishes: [oak, walnut],
    availability: "Made to order",
    showroom: ["London", "New York"],
    type: "quote",
    placeholder: "product",
    imageTint: "placeholder-oak",
    tagline: "Extendable plank top on tapered legs.",
    seenIn: "long-table-dining",
  },
  {
    slug: "solace-lounge-chair",
    name: "Solace Lounge Chair",
    category: "Seating",
    room: ["Living Room"],
    fromPrice: 1850,
    currency: "$",
    dimensions: "W 82 · D 88 · H 74 cm",
    materials: ["Bouclé", "Walnut legs"],
    finishes: [boucle, olive, linenClay],
    availability: "In stock",
    showroom: ["London", "Copenhagen", "New York"],
    type: "ready",
    placeholder: "product",
    imageTint: "placeholder-boucle",
    tagline: "Sculpted shell, quiet posture.",
    seenIn: "warm-neutral-living",
  },
  {
    slug: "nord-credenza",
    name: "Nord Credenza",
    category: "Storage",
    room: ["Living Room", "Dining"],
    fromPrice: 2900,
    currency: "$",
    dimensions: "L 180 · D 44 · H 72 cm",
    materials: ["Smoked walnut", "Brass hardware"],
    finishes: [walnut, oak],
    availability: "Made to order",
    showroom: ["Copenhagen"],
    type: "quote",
    placeholder: "product",
    imageTint: "placeholder-walnut",
    tagline: "Reeded doors, soft-close drawers.",
  },
  {
    slug: "field-bed-frame",
    name: "Field Bed Frame",
    category: "Bedroom",
    room: ["Bedroom"],
    fromPrice: 2100,
    currency: "$",
    dimensions: "L 210 · W 170 · H 92 cm",
    materials: ["Oak", "Linen headboard"],
    finishes: [linenClay, boucle, oak],
    availability: "Made to order",
    showroom: ["London"],
    type: "quote",
    placeholder: "product",
    imageTint: "placeholder-linen",
    tagline: "Upholstered headboard, low profile.",
    seenIn: "quiet-bedroom",
  },
  {
    slug: "atelier-oak-desk",
    name: "Atelier Oak Desk",
    category: "Tables",
    room: ["Workspace"],
    fromPrice: 1450,
    currency: "$",
    dimensions: "L 160 · W 72 · H 74 cm",
    materials: ["Solid oak", "Cable channel"],
    finishes: [oak, walnut],
    availability: "In stock",
    showroom: ["London", "New York"],
    type: "ready",
    placeholder: "product",
    imageTint: "placeholder-oak",
    tagline: "A steady surface for focused work.",
    seenIn: "focused-workspace",
  },
  {
    slug: "column-floor-lamp",
    name: "Column Floor Lamp",
    category: "Lighting",
    room: ["Living Room", "Workspace"],
    fromPrice: 620,
    currency: "$",
    dimensions: "H 168 · Ø 32 cm",
    materials: ["Brushed brass", "Linen shade"],
    finishes: [brass, linenClay],
    availability: "In stock",
    showroom: ["London", "Copenhagen", "New York"],
    type: "ready",
    placeholder: "product",
    imageTint: "placeholder-metal",
    tagline: "Warm ambient light for corners.",
    seenIn: "warm-neutral-living",
  },
  {
    slug: "pond-coffee-table",
    name: "Pond Coffee Table",
    category: "Tables",
    room: ["Living Room"],
    fromPrice: 980,
    currency: "$",
    dimensions: "Ø 96 · H 34 cm",
    materials: ["Limestone", "Oak base"],
    finishes: [stone, oak],
    availability: "Low stock",
    showroom: ["London"],
    type: "ready",
    placeholder: "product",
    imageTint: "placeholder-stone",
    tagline: "Round honed top on a turned base.",
    seenIn: "warm-neutral-living",
  },
  {
    slug: "vaultline-storage",
    name: "Vaultline Storage",
    category: "Storage",
    room: ["Workspace", "Living Room"],
    fromPrice: 1780,
    currency: "$",
    dimensions: "L 140 · D 40 · H 190 cm",
    materials: ["Oak veneer", "Steel frame"],
    finishes: [oak, walnut],
    availability: "Made to order",
    showroom: ["London", "New York"],
    type: "quote",
    placeholder: "product",
    imageTint: "placeholder-product",
    tagline: "Modular shelving for a working room.",
    seenIn: "focused-workspace",
  },
  {
    slug: "brook-armchair",
    name: "Brook Armchair",
    category: "Seating",
    room: ["Living Room", "Bedroom"],
    fromPrice: 1290,
    currency: "$",
    dimensions: "W 78 · D 82 · H 80 cm",
    materials: ["Cognac leather", "Oak frame"],
    finishes: [cognac, oak, linenClay],
    availability: "In stock",
    showroom: ["Copenhagen"],
    type: "ready",
    placeholder: "product",
    imageTint: "placeholder-leather",
    tagline: "Softened leather over a hand-turned frame.",
    seenIn: "quiet-bedroom",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
