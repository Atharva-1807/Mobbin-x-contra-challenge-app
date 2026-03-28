import { useState } from "react";
import { useScrollbarSmartReveal } from "../../hooks/useScrollbarSmartReveal";
import { motion, AnimatePresence } from "motion/react";
import { GrainImage } from "./GrainImage";
import { F } from "./data";
import imgRectangle81 from "figma:asset/e833dc6ce1b9f2fc67e48ba6053427a52ec45dde.png";
import imgEllipse13 from "figma:asset/c4706169bba86808e21939da2e8a81d339ae0404.png";
import imgEllipse14 from "figma:asset/41115b2ee9772d98407f866a59381e68b501d5bb.png";
import { IMG_AVATAR } from "./data";

// ─── Guest avatars ────────────────────────────────────────────────────────────
const IMG_SAM  = "https://images.unsplash.com/photo-1628619487925-e9b8fc4c6b08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200";
const IMG_MIA  = "https://images.unsplash.com/photo-1646933597890-c52f3033a230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200";

type GuestStatus = "confirmed" | "declined" | "pending";

type Guest = { id: number; name: string; avatar: string; status: GuestStatus };

const INITIAL_GUESTS: Guest[] = [
  { id: 1, name: "Sam",  avatar: IMG_SAM,       status: "confirmed" },
  { id: 2, name: "Tom",  avatar: imgEllipse13,  status: "declined"  },
  { id: 3, name: "Ben",  avatar: imgEllipse14,  status: "confirmed" },
  { id: 4, name: "Mia",  avatar: IMG_MIA,       status: "pending"   },
];

const ENERGY_OPTIONS = [
  { id: "color", label: "Color",  bg: "#E63B3B" },
  { id: "drip",  label: "Drip",   bg: "img",    img: imgEllipse13 },
  { id: "mood",  label: "Mood",   bg: "img",    img: imgEllipse14 },
  { id: "chill", label: "Chill",  bg: "#4A90D9" },
];

const DATES = [
  { label: "Today",    sub: "26 Mar" },
  { label: "Tomorrow", sub: "27 Mar" },
  { label: "Fri",      sub: "28 Mar" },
  { label: "Sat",      sub: "29 Mar" },
];

const TIMES = ["7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"];

// ─── Icons ─────────────────────────────────────────────────────────────────────
function BackIcon() {
  return (
    <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
      <path d="M8 1L1 7.5L8 14" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5" r="3" stroke="rgba(255,255,255,0.85)" strokeWidth="1.7" />
      <circle cx="6" cy="12" r="3" stroke="rgba(255,255,255,0.85)" strokeWidth="1.7" />
      <circle cx="18" cy="19" r="3" stroke="rgba(255,255,255,0.85)" strokeWidth="1.7" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="rgba(255,255,255,0.85)" strokeWidth="1.7" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="rgba(255,255,255,0.85)" strokeWidth="1.7" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="10" r="3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" />
    </svg>
  );
}
function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth="1.8" />
    </svg>
  );
}
function PlusSmallIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="#080808" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: GuestStatus }) {
  if (status === "confirmed") {
    return (
      <div
        style={{
          position: "absolute",
          bottom: -2,
          right: -2,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#1a1a1a",
          border: "1.5px solid #0C0C0C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          lineHeight: 1,
        }}
      >
        🍕
      </div>
    );
  }
  if (status === "declined") {
    return (
      <div
        style={{
          position: "absolute",
          bottom: -2,
          right: -2,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#1a1a1a",
          border: "1.5px solid #0C0C0C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          lineHeight: 1,
        }}
      >
        🥹
      </div>
    );
  }
  // pending
  return (
    <div
      style={{
        position: "absolute",
        bottom: -2,
        right: -2,
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "#1a1a1a",
        border: "1.5px solid #0C0C0C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 9,
        lineHeight: 1,
      }}
    >
      ⏳
    </div>
  );
}

// ─── Edit picker overlays ──────────────────────────────────────────────────────
function DatePicker({ selected, onSelect, onClose }: { selected: number; onSelect: (i: number) => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.16 }}
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        marginTop: 8,
        background: "#161616",
        border: "1px solid #2a2a2a",
        borderRadius: 12,
        padding: 12,
        zIndex: 10,
        display: "flex",
        gap: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      }}
    >
      {DATES.map((d, i) => {
        const sel = selected === i;
        return (
          <button
            key={i}
            onClick={() => { onSelect(i); onClose(); }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "8px 10px",
              borderRadius: 8,
              background: sel ? "#fff" : "transparent",
              border: sel ? "none" : "1px solid #2a2a2a",
              cursor: "pointer",
            }}
          >
            <span style={{ fontFamily: F, color: sel ? "#080808" : "#ccc", fontSize: 11, fontWeight: 600 }}>{d.label}</span>
            <span style={{ fontFamily: F, color: sel ? "#555" : "#444", fontSize: 10 }}>{d.sub}</span>
          </button>
        );
      })}
    </motion.div>
  );
}

