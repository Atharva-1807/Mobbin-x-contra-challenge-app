import { useState, useRef } from "react";
import { useScrollbarSmartReveal } from "../../hooks/useScrollbarSmartReveal";
import { motion, AnimatePresence } from "motion/react";
import { GrainImage } from "./GrainImage";
import { F, getVibeTagsForVenue, pillBase } from "./data";
import svgPaths from "../../../imports/svg-zu819l41gl";
import { CreatePlanSheet } from "./CreatePlanSheet";
import { VenueMiniMap } from "./VenueMiniMap";

// ─── Figma assets (same pipeline as hero — reliable in dev & Make) ────────────
import imgMapThumb  from "figma:asset/834e7da8c2b24af015640421f875dbe3e3331d07.png";
import imgVibeLarge from "figma:asset/48dc5e99c457d738d9b7b0d504c71e12c7da5d65.png";
import imgGallery1  from "figma:asset/6045c995cd3280cec00560453883580c1877efe1.png";
import imgGallery2  from "figma:asset/a0fccfce72939b41f7b57a72dba1bcde0e37ce35.png";
import imgGallery3  from "figma:asset/ad6ae33579b48bf4fc8c0aaa5ed952ec3d4845b7.png";
import imgCarousel3 from "figma:asset/64eb272aa271690d78b629a8b60b1847001dc1ee.png";
import imgCarousel4 from "figma:asset/a3d6af3571b34fbe54764ba53e6c288ae878524c.png";

import imgPerson1 from "figma:asset/8cf45a2064d96d25290262da5de28f0caaa3eea3.png";
import imgPerson2 from "figma:asset/d89abab674e43b78f892860d685785568e387c1d.png";
import imgPerson3 from "figma:asset/c4706169bba86808e21939da2e8a81d339ae0404.png";
import imgPerson4 from "figma:asset/41115b2ee9772d98407f866a59381e68b501d5bb.png";

const PEOPLE_LIST = [
  { id: 1, name: "Sam",   carouselName: "Sam Rivera",  avatar: imgPerson1 },
  { id: 2, name: "Mia",   carouselName: "Mia Sanders", avatar: imgPerson2 },
  { id: 3, name: "Tom",   carouselName: "Tom Lin",     avatar: imgPerson3 },
  { id: 4, name: "Priya", carouselName: "Priya Shah",  avatar: imgPerson4 },
];

const VIBE_GALLERY = [imgGallery1, imgGallery2, imgGallery3];

// Highlight carousel — four distinct venue / dining shots
const IMG_CAROUSEL = [imgVibeLarge, imgGallery1, imgCarousel3, imgCarousel4];

// ─── Per-person words data ────────────────────────────────────────────────────
const PEOPLE_WORDS: Record<number, { caption: string; cards: (typeof REVIEW_CARDS) }> = {
  1: {
    caption: "A night to remember",
    cards: [
      { id: 1, title: "Genuinely unreal", text: "Came here with four friends and we didn't want to leave. The pasta alone is worth the trip across town.", author: "Sam", date: "Jan 2026", stars: 5 },
      { id: 2, title: "Go immediately", text: "The wood-fired arancini is the best thing I've eaten this year. Book ahead — it fills up fast.", author: "Sam", date: "Nov 2025", stars: 5 },
    ],
  },
  2: {
    caption: "Great vibes, great food",
    cards: [
      { id: 1, title: "Delicious food!", text: "Very delicious food, great vibes for me and my group. Would totally go back here, 10/10!", author: "Mia", date: "Jan 2026", stars: 5 },
      { id: 2, title: "Love this place", text: "The vibe here on a Friday is unmatched. Every table around you is having the time of their life.", author: "Mia", date: "Dec 2025", stars: 5 },
    ],
  },
  3: {
    caption: "Worth every bite",
    cards: [
      { id: 1, title: "Exceptional hosting", text: "Staff remembered our names by the end of the night. The tiramisu is something else entirely.", author: "Tom", date: "Dec 2025", stars: 5 },
      { id: 2, title: "My new favourite", text: "I've been back four times since my first visit. The truffle pappardelle is non-negotiable.", author: "Tom", date: "Oct 2025", stars: 4 },
    ],
  },
  4: {
    caption: "Every visit feels special",
    cards: [
      { id: 1, title: "Perfect date spot", text: "Intimate lighting, great wine list, and food that makes the conversation flow naturally.", author: "Priya", date: "Feb 2026", stars: 5 },
      { id: 2, title: "Highly recommend", text: "Never had a bad meal here. The seasonal menu keeps things interesting every visit.", author: "Priya", date: "Jan 2026", stars: 5 },
    ],
  },
};

