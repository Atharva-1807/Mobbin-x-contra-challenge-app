import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HomeScreen } from "./HomeScreen";
import { SavedScreen } from "./SavedScreen";
import { DiscoverScreen, VenuePopover, type MapVenue } from "./DiscoverScreen";
import { CalendarScreen } from "./CalendarScreen";
import { BottomNav } from "./BottomNav";
import { VenueDetailSheet, type VenueDetailInfo } from "./VenueDetailSheet";
import { CreatePlanSheet } from "./CreatePlanSheet";
import { TRENDING_VENUES } from "./data";

export function DowntownApp() {
  const [activeTab, setActiveTab]     = useState("home");
  const [savedIds, setSavedIds]       = useState<Set<number>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set());
  const [openVenue, setOpenVenue]     = useState<VenueDetailInfo | null>(null);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [discoverVenue, setDiscoverVenue]   = useState<MapVenue | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [planVenue, setPlanVenue] = useState<{ name: string; image: string } | null>(null);

  function triggerSentToast() {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2400);
  }

  function handleConfirmPlan() {
    setShowCreatePlan(false);
    setPlanVenue(null);
    setOpenVenue(null);
    setActiveTab("calendar");
    triggerSentToast();
  }

  function handlePlanYourDay(v: MapVenue) {
    setDiscoverVenue(null);
    setPlanVenue({ name: v.name, image: v.image as string });
  }

  function handleSave(id: number) {
    setSavedIds((prev) => new Set(prev).add(id));
  }

  function handleDismiss(id: number) {
    setDismissedIds((prev) => new Set(prev).add(id));
  }

  function handleUnsave(id: number) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function openDetail(venue: VenueDetailInfo) {
    setOpenVenue(venue);
  }

  function closeDetail() {
    setOpenVenue(null);
  }

  const savedVenues = TRENDING_VENUES.filter((v) => savedIds.has(v.id));

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#080808" }}>

      {/* ── Status bar ── z-50 so sheets at z-700 properly cover it */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 pt-3.5 pb-2 z-50 pointer-events-none"
        style={{ background: "transparent" }}
      >
        <span className="text-white text-[15px] font-semibold" style={{ fontFamily: '"Geist", system-ui, sans-serif' }}>
          9:41
        </span>
        <div className="flex items-center gap-1.5">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
            <rect x="0" y="7" width="3" height="5" rx="1" fill="white" />
            <rect x="4.5" y="4.5" width="3" height="7.5" rx="1" fill="white" />
            <rect x="9" y="2" width="3" height="10" rx="1" fill="white" />
            <rect x="13.5" y="0" width="3" height="12" rx="1" fill="white" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M8 9.5C8.83 9.5 9.5 10.17 9.5 11S8.83 12.5 8 12.5 6.5 11.83 6.5 11 7.17 9.5 8 9.5Z" fill="white" />
            <path d="M3 6.5C4.4 4.9 6.1 4 8 4s4.6.9 5 2.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none" />
            <path d="M0.5 3.5C2.6 1.3 5.2 0 8 0s5.4 1.3 7.5 3.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          </svg>
          <div className="flex items-center">
            <div className="relative rounded-sm" style={{ width: 24, height: 12, border: "1px solid rgba(255,255,255,0.5)" }}>
              <div className="absolute left-0.5 top-0.5 bottom-0.5 rounded-[1px] bg-white" style={{ right: "15%" }} />
            </div>
            <div className="rounded-r-sm ml-px" style={{ width: 2, height: 6, background: "rgba(255,255,255,0.5)" }} />
          </div>
        </div>
      </div>

      {/* ── Dynamic Island ── z-50; will be covered by sheets at z-700 */}
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-black rounded-full pointer-events-none"
        style={{ width: 126, height: 37 }}
      />

      {/* ── Screens ── */}
      <div className="absolute inset-0">
        {activeTab === "home" && (
          <HomeScreen
            activeTab={activeTab}
            savedIds={savedIds}
            dismissedIds={dismissedIds}
            onSave={handleSave}
            onDismiss={handleDismiss}
          />
        )}
        {activeTab === "discover" && (
          <DiscoverScreen
            onOpenDetail={openDetail}
            selectedVenueId={discoverVenue?.id ?? null}
            onVenueSelect={setDiscoverVenue}
            onVenueDismiss={() => setDiscoverVenue(null)}
          />
        )}
        {activeTab === "saved" && (
          <SavedScreen
            savedVenues={savedVenues}
            onUnsave={handleUnsave}
            onGoHome={() => setActiveTab("home")}
            onOpenDetail={openDetail}
          />
        )}
        {activeTab === "calendar" && <CalendarScreen onCreatePlan={() => setShowCreatePlan(true)} />}
      </div>

      {/* ── Shared Bottom Nav ── */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Discover Venue Popover (rendered above BottomNav) ── */}
      <AnimatePresence>
        {discoverVenue && (
          <VenuePopover
            venue={discoverVenue}
            onClose={() => setDiscoverVenue(null)}
            onOpenDetail={openDetail}
            onPlanYourDay={handlePlanYourDay}
          />
        )}
      </AnimatePresence>

      {/* ── Venue Detail Sheet (global overlay) ── */}
      <AnimatePresence>
        {openVenue && (
          <VenueDetailSheet venue={openVenue} onClose={closeDetail} onConfirmPlan={handleConfirmPlan} />
        )}
      </AnimatePresence>

      {/* ── Direct Create Plan Sheet (from Calendar "Create" button) ── */}
      <AnimatePresence>
        {showCreatePlan && (
          <CreatePlanSheet
            venueName=""
            onClose={() => setShowCreatePlan(false)}
            onConfirm={handleConfirmPlan}
          />
        )}
      </AnimatePresence>

      {/* ── Create Plan Sheet triggered from Discover popover ── */}
      <AnimatePresence>
        {planVenue && (
          <CreatePlanSheet
            venueName={planVenue.name}
            venueImage={planVenue.image}
            onClose={() => setPlanVenue(null)}
            onConfirm={handleConfirmPlan}
          />
        )}
      </AnimatePresence>

      {/* ── Sent toast ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 60, y: -10 }}
            animate={{ opacity: 1, x: 0,  y: 0  }}
            exit={{ opacity: 0, x: 60, y: -10 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            style={{
              position: "absolute",
              top: 64,
              right: 16,
              background: "#1c1c1c",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 999,
              padding: "9px 22px",
              zIndex: 9999,
              pointerEvents: "none",
              backdropFilter: "blur(12px)",
            }}
          >
            <span style={{ fontFamily: '"Geist", system-ui, sans-serif', color: "#fff", fontSize: 14, fontWeight: 500 }}>
              Sent
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}