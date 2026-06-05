interface LogoProps {
  /** "full" shows mark + wordmark; "icon" shows mark only */
  variant?: "full" | "icon";
  /** Size of the mark in pixels */
  size?: number;
  /** Override the wordmark color. Defaults to current color (inherit). */
  color?: string;
  className?: string;
}

export default function Logo({
  variant = "full",
  size = 28,
  color,
  className,
}: LogoProps) {
  return (
    <span
      className={`logo-root${className ? ` ${className}` : ""}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        textDecoration: "none",
      }}
    >
      {/* Mark — swap public/icons/logo-mark.svg to update the icon globally */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/logo-mark.svg"
        alt="Sousie"
        width={size}
        height={size}
        style={{ display: "block", flexShrink: 0 }}
      />

      {variant === "full" && (
        <span
          className="wordmark"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: `${Math.round(size * 0.85)}px`,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            color: color ?? "inherit",
          }}
        >
          Sousie
        </span>
      )}
    </span>
  );
}
