'use client'

import { useState } from 'react'
import Image from 'next/image'

const FILTERS = ['All', 'Remodels', 'Additions', 'New Construction', 'Exterior', 'Commercial']

const PROJECTS = [
  {
    title: 'Kitchen Remodel',
    location: 'Parsippany, NJ',
    category: 'Remodels',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  },
  {
    title: 'Master Suite Addition',
    location: 'Rockaway, NJ',
    category: 'Additions',
    image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80',
  },
  {
    title: 'Full Home Renovation',
    location: 'Denville, NJ',
    category: 'Remodels',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
  },
  {
    title: 'Deck & Patio Build',
    location: 'Mount Olive, NJ',
    category: 'Exterior',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
  },
  {
    title: 'Basement Finishing',
    location: 'Lake Hiawatha, NJ',
    category: 'Remodels',
    image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80',
  },
  {
    title: 'Commercial Office Build-Out',
    location: 'Morristown, NJ',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  },
  {
    title: 'Bathroom Remodel',
    location: 'Jefferson Township, NJ',
    category: 'Remodels',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
  },
  {
    title: 'Two-Story Addition',
    location: 'Randolph, NJ',
    category: 'Additions',
    image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&q=80',
  },
  {
    title: 'New Home Construction',
    location: 'Wharton, NJ',
    category: 'New Construction',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  },
  {
    title: 'Exterior Siding & Roofing',
    location: 'Dover, NJ',
    category: 'Exterior',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
  },
  {
    title: 'Garage Conversion',
    location: 'Boonton, NJ',
    category: 'Additions',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    title: 'Restaurant Renovation',
    location: 'Netcong, NJ',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  },
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
              <Image
                src={p.image}
                alt={`${p.title} — ${p.location}`}
                fill
                sizes="(max-width: 540px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
              />

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
