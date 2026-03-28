import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: "", shadowUrl: "", iconRetinaUrl: "" });

const DARK_TILE = "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

interface VenueMiniMapProps {
  lat: number;
  lng: number;
  label: string;
  style?: React.CSSProperties;
  className?: string;
}

export function VenueMiniMap({ lat, lng, label, style, className }: VenueMiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      boxZoom: false,
      keyboard: false,
    });

    L.tileLayer(DARK_TILE, { maxZoom: 19 }).addTo(map);

    // Label tag above dot
    const labelIcon = L.divIcon({
      className: "",
      html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.8));">
        <div style="background:#fff;color:#080808;font-size:8px;font-weight:700;font-family:'Geist',system-ui,sans-serif;padding:3px 6px;border-radius:4px;white-space:nowrap;max-width:90px;overflow:hidden;text-overflow:ellipsis;letter-spacing:-0.01em;">${label}</div>
        <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #fff;"></div>
      </div>`,
      iconSize: [100, 36],
      iconAnchor: [50, 36],
    });
    L.marker([lat, lng], { icon: labelIcon }).addTo(map);

    // Dot
    const dotIcon = L.divIcon({
      className: "",
      html: `<div style="width:10px;height:10px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px rgba(255,255,255,0.25);"></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5],
    });
    L.marker([lat, lng], { icon: dotIcon }).addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, label]);

  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }} className={className}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 999,
        }}
      />
    </div>
  );
}
