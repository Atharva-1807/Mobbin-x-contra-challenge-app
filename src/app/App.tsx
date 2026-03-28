import { DowntownApp } from "./components/downtown/DowntownApp";

export default function App() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#050505" }}
    >
      {/* Phone frame */}
      <div
        className="relative overflow-hidden"
        style={{
          width: 390,
          height: 844,
          borderRadius: 52,
          background: "#080808",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08), 0 40px 120px rgba(0,0,0,0.8), 0 0 0 12px #111, 0 0 0 13px rgba(255,255,255,0.05)",
        }}
      >
        {/* App — status bar + Dynamic Island live inside DowntownApp so they share
            the same stacking context as sheets and are properly covered by them */}
        <div className="absolute inset-0">
          <DowntownApp />
        </div>

        {/* Home indicator */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full z-50"
          style={{ width: 130, height: 5, background: "rgba(255,255,255,0.3)" }}
        />
      </div>

      {/* Label */}
      <div
        className="absolute left-1/2 bottom-6 -translate-x-1/2 text-center"
        style={{ opacity: 0.2 }}
      >
        <p
          className="text-white text-xs tracking-widest uppercase"
          style={{ fontFamily: '"Geist", system-ui, sans-serif' }}
        >
          Downtown · NYC
        </p>
      </div>
    </div>
  );
}