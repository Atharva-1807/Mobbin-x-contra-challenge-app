import { useState, useEffect } from "react";
import { useScrollbarSmartReveal } from "../../hooks/useScrollbarSmartReveal";
import { motion, AnimatePresence, useMotionValue, animate } from "motion/react";
import { GrainImage } from "./GrainImage";
import { F, getVibeTagsForVenue, pillBase } from "./data";
import type { VenueDetailInfo } from "./VenueDetailSheet";
import svgNavIcons from "../../../imports/svg-jbsu1zdd29";
import { DarkMap } from "./DarkMap";
import type { MapVenueWithCoords } from "./DarkMap";
import { VenueMiniMap } from "./VenueMiniMap";

// ─── Figma venue image assets ─────────────────────────────────────────────────
import imgNavuProject from "figma:asset/a3d6af3571b34fbe54764ba53e6c288ae878524c.png";
import imgSandoClub   from "figma:asset/a0fccfce72939b41f7b57a72dba1bcde0e37ce35.png";
import imgStillCoffee from "figma:asset/64eb272aa271690d78b629a8b60b1847001dc1ee.png";
import imgTekaMatcha  from "figma:asset/ad6ae33579b48bf4fc8c0aaa5ed952ec3d4845b7.png";
import imgSiNonnas    from "figma:asset/6045c995cd3280cec00560453883580c1877efe1.png";
import imgVibeHero    from "figma:asset/48dc5e99c457d738d9b7b0d504c71e12c7da5d65.png";
import imgVibeThumb2  from "figma:asset/a0fccfce72939b41f7b57a72dba1bcde0e37ce35.png";
import imgVibeThumb3  from "figma:asset/ad6ae33579b48bf4fc8c0aaa5ed952ec3d4845b7.png";

export type MapVenue = MapVenueWithCoords;

export const MAP_VENUES: MapVenue[] = [
  {
    id: "navu",
    name: "Navu Project",
    rating: "4.6",
    vibe: "Japanese · Minimal",
    location: "Nolita",
    address: "20 Spring St, Nolita, NY 10012",
    description: "A serene Japanese-inspired studio offering omakase-style small plates with a deep reverence for seasonal ingredients.",
    image: imgNavuProject,
    lat: 40.7225, lng: -73.9945,
  },
  {
    id: "sando",
    name: "Sando Club",
    rating: "4.7",
    vibe: "Japanese · Sandwiches",
    location: "Lower East Side",
    address: "40 Canal St, Lower East Side, NY 10002",
    description: "Pillowy Japanese milk-bread sandwiches stuffed with perfectly crumbed katsu and house slaw. Cult status, deservedly so.",
    image: imgSandoClub,
    lat: 40.7153, lng: -73.9857,
  },
  {
    id: "still",
    name: "Still Coffee",
    rating: "4.8",
    vibe: "Coffee · Aesthetic",
    location: "Lower East Side",
    address: "17 Essex St, Lower East Side, NY 10002",
    description: "Specialty single-origin brews in a moody, minimalist café setting. The pour-over program is the city's finest.",
    image: imgStillCoffee,
    lat: 40.7180, lng: -73.9880,
  },
  {
    id: "teka",
    name: "TEKA Matcha",
    rating: "4.5",
    vibe: "Matcha · Cozy",
    location: "SoHo",
    address: "66 Spring St, SoHo, NY 10012",
    description: "A soothing corner dedicated to ceremonial matcha and hojicha latte art — the antidote to espresso-bar noise.",
    image: imgTekaMatcha,
    lat: 40.7245, lng: -73.9994,
    highlighted: true,
  },
  {
    id: "nonna",
    name: "Si Nonna's Pizzeria",
    rating: "4.7",
    vibe: "Italian · Lively",
    location: "West Village",
    address: "24 Minetta Ln, West Village, NY 10014",
    description: "Wood-fired pies and handmade pasta in a buzzing West Village trattoria.",
    vibeStory:
      "The arancini alone is worth the journey. The space strikes a rare balance between neighbourhood warmth and metropolitan cool.",
    image: imgSiNonnas,
    lat: 40.7303, lng: -74.0023,
  },
];

