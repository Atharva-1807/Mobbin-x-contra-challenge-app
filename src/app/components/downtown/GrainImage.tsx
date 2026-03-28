import { ImageWithFallback } from "../figma/ImageWithFallback";
import { GRAIN_SVG } from "./data";

export function GrainImage({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="relative w-full h-full">
      <ImageWithFallback
        src={src}
        alt={alt}
        className={className ?? "w-full h-full object-cover"}
        style={{
          filter: "saturate(1.45) contrast(1.08) brightness(1.05)",
          ...style,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: GRAIN_SVG,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          opacity: 0.09,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
