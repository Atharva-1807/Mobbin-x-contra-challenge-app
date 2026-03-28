import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useScrollbarSmartReveal } from "../../hooks/useScrollbarSmartReveal";
import { GrainImage } from "./GrainImage";
import { F, IMG_AVATAR, IMG_FRIENDS, pillBase, type Venue } from "./data";
import type { VenueDetailInfo } from "./VenueDetailSheet";

// ─── Icons ───────────────────────────────────────────────────────────────────
function StarIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookmarkFillIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(255,255,255,0.07)">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Fake avatar strip for social proof
const DEMO_AVATARS = [IMG_AVATAR, IMG_FRIENDS, IMG_AVATAR];

// ─── Single Saved Card ───────────────────────────────────────────────────────
function SavedCard({
  venue,
  onUnsave,
  onOpenDetail,
}: {
  venue: Venue;
  onUnsave: (id: number) => void;
  onOpenDetail: (v: VenueDetailInfo) => void;
}) {
  const [booked, setBooked] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.22 } }}
      transition={{ type: "spring", stiffness: 340, damping: 32 }}
    >
      <div
        className="rounded-[20px] overflow-hidden flex-shrink-0 cursor-pointer active:opacity-90 transition-opacity"
        style={{
          background: "#111",
          border: "1px solid #1E1E1E",
        }}
        onClick={() => onOpenDetail(venue)}
      >
        {/* ── Image ── */}
        <div className="relative" style={{ height: 168 }}>
          <GrainImage src={venue.image} alt={venue.name} />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)",
            }}
          />

          {/* Vibe tag — top left */}
          <div
            className="absolute top-3 left-3"
            style={{
              ...pillBase,
              padding: "4px 10px",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <span style={{ fontFamily: F, color: "rgba(255,255,255,0.85)", fontSize: 10, fontWeight: 500 }}>
              {venue.vibe}
            </span>
          </div>

          {/* Rating — top right */}
          <div
            className="absolute top-3 right-3"
            style={{
              ...pillBase,
              padding: "4px 9px",
              gap: 4,
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <span style={{ color: "#fff", display: "flex" }}><StarIcon /></span>
            <span style={{ fontFamily: F, color: "#fff", fontSize: 11, fontWeight: 600 }}>{venue.rating}</span>
          </div>

          {/* Venue name — bottom left overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
            <p
              style={{
                fontFamily: F,
                color: "#fff",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
              }}
            >
              {venue.name}
            </p>
            <div className="flex items-center gap-1.5 mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
              <MapPinIcon />
              <span style={{ fontFamily: F, fontSize: 11 }}>{venue.location}</span>
            </div>
          </div>
        </div>

        {/* ── Content row ── */}
        <div className="px-4 pt-3 pb-4">
          {/* Description */}
          <p
            style={{
              fontFamily: F,
              color: "#444",
              fontSize: 12,
              lineHeight: 1.55,
              marginBottom: 12,
            }}
          >
            {venue.description}
          </p>

          {/* Bottom row: avatars + actions */}
          <div className="flex items-center justify-between">
            {/* Social avatars */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {DEMO_AVATARS.slice(0, 3).map((av, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full overflow-hidden"
                    style={{ border: "1.5px solid #111" }}
                  >
                    <GrainImage src={av} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span style={{ fontFamily: F, color: "#383838", fontSize: 11 }}>+24 going</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Unsave */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUnsave(venue.id);
                }}
                className="flex items-center justify-center transition-opacity active:opacity-60"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid #222",
                  color: "#444",
                }}
              >
                <TrashIcon />
              </button>

              {/* Book CTA */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail(venue);
                }}
                className="flex items-center gap-1.5 transition-all active:scale-95"
                style={{
                  height: 34,
                  padding: "4px 14px",
                  borderRadius: 999,
                  background: "#fff",
                  color: "#080808",
                }}
              >
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700 }}>Book</span>
                <span style={{ color: "#080808", display: "flex" }}><ArrowRightIcon /></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 text-center" style={{ paddingBottom: 100 }}>
      {/* Big bookmark icon */}
      <div
        className="mb-6 flex items-center justify-center"
        style={{ width: 72, height: 72, borderRadius: 20, background: "#141414", border: "1px solid #222" }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p style={{ fontFamily: F, color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 8 }}>
        Nothing saved yet
      </p>
      <p style={{ fontFamily: F, color: "#444", fontSize: 13, lineHeight: 1.55, marginBottom: 28 }}>
        Swipe right on anything you like in the trending feed and it'll appear here.
      </p>
      <button
        onClick={onGoHome}
        className="flex items-center gap-2 transition-all active:scale-95"
        style={{
          height: 42,
          padding: "4px 22px",
          borderRadius: 999,
          background: "#fff",
          color: "#080808",
        }}
      >
        <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700 }}>Start swiping</span>
        <ArrowRightIcon />
      </button>
    </div>
  );
}

// ─── Saved Screen ─────────────────────────────────────────────────────────────
interface SavedScreenProps {
  savedVenues: Venue[];
  onUnsave: (id: number) => void;
  onGoHome: () => void;
  onOpenDetail: (venue: VenueDetailInfo) => void;
}

export function SavedScreen({ savedVenues, onUnsave, onGoHome, onOpenDetail }: SavedScreenProps) {
  const onScrollSmart = useScrollbarSmartReveal();
  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{ width: "100%", height: "100%", background: "#080808", fontFamily: F }}
    >
      {/* ── Scrollable body ── */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-smart"
        style={{ paddingBottom: 88 }}
        onScroll={onScrollSmart}
      >

        {/* ── Header ── */}
        <div className="px-5 pt-14 pb-5">
          <div className="flex items-end justify-between">
            <div>
              <p
                style={{
                  fontFamily: F,
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Your collection
              </p>
              <h1
                style={{
                  fontFamily: F,
                  color: "#fff",
                  fontSize: 30,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                Saved by You
              </h1>
            </div>

            {/* Count badge */}
            {savedVenues.length > 0 && (
              <div
                style={{
                  ...pillBase,
                  padding: "4px 12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid #222",
                  marginBottom: 2,
                }}
              >
                <span style={{ fontFamily: F, color: "#555", fontSize: 12, fontWeight: 600 }}>
                  {savedVenues.length} {savedVenues.length === 1 ? "place" : "places"}
                </span>
              </div>
            )}
          </div>

          {/* Subtle divider */}
          <div style={{ height: 1, background: "#181818", marginTop: 18 }} />
        </div>

        {/* ── Content ── */}
        {savedVenues.length === 0 ? (
          <EmptyState onGoHome={onGoHome} />
        ) : (
          <div className="px-5 flex flex-col gap-4 pb-4">
            <AnimatePresence initial={false}>
              {savedVenues.map((venue) => (
                <SavedCard
                  key={venue.id}
                  venue={venue}
                  onUnsave={onUnsave}
                  onOpenDetail={onOpenDetail}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}