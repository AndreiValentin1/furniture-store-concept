export interface Showroom {
  id: string;
  city: string;
  address: string;
  hours: string;
  phone: string;
  note: string;
}
export const showrooms: Showroom[] = [
  {
    id: "london",
    city: "London",
    address: "44 Bermondsey Street, SE1 3UD",
    hours: "Tue–Sat · 10:00–18:00",
    phone: "+44 20 7946 1000",
    note: "Full seating, dining and materials range on the ground floor.",
  },
  {
    id: "copenhagen",
    city: "Copenhagen",
    address: "Vesterbrogade 71, 1620 København V",
    hours: "Mon–Sat · 10:00–17:30",
    phone: "+45 33 32 10 00",
    note: "Fabric and leather swatch wall. Custom finish consultation.",
  },
  {
    id: "new-york",
    city: "New York",
    address: "142 Wooster Street, Soho, NY 10012",
    hours: "Mon–Sun · 11:00–19:00",
    phone: "+1 212 555 0140",
    note: "Full room installations and made-to-order surface reviews.",
  },
];
