import { useState } from "react";
import { useScrollbarSmartReveal } from "../../hooks/useScrollbarSmartReveal";
import { motion, AnimatePresence } from "motion/react";
import { GrainImage } from "./GrainImage";
import { F } from "./data";

// ─── Figma ellipse assets (energy options) ────────────────────────────────────
import imgEllipse8  from "figma:asset/8cf45a2064d96d25290262da5de28f0caaa3eea3.png";
import imgEllipse9  from "figma:asset/d89abab674e43b78f892860d685785568e387c1d.png";

// ─── Nintendo pixel-art images for the image picker ─────────────────────────
import pixelPizza    from "../../../assets/pixel-pizza.png";
import pixelCocktail from "../../../assets/pixel-cocktail.png";
import pixelSalmon   from "../../../assets/pixel-salmon.png";
import pixelBrunch   from "../../../assets/pixel-brunch.png";
import pixelCoffee   from "../../../assets/pixel-coffee.png";

const STOCK_IMAGES = [
  { id: "pizza",   src: pixelPizza,    label: "Pizza"   },
  { id: "rooftop", src: pixelCocktail, label: "Night"   },
  { id: "italian", src: pixelSalmon,   label: "Dining"  },
  { id: "brunch",  src: pixelBrunch,   label: "Brunch"  },
  { id: "cocktail",src: pixelCoffee,   label: "Coffee"  },
];

