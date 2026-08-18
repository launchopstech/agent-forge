import { ImageResponse } from 'next/og'

// TODO: replace placeholder colors and text with client brand after running /seo

export const alt = 'CLIENT_NAME'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#ffffff',
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
          background: '#000000',
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* TODO: replace with client logo mark SVG */}
        <div style={{ fontSize: 32, color: '#fff', fontWeight: 900 }}>C</div>
      </div>
      <div
        style={{
          fontSize: 72,
          color: '#000000',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          marginBottom: 20,
        }}
      >
        CLIENT_NAME
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
        {/* TODO: replace with client tagline */}
        Your tagline here
      </div>
    </div>,
    { ...size }
  )
}
