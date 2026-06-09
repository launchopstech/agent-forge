import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    stars: 5,
    quote:
      "Sebastian and his team completely transformed our kitchen and living room. They were on time, on budget, and the quality of work is outstanding. We've already recommended Blue Stone to three of our neighbors.",
    name: 'Michael T.',
    location: 'Parsippany, NJ',
  },
  {
    stars: 5,
    quote:
      "We hired Blue Stone for a master bedroom addition and couldn't be happier. They handled permits, coordinated everything, and kept us updated every step of the way. Professional from day one.",
    name: 'Lisa & Dave R.',
    location: 'Rockaway, NJ',
  },
  {
    stars: 5,
    quote:
      'Honest, hardworking, and fair pricing. Sebastian showed up when he said he would and the crew treated our home with respect. The basement came out better than we imagined.',
    name: 'Carlos M.',
    location: 'Lake Hiawatha, NJ',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={16} fill="var(--gold)" color="var(--gold)" />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ padding: '96px 24px', background: 'var(--bg-alt)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto' }}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="eyebrow">What Clients Say</div>
          <h2 className="section-heading">Don&apos;t Take Our Word For It</h2>
        </div>

        {/* Cards */}
        <div
          className="testimonials-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28,
            marginBottom: 48,
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`reveal d${i + 1} testimonials-card`}
              style={{
                background: '#fff',
                borderRadius: 'var(--r-xl)',
                padding: '32px 28px',
                boxShadow: '0 2px 24px rgba(0,0,0,0.06)',
                border: '1px solid var(--border-sub)',
                position: 'relative',
              }}
            >
              {/* Big quote mark */}
              <div
                aria-hidden
                style={{
                  fontSize: '4rem',
                  lineHeight: 1,
                  color: 'var(--green-light)',
                  fontFamily: 'Georgia, serif',
                  fontWeight: 900,
                  position: 'absolute',
                  top: 16,
                  right: 24,
                }}
              >
                &ldquo;
              </div>

              <Stars count={t.stars} />

              <p
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-sub)',
                  lineHeight: 1.75,
                  marginBottom: 24,
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              <div>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>
                  {t.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.location}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div
          className="testimonials-proof"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 40,
            padding: '28px',
            background: '#fff',
            borderRadius: 'var(--r-lg)',
            border: '1px solid var(--border-sub)',
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: '4.9 / 5 on Google', detail: 'Google Reviews' },
            { label: 'Licensed & Insured', detail: 'NJ State Certified' },
            { label: '200+ Happy Clients', detail: 'Morris County & NJ' },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .testimonials-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .testimonials-card { padding: 20px 16px !important; }
          .testimonials-proof { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
        }
      `}</style>
    </section>
  )
}
