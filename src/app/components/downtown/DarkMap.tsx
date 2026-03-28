import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Silence bundler icon-path warnings
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: "", shadowUrl: "", iconRetinaUrl: "" });

const DARK_TILE = "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface MapVenueWithCoords {
  id: string;
  name: string;
  rating: string;
  vibe: string;
  location: string;
  address: string;
  description: string;
  image: string;
  lat: number;
  lng: number;
  highlighted?: boolean;
  /** Extra Vibe-tab paragraph (mockup body copy) */
  vibeStory?: string;
}

// ─── Polaroid divIcon HTML ────────────────────────────────────────────────────
function makePolaroidHtml(venue: MapVenueWithCoords, isSelected: boolean) {
  const shadow = isSelected
    ? "0 12px 40px rgba(0,0,0,0.9),0 4px 16px rgba(0,0,0,0.7)"
    : "0 6px 20px rgba(0,0,0,0.7),0 2px 8px rgba(0,0,0,0.5)";
  const border = isSelected
    ? "1.5px solid rgba(255,255,255,0.5)"
    : venue.highlighted
    ? "1.5px solid rgba(180,190,240,0.7)"
    : "none";
  const bg    = venue.highlighted ? "#FAFAF6" : "#F5F3EF";
  const scale = isSelected ? "scale(1.12)" : "scale(1)";
  const label = venue.name.length > 12 ? venue.name.slice(0, 11) + "…" : venue.name;

  return `<div style="
    transform:${scale};transform-origin:bottom center;transition:transform 0.2s;
    width:64px;background:${bg};border-radius:5px;padding:5px 5px 0 5px;
    box-shadow:${shadow};border:${border};cursor:pointer;
  ">
    <div style="height:68px;overflow:hidden;border-radius:2px;">
      <img src="${venue.image}" alt="" style="width:100%;height:100%;object-fit:cover;filter:saturate(1.35) contrast(1.06);display:block;" />
    </div>
    <div style="padding:5px 2px 8px;text-align:center;">
      <p style="font-family:'Geist',system-ui,sans-serif;color:#111;font-size:7.5px;font-weight:700;line-height:1.2;letter-spacing:-0.01em;margin:0;">${label}</p>
    </div>
  </div>`;
}

// ─── DarkMap ──────────────────────────────────────────────────────────────────
interface DarkMapProps {
  venues: MapVenueWithCoords[];
  selectedId: string | null;
  onSelect: (v: MapVenueWithCoords) => void;
  onDeselect: () => void;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
}

export function DarkMap({
  venues,
  selectedId,
  onSelect,
  onDeselect,
  centerLat = 40.721,
  centerLng = -73.996,
  zoom = 14,
}: DarkMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const markersRef   = useRef<Map<string, L.Marker>>(new Map());

  // ── Init map once ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [centerLat, centerLng],
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(DARK_TILE, { maxZoom: 19 }).addTo(map);

    // User location pin
    const userIcon = L.divIcon({
      className: "",
      html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:32px;height:32px;">
        <div style="position:absolute;width:32px;height:32px;border-radius:50%;background:rgba(220,50,50,0.18);top:0;left:0;"></div>
        <svg width="20" height="28" viewBox="0 0 20 28" fill="none" style="position:relative;z-index:1;">
          <path d="M10 0C4.477 0 0 4.477 0 10c0 7.18 10 18 10 18S20 17.18 20 10C20 4.477 15.523 0 10 0z" fill="#E53935"/>
          <circle cx="10" cy="10" r="4" fill="white"/>
        </svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 28],
    });
    L.marker([40.7258, -73.993], { icon: userIcon, zIndexOffset: 2000 }).addTo(map);

    // Click map to deselect
    map.on("click", () => onDeselect());

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync venue markers whenever venues or selectedId changes ──────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove markers no longer in venues list
    markersRef.current.forEach((marker, id) => {
      if (!venues.find((v) => v.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    venues.forEach((venue) => {
      const isSelected = venue.id === selectedId;
      const html  = makePolaroidHtml(venue, isSelected);
      const icon  = L.divIcon({ className: "", html, iconSize: [64, 90], iconAnchor: [32, 90] });

      const existing = markersRef.current.get(venue.id);
      if (existing) {
        existing.setIcon(icon);
        existing.setZIndexOffset(isSelected ? 1000 : 0);
      } else {
        const marker = L.marker([venue.lat, venue.lng], { icon, zIndexOffset: isSelected ? 1000 : 0 })
          .addTo(map)
          .on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            onSelect(venue);
          });
        markersRef.current.set(venue.id, marker);
      }
    });
  }, [venues, selectedId, onSelect]);

  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)",
          zIndex: 1000,
        }}
      />
    </div>
  );
}
