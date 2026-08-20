/* eslint-disable i18next/no-literal-string -- This client site ships English legal copy only. */
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms governing use of the Ploutos website.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link href="/" className="legal-back">
          ← Back to Ploutos
        </Link>
        <p className="legal-kicker">Legal</p>
        <h1>Terms of Use</h1>
        <p className="legal-updated">Effective August 20, 2026</p>

        <section>
          <h2>Website information</h2>
          <p>
            This website provides general information about Ploutos and its services. It is not a
            binding service offer. Project scope, fees, timing, ownership, and responsibilities are
            established in a separate written agreement or proposal.
          </p>
        </section>

        <section>
          <h2>No performance guarantees</h2>
          <p>
            Marketing, advertising, search visibility, and business outcomes depend on factors
            outside our control. Examples and concept work illustrate capabilities and intended
            approaches, not guaranteed results.
          </p>
        </section>

        <section>
          <h2>Intellectual property</h2>
          <p>
            Unless otherwise stated, the Ploutos name, website design, copy, and original materials
            on this site belong to Ploutos LLC. Client ownership and licensing terms are defined in
            each signed project agreement.
          </p>
        </section>

        <section>
          <h2>External links</h2>
          <p>
            We are not responsible for third-party websites, services, availability, or content
            linked from this site. Links do not imply an endorsement unless explicitly stated.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about these terms can be sent to{' '}
            <a href="mailto:admin@ploutos.llc">admin@ploutos.llc</a>.
          </p>
        </section>
      </div>
    </main>
  )
}
