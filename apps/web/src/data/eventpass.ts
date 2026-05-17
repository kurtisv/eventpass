export const events = [
  {
    id: "ep-event-001",
    slug: "founder-summit",
    name: "Founder Summit",
    date: "2026-06-12",
    venue: "Port Hall Montreal",
    capacity: 120,
    registered: 86,
    type: "Conference",
    accent: "#3c2f69",
    description: {
      fr: "Un evenement cible pour fondateurs, equipes produit et operateurs.",
      en: "A focused operator event for founders, builders, and product teams.",
    },
  },
  {
    id: "ep-event-002",
    slug: "design-ops-night",
    name: "Design Ops Night",
    date: "2026-06-26",
    venue: "Atelier Saint-Laurent",
    capacity: 72,
    registered: 49,
    type: "Workshop",
    accent: "#e05d3f",
    description: {
      fr: "Une soiree pratique sur la livraison de meilleurs produits numeriques avec de petites equipes.",
      en: "A practical evening on shipping better digital products with small teams.",
    },
  },
];

export const tickets = [
  { token: "eventpass-demo-ticket", attendeeName: "Mara Chen", attendeeEmail: "mara@example.com", eventName: "Founder Summit", status: "CONFIRMED", checkedIn: false },
  { token: "eventpass-demo-checked", attendeeName: "Elliot Moore", attendeeEmail: "elliot@example.com", eventName: "Design Ops Night", status: "CHECKED_IN", checkedIn: true },
];

export const eventStats = [
  { label: "Events live", value: "2" },
  { label: "Seats tracked", value: "192" },
  { label: "Registrations", value: "135" },
  { label: "Token tickets", value: "2" },
];
