import { ImageResponse } from 'next/og'

export const alt = 'Ploutos — Websites, Online Stores & Ads That Actually Work'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#FAF7F2',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          background: '#10b981',
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(16,185,129,0.25)',
        }}
      >
        <div style={{ fontSize: 32, color: '#fff', fontWeight: 900 }}>Π</div>
      </div>
      <div
        style={{
          fontSize: 76,
          color: '#1A1A2E',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          marginBottom: 20,
        }}
      >
        PLOUTOS
      </div>
      <div
        style={{
          fontSize: 26,
          color: '#4A5568',
          textAlign: 'center',
          lineHeight: 1.5,
          maxWidth: 700,
        }}
      >
        Websites, Online Stores & Ads That Actually Work
      </div>
      <div
        style={{
          marginTop: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 15,
          color: '#10b981',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        Direct · Precise · Results-Driven
      </div>
    </div>,
    { ...size }
  )
}
