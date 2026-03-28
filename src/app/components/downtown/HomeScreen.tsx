import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useScrollbarSmartReveal } from "../../hooks/useScrollbarSmartReveal";
import { GrainImage } from "./GrainImage";
import {
  F,
  IMG_AVATAR,
  IMG_BAR,
  IMG_BRUNCH,
  IMG_DESSERT,
  IMG_FRIENDS,
  IMG_PIZZA_REST,
  IMG_SUSHI,
  TRENDING_VENUES,
  pillBase,
} from "./data";

// ─── Mood chips ──────────────────────────────────────────────────────────────
const MOODS = [
  { icon: "💃", label: "Clubbing"  },
  { icon: "🥞", label: "Brunch"    },
  { icon: "🍟", label: "Snacks"    },
  { icon: "☕", label: "Coffee"    },
  { icon: "🍺", label: "Drinks"    },
  { icon: "🍽️", label: "Dinner"   },
  { icon: "🍔", label: "Fast Food" },
  { icon: "🍮", label: "Dessert"   },
];

const OFFERS = [
  { id: 1, name: "Si Nonna's",      offer: "40% off pizza",      image: IMG_PIZZA_REST, tag: "Limited",  rating: "4.7" },
  { id: 2, name: "Bar Boulud",      offer: "2-for-1 cocktails",  image: IMG_BAR,        tag: "Tonight",  rating: "4.6" },
  { id: 3, name: "Masa Sushi",      offer: "Free dessert",       image: IMG_SUSHI,      tag: "Expiring", rating: "5.0" },
  { id: 4, name: "Sweet Surrender", offer: "20% off all sweets", image: IMG_DESSERT,    tag: "Today",    rating: "4.4" },
];

const HAPPENING = [
  { id: 1, venue: "Dante NYC",     plan: "Friday vibes 🍹",  image: IMG_BAR,        avatars: [IMG_AVATAR, IMG_FRIENDS], attendees: "Mia + 3 others",  rating: "4.8" },
  { id: 2, venue: "Carbone",       plan: "Pasta night 🍝",   image: IMG_PIZZA_REST, avatars: [IMG_FRIENDS, IMG_AVATAR], attendees: "Jake + 5 others", rating: "4.9" },
  { id: 3, venue: "Masa Sushi",    plan: "Omakase exp.",     image: IMG_SUSHI,      avatars: [IMG_AVATAR],              attendees: "Priya + 2 others",rating: "5.0" },
  { id: 4, venue: "Sunday Brunch", plan: "Morning crew ☀️",  image: IMG_BRUNCH,      avatars: [IMG_FRIENDS, IMG_AVATAR], attendees: "Alex + 4 others", rating: "4.5" },
];

const STACK_ROTATIONS = [0, 3.5, -2.5];
const CARD_W = 308;