const FILTER_CHIPS = ["All", "Coffee", "Dining", "Cocktails", "Brunch", "Dessert"];

/** Vibe-tab review filters + cards (Discover popover + parity with venue sheet) */
const VIBE_TAB_REVIEW_CHIPS = ["Featured", "1 Star", "2 Star"];
const VIBE_TAB_REVIEW_CARDS = [
  {
    id: 1,
    title: "Delicious food!",
    text: "Very delicious food, great vibes for me and my group. Would totally go back here, 10/10 amazing place!",
    author: "Stephen H",
    date: "Jan 2026",
    stars: 5,
  },
  {
    id: 2,
    title: "Awesome experience",
    text: "Very delicious food, great vibes for me and my group. Would totally go back here, 10/10 amazing place!",
    author: "John H",
    date: "Jan 2026",
    stars: 5,
  },
  {
    id: 3,
    title: "A must visit!",
    text: "Incredible atmosphere and the pasta is genuinely the best in the city. Our whole table was blown away.",
    author: "Priya S.",
    date: "Dec 2025",
    stars: 5,
  },
];

const PEOPLE_POP_INSET = 12;
const PEOPLE_POP_AVATARS = [
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100",
];
const PEOPLE_POP_NAMES = ["Sam Rivera", "Mia Sanders", "Tom Lin", "Priya Shah"];
const PEOPLE_POP_SHORT = ["Sam", "Mia", "Tom", "Priya"];
const PEOPLE_POP_CAPTIONS = [
  "A night to remember",
  "Great vibes, great food",
  "Worth every bite",
  "Every visit feels special",
];

// ─── Icons ────────────────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon({ size = 9, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function MapPinIconSmall() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// ─── Venue Pin ────────────────────────────────────────────────────────────────
function VenuePin({
  venue,
  isSelected,
  onClick,
}: {
  venue: MapVenue;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      className="absolute flex flex-col items-center"
      style={{ left: venue.pinX, top: venue.pinY, zIndex: isSelected ? 30 : 10 }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      whileTap={{ scale: 0.94 }}
      animate={{ scale: isSelected ? 1.08 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <div
        style={{
          width: 64,
          background: venue.highlighted ? "#FAFAF6" : "#F5F3EF",
          borderRadius: 5,
          padding: "5px 5px 0 5px",
          boxShadow: isSelected
            ? "0 12px 40px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.5)"
            : "0 6px 20px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
          border: venue.highlighted
            ? "1.5px solid rgba(180,190,240,0.7)"
            : isSelected ? "1.5px solid rgba(255,255,255,0.4)" : "none",
        }}
      >
        <div style={{ height: 68, overflow: "hidden", borderRadius: 2 }}>
          <GrainImage
            src={venue.image}
            alt={venue.name}
            className="w-full h-full object-cover"
            style={{ filter: "saturate(1.35) contrast(1.06)" }}
          />
        </div>
        <div style={{ padding: "5px 2px 8px", textAlign: "center" }}>
          <p style={{ fontFamily: F, color: "#111", fontSize: 8, fontWeight: 700, lineHeight: 1.2 }}>
            {venue.name}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function DiscoverIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 29 29" fill="none">
      <clipPath id="d-clip">
        <rect width="29" height="29" fill="white" />
      </clipPath>
      <g clipPath="url(#d-clip)">
        <path d={svgNavIcons.p34b22b00} fill="rgba(255,255,255,0.6)" />
      </g>
    </svg>
  );
}

// ─── Venue Popover ─────────────────────────────────────────────────────────────
// Card is 95% tall (~802px). Collapsed state shows 354px (42%).
// SNAP_CLOSED = 802 - 354 = 448.
const SNAP_CLOSED = 448;
const HEADER_H = 260; // image area height

// Tab icons
function PlaceIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="11" height="15" viewBox="0 0 11 15" fill="none">
      <path
        d="M5.5 0C2.46 0 0 2.46 0 5.5c0 4.13 5.5 9.5 5.5 9.5S11 9.63 11 5.5C11 2.46 8.54 0 5.5 0zm0 7.5A2 2 0 1 1 5.5 3.5a2 2 0 0 1 0 4z"
        fill={color}
      />
    </svg>
  );
}
function VibeIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l2.09 6.43H21l-5.47 3.97 2.09 6.43L12 14.87l-5.62 3.96 2.09-6.43L3 8.43h6.91L12 2z"
        fill={color}
      />
    </svg>
  );
}
function PeopleIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="15" viewBox="0 0 24 18" fill="none">
      <path
        d="M16 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm8 0c-.33 0-.69.03-1.09.07C16.25 11 17 12.11 17 13.5V16h7v-2c0-2.66-4.67-4-8-4z"
        fill={color}
      />
    </svg>
  );
}
function HeartOutlineIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function BookmarkOutlineIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
const TABS_POPOVER = [
  { id: "Place", label: "Place", Icon: PlaceIcon },
  { id: "Vibe",  label: "Vibe",  Icon: VibeIcon  },
  { id: "People",label: "People",Icon: PeopleIcon },
];
const DATES = [
  { day: "Today",    date: "26 Mar" },
  { day: "Tomorrow", date: "27 Mar" },
  { day: "Fri",      date: "28 Mar" },
  { day: "Sat",      date: "29 Mar" },
];
const TIMES = [
  { time: "7:00 PM",  sub: "2 offers" },
  { time: "8:00 PM",  sub: "2 offers" },
  { time: "9:00 PM",  sub: "2 offers" },
  { time: "10:00 PM", sub: "Full"     },
];

