type OrthoLogoProps = {
  tone?: "light" | "dark";
  compact?: boolean;
  subtitle?: boolean;
  className?: string;
};

export function OrthoLogo({
  tone = "light",
  compact = false,
  subtitle = true,
  className = "",
}: OrthoLogoProps) {
  const rootClassName = [
    "ortho-logo",
    tone === "dark" ? "ortho-logo--dark" : "ortho-logo--light",
    compact ? "ortho-logo--compact" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      <div className="ortho-logo__mark" aria-hidden="true">
        <svg viewBox="0 0 68 68" role="img">
          <circle cx="34" cy="34" r="29" fill="#F7F6F2" />
          <path
            d="M15 44C18.6 30.4 30.9 20 45.8 20"
            fill="none"
            stroke="#0B1F2A"
            strokeLinecap="round"
            strokeWidth="5.2"
          />
          <path
            d="M23 51.5C32.4 53.8 43.6 50.4 51 42.4C55.2 37.9 57.9 32.5 59 27"
            fill="none"
            stroke="#C9A84C"
            strokeLinecap="round"
            strokeWidth="5.2"
          />
          <path
            d="M34 16V52"
            fill="none"
            stroke="#163A5F"
            strokeDasharray="2.5 4"
            strokeLinecap="round"
            strokeWidth="2.3"
          />
          <circle cx="34" cy="24" r="3.2" fill="#C9A84C" />
          <circle
            cx="34"
            cy="34"
            r="11.5"
            fill="none"
            stroke="#163A5F"
            strokeOpacity="0.12"
            strokeWidth="1.6"
          />
        </svg>
      </div>
      <div className="ortho-logo__copy">
        <span className="ortho-logo__name">
          Ortho<span className="ortho-logo__dot">.</span>
          <strong>AI</strong>
        </span>
        {subtitle ? <span className="ortho-logo__subtitle">OrthoBrain Engine™</span> : null}
      </div>
    </div>
  );
}
