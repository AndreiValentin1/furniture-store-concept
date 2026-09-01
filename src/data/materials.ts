export interface MaterialFinish {
  id: string;
  name: string;
  note: string;
}

export interface MaterialCategory {
  slug: "wood" | "fabric" | "leather" | "stone" | "metal";
  name: string;
  tagline: string;
  description: string;
  care: string;
  durability: string;
  showroom: string;
  compatibleProducts: number;
  placeholder: string; // css utility class
  finishes: MaterialFinish[];
}

export const materials: MaterialCategory[] = [
  {
    slug: "wood",
    name: "Wood",
    tagline: "Solid oak and smoked walnut, finished by hand.",
    description:
      "European hardwoods, dried slowly and finished with plant oils. Each piece keeps the grain visible and responsive to touch.",
    care: "Wipe with a soft cloth. Re-oil once a year.",
    durability: "Made to last decades with regular oiling.",
    showroom: "Full range on display in London and Copenhagen.",
    compatibleProducts: 6,
    placeholder: "placeholder-oak",
    finishes: [
      { id: "oak", name: "Natural Oak", note: "Oil finish, warm honey tone." },
      { id: "walnut", name: "Smoked Walnut", note: "Deep, matte, low sheen." },
      { id: "ash", name: "Pale Ash", note: "Light, open grain." },
    ],
  },
  {
    slug: "fabric",
    name: "Fabric",
    tagline: "Bouclé, linen and heavy weaves.",
    description:
      "Textiles chosen for structure and hand. Belgian linen, chunky bouclé, and tight cotton weaves that soften with use.",
    care: "Vacuum with soft brush. Spot clean with mild soap.",
    durability: "Rated 40,000+ Martindale on upholstery.",
    showroom: "Full swatch wall in each location.",
    compatibleProducts: 7,
    placeholder: "placeholder-boucle",
    finishes: [
      { id: "boucle", name: "Bouclé Ivory", note: "Textured loop pile." },
      { id: "linen-clay", name: "Linen Clay", note: "Pre-washed heavy linen." },
      { id: "olive", name: "Muted Olive", note: "Wool blend, tight weave." },
    ],
  },
  {
    slug: "leather",
    name: "Leather",
    tagline: "Full-grain, vegetable-tanned.",
    description:
      "Sourced from small tanneries. Full-grain hides that develop a patina and warm color over the years.",
    care: "Condition twice a year. Keep out of direct sun.",
    durability: "Improves with age; expect 20+ years of use.",
    showroom: "Cognac and Charcoal on display in Copenhagen.",
    compatibleProducts: 3,
    placeholder: "placeholder-leather",
    finishes: [
      { id: "cognac", name: "Cognac", note: "Warm amber tone." },
      { id: "charcoal", name: "Charcoal", note: "Deep, matte finish." },
    ],
  },
  {
    slug: "stone",
    name: "Stone",
    tagline: "Honed limestone and quarry marble.",
    description:
      "European stones cut and honed for warm, non-reflective surfaces. Naturally cool to the touch.",
    care: "Wipe with pH-neutral cleaner. Reseal every two years.",
    durability: "Structural, decades of use with sealing.",
    showroom: "Sample tiles available at all showrooms.",
    compatibleProducts: 2,
    placeholder: "placeholder-stone",
    finishes: [
      { id: "limestone", name: "Honed Limestone", note: "Pale, warm grey." },
      { id: "travertine", name: "Cream Travertine", note: "Open pore, sealed." },
    ],
  },
  {
    slug: "metal",
    name: "Metal",
    tagline: "Brushed brass and warm steel.",
    description:
      "Hardware and structural detailing in solid brass and powder-coated steel. Warm finishes, no shine.",
    care: "Wipe with a dry cloth. Brass ages naturally.",
    durability: "Structural pieces guaranteed for 20 years.",
    showroom: "Hardware samples available on request.",
    compatibleProducts: 4,
    placeholder: "placeholder-metal",
    finishes: [
      { id: "brass", name: "Brushed Brass", note: "Warm, lightly matte." },
      { id: "graphite-steel", name: "Graphite Steel", note: "Powder coat, warm charcoal." },
    ],
  },
];

export function getMaterial(slug: string) {
  return materials.find((m) => m.slug === slug);
}