export function VenuePopover({
  venue,
  onClose,
  onOpenDetail,
  onPlanYourDay,
}: {
  venue: MapVenue;
  onClose: () => void;
  onOpenDetail: (v: VenueDetailInfo) => void;
  onPlanYourDay: (v: MapVenue) => void;
}) {
  const [isOpen, setIsOpen]       = useState(false);
  const [activeTab, setActiveTab] = useState("Place");
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);
  const [groupSize, setGroupSize] = useState(2);
  const [vibeReviewFilter, setVibeReviewFilter] = useState("Featured");
  const [peopleCarouselIdx, setPeopleCarouselIdx] = useState(0);
  const onScrollSmart = useScrollbarSmartReveal();

  const peopleHighlightImages = [imgVibeHero, venue.image as string, imgVibeThumb2, imgSiNonnas];

  // y=0 → fully open, y=SNAP_CLOSED → collapsed showing 42%
  const y = useMotionValue(SNAP_CLOSED + 400);

  // Entrance: slide up to collapsed position
  useEffect(() => {
    animate(y, SNAP_CLOSED, { type: "spring", stiffness: 300, damping: 38 });
  }, []);

  function snapOpen() {
    animate(y, 0, { type: "spring", stiffness: 340, damping: 42 });
    setIsOpen(true);
  }

  function snapClose() {
    animate(y, SNAP_CLOSED, { type: "spring", stiffness: 340, damping: 42 });
    setIsOpen(false);
  }

  function dismiss() {
    animate(y, SNAP_CLOSED + 600, {
      type: "spring",
      stiffness: 280,
      damping: 36,
      onComplete: onClose,
    });
  }

  function handleDragEnd(_: unknown, info: { offset: { y: number }; velocity: { y: number } }) {
    const vel = info.velocity.y;
    const curr = y.get();

    if (!isOpen) {
      // Collapsed → open if dragged far enough up
      if (vel < -250 || curr < SNAP_CLOSED - 90) snapOpen();
      // Collapsed → dismiss if dragged down
      else if (vel > 300 || curr > SNAP_CLOSED + 90) dismiss();
      // Snap back to collapsed
      else animate(y, SNAP_CLOSED, { type: "spring", stiffness: 400, damping: 44 });
    } else {
      // Open → collapse if dragged down enough
      if (vel > 300 || curr > 90) snapClose();
      // Snap back to open
      else animate(y, 0, { type: "spring", stiffness: 400, damping: 44 });
    }
  }

  return (
    <motion.div
      style={{
        y,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "95%",
        borderRadius: "20px 20px 0 0",
        zIndex: 650,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#000",
      }}
      drag="y"
      dragConstraints={{ top: -24, bottom: SNAP_CLOSED + 120 }}
      dragElastic={{ top: 0.04, bottom: 0.18 }}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── HEADER: venue image background + gradient overlay ── */}
      <div
        style={{
          position: "relative",
          height: HEADER_H,
          flexShrink: 0,
          overflow: "hidden",
          borderRadius: "20px 20px 0 0",
          cursor: "grab",
        }}
      >
        {/* Background image */}
        <img
          src={venue.image as string}
          alt={venue.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Dark gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.45) 52%, rgba(0,0,0,0.82) 78%, #000 100%)",
          }}
        />

        {/* Drag pill */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 38,
            height: 3,
            borderRadius: 2,
            background: "rgba(255,255,255,0.35)",
          }}
        />

        {/* Venue name */}
        <p
          style={{
            position: "absolute",
            bottom: 62,
            left: 20,
            right: 20,
            fontFamily: F,
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {venue.name}
        </p>

        {/* Rating + vibe row + action icons */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 20,
            right: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ color: "#FFD700", display: "flex", alignItems: "center" }}>
              <StarIcon size={12} />
            </span>
            <span style={{ fontFamily: F, color: "#fff", fontSize: 14, fontWeight: 600 }}>
              {venue.rating}
            </span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>·</span>
            <span style={{ fontFamily: F, color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
              {venue.vibe}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <HeartOutlineIcon />
            <UploadIcon />
            <BookmarkOutlineIcon />
          </div>
        </div>
      </div>

      {/* ── TABS row (on black, always visible) ── */}
      <div
        style={{ flexShrink: 0, background: "#000", cursor: "grab" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", padding: "14px 20px 0" }}>
          {TABS_POPOVER.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab(id);
                  if (!isOpen) snapOpen();
                }}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  paddingBottom: 10,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span style={{ color: active ? "#fff" : "#666", display: "flex" }}>
                  <Icon color={active ? "#fff" : "#666"} />
                </span>
                <span
                  style={{
                    fontFamily: F,
                    color: active ? "#fff" : "#666",
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
        {/* Progress track + active indicator */}
        <div style={{ position: "relative", height: 1, background: "#2e2318", margin: "0 20px" }}>
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              height: 1,
              background: "#fff",
              borderRadius: 6,
              width: `${100 / 3}%`,
            }}
            animate={{ left: `${(TABS_POPOVER.findIndex((t) => t.id === activeTab) * 100) / 3}%` }}
            transition={{ type: "spring", stiffness: 400, damping: 36 }}
          />
        </div>

        {/* Address — Place tab only (not on Vibe / People) */}
        {activeTab === "Place" && (
          <div style={{ padding: "12px 20px 14px" }}>
            <p style={{ fontFamily: F, color: "#B2B2B2", fontSize: 13, lineHeight: 1.5, margin: 0 }}>
              {venue.address}
            </p>
          </div>
        )}
      </div>

      {/* ── SCROLLABLE open-state content — tab-aware ── */}
      <div
        className="scrollbar-smart"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: isOpen ? "auto" : "hidden",
          background: "#000",
        }}
        onScroll={onScrollSmart}
        onPointerDownCapture={(e) => {
          if (isOpen) e.stopPropagation();
        }}
      >
        <div style={{ height: 1, background: "#1a1a1a", margin: "0 20px 20px" }} />

        {/* ── PLACE TAB content ── */}
        {activeTab === "Place" && (
          <>
            {/* Mini map */}
            <div style={{ padding: "0 20px 16px" }}>
              <div style={{ borderRadius: 14, overflow: "hidden", height: 130, border: "1px solid rgba(255,255,255,0.06)" }}>
                <VenueMiniMap lat={venue.lat} lng={venue.lng} label={venue.name} style={{ height: 130 }} />
              </div>
            </div>

            <div style={{ height: 1, background: "#1a1a1a", margin: "0 20px 20px" }} />

            {/* Grab a table */}
            <p style={{ fontFamily: F, color: "#fff", fontSize: 22, fontWeight: 700, padding: "0 20px", margin: "0 0 16px" }}>
              Grab a table
            </p>

            {/* Select your group — minus / count / plus (not a dropdown) */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 14px" }}>
              <span style={{ fontFamily: F, color: "#B2B2B2", fontSize: 13 }}>Select your group</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #2A2A2A", borderRadius: 8, padding: "6px 14px", background: "rgba(255,255,255,0.04)" }}>
                <button type="button" onClick={(e) => { e.stopPropagation(); setGroupSize((n) => Math.max(1, n - 1)); }} aria-label="Decrease group size" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, background: groupSize > 1 ? "rgba(255,255,255,0.12)" : "transparent", border: "none", cursor: groupSize > 1 ? "pointer" : "default" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke={groupSize > 1 ? "#fff" : "#555"} strokeWidth="2.5" strokeLinecap="round" /></svg>
                </button>
                <span style={{ fontFamily: F, color: "#fff", fontSize: 15, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{groupSize}</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); setGroupSize((n) => Math.min(20, n + 1)); }} aria-label="Add person" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.12)", border: "none", cursor: "pointer" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /></svg>
                </button>
              </div>
            </div>

            {/* Select Date */}
            <div style={{ padding: "0 20px 16px" }}>
              <p style={{ fontFamily: F, color: "#B3B3B3", fontSize: 13, marginBottom: 10 }}>Select Date</p>
              <div style={{ display: "flex", gap: 8 }}>
                {DATES.map((d, i) => {
                  const sel = selectedDate === i;
                  return (
                    <button key={i} onClick={(e) => { e.stopPropagation(); setSelectedDate(i); }}
                      style={{ flex: 1, height: 56, borderRadius: 5, background: sel ? "#e8e8e8" : "transparent", border: sel ? "none" : "1px solid rgba(255,255,255,0.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer" }}>
                      <span style={{ fontFamily: F, fontSize: 13, color: sel ? "#000" : "#fff", fontWeight: sel ? 600 : 400 }}>{d.day}</span>
                      <span style={{ fontFamily: F, fontSize: 10, color: sel ? "#666" : "#888" }}>{d.date}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Time */}
            <div style={{ padding: "0 20px 24px" }}>
              <p style={{ fontFamily: F, color: "#B3B3B3", fontSize: 13, marginBottom: 10 }}>Select Time</p>
              <div style={{ display: "flex", gap: 8 }}>
                {TIMES.map((t, i) => {
                  const sel = selectedTime === i;
                  const isFull = t.sub === "Full";
                  return (
                    <button key={i} onClick={(e) => { e.stopPropagation(); if (!isFull) setSelectedTime(i); }}
                      style={{ flex: 1, height: 56, borderRadius: 5, background: isFull ? "#292929" : sel ? "#e8e8e8" : "transparent", border: isFull ? "1px solid #444" : sel ? "none" : "1px solid rgba(255,255,255,0.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: isFull ? "default" : "pointer" }}>
                      <span style={{ fontFamily: F, fontSize: 12, color: isFull ? "#444444" : sel ? "#000" : "#fff", fontWeight: sel && !isFull ? 600 : 400 }}>{t.time}</span>
                      <span style={{ fontFamily: F, fontSize: 10, color: isFull ? "#777777" : sel ? "#666" : "#888" }}>{t.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ── VIBE TAB — homepage pills + sections ── */}
        {activeTab === "Vibe" && (
          <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {getVibeTagsForVenue(venue.vibe).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      ...pillBase,
                      padding: "5px 14px",
                      display: "inline-flex",
                      alignItems: "center",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }}
                  >
                    <span style={{ fontFamily: F, color: "#fff", fontSize: 12, fontWeight: 500 }}>{tag}</span>
                  </span>
                ))}
              </div>
              <p style={{ fontFamily: F, color: "#fff", fontSize: 14, lineHeight: 1.68, margin: 0 }}>
                {venue.description}
                {venue.vibeStory ? ` ${venue.vibeStory}` : ""}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div
                style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  height: 220,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <img
                  src={imgVibeHero}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(1.15) brightness(0.92)" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 55%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {[venue.image, imgVibeThumb2, imgVibeThumb3].map((src, i) => (
                  <div key={i} style={{ borderRadius: 10, overflow: "hidden", height: 68, border: "1px solid rgba(255,255,255,0.1)" }}>
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
                <div
                  style={{
                    borderRadius: 10,
                    height: 68,
                    background: "rgba(45,45,45,0.95)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontFamily: F, color: "#fff", fontSize: 13, fontWeight: 600 }}>+25</span>
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: "#1a1a1a" }} />

            {/* Reviews (same content model as full venue sheet) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <p style={{ fontFamily: F, color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 4px" }}>
                  Reviews
                </p>
                <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 13, margin: 0 }}>What do people say about this place</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <p style={{ fontFamily: F, color: "#fff", fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, margin: 0 }}>
                  {venue.rating}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <StarIcon key={n} size={14} color={n <= Math.round(Number.parseFloat(venue.rating)) ? "#fff" : "rgba(255,255,255,0.18)"} />
                    ))}
                  </div>
                  <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 12, margin: 0 }}>970 reviews</p>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {VIBE_TAB_REVIEW_CHIPS.map((chip) => {
                  const active = vibeReviewFilter === chip;
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVibeReviewFilter(chip);
                      }}
                      style={{
                        ...pillBase,
                        padding: "5px 14px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontFamily: F,
                        color: active ? "#1a1a1a" : "#fff",
                        fontSize: 12,
                        fontWeight: active ? 600 : 500,
                        letterSpacing: "-0.01em",
                        background: active ? "#fff" : "rgba(255,255,255,0.1)",
                        border: active ? "1px solid #fff" : "1px solid rgba(255,255,255,0.18)",
                      }}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
              <div
                style={{
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                  marginLeft: -20,
                  marginRight: -20,
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingBottom: 4,
                  scrollbarWidth: "none",
                } as React.CSSProperties}
              >
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", gap: 12 }}>
                  {VIBE_TAB_REVIEW_CARDS.map((card) => (
                    <div
                      key={card.id}
                      style={{
                        flexShrink: 0,
                        width: 230,
                        minHeight: 170,
                        border: "1px solid rgba(255,255,255,0.18)",
                        borderRadius: 8,
                        padding: "16px 14px 14px",
                        background: "transparent",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <StarIcon key={n} size={12} color={n <= card.stars ? "#fff" : "rgba(255,255,255,0.2)"} />
                        ))}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: F, color: "#fff", fontSize: 13, fontWeight: 600, margin: "0 0 6px", lineHeight: 1.2 }}>{card.title}</p>
                        <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 12, lineHeight: 1.5, margin: 0 }}>{card.text}</p>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <p style={{ fontFamily: F, color: "#fff", fontSize: 12, fontWeight: 500, margin: 0 }}>{card.author}</p>
                        <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 11, margin: 0 }}>{card.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    height: 36,
                    paddingLeft: 32,
                    paddingRight: 32,
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.8)",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontFamily: F, color: "#fff", fontSize: 13, fontWeight: 500 }}>See all reviews</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PEOPLE TAB content — uniform 20px horizontal padding ── */}
        {activeTab === "People" && (
          <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontFamily: F, color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
              Who's been here
            </p>
            <p style={{ fontFamily: F, color: "#B2B2B2", fontSize: 13, margin: 0 }}>
              6 people in your network visited recently
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {PEOPLE_POP_AVATARS.map((src, i) => (
                <div key={i} style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.15)" }}>
                  <img src={src} alt={`person-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: F, color: "#fff", fontSize: 12, fontWeight: 600 }}>+2</span>
              </div>
            </div>

            {/* Highlight carousel — paginated hero (matches venue sheet People tab) */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 152,
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={peopleCarouselIdx}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{ position: "absolute", inset: 0 }}
                >
                  <img
                    src={peopleHighlightImages[peopleCarouselIdx]}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: "saturate(1.1) brightness(0.88)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: PEOPLE_POP_INSET,
                      left: PEOPLE_POP_INSET,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      zIndex: 1,
                    }}
                  >
                    <div style={{ width: 26, height: 26, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.65)" }}>
                      <img src={PEOPLE_POP_AVATARS[peopleCarouselIdx]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <span style={{ fontFamily: F, color: "#fff", fontSize: 11, fontWeight: 600, textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>
                      {PEOPLE_POP_NAMES[peopleCarouselIdx]}
                    </span>
                  </div>
                  <p
                    style={{
                      position: "absolute",
                      left: PEOPLE_POP_INSET,
                      right: PEOPLE_POP_INSET,
                      bottom: PEOPLE_POP_INSET + 22,
                      fontFamily: F,
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      lineHeight: 1.35,
                      textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                      margin: 0,
                      zIndex: 1,
                    }}
                  >
                    {PEOPLE_POP_CAPTIONS[peopleCarouselIdx]}
                  </p>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: PEOPLE_POP_INSET,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      zIndex: 2,
                    }}
                  >
                    {peopleHighlightImages.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`View highlight ${i + 1}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPeopleCarouselIdx(i);
                        }}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: i === peopleCarouselIdx ? "#fff" : "rgba(255,255,255,0.35)",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Visit photos — smaller tiles, even spacing */}
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                paddingBottom: 2,
              } as React.CSSProperties}
            >
              {[venue.image, imgNavuProject, imgSiNonnas].map((src, i) => (
                <div
                  key={i}
                  style={{
                    flexShrink: 0,
                    width: 100,
                    height: 72,
                    borderRadius: 10,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <img src={src} alt={`visit-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
              <div
                style={{
                  flexShrink: 0,
                  width: 72,
                  height: 72,
                  borderRadius: 10,
                  background: "rgba(217,217,217,0.12)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontFamily: F, color: "#d9d9d9", fontSize: 12, fontWeight: 600 }}>+18</span>
              </div>
            </div>
            {/* Their words */}
            <div>
              <p style={{ fontFamily: F, color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 4px" }}>Their words</p>
              <p style={{ fontFamily: F, color: "#B2B2B2", fontSize: 13, margin: 0 }}>
                {PEOPLE_POP_SHORT[peopleCarouselIdx]}&rsquo;s take on this place
              </p>
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: 0 }} />
            <div
              style={{
                display: "flex",
                gap: 10,
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
              } as React.CSSProperties}
            >
              {[
                { title: "Genuinely unreal", text: "Came here with four friends and we didn't want to leave. The pasta alone is worth the trip.", author: "Sam", stars: 5 },
                { title: "Delicious food!", text: "Very delicious food, great vibes for me and my group. Would totally go back here, 10/10!", author: "Mia", stars: 5 },
              ].map((card, i) => (
                <div
                  key={i}
                  style={{
                    flexShrink: 0,
                    width: 220,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
                    {Array.from({ length: card.stars }).map((_, s) => (
                      <svg key={s} width={11} height={11} viewBox="0 0 24 24" fill="#fff"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    ))}
                  </div>
                  <p style={{ fontFamily: F, color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{card.title}</p>
                  <p style={{ fontFamily: F, color: "#B2B2B2", fontSize: 12, lineHeight: 1.55, marginBottom: 8 }}>{card.text}</p>
                  <p style={{ fontFamily: F, color: "#777", fontSize: 11 }}>{card.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTAs — Place tab only (hidden on Vibe / People) */}
        {activeTab === "Place" ? (
          <div style={{ display: "flex", gap: 10, padding: "0 19px 48px" }}>
            <button
              onClick={(e) => { e.stopPropagation(); onOpenDetail(venue); }}
              style={{ flex: 1, height: 38, borderRadius: 6, background: "transparent", border: "none", cursor: "pointer" }}
            >
              <span style={{ fontFamily: F, color: "#D9D9D9", fontSize: 14, fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 3 }}>
                Book a Table
              </span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onPlanYourDay(venue); }}
              style={{ flex: 1, height: 38, borderRadius: 6, background: "#D9D9D9", border: "none", cursor: "pointer" }}
            >
              <span style={{ fontFamily: F, color: "#000", fontSize: 14, fontWeight: 600 }}>
                Plan your day
              </span>
            </button>
          </div>
        ) : (
          <div style={{ paddingBottom: 48 }} aria-hidden />
        )}
      </div>
    </motion.div>
  );
}

// ─── Discover Screen ──────────────────────────────────────────────────────────
interface DiscoverScreenProps {
  onOpenDetail: (venue: VenueDetailInfo) => void;
  selectedVenueId: string | null;
  onVenueSelect: (venue: MapVenue) => void;
  onVenueDismiss: () => void;
}

export function DiscoverScreen({
  onOpenDetail,
  selectedVenueId,
  onVenueSelect,
  onVenueDismiss,
}: DiscoverScreenProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: "#080D14" }}
      onClick={onVenueDismiss}
    >
      {/* ── Live dark Leaflet map ── */}
      <DarkMap
        venues={MAP_VENUES}
        selectedId={selectedVenueId}
        onSelect={onVenueSelect}
        onDeselect={onVenueDismiss}
        centerLat={40.721}
        centerLng={-73.996}
        zoom={14}
      />

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-[600]" style={{ paddingTop: 54 }}>
        <div className="mx-4">
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{
              background: "rgba(10,10,15,0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <DiscoverIcon />
            <div className="flex-1">
              <p
                style={{
                  fontFamily: F,
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                }}
              >
                New York City
              </p>
              <p style={{ fontFamily: F, color: "#B2B2B2", fontSize: 11 }}>Explore nearby</p>
            </div>
            <button
              className="flex items-center justify-center"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#888",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <SearchIcon />
            </button>
            <button
              className="flex items-center justify-center"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#888",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <FilterIcon />
            </button>
          </div>

          {/* Filter chips */}
          <div className="mt-2.5 overflow-x-auto no-scrollbar">
            <div className="flex gap-2" style={{ width: "max-content" }}>
              {FILTER_CHIPS.map((chip) => {
                const active = activeFilter === chip;
                return (
                  <button
                    key={chip}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFilter(chip);
                    }}
                    style={{
                      ...pillBase,
                      padding: "4px 14px",
                      background: active ? "#fff" : "rgba(10,10,15,0.75)",
                      border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
                      backdropFilter: "blur(16px)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: F,
                        color: active ? "#080808" : "#888",
                        fontSize: 12,
                        fontWeight: active ? 700 : 400,
                      }}
                    >
                      {chip}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.leaflet-container{background:#0d1117}`}</style>
    </div>
  );
}
