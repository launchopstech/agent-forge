/* eslint-disable i18next/no-literal-string -- This client site ships English marketing copy only. */
import { ScrollReveal } from './ScrollReveal'

const works = [
  {
    real: true,
    category: 'Construction · New Jersey',
    title: 'Blue Stone Construction LLC',
    tagline: 'General contractor — full website, designed and delivered',
    description:
      'New website for a licensed general contractor serving Morris County, NJ. Custom design, mobile-first build, Google Business setup, and launch in under 2 weeks.',
    details: ['Custom website design', 'Mobile-first development', 'Google Business setup'],
    tags: ['Website', 'Google Business', 'Hosting'],
    availability: 'Delivered project · Public site currently unavailable',
    preview: {
      background: '#152235',
      accent: '#d6a85f',
      label: 'BLUE STONE',
      eyebrow: 'GENERAL CONTRACTING',
      headline: 'Built for Morris County',
    },
  },
  {
    real: false,
    category: 'Home Services · Google Ads',
    title: 'Local HVAC Company',
    tagline: 'Concept: turn urgent local searches into qualified calls',
    description:
      'A portfolio concept showing how an HVAC company could connect service-area pages, emergency-call messaging, and tracked Google Ads landing pages.',
    details: ['Emergency-service landing page', 'Service-area structure', 'Call tracking plan'],
    tags: ['Website', 'Google Ads', 'Local SEO'],
    availability: 'Concept project · No client results claimed',
    preview: {
      background: '#0b2630',
      accent: '#38bdf8',
      label: 'NORTHSTAR HVAC',
      eyebrow: '24/7 HEATING & COOLING',
      headline: 'Comfort starts with one call',
    },
  },
  {
    real: false,
    category: 'Trades · Local SEO',
    title: 'Roofing Contractor',
    tagline: 'Concept: build trust before the homeowner requests a quote',
    description:
      'A portfolio concept for a roofing contractor centered on proof, service-area relevance, project galleries, and a lower-friction estimate flow.',
    details: ['Trust-first homepage', 'Project gallery system', 'Local SEO content plan'],
    tags: ['Local SEO', 'Google Business', 'Content'],
    availability: 'Concept project · No client results claimed',
    preview: {
      background: '#2b1d17',
      accent: '#fb923c',
      label: 'RIDGELINE ROOFING',
      eyebrow: 'LOCAL ROOFING EXPERTS',
      headline: 'A stronger roof starts here',
    },
  },
]

