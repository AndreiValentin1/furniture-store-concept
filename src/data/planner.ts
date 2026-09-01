export interface Measurement {
  id: string;
  room: string;
  label: string;
  value: string;
}
export interface SavedRoom {
  id: string;
  name: string;
  roomSlug: string;
  updated: string;
  pieceCount: number;
  finishes: string[];
  note: string;
}
export interface QuoteDraft {
  id: string;
  reference: string;
  name: string;
  status: "Draft" | "Quote requested" | "Finish selection pending" | "Ready for review";
  items: number;
  updated: string;
}
export interface Appointment {
  id: string;
  city: string;
  date: string;
  time: string;
  purpose: string;
  attachedRoom?: string;
}

export const savedRooms: SavedRoom[] = [
  {
    id: "sr-1",
    name: "North London Apartment · Living",
    roomSlug: "warm-neutral-living",
    updated: "2 days ago",
    pieceCount: 5,
    finishes: ["Linen Clay", "Oak", "Bouclé Ivory"],
    note: "Fits under 3.2 m wall. Compact layout.",
  },
  {
    id: "sr-2",
    name: "Studio Dining Corner",
    roomSlug: "long-table-dining",
    updated: "1 week ago",
    pieceCount: 3,
    finishes: ["Smoked Walnut", "Linen Clay"],
    note: "Testing walnut vs oak top.",
  },
  {
    id: "sr-3",
    name: "Home Office Refit",
    roomSlug: "focused-workspace",
    updated: "3 weeks ago",
    pieceCount: 4,
    finishes: ["Oak", "Brushed Brass"],
    note: "Needs cable routing note.",
  },
  {
    id: "sr-4",
    name: "Guest Bedroom Plan",
    roomSlug: "quiet-bedroom",
    updated: "1 month ago",
    pieceCount: 2,
    finishes: ["Linen Clay", "Cognac"],
    note: "Awaiting wall measurement.",
  },
];

export const measurements: Measurement[] = [
  { id: "m-1", room: "Living Room", label: "Main wall", value: "320 cm" },
  { id: "m-2", room: "Living Room", label: "Window gap", value: "148 cm" },
  { id: "m-3", room: "Dining", label: "Wall to wall", value: "412 cm" },
  { id: "m-4", room: "Workspace", label: "Doorway", value: "82 cm" },
  { id: "m-5", room: "Bedroom", label: "Wall behind bed", value: "360 cm" },
];

export const quoteDrafts: QuoteDraft[] = [
  {
    id: "qd-1",
    reference: "Q2-092",
    name: "Dining Suite Q2-092",
    status: "Ready for review",
    items: 4,
    updated: "yesterday",
  },
  {
    id: "qd-2",
    reference: "Q2-088",
    name: "Living Room Refresh",
    status: "Finish selection pending",
    items: 6,
    updated: "5 days ago",
  },
];

export const appointments: Appointment[] = [
  {
    id: "a-1",
    city: "London — Bermondsey",
    date: "Oct 12",
    time: "10:30",
    purpose: "Review Dining Suite quote",
    attachedRoom: "Long Table Dining",
  },
  {
    id: "a-2",
    city: "Copenhagen — Vesterbro",
    date: "Nov 04",
    time: "14:00",
    purpose: "Fabric samples review",
  },
];

export const savedMaterialIds = ["oak", "walnut", "boucle", "linen-clay"];
