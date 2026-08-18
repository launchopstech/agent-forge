import { ImageResponse } from 'next/og'

// TODO: replace placeholder colors and logo mark with client brand after running /seo

export const alt = 'CLIENT_NAME'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleTouchIcon() {
  return new ImageResponse(
    <div
      style={{
        background: '#ffffff',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: 28,
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* TODO: replace with client logo mark SVG */}
        <div style={{ fontSize: 64, color: '#fff', fontWeight: 900, fontFamily: 'sans-serif' }}>
          C
        </div>
      </div>
    </div>,
    { ...size }
  )
}
