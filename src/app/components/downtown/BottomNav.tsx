import { F } from "./data";

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={active ? "rgba(255,255,255,0.12)" : "none"}
      />
      <polyline
        points="9 22 9 12 15 12 15 22"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DiscoverIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SavedIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "rgba(255,255,255,0.15)" : "none"}>
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

const TABS = [
  { id: "home",     label: "Home",     Icon: HomeIcon     },
  { id: "discover", label: "Discover", Icon: DiscoverIcon },
  { id: "saved",    label: "Saved",    Icon: SavedIcon    },
  { id: "calendar", label: "Calendar", Icon: CalendarIcon },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex items-center justify-around px-2 pt-3 pb-7 z-40"
      style={{
        background: "linear-gradient(to top, #0A0A0A 78%, rgba(8,8,8,0.96) 100%)",
        borderTop: "1px solid #181818",
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center gap-1.5 min-w-[60px] transition-all active:scale-95"
            style={{ color: isActive ? "#fff" : "#4D4D4D" }}
          >
            <Icon active={isActive} />
            <span
              style={{
                fontFamily: F,
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#fff" : "#4D4D4D",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
