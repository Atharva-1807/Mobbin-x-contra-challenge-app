// ─── Shared design token ────────────────────────────────────────────────────
export const F = '"Geist", system-ui, sans-serif';

// ─── Premium reference images (user-provided, high-fidelity dining photography)
import _refGardenRestaurant from "../../../assets/ref-garden-restaurant.png";
import _refCoffeeShop       from "../../../assets/ref-coffee-shop.png";
import _refBarGlobe         from "../../../assets/ref-bar-globe.png";
import _refAtelierOmakase   from "../../../assets/ref-atelier-omakase.png";
import _refFoundersBurger   from "../../../assets/ref-founders-burger.png";
import _refMasaSashimi      from "../../../assets/ref-masa-sashimi.png";

// ─── Images ─────────────────────────────────────────────────────────────────
export const IMG_PIZZA_REST  = _refGardenRestaurant;  // warm garden trattoria → Si Nonna's
export const IMG_COFFEE      = _refCoffeeShop;         // minimal coffee shop → Still Coffee
export const IMG_BAR         = _refBarGlobe;           // intimate bar → Bar Boulud / Dante
export const IMG_FINE_DINING = _refAtelierOmakase;     // omakase / chef at counter — Atelier
export const IMG_SUSHI       = _refMasaSashimi;        // premium sashimi bowl — Masa
export const IMG_BURGER      = _refFoundersBurger;     // smash burgers on tray — Founders Burgers

// Premium Unsplash photography for remaining venues
export const IMG_ROOFTOP_BAR = "https://images.unsplash.com/photo-1470337458703-46ad1756a187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";
export const IMG_BRUNCH      = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";
export const IMG_DESSERT     = "https://images.unsplash.com/photo-1587314168485-3236d6710814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";
// Real-person portrait images — diverse demographics
export const IMG_FRIENDS     = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200";
export const IMG_AVATAR      = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200";

// ─── Types ───────────────────────────────────────────────────────────────────
export type Venue = {
  id: number;
  name: string;
  rating: string;
  vibe: string;
  location: string;
  address: string;
  image: string;
  description: string;
  /** Second paragraph on Vibe tab (high-fid copy) */
  vibeStory?: string;
};

// ─── Vibe tab tags — high-fid mockup (category chips, not raw vibe split) ───────
export const VIBE_TAG_SETS: Record<string, string[]> = {
  default: ["Great Vibe", "Group-friendly", "Book Ahead", "Outdoor"],
  Italian: ["Wood-fired", "Date Night", "Group Dining", "Reservations"],
  Coffee: ["Single-origin", "Work-friendly", "Morning", "Aesthetic"],
  Cocktails: ["Sunset Views", "Craft Drinks", "Date Night", "Dress Up"],
  Japanese: ["Omakase", "Intimate", "Reservations", "Premium"],
  Matcha: ["Ceremonial", "Quiet", "Afternoon", "Solo-friendly"],
  Brunch: ["Weekend Vibes", "Bottomless", "Group-friendly", "Leisurely"],
  "Fine Dining": ["Chef's Table", "Tasting Menu", "Wine Pairing", "Reservations"],
  American: ["Casual", "Groups", "Late Night", "Local fav"],
  Dessert: ["Sweet Treats", "Date Night", "Insta-worthy", "To-go"],
};

export function getVibeTagsForVenue(venueVibe: string): string[] {
  const key =
    Object.keys(VIBE_TAG_SETS).find((k) => k !== "default" && venueVibe.includes(k)) ?? "default";
  return VIBE_TAG_SETS[key];
}

// ─── Venue data ──────────────────────────────────────────────────────────────
export const TRENDING_VENUES: Venue[] = [
  {
    id: 1,
    name: "Si Nonna's Pizzeria",
    rating: "4.7",
    vibe: "Italian · Lively",
    location: "West Village",
    address: "24 Minetta Ln, West Village, NY 10014",
    image: IMG_PIZZA_REST,
    description: "Wood-fired pies and handmade pasta in a buzzing West Village trattoria.",
    vibeStory:
      "The arancini alone is worth the journey. The space strikes a rare balance between neighbourhood warmth and metropolitan cool.",
  },
  { id: 2, name: "Skyline Rooftop Bar",  rating: "4.9", vibe: "Cocktails · Views",     location: "Midtown",         address: "45 W 55th St, Midtown, NY 10019",                  image: IMG_ROOFTOP_BAR, description: "Elevated cocktails with panoramic Manhattan skyline views at sunset." },
  { id: 3, name: "The Sunday Table",     rating: "4.5", vibe: "Brunch · Cozy",         location: "SoHo",            address: "88 Greene St, SoHo, NY 10012",                     image: IMG_BRUNCH,      description: "Leisurely weekend brunch with seasonal small plates and bottomless mimosas." },
  { id: 4, name: "Still Coffee",         rating: "4.8", vibe: "Coffee · Aesthetic",    location: "Lower East Side", address: "17 Essex St, Lower East Side, NY 10002",           image: IMG_COFFEE,      description: "Specialty single-origin brews in a moody, minimalist café setting." },
  { id: 5, name: "Atelier",              rating: "4.9", vibe: "Fine Dining · Elegant", location: "Upper East Side", address: "160 E 65th St, Upper East Side, NY 10065",         image: IMG_FINE_DINING, description: "Refined modern European tasting menus in an intimate candlelit room." },
  { id: 6, name: "Founders Burgers",     rating: "4.6", vibe: "American · Casual",     location: "Brooklyn",        address: "341 Bedford Ave, Williamsburg, Brooklyn, NY 11211", image: IMG_BURGER,      description: "Smash burgers with locally-sourced beef and house-made sauces." },
  { id: 7, name: "Sweet Surrender",      rating: "4.4", vibe: "Dessert · Whimsical",   location: "West Village",    address: "36 Bedford St, West Village, NY 10014",            image: IMG_DESSERT,     description: "Playful artisan pastries and dessert flights in a pastel-hued café." },
  { id: 8, name: "Masa",                 rating: "5.0", vibe: "Japanese · Omakase",    location: "Columbus Circle", address: "10 Columbus Cir, Upper West Side, NY 10019",       image: IMG_SUSHI,       description: "The pinnacle of New York omakase — pristine fish, zero distractions." },
];

// ─── Grain SVG utility ────────────────────────────────────────────────────────
export const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

// ─── Shared pill style ────────────────────────────────────────────────────────
export const pillBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: 999,
  backdropFilter: "blur(8px)",
};