const REVIEW_CARDS = [
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

// ─── Type ─────────────────────────────────────────────────────────────────────
export interface VenueDetailInfo {
  name: string;
  rating: string;
  vibe: string;
  location: string;
  address: string;
  description: string;
  image: string;
  /** Extra Vibe-tab paragraph (mockup body copy) */
  vibeStory?: string;
}

// ─── Icons ───────────────────────────────────────────────────────────────────
function StarFill({ size = 12, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/** Heart — uniform 17×17 within 36×36 circle */
function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={filled ? "#fff" : "none"}>
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M12 21.593c-.329-.208-6.918-4.518-8.779-7.032C1.838 12.716 1.5 10.92 1.5 9.5 1.5 6.462 3.962 4 7 4a5.5 5.5 0 0 1 5 3.197A5.5 5.5 0 0 1 17 4c3.038 0 5.5 2.462 5.5 5.5 0 1.42-.338 3.216-1.721 5.061C18.918 17.075 12.329 21.385 12 21.593z"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth={filled ? "0" : "1.6"}
        fill={filled ? "#fff" : "none"}
      />
    </svg>
  );
}

/** Share — uniform 17×17 within 36×36 circle */
function ShareIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5"  r="3" stroke="rgba(255,255,255,0.85)" strokeWidth="1.7" />
      <circle cx="6"  cy="12" r="3" stroke="rgba(255,255,255,0.85)" strokeWidth="1.7" />
      <circle cx="18" cy="19" r="3" stroke="rgba(255,255,255,0.85)" strokeWidth="1.7" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="rgba(255,255,255,0.85)" strokeWidth="1.7" />
      <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49" stroke="rgba(255,255,255,0.85)" strokeWidth="1.7" />
    </svg>
  );
}

/** Bookmark — uniform 16×16 within 36×36 circle */
function BookmarkHeroIcon({ saved = false }: { saved?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "#fff" : "none"}>
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M18 6 6 18M6 6l12 12" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ChevronRight({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Tab icons from figma SVG ─────────────────────────────────────────────────
function PlaceTabIcon({ active }: { active: boolean }) {
  return (
    <svg width="12" height="17" viewBox="0 0 12 17.1431" fill={active ? "#fff" : "#777"}>
      <path d={svgPaths.p38f16480} />
      <path d={svgPaths.p13e32c00} />
    </svg>
  );
}

function VibeTabIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 19.0026 19.0026" fill={active ? "#fff" : "#777"} stroke={active ? "#fff" : "#777"} strokeWidth="0.003">
      <path d={svgPaths.p3e39a100} />
    </svg>
  );
}

function PeopleTabIcon({ active }: { active: boolean }) {
  return (
    <svg width="25" height="18" viewBox="0 0 27.125 20" fill={active ? "#fff" : "#777"} stroke={active ? "#fff" : "#777"} strokeWidth="0.4">
      <path d={svgPaths.pc2db700} />
    </svg>
  );
}

// ─── Star row ─────────────────────────────────────────────────────────────────
function StarRow({ rating, size = 12, color = "#fff" }: { rating: number; size?: number; color?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarFill key={n} size={size} color={n <= Math.round(rating) ? color : "rgba(255,255,255,0.18)"} />
      ))}
    </div>
  );
}

// ─── Horizontal Review Card (Figma style) ─────────────────────────────────────
function ReviewCard({ card }: { card: (typeof REVIEW_CARDS)[0] }) {
  return (
    <div
      className="shrink-0 flex flex-col justify-between"
      style={{
        width: 230,
        minHeight: 170,
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 8,
        padding: "16px 14px 14px",
        background: "transparent",
      }}
    >
      {/* Stars at top */}
      <div className="flex gap-0.5 mb-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <StarFill key={n} size={12} color={n <= card.stars ? "#fff" : "rgba(255,255,255,0.2)"} />
        ))}
      </div>

      <div className="flex-1">
        <p style={{ fontFamily: F, color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 6, lineHeight: 1.2 }}>
          {card.title}
        </p>
        <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 12, lineHeight: 1.5 }}>
          {card.text}
        </p>
      </div>

      <div className="mt-3">
        <p style={{ fontFamily: F, color: "#fff", fontSize: 12, fontWeight: 500 }}>{card.author}</p>
        <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 11 }}>{card.date}</p>
      </div>
    </div>
  );
}

