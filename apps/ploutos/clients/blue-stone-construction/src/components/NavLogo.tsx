import Image from 'next/image'

export function NavLogo() {
  return (
    <a
      href="#home"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        textDecoration: 'none',
      }}
    >
      {/* Construction icon — SVG scales cleanly */}
      <div style={{ flexShrink: 0, width: 52, height: 52 }}>
        <Image
          src="/brands/blue-stone-construction/logo-icon.svg"
          alt=""
          width={52}
          height={52}
          priority
          style={{ objectFit: 'contain', objectPosition: 'center' }}
        />
      </div>

      {/* Text stack */}
      <div style={{ lineHeight: 1.1 }}>
        <div
          style={{
            fontSize: '0.55rem',
            fontWeight: 600,
            color: 'var(--text-sub)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          Interior &amp; Exterior
        </div>
        <div
          style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: 'var(--navy)',
            fontFamily: 'var(--font-heading), sans-serif',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Blue Stone
        </div>
        <div
          style={{
            fontSize: '0.6rem',
            fontWeight: 700,
            color: 'var(--navy)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          Construction
        </div>
      </div>
    </a>
  )
}