export function WorkSection() {
  return (
    <section id="work" style={{ padding: '96px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <ScrollReveal>
          <div style={{ marginBottom: 56 }}>
            <div className="eyebrow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                width={11}
                height={11}
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              Our Work
            </div>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(1.8rem,3.2vw,2.6rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
                marginBottom: 14,
              }}
            >
              Work &amp; Concepts.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--sub)', lineHeight: 1.8, maxWidth: 520 }}>
              One delivered client project and two clearly labeled concepts that show how we think,
              structure, and design for local service businesses.
            </p>
          </div>
        </ScrollReveal>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}
          className="work-grid"
        >
          {works.map(
            (
              { real, category, title, tagline, description, details, tags, availability, preview },
              i
            ) => (
              <ScrollReveal key={title} delay={(i + 1) as 1 | 2 | 3}>
                <div
                  style={{
                    background: 'var(--bg-alt)',
                    border: real ? '1px solid rgba(16,185,129,.3)' : '1px solid var(--border)',
                    borderRadius: 'var(--r-xl)',
                    padding: '28px 26px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: real ? '0 0 40px rgba(16,185,129,.06)' : undefined,
                    transition: 'border-color .3s, transform .25s var(--ease)',
                  }}
                  className="work-card"
                >
                  <div
                    className="work-preview"
                    style={{ background: preview.background, color: '#fff' }}
                    aria-label={`Stylized preview for ${title}`}
                  >
                    <div className="work-preview-bar">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="work-preview-content">
                      <div className="work-preview-brand">{preview.label}</div>
                      <div className="work-preview-eyebrow" style={{ color: preview.accent }}>
                        {preview.eyebrow}
                      </div>
                      <div className="work-preview-heading">{preview.headline}</div>
                      <div className="work-preview-button" style={{ background: preview.accent }} />
                    </div>
                  </div>

                  {/* Category + representative badge row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 20,
                      flexWrap: 'wrap',
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: real ? 'var(--accent)' : 'var(--muted)',
                      }}
                    >
                      {category}
                    </span>
                    {!real && (
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          color: 'var(--muted)',
                          background: 'rgba(0,0,0,.05)',
                          border: '1px solid var(--border-sub)',
                          borderRadius: 99,
                          padding: '2px 8px',
                        }}
                      >
                        Concept build
                      </span>
                    )}
                    {real && (
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: 'var(--accent)',
                          background: 'rgba(16,185,129,.08)',
                          border: '1px solid rgba(16,185,129,.2)',
                          borderRadius: 99,
                          padding: '2px 8px',
                        }}
                      >
                        Client project
                      </span>
                    )}
                  </div>

                  {/* Title + tagline */}
                  <h3
                    className="font-serif"
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--text)',
                      marginBottom: 6,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--sub)',
                      marginBottom: 18,
                      lineHeight: 1.5,
                    }}
                  >
                    {tagline}
                  </p>

                  {/* Description (real card) */}
                  {description && (
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--sub)',
                        lineHeight: 1.75,
                        marginBottom: 20,
                        flex: 1,
                      }}
                    >
                      {description}
                    </p>
                  )}

                  {/* Project details */}
                  {details && (
                    <div
                      style={{
                        display: 'grid',
                        gap: 8,
                        marginBottom: 20,
                        flex: 1,
                      }}
                    >
                      {details.map((detail) => (
                        <div
                          key={detail}
                          style={{
                            background: 'var(--bg)',
                            border: '1px solid var(--border-sub)',
                            borderRadius: 'var(--r)',
                            padding: '9px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span>
                          <span
                            style={{ fontSize: '0.75rem', color: 'var(--sub)', lineHeight: 1.4 }}
                          >
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                      borderTop: '1px solid var(--border-sub)',
                      paddingTop: 16,
                      marginTop: 'auto',
                    }}
                  >
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: 'var(--sub)',
                          background: 'rgba(0,0,0,.03)',
                          border: '1px solid var(--border-sub)',
                          borderRadius: 99,
                          padding: '3px 9px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p style={{ marginTop: 16, fontSize: '0.72rem', color: 'var(--muted)' }}>
                    {availability}
                  </p>
                </div>
              </ScrollReveal>
            )
          )}
        </div>

        <p
          style={{
            marginTop: 28,
            fontSize: '0.75rem',
            color: 'var(--muted)',
            textAlign: 'center',
          }}
        >
          Previews are stylized portfolio summaries. Concept projects demonstrate strategy and
          design direction only; they are not client work and do not claim performance outcomes.
        </p>
      </div>
      <style>{`
        @media (max-width: 1024px) { .work-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 640px) { .work-grid { grid-template-columns: 1fr !important; } }
        .work-card:hover { transform: translateY(-3px); }
        .work-preview { border-radius: 12px; min-height: 176px; margin-bottom: 24px; overflow: hidden; position: relative; }
        .work-preview::after { content: ''; position: absolute; width: 160px; height: 160px; border: 1px solid rgba(255,255,255,.09); border-radius: 50%; right: -50px; bottom: -70px; }
        .work-preview-bar { height: 24px; padding: 0 10px; display: flex; align-items: center; gap: 4px; background: rgba(255,255,255,.07); }
        .work-preview-bar span { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.35); }
        .work-preview-content { padding: 16px 18px 20px; position: relative; z-index: 1; }
        .work-preview-brand { font-size: .55rem; letter-spacing: .14em; font-weight: 800; margin-bottom: 22px; }
        .work-preview-eyebrow { font-size: .46rem; letter-spacing: .12em; font-weight: 800; margin-bottom: 5px; }
        .work-preview-heading { max-width: 180px; font-family: var(--font-serif), Georgia, serif; font-size: 1.05rem; font-weight: 800; line-height: 1.12; }
        .work-preview-button { width: 60px; height: 15px; border-radius: 3px; margin-top: 12px; }
      `}</style>
    </section>
  )
}