// ─── Date / Time / group data ─────────────────────────────────────────────────
const DATES = [
  { label: "Today",    sub: "26 Mar" },
  { label: "Tomorrow", sub: "27 Mar" },
  { label: "Fri",      sub: "28 Mar" },
  { label: "Sat",      sub: "29 Mar" },
];

const TIMES = [
  { label: "7:00 PM",  note: "2 offers" },
  { label: "8:00 PM",  note: "2 offers" },
  { label: "9:00 PM",  note: "2 offers" },
  { label: "10:00 PM", note: "Full"     },
];

// ─── Venue lat/lng lookup ──────────────────────────────────────────────────────
const VENUE_COORDS: Record<string, { lat: number; lng: number }> = {
  "West Village":     { lat: 40.7303, lng: -74.0023 },
  "Nolita":           { lat: 40.7225, lng: -73.9945 },
  "Lower East Side":  { lat: 40.7160, lng: -73.9868 },
  "SoHo":             { lat: 40.7245, lng: -73.9994 },
  "Midtown":          { lat: 40.7549, lng: -73.9840 },
};

function getVenueCoords(location: string) {
  return VENUE_COORDS[location] ?? { lat: 40.7280, lng: -73.9970 };
}

// ─── Place Tab ────────────────────────────────────────────────────────────────
function PlaceTab({ venue, onPlanYourDay }: { venue: VenueDetailInfo; onPlanYourDay: () => void }) {
  const [groupSize, setGroupSize]       = useState(2);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);
  const [booked, setBooked]             = useState(false);

  const coords = getVenueCoords(venue.location);

  return (
    <div className="px-5 pt-5 pb-8 flex flex-col gap-5">
      {/* Address */}
      <div className="flex items-start gap-2" style={{ color: "rgba(255,255,255,0.45)" }}>
        <div className="mt-0.5 shrink-0"><PinIcon size={12} /></div>
        <p style={{ fontFamily: F, fontSize: 12, lineHeight: 1.55 }}>{venue.address}</p>
      </div>

      {/* Live dark mini map */}
      <VenueMiniMap
        lat={coords.lat}
        lng={coords.lng}
        label={venue.name}
        style={{ height: 110, borderRadius: 16, overflow: "hidden" }}
      />

      <div style={{ height: 1, background: "#1E1E1E" }} />

      <h3 style={{ fontFamily: F, color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: -4 }}>
        Grab a Table
      </h3>

      {/* Group size */}
      <div className="flex items-center justify-between">
        <span style={{ fontFamily: F, color: "#B2B2B2", fontSize: 13 }}>Select your group</span>
        <div className="flex items-center gap-3" style={{ border: "1px solid #2A2A2A", borderRadius: 8, padding: "6px 14px", background: "rgba(255,255,255,0.04)" }}>
          <button
            onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 4, background: groupSize > 1 ? "rgba(255,255,255,0.1)" : "transparent", border: "none", cursor: groupSize > 1 ? "pointer" : "default" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke={groupSize > 1 ? "#fff" : "#444"} strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
          <span style={{ fontFamily: F, color: "#fff", fontSize: 15, fontWeight: 600, minWidth: 18, textAlign: "center" }}>{groupSize}</span>
          <button
            onClick={() => setGroupSize(Math.min(20, groupSize + 1))}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 4, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Date selector */}
      <div>
        <p style={{ fontFamily: F, color: "#B2B2B2", fontSize: 12, marginBottom: 10 }}>Select date</p>
        <div className="grid grid-cols-4 gap-2">
          {DATES.map((d, i) => {
            const sel = selectedDate === i;
            return (
              <button key={i} onClick={() => setSelectedDate(i)} className="flex flex-col items-center gap-1 py-3 rounded-xl transition-all" style={{ background: sel ? "#fff" : "transparent", border: sel ? "none" : "1px solid #272727" }}>
                <span style={{ fontFamily: F, color: sel ? "#080808" : "#ccc", fontSize: 12, fontWeight: 600 }}>{d.label}</span>
                <span style={{ fontFamily: F, color: sel ? "#555" : "#444", fontSize: 10 }}>{d.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div>
        <p style={{ fontFamily: F, color: "#B2B2B2", fontSize: 12, marginBottom: 10 }}>Select time</p>
        <div className="grid grid-cols-4 gap-2">
          {TIMES.map((t, i) => {
            const sel = selectedTime === i;
            const full = t.note === "Full";
            return (
              <button
                key={i}
                onClick={() => !full && setSelectedTime(i)}
                className="flex flex-col items-center gap-1 py-3 transition-all"
                style={{
                  borderRadius: full ? 5 : 12,
                  background: full ? "#292929" : (sel ? "#fff" : "transparent"),
                  border: full ? "1px solid #444" : (sel ? "none" : "1px solid #272727"),
                  cursor: full ? "not-allowed" : "pointer",
                }}
              >
                <span style={{ fontFamily: F, color: full ? "#444444" : (sel ? "#080808" : "#ccc"), fontSize: 11, fontWeight: 600 }}>{t.label}</span>
                <span style={{ fontFamily: F, color: full ? "#777777" : (sel ? "#555" : "#444"), fontSize: 9 }}>{t.note}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTAs — Plan Your Day PRIMARY */}
      <div className="flex gap-3 pt-1">
        <button
          className="flex-1 flex items-center justify-center transition-all active:scale-95"
          style={{ height: 46, borderRadius: 12, background: "#fff" }}
          onClick={() => onPlanYourDay()}
        >
          <span style={{ fontFamily: F, color: "#080808", fontSize: 13, fontWeight: 700 }}>Plan Your Day</span>
        </button>
        <button
          onClick={() => setBooked((b) => !b)}
          className="flex-1 flex items-center justify-center transition-all active:scale-95"
          style={{ height: 46, borderRadius: 12, background: booked ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.06)", border: "1px solid #2A2A2A" }}
        >
          <span style={{ fontFamily: F, color: booked ? "#888" : "#fff", fontSize: 13, fontWeight: 600 }}>{booked ? "Booked ✓" : "Book a Table"}</span>
        </button>
      </div>
    </div>
  );
}

const FILTER_CHIPS = ["Featured", "1 Star", "2 Star"];

/** Homepage offer-card pill look (filled outline, light bg) */
function homePillInactive(): React.CSSProperties {
  return {
    ...pillBase,
    padding: "5px 14px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.18)",
  };
}

function homePillActive(): React.CSSProperties {
  return {
    ...pillBase,
    padding: "5px 14px",
    background: "#fff",
    border: "1px solid #fff",
  };
}

function VibeTab({ venue }: { venue: VenueDetailInfo }) {
  const [activeFilter, setActiveFilter] = useState("Featured");

  const tags = getVibeTagsForVenue(venue.vibe);

  return (
    <div className="pt-5 pb-8 flex flex-col gap-6">
      {/* ── Place: tags + story (no address / location) ── */}
      <div className="flex flex-col gap-6">
        <div className="px-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                ...homePillInactive(),
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <span style={{ fontFamily: F, color: "#fff", fontSize: 12, fontWeight: 500 }}>{tag}</span>
            </span>
          ))}
        </div>

        <div className="px-5">
          <p style={{ fontFamily: F, color: "#fff", fontSize: 14, lineHeight: 1.68, margin: 0 }}>
            {venue.description}
            {venue.vibeStory ? ` ${venue.vibeStory}` : ""}
          </p>
        </div>
      </div>

      {/* ── Gallery ── */}
      <div className="flex flex-col gap-6">
        <div className="mx-5 relative overflow-hidden" style={{ height: 236, borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
          <img
            src={imgVibeLarge}
            alt="ambiance"
            className="w-full h-full object-cover"
            style={{ filter: "saturate(1.15) brightness(0.92)" }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 55%)" }} />
        </div>

        <div className="px-5 grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {VIBE_GALLERY.map((src, i) => (
            <div key={i} className="overflow-hidden" style={{ height: 68, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover"
                style={{ filter: "saturate(1.12) brightness(0.94)" }}
              />
            </div>
          ))}
          <div
            className="flex items-center justify-center"
            style={{
              height: 68,
              borderRadius: 10,
              background: "rgba(45,45,45,0.95)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <span style={{ fontFamily: F, color: "#fff", fontSize: 13, fontWeight: 600 }}>+25</span>
          </div>
        </div>
      </div>

      <div className="mx-5" style={{ height: 1, background: "#1E1E1E" }} />

      {/* ── Reviews ── */}
      <div className="flex flex-col gap-6">
      <div className="px-5">
        <p style={{ fontFamily: F, color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 2 }}>
          Reviews
        </p>
        <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 13 }}>
          What do people say about this place
        </p>
      </div>

      {/* Rating block */}
      <div className="px-5 flex items-center gap-4">
        <p style={{ fontFamily: F, color: "#fff", fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
          {venue.rating}
        </p>
        <div className="flex flex-col gap-1.5">
          <StarRow rating={parseFloat(venue.rating)} size={14} />
          <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 12 }}>970 reviews</p>
        </div>
      </div>

      {/* Filter pills — same system as homepage / offer tags */}
      <div className="px-5 flex flex-wrap gap-2">
        {FILTER_CHIPS.map((chip) => {
          const active = activeFilter === chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveFilter(chip)}
              style={{
                ...(active ? homePillActive() : homePillInactive()),
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
              }}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Horizontal review cards — touch-scrollable */}
      <div
        style={{
          overflowX: "auto",
          overflowY: "visible",
          WebkitOverflowScrolling: "touch",
          paddingLeft: 20,
          paddingBottom: 4,
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        } as React.CSSProperties}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            gap: 12,
            paddingRight: 20,
          }}
        >
          {REVIEW_CARDS.map((card) => (
            <ReviewCard key={card.id} card={card} />
          ))}
        </div>
      </div>

      {/* See all reviews button */}
      <div className="flex justify-center">
        <button
          className="flex items-center justify-center active:opacity-70 transition-opacity"
          style={{
            height: 36,
            paddingLeft: 32,
            paddingRight: 32,
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.8)",
          }}
        >
          <span style={{ fontFamily: F, color: "#fff", fontSize: 13, fontWeight: 500 }}>See all reviews</span>
        </button>
      </div>
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}

// ─── People Tab ───────────────────────────────────────────────────────────────
const PEOPLE_INSET = 12;

function PeopleTab() {
  const [carouselIdx, setCarouselIdx] = useState(0);

  return (
    <div className="pt-5 pb-8 flex flex-col gap-5 px-5">

      {/* Label */}
      <div>
        <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 14 }}>
          People who have been here
        </p>
      </div>

      {/* Avatar row — 4 profiles (no select) + "+2" circle */}
      <div className="flex gap-4">
        {PEOPLE_LIST.map((p) => (
          <div key={p.id} className="flex flex-col items-center gap-1.5 shrink-0">
            <div style={{ width: 45, height: 45, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
              <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <span style={{ fontFamily: F, color: "#b3b3b3", fontSize: 12 }}>{p.name}</span>
          </div>
        ))}
        {/* +2 overflow circle */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: F, color: "#fff", fontSize: 13, fontWeight: 600 }}>+2</span>
          </div>
          <span style={{ fontFamily: F, color: "#b3b3b3", fontSize: 12 }}> </span>
        </div>
      </div>

      {/* ── Highlight carousel — shorter card, uniform 12px inner inset for overlays ── */}
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 152 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={carouselIdx}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0"
          >
            <img
              src={IMG_CAROUSEL[carouselIdx]}
              alt={`Highlight ${carouselIdx + 1}`}
              className="w-full h-full object-cover"
              style={{ filter: "saturate(1.1) brightness(0.88)" }}
            />
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }}
            />
            {/* Person badge — top left */}
            <div
              className="absolute flex items-center gap-2 z-[1]"
              style={{ top: PEOPLE_INSET, left: PEOPLE_INSET }}
            >
              <div style={{ width: 26, height: 26, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.65)" }}>
                <img src={PEOPLE_LIST[carouselIdx]?.avatar ?? PEOPLE_LIST[0].avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <span style={{ fontFamily: F, color: "#fff", fontSize: 11, fontWeight: 600, textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>
                {PEOPLE_LIST[carouselIdx]?.carouselName ?? PEOPLE_LIST[0].carouselName}
              </span>
            </div>
            {/* Caption */}
            <p
              className="absolute z-[1]"
              style={{
                left: PEOPLE_INSET,
                right: PEOPLE_INSET,
                bottom: PEOPLE_INSET + 22,
                fontFamily: F,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                lineHeight: 1.35,
                textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                margin: 0,
              }}
            >
              {PEOPLE_WORDS[carouselIdx + 1]?.caption}
            </p>
            {/* Pagination dots */}
            <div
              className="absolute left-0 right-0 flex items-center justify-center gap-1.5 z-[2]"
              style={{ bottom: PEOPLE_INSET }}
            >
              {IMG_CAROUSEL.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`View photo ${i + 1}`}
                  onClick={() => setCarouselIdx(i)}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: i === carouselIdx ? "#fff" : "rgba(255,255,255,0.35)",
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

      {/* Their words heading */}
      <div>
        <p style={{ fontFamily: F, color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 2 }}>
          Their words
        </p>
        <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 13 }}>
          {PEOPLE_LIST[carouselIdx]?.name}'s take on this place
        </p>
      </div>

      <div style={{ height: 1, background: "#b3b3b3", opacity: 0.2 }} />

      {/* Review cards — reflect current carousel person */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`words-${carouselIdx}`}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="no-scrollbar"
          style={{
            overflowX: "auto",
            overflowY: "visible",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 4,
            marginLeft: 0,
            marginRight: 0,
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          } as React.CSSProperties}
        >
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", gap: 12, paddingRight: 0 }}>
            {(PEOPLE_WORDS[carouselIdx + 1]?.cards ?? []).map((card) => (
              <ReviewCard key={card.id} card={card} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}

// ─── Venue Detail Sheet ───────────────────────────────────────────────────────
type DetailTab = "place" | "vibe" | "people";

interface VenueDetailSheetProps {
  venue: VenueDetailInfo;
  onClose: () => void;
  onConfirmPlan?: () => void;
}

export function VenueDetailSheet({ venue, onClose, onConfirmPlan }: VenueDetailSheetProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("place");
  const [liked, setLiked]         = useState(false);
  const [saved, setSaved]         = useState(false);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const onScrollSmart = useScrollbarSmartReveal();

  const tabs: { id: DetailTab; label: string; Icon: React.FC<{ active: boolean }> }[] = [
    { id: "place",  label: "Place",  Icon: PlaceTabIcon  },
    { id: "vibe",   label: "Vibe",   Icon: VibeTabIcon   },
    { id: "people", label: "People", Icon: PeopleTabIcon },
  ];

  function switchTab(id: DetailTab) {
    setActiveTab(id);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <motion.div
      className="absolute inset-0 z-[700]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />

      {/* Sheet */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 flex flex-col"
        style={{
          background: "#0C0C0C",
          borderRadius: "20px 20px 0 0",
          maxHeight: "94%",
          overflow: "hidden",
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Drag handle ── */}
        <div className="flex justify-center pt-3 pb-0 shrink-0">
          <div style={{ width: 40, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* ── Hero image ── */}
        <div className="relative shrink-0" style={{ height: 256 }}>
          <GrainImage src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(12,12,12,1) 0%, rgba(0,0,0,0.3) 45%, transparent 80%)" }}
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.52)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <CloseIcon />
          </button>

          {/* Action icons — uniform 36×36 circles */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* Heart */}
            <button
              onClick={() => setLiked((l) => !l)}
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.52)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <HeartIcon filled={liked} />
            </button>

            {/* Share */}
            <button
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.52)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <ShareIcon />
            </button>

            {/* Bookmark */}
            <button
              onClick={() => setSaved((s) => !s)}
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.52)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <BookmarkHeroIcon saved={saved} />
            </button>
          </div>

          {/* Venue name + rating */}
          <div className="absolute bottom-4 left-5 right-5">
            <p style={{ fontFamily: F, color: "#fff", fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              {venue.name}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span style={{ fontFamily: F, color: "rgba(255,255,255,0.9)", fontSize: 16, fontWeight: 600 }}>
                {venue.rating}/5
              </span>
              <span style={{ color: "#333", fontSize: 11 }}>·</span>
              <span style={{ fontFamily: F, color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{venue.vibe}</span>
            </div>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex items-center shrink-0" style={{ borderBottom: "1px solid #1E1E1E" }}>
          {tabs.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => switchTab(id)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 relative"
              >
                <Icon active={active} />
                <span style={{ fontFamily: F, color: active ? "#fff" : "#777", fontSize: 14, fontWeight: active ? 600 : 400 }}>
                  {label}
                </span>
                {active && (
                  <motion.div
                    layoutId="tab-ul"
                    className="absolute bottom-0 left-5 right-5"
                    style={{ height: 1, background: "#fff", borderRadius: 1 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Tab content ── */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto scrollbar-smart"
          style={{ WebkitOverflowScrolling: "touch" }}
          onScroll={onScrollSmart}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "place"  && <PlaceTab  venue={venue} onPlanYourDay={() => setShowCreatePlan(true)} />}
              {activeTab === "vibe"   && <VibeTab   venue={venue} />}
              {activeTab === "people" && <PeopleTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {showCreatePlan && (
          <CreatePlanSheet
            venueName={venue.name}
            venueImage={venue.image}
            onClose={() => setShowCreatePlan(false)}
            onConfirm={onConfirmPlan}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}