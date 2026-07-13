interface LogoMarkProps {
  size?: number
}

export function LogoMark({ size = 32 }: LogoMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="lGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="48%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <radialGradient id="lNode" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
        <radialGradient id="lBg" cx="65%" cy="28%" r="55%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <filter
          id="lMarkGlow"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          id="lNodeGlow"
          x="-140%"
          y="-140%"
          width="380%"
          height="380%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          id="lArcGlow"
          x="-30%"
          y="-60%"
          width="160%"
          height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background tile */}
      <rect width="64" height="64" rx="14" fill="#06060f" />
      <rect width="64" height="64" rx="14" fill="url(#lBg)" />
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="63"
        rx="13.5"
        fill="none"
        stroke="rgba(124,58,237,0.28)"
        strokeWidth="1"
      />
      <path d="M14 1 Q32 0 50 1" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

      {/* L letterform */}
      <path
        fill="url(#lGrad)"
        filter="url(#lMarkGlow)"
        d="M 12 10 L 22 10 L 22 44 L 48 44 L 48 54 L 12 54 Z"
      />

      {/* Launch trajectory arc */}
      <path
        d="M 22 12 Q 34 2 42 15"
        fill="none"
        stroke="rgba(196,181,253,0.45)"
        strokeWidth="1.2"
        strokeDasharray="2.5 2.2"
        strokeLinecap="round"
        filter="url(#lArcGlow)"
      />

      {/* Node */}
      <circle cx="42" cy="15" r="3.2" fill="url(#lNode)" filter="url(#lNodeGlow)" />
    </svg>
  )
}
