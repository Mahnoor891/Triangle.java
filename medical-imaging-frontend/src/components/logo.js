import { SITE } from "@/lib/site";

export default function Logo({ size = 40, dark = false, showText = true }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.28 }}>
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <rect width="48" height="48" rx="11" fill="#1b6ca8" />
        <circle cx="24" cy="24" r="15" fill="none" stroke="#ffffff" strokeWidth="3" />
        <rect x="22" y="16" width="4" height="16" rx="1" fill="#ffffff" />
        <rect x="16" y="22" width="16" height="4" rx="1" fill="#ffffff" />
      </svg>
      {showText && (
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <span
            style={{
              fontSize: size * 0.5,
              fontWeight: 800,
              letterSpacing: 1,
              color: dark ? "#ffffff" : "#12355b",
            }}
          >
            {SITE.name}
          </span>
          <span
            style={{
              fontSize: Math.max(size * 0.26, 10),
              color: dark ? "#c9d8e8" : "#666666",
            }}
          >
            {SITE.tagline}
          </span>
        </span>
      )}
    </span>
  );
}