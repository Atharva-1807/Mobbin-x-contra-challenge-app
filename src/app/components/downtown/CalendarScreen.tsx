import { useState } from "react";
import { useScrollbarSmartReveal } from "../../hooks/useScrollbarSmartReveal";
import { motion, AnimatePresence } from "motion/react";
import { GrainImage } from "./GrainImage";
import { F } from "./data";
import { PlanDetailSheet } from "./PlanDetailSheet";

// ─── Nintendo pixel-art food images ──────────────────────────────────────────
import pixelPizza    from "../../../assets/pixel-pizza.png";
import pixelCoffee   from "../../../assets/pixel-coffee.png";
import pixelBrunch   from "../../../assets/pixel-brunch.png";
import pixelBurger   from "../../../assets/pixel-burger.png";
import pixelCocktail from "../../../assets/pixel-cocktail.png";



// ─── Time of day types ────────────────────────────────────────────────────────
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

const TIME_COLORS: Record<TimeOfDay, string> = {
  morning:   "#FCD34D",
  afternoon: "#60A5FA",
  evening:   "#FB923C",
  night:     "#A78BFA",
};

const TIME_LABELS: Record<TimeOfDay, string> = {
  morning:   "Morning",
  afternoon: "Afternoon",
  evening:   "Evening",
  night:     "Night",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
function MorningIcon({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2"/>
    </svg>
  );
}
function AfternoonIcon({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function EveningIcon({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path d="M3 12h1M20 12h1M12 3v1M12 20v1M5.22 5.22l.71.71M18.07 18.07l.71.71M5.22 18.78l.71-.71M18.07 5.93l.71-.71" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M6 16h12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M8 16a4 4 0 1 1 8 0" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function NightIcon({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function TimeIcon({ type }: { type: TimeOfDay }) {
  const color = TIME_COLORS[type];
  if (type === "morning")   return <MorningIcon color={color} />;
  if (type === "afternoon") return <AfternoonIcon color={color} />;
  if (type === "evening")   return <EveningIcon color={color} />;
  return <NightIcon color={color} />;
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#888" strokeWidth="2"/>
      <path d="M21 21l-4.35-4.35" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="#080808" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
type WeekDay = {
  id: string;
  label: string;
  date: number;
  count: number;
  avatar: string | null;
  times: TimeOfDay[];
  isToday?: boolean;
};

const WEEK_DAYS: WeekDay[] = [
  { id: "mo", label: "Mo", date: 23, count: 3, avatar: pixelBurger,   times: ["morning", "evening", "night"] },
  { id: "tu", label: "Tu", date: 24, count: 1, avatar: pixelPizza,    times: ["afternoon"] },
  { id: "we", label: "We", date: 25, count: 0, avatar: null,           times: [] },
  { id: "th", label: "Th", date: 26, count: 1, avatar: pixelBrunch,   times: ["evening"] },
  { id: "fr", label: "Fr", date: 27, count: 3, avatar: pixelCoffee,   times: ["morning", "evening", "night"], isToday: true },
  { id: "sa", label: "Sa", date: 28, count: 1, avatar: pixelCocktail, times: ["evening"] },
  { id: "su", label: "Su", date: 29, count: 0, avatar: null,           times: [] },
];

type InvitePlan = {
  id: number;
  name: string;
  host: string;
  timeLabel: string;
  image: string;
  timeOfDay: TimeOfDay;
  dayId: string;
};

// ─── Static invites (always show first 4, never changes with day) ─────────────
const ALL_INVITES: InvitePlan[] = [
  { id: 1, name: "Skyline Rooftop",   host: "Sam",    timeLabel: "Tonight, 9 PM", image: pixelCocktail, timeOfDay: "night",   dayId: "fr" },
  { id: 2, name: "Ramen Nights",      host: "Mia",    timeLabel: "Fri, 7 PM",     image: pixelBrunch,   timeOfDay: "evening", dayId: "fr" },
  { id: 3, name: "Omakase Night",     host: "Ben",    timeLabel: "Sat, 8 PM",     image: pixelBurger,   timeOfDay: "evening", dayId: "sa" },
  { id: 4, name: "Italian Night Out", host: "Alex",   timeLabel: "Mon, 8 PM",     image: pixelPizza,    timeOfDay: "evening", dayId: "mo" },
];

// ─── Per-day schedule cards (max 3 shown) ─────────────────────────────────────
type ScheduleCard = {
  id: number;
  name: string;
  host: string;
  timeLabel: string;
  image: string;
  timeOfDay: TimeOfDay;
};

const DAY_SCHEDULE: Record<string, ScheduleCard[]> = {
  mo: [
    { id: 1, name: "Italian Night Out", host: "Alex",   timeLabel: "8:00 PM",  image: pixelPizza,    timeOfDay: "evening" },
    { id: 2, name: "Morning Coffee",    host: "You",    timeLabel: "9:00 AM",  image: pixelCoffee,   timeOfDay: "morning" },
    { id: 3, name: "Late Night Out",    host: "Sam",    timeLabel: "10:30 PM", image: pixelCocktail, timeOfDay: "night"   },
  ],
  tu: [
    { id: 1, name: "Coffee Morning",    host: "Jordan", timeLabel: "9:00 AM",  image: pixelCoffee,   timeOfDay: "morning" },
  ],
  we: [],
  th: [
    { id: 1, name: "Dinner Res.",       host: "You",    timeLabel: "7:00 PM",  image: pixelPizza,    timeOfDay: "evening" },
  ],
  fr: [
    { id: 1, name: "Skyline Rooftop",  host: "Sam",    timeLabel: "9:00 PM",  image: pixelCocktail, timeOfDay: "night"   },
    { id: 2, name: "Ramen Nights",     host: "Mia",    timeLabel: "7:00 PM",  image: pixelBrunch,   timeOfDay: "evening" },
    { id: 3, name: "Morning Run",      host: "You",    timeLabel: "8:30 AM",  image: pixelCoffee,   timeOfDay: "morning" },
  ],
  sa: [
    { id: 1, name: "Omakase Night",    host: "Ben",    timeLabel: "8:00 PM",  image: pixelBurger,   timeOfDay: "evening" },
  ],
  su: [],
};

type YourPlan = {
  id: number;
  name: string;
  date: string;
  time: string;
  image: string;
  timeOfDay: TimeOfDay;
  guestCount: number;
};

const ALL_YOUR_PLANS: YourPlan[] = [
  { id: 1, name: "Pizza Mania",      date: "26 March", time: "9:00 PM", image: pixelPizza,    timeOfDay: "night",   guestCount: 4 },
  { id: 2, name: "Sando Madness",    date: "28 March", time: "7:00 PM", image: pixelBrunch,   timeOfDay: "evening", guestCount: 2 },
  { id: 3, name: "Still Coffee",     date: "29 March", time: "9:00 AM", image: pixelCoffee,   timeOfDay: "morning", guestCount: 3 },
  { id: 4, name: "Skyline Rooftop",  date: "30 March", time: "8:00 PM", image: pixelCocktail, timeOfDay: "evening", guestCount: 5 },
  { id: 5, name: "Burger Night",     date: "2 April",  time: "7:30 PM", image: pixelBurger,   timeOfDay: "evening", guestCount: 3 },
];

type FilterType = "upcoming" | "by-you";

// ─── Sub-components ───────────────────────────────────────────────────────────

// Compact card used in both "Your Invites" and the day schedule popover
function MiniCard({ name, host, timeLabel, image, timeOfDay }: {
  name: string; host: string; timeLabel: string; image: string; timeOfDay: TimeOfDay;
}) {
  const dotColor = TIME_COLORS[timeOfDay];
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      style={{
        display: "flex",
        alignItems: "center",
        background: "#161616",
        borderRadius: 10,
        overflow: "hidden",
        height: 64,
        border: "1px solid #202020",
        cursor: "pointer",
      }}
    >
      <img src={image} alt={name} style={{ width: 64, height: 64, objectFit: "cover", flexShrink: 0 }} />
      <div style={{ padding: "0 10px", minWidth: 0, flex: 1 }}>
        <p style={{
          fontFamily: F, color: "#fff", fontSize: 12, fontWeight: 600,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.01em",
        }}>
          {name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
          <p style={{ fontFamily: F, color: "#666", fontSize: 10.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {host} · {timeLabel}
          </p>
        </div>
      </div>
      {/* time icon */}
      <div style={{ paddingRight: 12, flexShrink: 0 }}>
        <TimeIcon type={timeOfDay} />
      </div>
    </motion.div>
  );
}

function WeekStrip({ selectedDay, onSelectDay }: { selectedDay: string; onSelectDay: (id: string) => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 16, paddingRight: 16 }}>
      {WEEK_DAYS.map((day) => {
        const isSelected = selectedDay === day.id;
        return (
          <motion.button
            key={day.id}
            onClick={() => onSelectDay(day.id)}
            whileTap={{ scale: 0.92 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              padding: "0 2px",
              cursor: "pointer",
              minWidth: 44,
            }}
          >
            {/* Day label */}
            <span style={{
              fontFamily: F,
              fontSize: 12,
              fontWeight: isSelected ? 700 : 400,
              color: isSelected ? "#fff" : "#555",
              letterSpacing: "0.01em",
            }}>
              {day.label}
            </span>

            {/* Circle — white ring follows selected day */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: day.count === 0 ? "#1a1a1a" : "transparent",
                  border: isSelected
                    ? "2px solid #fff"
                    : day.isToday
                    ? "2px solid #3a3a3a"
                    : "2px solid transparent",
                  transition: "border-color 0.2s",
                }}
              >
                {day.avatar ? (
                  <img src={day.avatar} alt={day.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "#1E1E1E" }} />
                )}
              </div>

              {/* Count badge */}
              {day.count > 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: -3,
                    right: -3,
                    width: 17,
                    height: 17,
                    borderRadius: "50%",
                    background: "#fff",
                    border: "1.5px solid #080808",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontFamily: F, fontSize: 9, fontWeight: 800, color: "#080808", lineHeight: 1 }}>
                    {day.count}
                  </span>
                </div>
              )}
            </div>

            {/* Time-of-day icons only — no labels */}
            <div style={{ display: "flex", gap: 3, minHeight: 11 }}>
              {day.times.map((t) => (
                <TimeIcon key={t} type={t as TimeOfDay} />
              ))}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function DaySchedule({ day }: { day: WeekDay }) {
  const cards = (DAY_SCHEDULE[day.id] ?? []).slice(0, 3);

  return (
    <motion.div
      key={day.id}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      style={{ marginLeft: 20, marginRight: 20 }}
    >
      <p style={{
        fontFamily: F, color: "#444", fontSize: 11, marginBottom: 10,
        letterSpacing: "0.04em", textTransform: "uppercase",
      }}>
        {day.label} · {day.date} March
      </p>

      {cards.length === 0 ? (
        <div
          style={{
            height: 60,
            background: "#111",
            borderRadius: 10,
            border: "1px solid #1E1E1E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ fontFamily: F, color: "#333", fontSize: 13 }}>Nothing planned</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {cards.map((c) => (
            <MiniCard key={c.id} {...c} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function PlanCard({ plan, onPress }: { plan: YourPlan; onPress?: () => void }) {
  const dotColor = TIME_COLORS[plan.timeOfDay];
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onPress}
      style={{ flexShrink: 0, width: 175, cursor: onPress ? "pointer" : "default" }}
    >
      <div style={{ position: "relative", width: 175, height: 200, borderRadius: 12, overflow: "hidden" }}>
        <GrainImage src={plan.image} alt={plan.name} className="w-full h-full object-cover" />
        {/* subtle vignette — darkens top edge and strengthens towards bottom for label legibility */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 32%, transparent 52%, rgba(0,0,0,0.72) 100%)" }} />
        <div
          style={{
            position: "absolute", bottom: 10, left: 10,
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
            borderRadius: 999, padding: "3px 8px 3px 4px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: dotColor }} />
          <span style={{ fontFamily: F, color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: 500 }}>
            {plan.guestCount} going · {TIME_LABELS[plan.timeOfDay]}
          </span>
        </div>
        <div
          style={{
            position: "absolute", top: 10, right: 10,
            width: 28, height: 28, borderRadius: "50%",
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <TimeIcon type={plan.timeOfDay} />
        </div>
      </div>
      <div style={{ paddingTop: 10, paddingLeft: 2 }}>
        <p style={{ fontFamily: F, color: "#fff", fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em" }}>
          {plan.name}
        </p>
        <p style={{ fontFamily: F, color: "#666", fontSize: 13, marginTop: 2 }}>
          {plan.date}, {plan.time}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main CalendarScreen ──────────────────────────────────────────────────────
export function CalendarScreen({ onCreatePlan }: { onCreatePlan?: () => void }) {
  const [planFilter, setPlanFilter] = useState<FilterType>("upcoming");
  // Default to Monday
  const [selectedDay, setSelectedDay] = useState<string>("mo");
  const [showPizzaPlan, setShowPizzaPlan] = useState(false);
  const onScrollSmart = useScrollbarSmartReveal();

  const currentDay = WEEK_DAYS.find((d) => d.id === selectedDay)!;

  const filteredPlans =
    planFilter === "by-you"
      ? ALL_YOUR_PLANS.filter((p) => p.id <= 3)
      : ALL_YOUR_PLANS;

  return (
    <div
      className="scrollbar-smart"
      style={{
        width: "100%",
        height: "100%",
        background: "#080808",
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        paddingBottom: 90,
      }}
      onScroll={onScrollSmart}
    >
      <div style={{ height: 52 }} />

      {/* ── Header ── */}
      <div style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: F, color: "#555", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
              March 2026
            </p>
            <h1 style={{ fontFamily: F, color: "#fff", fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
              Calendar
            </h1>
          </div>
          {/* Create button — icon + label only */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onCreatePlan}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            <PlusIcon />
            <span style={{ fontFamily: F, color: "#080808", fontSize: 12, fontWeight: 700, letterSpacing: "-0.01em" }}>
              Create
            </span>
          </motion.button>
        </div>
      </div>

      {/* ── Your Invites — static, always 4 cards, 2-col grid ── */}
      <div style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontFamily: F, color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.025em" }}>
            Your Invites
          </h2>
          <p style={{ fontFamily: F, color: "#555", fontSize: 12 }}>4 pending</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {ALL_INVITES.map((invite) => (
            <MiniCard
              key={invite.id}
              name={invite.name}
              host={invite.host}
              timeLabel={invite.timeLabel}
              image={invite.image}
              timeOfDay={invite.timeOfDay}
            />
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ marginLeft: 20, marginRight: 20, height: 1, background: "#141414", marginBottom: 24 }} />

      {/* ── This Week ── */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 14 }}>
          <h2 style={{ fontFamily: F, color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.025em" }}>
            This Week
          </h2>
        </div>

        <WeekStrip selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      </div>

      {/* ── Day schedule — invite-style cards ── */}
      <div style={{ marginBottom: 24, marginTop: 14 }}>
        <AnimatePresence mode="wait">
          <DaySchedule key={selectedDay} day={currentDay} />
        </AnimatePresence>
      </div>

      {/* ── Divider ── */}
      <div style={{ marginLeft: 20, marginRight: 20, height: 1, background: "#141414", marginBottom: 24 }} />

      {/* ── Your Plans ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ paddingLeft: 20, paddingRight: 20, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontFamily: F, color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.025em" }}>
            Your Plans
          </h2>
        </div>

        {/* Filter row */}
        <div
          className="no-scrollbar"
          style={{
            paddingLeft: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 18,
            overflowX: "auto",
            paddingRight: 20,
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          } as React.CSSProperties}
        >
          <button
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "#161616", border: "1px solid #222",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, cursor: "pointer",
            }}
          >
            <SearchIcon />
          </button>

          {(["upcoming", "by-you"] as FilterType[]).map((f) => {
            const labels: Record<FilterType, string> = { upcoming: "Upcoming", "by-you": "By You" };
            const active = planFilter === f;
            return (
              <button
                key={f}
                onClick={() => setPlanFilter(f)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 14px", height: 34, borderRadius: 8,
                  background: active ? "#d9d9d9" : "transparent",
                  border: `1px solid ${active ? "#d9d9d9" : "rgba(255,255,255,0.2)"}`,
                  fontFamily: F, color: active ? "#1a1a1a" : "#fff",
                  fontSize: 13, fontWeight: active ? 700 : 400,
                  letterSpacing: "-0.01em", cursor: "pointer",
                  flexShrink: 0, whiteSpace: "nowrap",
                }}
              >
                {labels[f]}
              </button>
            );
          })}
        </div>

        {/* Plan cards — horizontal scroll */}
        <AnimatePresence mode="wait">
          <motion.div
            key={planFilter}
            className="no-scrollbar"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              overflowX: "auto",
              overflowY: "visible",
              WebkitOverflowScrolling: "touch",
              paddingLeft: 20,
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            } as React.CSSProperties}
          >
            <div style={{ display: "flex", gap: 14, paddingRight: 20, flexWrap: "nowrap" }}>
              {filteredPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onPress={plan.id === 1 ? () => setShowPizzaPlan(true) : undefined}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Pizza Mania Plan Detail Sheet ── */}
      <AnimatePresence>
        {showPizzaPlan && (
          <PlanDetailSheet onClose={() => setShowPizzaPlan(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}
