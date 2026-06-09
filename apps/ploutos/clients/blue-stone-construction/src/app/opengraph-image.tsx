import { ImageResponse } from 'next/og'

export const alt = 'Blue Stone Construction LLC — General Contractor in Lake Hiawatha, NJ'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#1a1a2e',
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
          fontSize: 22,
          color: '#7BC4EE',
          fontWeight: 700,
          letterSpacing: '0.22em',
          marginBottom: 16,
          textTransform: 'uppercase',
        }}
      >
        INTERIOR &amp; EXTERIOR
      </div>
      <div
        style={{
          fontSize: 100,
          color: '#ffffff',
          fontWeight: 800,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        BLUE STONE
      </div>
      <div
        style={{
          fontSize: 38,
          color: '#ffffff',
          fontWeight: 700,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          marginBottom: 52,
        }}
      >
        CONSTRUCTION
      </div>
      <div
        style={{
          fontSize: 24,
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        General Contractor · Lake Hiawatha, NJ · Licensed &amp; Insured
      </div>
    </div>,
    { ...size }
  )
}