// ─── Icons ───────────────────────────────────────────────────────────────────
function BellIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MapPinIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function StarIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function XMarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
function BookmarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Polaroid card ───────────────────────────────────────────────────────────
function TrendingCard({
  venue, index, totalCount, onSwipe,
}: {
  venue: (typeof TRENDING_VENUES)[0];
  index: number;
  totalCount: number;
  onSwipe: (direction: "left" | "right") => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-16, 16]);
  const opacity = useTransform(x, [-280, -110, 0, 110, 280], [0, 1, 1, 1, 0]);

  const stackOffset = totalCount - 1 - index;
  if (stackOffset > 2) return null;

  const isTopCard = stackOffset === 0;
  const cardScale = isTopCard ? 1 : 1 - stackOffset * 0.04;
  const cardY = isTopCard ? 0 : stackOffset * 14;
  const cardRotate = isTopCard ? rotate : STACK_ROTATIONS[stackOffset];

  function handleDragEnd(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) {
    if (Math.abs(info.offset.x) > 75 || Math.abs(info.velocity.x) > 250) {
      const dir = info.offset.x > 0 || info.velocity.x > 0 ? "right" : "left";
      animate(x, dir === "right" ? 540 : -540, { type: "spring", stiffness: 280, damping: 28 });
      setTimeout(() => onSwipe(dir), 180);
    } else {
      animate(x, 0, { type: "spring", stiffness: 420, damping: 32 });
    }
  }

  return (
    <motion.div
      style={{
        position: "absolute",
        width: CARD_W,
        left: "50%",
        marginLeft: -CARD_W / 2,
        x: isTopCard ? x : 0,
        rotate: cardRotate,
        opacity: isTopCard ? opacity : 1,
        scale: cardScale,
        y: cardY,
        zIndex: totalCount - stackOffset,
        transformOrigin: "bottom center",
      }}
      drag={isTopCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={isTopCard ? "cursor-grab active:cursor-grabbing" : ""}
    >
      <div
        style={{
          background: "#F7F5F0",
          borderRadius: 4,
          padding: "8px 8px 0 8px",
          boxShadow: isTopCard
            ? "0 24px 72px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.45)"
            : "0 10px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div className="relative overflow-hidden" style={{ height: 236 }}>
          <GrainImage src={venue.image} alt={venue.name} />


          {/* Vibe */}
          <div className="absolute bottom-3 left-3" style={{ ...pillBase, padding: "4px 10px", background: "rgba(0,0,0,0.52)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <span style={{ fontFamily: F, color: "rgba(255,255,255,0.92)", fontSize: 10, fontWeight: 500 }}>{venue.vibe}</span>
          </div>

          {/* Counter */}
          <div className="absolute bottom-3 right-3" style={{ ...pillBase, padding: "4px 9px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ fontFamily: F, color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 600 }}>
              {String(venue.id).padStart(2, "0")} / 08
            </span>
          </div>
        </div>

        {/* Caption */}
        <div style={{ padding: "12px 8px 18px", textAlign: "center" }}>
          <p style={{ fontFamily: F, color: "#111", fontSize: 17, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
            {venue.name}
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            <span style={{ color: "#888" }}><StarIcon size={9} /></span>
            <span style={{ fontFamily: F, color: "#555", fontSize: 11, fontWeight: 600 }}>{venue.rating}</span>
            <span style={{ color: "#ccc", fontSize: 10 }}>·</span>
            <span style={{ color: "#aaa" }}><MapPinIcon size={9} /></span>
            <span style={{ fontFamily: F, color: "#777", fontSize: 10 }}>{venue.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface HomeScreenProps {
  activeTab: string;
  savedIds: Set<number>;
  dismissedIds: Set<number>;
  onSave: (id: number) => void;
  onDismiss: (id: number) => void;
}

// ─── HomeScreen ──────────────────────────────────────────────────────────────
export function HomeScreen({ savedIds, dismissedIds, onSave, onDismiss }: HomeScreenProps) {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);
  const [hasUpcoming] = useState(true);
  const onScrollSmart = useScrollbarSmartReveal();

  const visibleTrending = TRENDING_VENUES.filter(
    (v) => !dismissedIds.has(v.id) && !savedIds.has(v.id)
  );

  function handleSwipe(direction: "left" | "right", venueId: number) {
    if (direction === "right") {
      onSave(venueId);
      setSavedFeedback("Saved ✦");
      setTimeout(() => setSavedFeedback(null), 1400);
    } else {
      onDismiss(venueId);
    }
  }

  function handleActionBtn(direction: "left" | "right") {
    if (!visibleTrending.length) return;
    handleSwipe(direction, visibleTrending[visibleTrending.length - 1].id);
  }

  const SMALL_W = 152;
  const SMALL_H = 205;

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{ width: "100%", height: "100%", background: "#080808", fontFamily: F }}
    >
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-smart"
        style={{ paddingBottom: 88 }}
        onScroll={onScrollSmart}
      >

        {/* ── Header ── */}
        <div className="px-5 pt-12 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden" style={{ border: "1.5px solid rgba(255,255,255,0.15)" }}>
              <GrainImage src={IMG_AVATAR} alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <p style={{ fontFamily: F, color: "#fff", fontSize: 18, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                Hey Peter! 👋
              </p>
              <div className="flex items-center gap-1 mt-0.5" style={{ color: "#555" }}>
                <MapPinIcon size={10} />
                <span style={{ fontFamily: F, fontSize: 11 }}>New York City</span>
              </div>
            </div>
          </div>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center relative"
            style={{ background: "#1A1A1A", color: "#888" }}
          >
            <BellIcon />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "#fff", border: "1px solid #080808" }} />
          </button>
        </div>

        {/* ── Upcoming Banner ── */}
        {hasUpcoming && (
          <div className="mx-5 mb-5">
            <div
              className="rounded-2xl px-4 py-3.5 flex items-center justify-between"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(12px)" }}
            >
              <div>
                <span style={{ fontFamily: F, color: "#A3FF1A66", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Upcoming
                </span>
                <p style={{ fontFamily: F, color: "#fff", fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 2 }}>
                  Pizza Mania 🍕
                </p>
                <p style={{ fontFamily: F, color: "#B2B2B2", fontSize: 11, marginTop: 3 }}>
                  Si Nonna's Pizzeria · 9:00 PM
                </p>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  padding: "4px 14px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontFamily: F, color: "#fff", fontSize: 13, fontWeight: 600 }}>Today</p>
                <p style={{ fontFamily: F, color: "#B2B2B2", fontSize: 11 }}>26 Mar</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Trending header ── */}
        <div className="px-5 mb-3">
          <h2 style={{ fontFamily: F, color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
            What's Trending
          </h2>
          <p style={{ fontFamily: F, color: "#B2B2B2", fontSize: 11, marginTop: 3 }}>Downtown New York</p>
        </div>

        {/* ── Polaroid Deck ── */}
        <div className="relative mx-5" style={{ height: 352 }}>
          {visibleTrending.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p style={{ fontFamily: F, color: "#fff", fontSize: 18, fontWeight: 700 }}>You've seen it all</p>
              <p style={{ fontFamily: F, color: "#444", fontSize: 12, marginTop: 4 }}>Check back soon for more</p>
            </div>
          ) : (
            visibleTrending.map((venue, i) => (
              <TrendingCard
                key={venue.id}
                venue={venue}
                index={i}
                totalCount={visibleTrending.length}
                onSwipe={(dir) => handleSwipe(dir, venue.id)}
              />
            ))
          )}

          {/* Save toast */}
          {savedFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-2 left-1/2 -translate-x-1/2 z-50"
              style={{ ...pillBase, padding: "4px 16px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              <span style={{ fontFamily: F, color: "#fff", fontSize: 12, fontWeight: 600 }}>{savedFeedback}</span>
            </motion.div>
          )}
        </div>

        {/* Action buttons */}
        {visibleTrending.length > 0 && (
          <div className="flex items-center justify-center gap-8 mt-4 mb-6">
            <button
              onClick={() => handleActionBtn("left")}
              className="flex items-center justify-center transition-transform active:scale-90"
              style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.45)" }}
            >
              <XMarkIcon />
            </button>
            <span style={{ fontFamily: F, color: "#B2B2B2", fontSize: 10, letterSpacing: "0.1em" }}>← swipe →</span>
            <button
              onClick={() => handleActionBtn("right")}
              className="flex items-center justify-center transition-transform active:scale-90"
              style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.45)" }}
            >
              <BookmarkIcon />
            </button>
          </div>
        )}

        <div className="mx-5 mb-6" style={{ height: 1, background: "#181818" }} />

        {/* ── Mood ── */}
        <div className="mb-6">
          <div className="px-5" style={{ marginBottom: 8 }}>
            <h2 style={{ fontFamily: F, color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
              What's the Mood?
            </h2>
          </div>
          {/* paddingTop: 8 prevents overflow-x-auto from clipping scaled tiles at the top;
              together with the 8px heading margin-bottom it totals the intended 16px gap */}
          <div className="px-5 overflow-x-auto no-scrollbar" style={{ paddingTop: 8, paddingBottom: 2 }}>
            <div className="flex gap-3" style={{ width: "max-content" }}>
              {MOODS.map((mood) => {
                const isActive = activeMood === mood.label;
                return (
                  <button
                    key={mood.label}
                    onClick={() => setActiveMood(isActive ? null : mood.label)}
                    className="flex flex-col items-center gap-2 transition-transform active:scale-95"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-[24px] transition-all"
                      style={{
                        background: isActive ? "#fff" : "#141414",
                        border: isActive ? "none" : "1px solid #202020",
                        boxShadow: isActive ? "0 4px 20px rgba(255,255,255,0.1)" : "none",
                        transform: isActive ? "scale(1.07)" : "scale(1)",
                      }}
                    >
                      {mood.icon}
                    </div>
                    <span style={{ fontFamily: F, fontSize: 10, fontWeight: 500, color: isActive ? "#fff" : "#444", whiteSpace: "nowrap" }}>
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-5 mb-6" style={{ height: 1, background: "#181818" }} />

        {/* ── Offers Today ── */}
        <div className="mb-6">
          <div className="px-5 mb-4 flex items-center justify-between">
            <h2 style={{ fontFamily: F, color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Offers Today</h2>
            <button style={{ fontFamily: F, color: "#B2B2B2", fontSize: 11 }}>See all</button>
          </div>
          <div className="pl-5 overflow-x-auto no-scrollbar">
            <div className="flex gap-3 pr-5" style={{ width: "max-content" }}>
              {OFFERS.map((offer) => (
                <div key={offer.id} className="relative rounded-[20px] overflow-hidden flex-shrink-0" style={{ width: SMALL_W, height: SMALL_H }}>
                  <GrainImage src={offer.image} alt={offer.name} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.22) 52%, transparent 100%)" }} />

                  {/* Tag */}
                  <div className="absolute top-3 left-3" style={{ ...pillBase, padding: "4px 8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                    <span style={{ fontFamily: F, color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em" }}>{offer.tag.toUpperCase()}</span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 flex items-center gap-1" style={{ ...pillBase, padding: "4px 7px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span style={{ color: "#fff", display: "flex" }}><StarIcon size={8} /></span>
                    <span style={{ fontFamily: F, color: "#fff", fontSize: 10, fontWeight: 600 }}>{offer.rating}</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p style={{ fontFamily: F, color: "#fff", fontSize: 13, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" }}>{offer.name}</p>
                    <p style={{ fontFamily: F, color: "#B2B2B2", fontSize: 10, marginTop: 2 }}>{offer.offer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-5 mb-6" style={{ height: 1, background: "#181818" }} />

        {/* ── What's Happening ── */}
        <div className="mb-4">
          <div className="px-5 mb-4 flex items-center justify-between">
            <h2 style={{ fontFamily: F, color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>What's Happening</h2>
            <button style={{ fontFamily: F, color: "#B2B2B2", fontSize: 11 }}>See all</button>
          </div>
          <div className="pl-5 overflow-x-auto no-scrollbar">
            <div className="flex gap-3 pr-5" style={{ width: "max-content" }}>
              {HAPPENING.map((item) => (
                <div key={item.id} className="relative rounded-[20px] overflow-hidden flex-shrink-0" style={{ width: SMALL_W, height: SMALL_H }}>
                  <GrainImage src={item.image} alt={item.venue} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.22) 52%, transparent 100%)" }} />

                  {/* Avatars */}
                  <div className="absolute top-3 left-3 flex -space-x-1.5">
                    {item.avatars.slice(0, 2).map((av, idx) => (
                      <div key={idx} className="w-6 h-6 rounded-full overflow-hidden" style={{ border: "1.5px solid rgba(255,255,255,0.25)" }}>
                        <GrainImage src={av} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 flex items-center gap-1" style={{ ...pillBase, padding: "4px 7px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span style={{ color: "#fff", display: "flex" }}><StarIcon size={8} /></span>
                    <span style={{ fontFamily: F, color: "#fff", fontSize: 10, fontWeight: 600 }}>{item.rating}</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p style={{ fontFamily: F, color: "#fff", fontSize: 13, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" }}>{item.venue}</p>
                    <p style={{ fontFamily: F, color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 2 }}>{item.attendees}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
