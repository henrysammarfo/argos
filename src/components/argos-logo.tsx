import { Link } from "@tanstack/react-router";

interface ArgosLogoProps {
  size?: number;
  markOnly?: boolean;
  className?: string;
  wordmarkClassName?: string;
  to?: string;
}

/**
 * ARGOS mark — a hexagonal aperture with a central pupil.
 * Stroke-only so it prints clean on merch (embroidery, screen-print, vinyl).
 */
export function ArgosMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer hexagon */}
      <path
        d="M16 2.5L27.5 9v14L16 29.5 4.5 23V9L16 2.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Aperture blades — 6 rotated triangles forming an iris */}
      <g stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" opacity="0.9">
        <path d="M16 8.5L21 12l-2.2 3.8H13.2L11 12l5-3.5z" />
        <path d="M16 8.5v3.8" opacity="0.6" />
      </g>
      {/* Central pupil */}
      <circle cx="16" cy="16" r="1.8" fill="currentColor" />
      {/* Inner iris ring */}
      <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

export function ArgosLogo({
  size = 28,
  markOnly = false,
  className = "",
  wordmarkClassName = "text-lg sm:text-xl font-medium tracking-tight text-foreground",
  to = "/",
}: ArgosLogoProps) {
  const content = (
    <span className="inline-flex items-center gap-2.5">
      <ArgosMark size={size} className="text-primary" />
      {!markOnly && <span className={wordmarkClassName}>ARGOS</span>}
    </span>
  );

  if (to) {
    return (
      <Link to={to} className={`inline-flex items-center ${className}`}>
        {content}
      </Link>
    );
  }
  return <span className={`inline-flex items-center ${className}`}>{content}</span>;
}