function TimePicker({ selected, onSelect, onClose }: { selected: number; onSelect: (i: number) => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.16 }}
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        marginTop: 8,
        background: "#161616",
        border: "1px solid #2a2a2a",
        borderRadius: 12,
        padding: 12,
        zIndex: 10,
        display: "flex",
        gap: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      }}
    >
      {TIMES.map((t, i) => {
        const sel = selected === i;
        return (
          <button
            key={i}
            onClick={() => { onSelect(i); onClose(); }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 10px",
              borderRadius: 8,
              background: sel ? "#fff" : "transparent",
              border: sel ? "none" : "1px solid #2a2a2a",
              cursor: "pointer",
            }}
          >
            <span style={{ fontFamily: F, color: sel ? "#080808" : "#ccc", fontSize: 11, fontWeight: 600 }}>{t}</span>
          </button>
        );
      })}
    </motion.div>
  );
}

// ─── Main PlanDetailSheet ─────────────────────────────────────────────────────
interface PlanDetailSheetProps {
  onClose: () => void;
}

export function PlanDetailSheet({ onClose }: PlanDetailSheetProps) {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(2); // 9:00 PM
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [selectedEnergy, setSelectedEnergy] = useState("color");
  const [notes, setNotes] = useState("Bring a huge appetite! And don't forget to carry a tiffin box to take all the pizza home.");
  const onScrollSmart = useScrollbarSmartReveal();

  const dateLabel = DATES[selectedDate].label === "Today" ? "Today, 26 March" : `${DATES[selectedDate].label}, ${DATES[selectedDate].sub}`;
  const timeLabel = TIMES[selectedTime];

  function addGuest() {
    const newId = guests.length + 1;
    const newGuest: Guest = {
      id: newId,
      name: "Alex",
      avatar: IMG_AVATAR,
      status: "pending",
    };
    setGuests((prev) => [...prev, newGuest]);
  }

  return (
    <motion.div
      className="absolute inset-0 z-[300]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose} />

      {/* Sheet */}
      <motion.div
        className="absolute inset-0 flex flex-col scrollbar-smart"
        style={{ background: "#0C0C0C", overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", paddingBottom: 90 }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 360, damping: 38 }}
        onScroll={onScrollSmart}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Nav bar ── */}
        <div style={{ height: 52, flexShrink: 0 }} />
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 16,
            paddingRight: 16,
            paddingBottom: 12,
            background: "linear-gradient(to bottom, #0C0C0C 80%, transparent)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <BackIcon />
          </button>

          <p style={{ fontFamily: F, color: "#fff", fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Pizza Mania
          </p>

          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ShareIcon />
          </button>
        </div>

        {/* ── Hero image ── */}
        <div style={{ position: "relative", marginLeft: 20, marginRight: 20, height: 240, borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
          <img
            src={imgRectangle81}
            alt="Pizza Mania"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)" }} />

          {/* Edit image button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              width: 36,
              height: 36,
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

          {/* Host badge */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              borderRadius: 999,
              padding: "4px 10px 4px 4px",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: "50%", overflow: "hidden", background: "#d9d9d9" }}>
              <GrainImage src={IMG_AVATAR} alt="You" className="w-full h-full object-cover" />
            </div>
            <span style={{ fontFamily: F, color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600 }}>Hosted by You</span>
          </div>
        </div>

        {/* ── Date & time ── */}
        <div style={{ paddingLeft: 20, paddingRight: 20, marginTop: 20, position: "relative" }}>
          {/* Date row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <button
              onClick={() => { setShowDatePicker((v) => !v); setShowTimePicker(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <p style={{ fontFamily: F, color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.025em" }}>
                {dateLabel}
              </p>
              <EditIcon />
            </button>
          </div>

          {/* Time row */}
          <button
            onClick={() => { setShowTimePicker((v) => !v); setShowDatePicker(false); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <p style={{ fontFamily: F, color: "#777", fontSize: 15, fontWeight: 500 }}>{timeLabel}</p>
            <EditIcon />
          </button>

          {/* Date picker dropdown */}
          <AnimatePresence>
            {showDatePicker && (
              <DatePicker
                selected={selectedDate}
                onSelect={setSelectedDate}
                onClose={() => setShowDatePicker(false)}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showTimePicker && (
              <TimePicker
                selected={selectedTime}
                onSelect={setSelectedTime}
                onClose={() => setShowTimePicker(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* ── Venue ── */}
        <div style={{ paddingLeft: 20, paddingRight: 20, marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
          <PinIcon />
          <p style={{ fontFamily: F, color: "rgba(255,255,255,0.55)", fontSize: 14, textDecoration: "underline", textUnderlineOffset: 2 }}>
            Si Nonna's Pizzeria
          </p>
        </div>

        {/* ── Divider ── */}
        <div style={{ marginLeft: 20, marginRight: 20, height: 1, background: "#1a1a1a", marginTop: 20, marginBottom: 20 }} />

        {/* ── Who's coming ── */}
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 15, fontWeight: 500 }}>Who's coming?</p>
            {/* Legend */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 10 }}>🍕</span>
                <span style={{ fontFamily: F, color: "#555", fontSize: 10 }}>going</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 10 }}>🥹</span>
                <span style={{ fontFamily: F, color: "#555", fontSize: 10 }}>can't go</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
            {guests.map((guest) => (
              <div key={guest.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", overflow: "hidden", background: "#2a2a2a" }}>
                    <GrainImage src={guest.avatar} alt={guest.name} className="w-full h-full object-cover" />
                  </div>
                  <StatusBadge status={guest.status} />
                </div>
                <span style={{ fontFamily: F, color: "#b3b3b3", fontSize: 12 }}>{guest.name}</span>
              </div>
            ))}

            {/* Add person */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={addGuest}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: "transparent",
                  border: "1.5px dashed rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <PlusSmallIcon />
              </motion.button>
              <span style={{ fontFamily: F, color: "#444", fontSize: 12 }}>Add</span>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ marginLeft: 20, marginRight: 20, height: 1, background: "#1a1a1a", marginTop: 24, marginBottom: 20 }} />

        {/* ── Energy ── */}
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 15, fontWeight: 500, marginBottom: 16 }}>Energy</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
            {ENERGY_OPTIONS.map((opt) => {
              const isSelected = selectedEnergy === opt.id;
              return (
                <div key={opt.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedEnergy(opt.id)}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      overflow: "hidden",
                      cursor: "pointer",
                      border: isSelected ? "2.5px solid #fff" : "2.5px solid transparent",
                      padding: 0,
                      position: "relative",
                      transition: "border-color 0.18s",
                    }}
                  >
                    {opt.bg === "img" && opt.img ? (
                      <img src={opt.img} alt={opt.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: opt.bg as string }} />
                    )}
                    {isSelected && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(0,0,0,0.35)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckIcon />
                      </div>
                    )}
                  </motion.button>
                  <span style={{ fontFamily: F, color: isSelected ? "#fff" : "#666", fontSize: 12, transition: "color 0.18s" }}>
                    {opt.label}
                  </span>
                </div>
              );
            })}

            {/* Add energy */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: "transparent",
                  border: "1.5px dashed rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <PlusSmallIcon />
              </motion.button>
              <span style={{ fontFamily: F, color: "#444", fontSize: 12 }}>Add</span>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ marginLeft: 20, marginRight: 20, height: 1, background: "#1a1a1a", marginTop: 24, marginBottom: 20 }} />

        {/* ── Notes ── */}
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          <p style={{ fontFamily: F, color: "#b3b3b3", fontSize: 15, fontWeight: 500, marginBottom: 12 }}>Notes</p>
          <div
            style={{
              border: "1px solid #2a2a2a",
              borderRadius: 10,
              padding: "14px 14px",
            }}
          >
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
                minHeight: 80,
              }}
            />
          </div>
        </div>

        {/* ── Save CTA ── */}
        <div style={{ paddingLeft: 20, paddingRight: 20, marginTop: 28 }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            style={{
              width: "100%",
              height: 50,
              background: "#fff",
              borderRadius: 14,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <span style={{ fontFamily: F, color: "#080808", fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Save Changes
            </span>
          </motion.button>
        </div>

        <style>{`textarea::placeholder{color:#444}`}</style>
      </motion.div>
    </motion.div>
  );
}