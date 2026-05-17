export const events = [
  {
    id: "ep-event-001",
    slug: "founder-summit",
    name: "KV Client Launch Summit",
    date: "2026-06-12",
    venue: "Port Hall Montreal",
    capacity: 120,
    registered: 86,
    type: "Client summit",
    accent: "#3c2f69",
    description: {
      fr: "Un sommet client pour transformer les leads Luma et QuotePilot en plans de lancement concrets.",
      en: "A client summit that turns Luma and QuotePilot leads into concrete launch plans.",
    },
    linkedProject: "Northline Launch Workspace",
    sourceModule: "QuotePilot + ReserveFlow",
  },
  {
    id: "ep-event-002",
    slug: "design-ops-night",
    name: "Design Ops Night",
    date: "2026-06-26",
    venue: "Atelier Saint-Laurent",
    capacity: 72,
    registered: 49,
    type: "Client workshop",
    accent: "#e05d3f",
    description: {
      fr: "Un atelier pour clients actifs dans ClientHub, avec materiel vendu par CommerceKit et suivi SupportDesk.",
      en: "A workshop for active ClientHub customers, with CommerceKit materials and SupportDesk follow-up.",
    },
    linkedProject: "Atelier Boutique Operations Portal",
    sourceModule: "ClientHub + CommerceKit",
  },
];

export const tickets = [
  { token: "eventpass-demo-ticket", attendeeName: "Mara Chen", attendeeEmail: "mara@example.com", company: "Northline Studio", eventName: "KV Client Launch Summit", source: "ClientHub", status: "CONFIRMED", checkedIn: false },
  { token: "eventpass-demo-checked", attendeeName: "Elliot Moore", attendeeEmail: "elliot@example.com", company: "Atelier Boutique", eventName: "Design Ops Night", source: "CommerceKit", status: "CHECKED_IN", checkedIn: true },
  { token: "eventpass-demo-support", attendeeName: "Nadia Fortin", attendeeEmail: "nadia@example.com", company: "Riverside Condo", eventName: "Design Ops Night", source: "SupportDesk Lite", status: "CONFIRMED", checkedIn: false },
];

export const eventStats = [
  { label: "Events live", value: "2" },
  { label: "Seats tracked", value: "192" },
  { label: "Registrations", value: "135" },
  { label: "Token tickets", value: "3" },
];

export const agendaBlocks = [
  { time: "09:00", title: "Northline launch clinic", module: "QuotePilot", seats: "42/60" },
  { time: "11:30", title: "ClientHub delivery review", module: "ClientHub", seats: "38/48" },
  { time: "14:00", title: "CommerceKit materials pickup", module: "CommerceKit", seats: "27/36" },
  { time: "16:15", title: "SupportDesk follow-up desk", module: "SupportDesk Lite", seats: "18/24" },
];

export const registrationLanes = [
  { label: "Invited from ClientHub", value: "58", tone: "bg-[#7c4dff]" },
  { label: "Paid through CommerceKit", value: "44", tone: "bg-[#ff7a45]" },
  { label: "Checked in", value: "33", tone: "bg-[#1fbf9b]" },
];

export const ecosystemTimeline = [
  {
    module: "Luma Studio",
    fr: "La demande initiale genere un lead qualifie.",
    en: "The initial request creates a qualified lead.",
  },
  {
    module: "QuotePilot",
    fr: "Le lead recoit une proposition et passe au suivi client.",
    en: "The lead receives a proposal and moves into client follow-up.",
  },
  {
    module: "ClientHub",
    fr: "Le client actif est invite a un atelier ou lancement.",
    en: "The active client is invited to a workshop or launch event.",
  },
  {
    module: "CommerceKit",
    fr: "Le materiel ou les credits lies a l'evenement sont vendus.",
    en: "Event materials or related credits are sold.",
  },
  {
    module: "SupportDesk Lite",
    fr: "Le suivi apres evenement reste disponible dans le support.",
    en: "Post-event follow-up remains available through support.",
  },
];
