'use client'

import { useState } from 'react'

const FILTERS = ['All', 'Remodels', 'Additions', 'New Construction', 'Exterior', 'Commercial']

const PROJECTS = [
  { title: 'Kitchen Remodel', location: 'Parsippany, NJ', category: 'Remodels' },
  { title: 'Master Suite Addition', location: 'Rockaway, NJ', category: 'Additions' },
  { title: 'Full Home Renovation', location: 'Denville, NJ', category: 'Remodels' },
  { title: 'Deck & Patio Build', location: 'Mount Olive, NJ', category: 'Exterior' },
  { title: 'Basement Finishing', location: 'Lake Hiawatha, NJ', category: 'Remodels' },
  { title: 'Commercial Office Build-Out', location: 'Morristown, NJ', category: 'Commercial' },
  { title: 'Bathroom Remodel', location: 'Jefferson Township, NJ', category: 'Remodels' },
  { title: 'Two-Story Addition', location: 'Randolph, NJ', category: 'Additions' },
  { title: 'New Home Construction', location: 'Wharton, NJ', category: 'New Construction' },
  { title: 'Exterior Siding & Roofing', location: 'Dover, NJ', category: 'Exterior' },
  { title: 'Garage Conversion', location: 'Boonton, NJ', category: 'Additions' },
  { title: 'Restaurant Renovation', location: 'Netcong, NJ', category: 'Commercial' },
]

export function PortfolioSection() {
  const [active, setActive] = useState('All')

  const visible = active === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === active)

  return (
    <section id="portfolio" style={{ padding: '96px 24px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="eyebrow">Our Work</div>
          <h2 className="section-heading">Projects We&apos;re Proud Of</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Every project tells a story. Here&apos;s a look at some of our recent work across New
            Jersey.
          </p>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 40,
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              style={{
                padding: '8px 20px',
                borderRadius: 99,
                fontSize: '0.85rem',
                fontWeight: 600,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: active === f ? 'var(--green)' : 'transparent',
                borderColor: active === f ? 'var(--green)' : 'var(--border-sub)',
                color: active === f ? '#fff' : 'var(--text-sub)',
                fontFamily: 'inherit',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          className="portfolio-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          {visible.map((p) => (
            <div
              key={`${p.title}-${p.location}`}
              style={{
                position: 'relative',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                aspectRatio: '4/3',
              }}
            >
              {/* Photo placeholder — replace with next/image when real photos available */}
              <div
                className="photo-placeholder"
                style={{ position: 'absolute', inset: 0 }}
                aria-label={`${p.title} — ${p.location}`}
              >
                {p.category}
              </div>

              {/* Hover overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(26,26,46,0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '20px',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = '1')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = '0')}
              >
                <div
                  style={{
                    display: 'inline-block',
                    background: 'var(--green)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: 99,
                    marginBottom: 8,
                    width: 'fit-content',
                  }}
                >
                  {p.category}
                </div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{p.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                  {p.location}
                </div>
              </div>

              {/* Always-visible label on mobile */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(26,26,46,0.9))',
                  padding: '24px 16px 14px',
                }}
                className="hide-desktop"
              >
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.875rem' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                  {p.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .portfolio-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .portfolio-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .portfolio-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