// ─── Friends ──────────────────────────────────────────────────────────────────
const ALL_FRIENDS = [
  { id: 1, name: "Sam",   avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
  { id: 2, name: "Tom",   avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
  { id: 3, name: "Mia",   avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
  { id: 4, name: "Priya", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
];

// ─── Energy options (matching Figma) ─────────────────────────────────────────
const ENERGY_OPTS = [
  { id: "color", label: "Color", type: "solid",  bg: "#E53935" },
  { id: "drip",  label: "Drip",  type: "image",  src: imgEllipse8 },
  { id: "mood",  label: "Mood",  type: "image",  src: imgEllipse9 },
];

// ─── Date & time options ──────────────────────────────────────────────────────
const DATE_OPTS = ["Today, 26 Mar", "Tomorrow, 27 Mar", "Fri, 28 Mar", "Sat, 29 Mar", "Sun, 30 Mar"];
const TIME_OPTS = ["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"];

// ─── Icons ────────────────────────────────────────────────────────────────────
function BackIcon() {
  return (
    <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
      <path d="M8 1L1 7.5L8 14" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PencilIcon({ color = "rgba(255,255,255,0.55)" }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function PinIcon({ color = "rgba(255,255,255,0.55)" }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={color} strokeWidth="1.8" />
      <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}
function PlusIcon({ color = "rgba(255,255,255,0.5)" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
function CheckIcon({ color = "#080808" }: { color?: string }) {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CameraIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="13" r="4" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" />
    </svg>
  );
}
function ChevronDown({ color = "#555" }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Inline dropdown ──────────────────────────────────────────────────────────
function DropdownList<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: T[];
  selected: T;
  onSelect: (v: T) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scaleY: 0.9 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: -6, scaleY: 0.9 }}
      transition={{ duration: 0.14 }}
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        marginTop: 4,
        background: "#1c1c1c",
        border: "1px solid #2a2a2a",
        borderRadius: 12,
        overflow: "hidden",
        zIndex: 50,
        boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
        transformOrigin: "top",
      }}
    >
      {options.map((opt) => {
        const sel = opt === selected;
        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            style={{
              width: "100%",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "11px 14px",
              background: sel ? "rgba(255,255,255,0.07)" : "none",
              border: "none",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              cursor: "pointer",
            }}
          >
            <span style={{ fontFamily: F, color: sel ? "#fff" : "#888", fontSize: 14, fontWeight: sel ? 600 : 400 }}>
              {opt}
            </span>
            {sel && <CheckIcon />}
          </button>
        );
      })}
    </motion.div>
  );
}

// ─── CreatePlanSheet ──────────────────────────────────────────────────────────
interface Props {
  venueName: string;
  venueImage: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export function CreatePlanSheet({ venueName, onClose, onConfirm }: Props) {
  const [title, setTitle]           = useState("");
  const [selectedImg, setSelectedImg] = useState(STOCK_IMAGES[0]);
  const [showImgPicker, setShowImgPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(DATE_OPTS[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_OPTS[3]); // 9:00 PM
  const [showDateDrop, setShowDateDrop] = useState(false);
  const [showTimeDrop, setShowTimeDrop] = useState(false);
  const [invitedIds, setInvitedIds]   = useState<number[]>([1, 2, 3, 4]);
  const [rsvpGoing, setRsvpGoing]     = useState(true);
  const [rsvpNotGoing, setRsvpNotGoing] = useState(true);
  const [energy, setEnergy]           = useState("color");
  const [message, setMessage]         = useState("");
  const [sent, setSent]               = useState(false);
  const onScrollSmart = useScrollbarSmartReveal();

  function toggleInvite(id: number) {
    setInvitedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSend() {
    setSent(true);
    setTimeout(() => {
      onConfirm?.();
      onClose();
    }, 1400);
  }

  function closeDropdowns() {
    setShowDateDrop(false);
    setShowTimeDrop(false);
  }

  return (
    <motion.div
      className="absolute inset-0 z-[800] flex flex-col"
      style={{ background: "#000" }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 340, damping: 36 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── Scrollable content ── */}
      <div
        className="flex-1 overflow-y-auto scrollbar-smart"
        style={{ WebkitOverflowScrolling: "touch", paddingBottom: 100 }}
        onScroll={onScrollSmart}
        onClick={closeDropdowns}
      >
        {/* Status bar space */}
        <div style={{ height: 52, flexShrink: 0 }} />

        {/* ── Top bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 24,
          }}
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <BackIcon />
          </motion.button>

          <p style={{ fontFamily: F, color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em" }}>
            Plan your Day
          </p>

          {/* Spacer to keep title centred */}
          <div style={{ width: 34 }} />
        </div>

        {/* ─── 1. TITLE ──────────────────────────────────────────────── */}
        <div
          style={{
            marginLeft: 20,
            marginRight: 20,
            borderBottom: "1px solid rgba(255,255,255,0.25)",
            paddingBottom: 16,
            marginBottom: 28,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Add a Title"
            maxLength={50}
            style={{
              width: "100%",
              textAlign: "center",
              fontFamily: F,
              color: "#fff",
              fontSize: 24,
              fontWeight: 500,
              background: "transparent",
              border: "none",
              outline: "none",
              caretColor: "#fff",
            }}
          />
        </div>

        {/* ─── 2. CHOOSE AN IMAGE ──────────────────────────────────────── */}
        <div style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 12 }}>
          <p style={{ fontFamily: F, color: "#fff", fontSize: 16, fontWeight: 500, marginBottom: 14 }}>
            Choose an image
          </p>

          {/* Full-width image — explicit height + absolute-fill child to avoid aspectRatio bugs */}
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", height: 260, background: "#111" }}>
            <img
              src={selectedImg.src}
              alt="Plan"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent 55%)" }} />

            {/* Camera / change image button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setShowImgPicker((v) => !v); }}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <CameraIcon />
            </motion.button>
          </div>

          {/* Image picker strip */}
          <AnimatePresence>
            {showImgPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                <div
                  className="no-scrollbar"
                  style={{
                    display: "flex",
                    gap: 8,
                    paddingTop: 12,
                    paddingBottom: 4,
                    overflowX: "auto",
                    scrollbarWidth: "none",
                  }}
                >
                  {STOCK_IMAGES.map((img) => {
                    const sel = selectedImg.id === img.id;
                    return (
                      <motion.button
                        key={img.id}
                        whileTap={{ scale: 0.93 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImg(img);
                          setShowImgPicker(false);
                        }}
                        style={{
                          flexShrink: 0,
                          width: 66,
                          height: 66,
                          borderRadius: 8,
                          overflow: "hidden",
                          border: sel ? "2.5px solid #fff" : "2.5px solid transparent",
                          cursor: "pointer",
                          padding: 0,
                          position: "relative",
                        }}
                      >
                        <img src={img.src} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        {sel && (
                          <div style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <CheckIcon />
                            </div>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── 3. VENUE + DATE/TIME ─────────────────────────────────────── */}
        <div style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 28 }}>
          {/* Venue row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <PinIcon />
            <p style={{ fontFamily: F, color: venueName ? "#fff" : "rgba(255,255,255,0.3)", fontSize: 16, fontWeight: 500, flex: 1 }}>
              {venueName || "Choose a venue…"}
            </p>
            <PencilIcon />
          </div>

          {/* Date row */}
          <div style={{ position: "relative" }}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowDateDrop((v) => !v); setShowTimeDrop(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <p style={{ fontFamily: F, color: "#9a9a9a", fontSize: 14 }}>
                {selectedDate.split(",")[1]?.trim() || selectedDate}, {selectedTime}
              </p>
              <ChevronDown color="#555" />
            </button>

            {/* Date dropdown */}
            <AnimatePresence>
              {showDateDrop && (
                <DropdownList
                  options={DATE_OPTS as any}
                  selected={selectedDate as any}
                  onSelect={(v) => { setSelectedDate(v); setShowDateDrop(false); }}
                />
              )}
            </AnimatePresence>

            {/* Time sub-row */}
            {!showDateDrop && (
              <div style={{ position: "relative", marginTop: 4 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowTimeDrop((v) => !v); setShowDateDrop(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    opacity: 0,
                    height: 0,
                    overflow: "hidden",
                  }}
                >
                  <span>{selectedTime}</span>
                </button>

                <AnimatePresence>
                  {showTimeDrop && (
                    <DropdownList
                      options={TIME_OPTS as any}
                      selected={selectedTime as any}
                      onSelect={(v) => { setSelectedTime(v); setShowTimeDrop(false); }}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Inline date+time pickers as horizontal strip when tapped */}
          <AnimatePresence>
            {showDateDrop && (
              <div style={{ display: "none" }} />
            )}
          </AnimatePresence>
        </div>

        {/* ─── 4. WHO'S COMING? ────────────────────────────────────────── */}
        <div style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 28 }}>
          <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 15, fontWeight: 500, marginBottom: 16 }}>
            Who's coming?
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
            {ALL_FRIENDS.map((f) => {
              const invited = invitedIds.includes(f.id);
              return (
                <motion.button
                  key={f.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleInvite(f.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: "50%",
                        overflow: "hidden",
                        opacity: invited ? 1 : 0.4,
                        border: invited ? "2px solid rgba(255,255,255,0.4)" : "2px solid transparent",
                        transition: "opacity 0.2s, border-color 0.2s",
                      }}
                    >
                      <GrainImage src={f.avatar} alt={f.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: F,
                      color: invited ? "#b3b3b3" : "#555",
                      fontSize: 12,
                      transition: "color 0.2s",
                    }}
                  >
                    {f.name}
                  </span>
                </motion.button>
              );
            })}

            {/* Add more */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  background: "transparent",
                  border: "2px solid rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <PlusIcon />
              </motion.button>
              <span style={{ fontFamily: F, color: "#555", fontSize: 12 }}>Add</span>
            </div>
          </div>
        </div>

        {/* ─── 5. RSVP OPTIONS ─────────────────────────────────────────── */}
        <div style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 28 }}>
          <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 15, fontWeight: 500, marginBottom: 16 }}>
            RSVP Options
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            {/* Going */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setRsvpGoing((v) => !v)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <div
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  background: rsvpGoing ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                  border: rsvpGoing ? "2px solid rgba(255,255,255,0.4)" : "2px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  transition: "all 0.2s",
                  opacity: rsvpGoing ? 1 : 0.4,
                }}
              >
                🍕
              </div>
              <span style={{ fontFamily: F, color: "#b3b3b3", fontSize: 15 }}>Going</span>
            </motion.button>

            {/* Not going */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setRsvpNotGoing((v) => !v)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <div
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  background: rsvpNotGoing ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                  border: rsvpNotGoing ? "2px solid rgba(255,255,255,0.4)" : "2px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  transition: "all 0.2s",
                  opacity: rsvpNotGoing ? 1 : 0.4,
                }}
              >
                🥹
              </div>
              <span style={{ fontFamily: F, color: "#b3b3b3", fontSize: 15 }}>Not going</span>
            </motion.button>

            {/* Add RSVP option */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  background: "transparent",
                  border: "2px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <PlusIcon />
              </motion.button>
              <span style={{ fontFamily: F, color: "#555", fontSize: 15 }}>Add</span>
            </div>
          </div>
        </div>

        {/* ─── 6. ENERGY ───────────────────────────────────────────────── */}
        <div style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 28 }}>
          <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 15, fontWeight: 500, marginBottom: 16 }}>
            Energy
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            {ENERGY_OPTS.map((opt) => {
              const active = energy === opt.id;
              return (
                <motion.button
                  key={opt.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEnergy(opt.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: active ? "3px solid #fff" : "3px solid transparent",
                      position: "relative",
                      transition: "border-color 0.18s",
                    }}
                  >
                    {opt.type === "image" && opt.src ? (
                      <img src={opt.src} alt={opt.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: opt.bg }} />
                    )}
                    {active && (
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <CheckIcon color="#fff" />
                      </div>
                    )}
                  </div>
                  <span style={{ fontFamily: F, color: active ? "#fff" : "#b3b3b3", fontSize: 12, transition: "color 0.18s" }}>
                    {opt.label}
                  </span>
                </motion.button>
              );
            })}

            {/* Add energy */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <PlusIcon color="rgba(255,255,255,0.6)" />
              </motion.button>
              <span style={{ fontFamily: F, color: "#b3b3b3", fontSize: 12 }}>Add</span>
            </div>
          </div>
        </div>

        {/* ─── 7. MESSAGE ──────────────────────────────────────────────── */}
        <div style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 32 }}>
          <div
            style={{
              border: "1px solid #707070",
              borderRadius: 8,
              padding: "14px 14px",
              minHeight: 100,
            }}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message (optional)"
              rows={3}
              style={{
                fontFamily: F,
                color: "#d9d9d9",
                fontSize: 14,
                lineHeight: 1.6,
                background: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
                resize: "none",
              }}
            />
          </div>
        </div>

        {/* ─── 8. BOTTOM CTAs ──────────────────────────────────────────── */}
        <div style={{ paddingLeft: 20, paddingRight: 20, display: "flex", gap: 10 }}>
          {/* Save as Draft */}
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 36,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: F,
                color: "#d9d9d9",
                fontSize: 15,
                fontWeight: 500,
                textDecoration: "underline",
                textUnderlineOffset: 2,
              }}
            >
              Save as Draft
            </span>
          </button>

          {/* Confirm */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSend}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 6,
              background: sent ? "#22c55e" : "#d9d9d9",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.3s",
            }}
          >
            <span style={{ fontFamily: F, color: sent ? "#fff" : "#080808", fontSize: 15, fontWeight: 600 }}>
              {sent ? "Sent" : "Confirm"}
            </span>
          </motion.button>
        </div>
      </div>

      <style>{`
        textarea::placeholder { color: #d9d9d9; opacity: 0.6; }
        input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </motion.div>
  );
}