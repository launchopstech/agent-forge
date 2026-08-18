import { ImageResponse } from 'next/og'

export const alt = 'Ploutos'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleTouchIcon() {
  return new ImageResponse(
    <div
      style={{
        background: '#FAF7F2',
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
          background: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(16,185,129,0.3)',
        }}
      >
        <div style={{ fontSize: 64, color: '#fff', fontWeight: 900, fontFamily: 'sans-serif' }}>
          Π
        </div>
      </div>
    </div>,
    { ...size }
  )
}
