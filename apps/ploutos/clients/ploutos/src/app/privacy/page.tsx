/* eslint-disable i18next/no-literal-string -- This client site ships English legal copy only. */
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Ploutos collects, uses, and protects information submitted through this website.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link href="/" className="legal-back">
          ← Back to Ploutos
        </Link>
        <p className="legal-kicker">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Effective August 20, 2026</p>

        <section>
          <h2>Information we collect</h2>
          <p>
            When you request a website review, we collect the information you provide, such as your
            name, business email, website address, and details about your marketing needs. We may
            also collect basic usage information through privacy-conscious website analytics.
          </p>
        </section>

        <section>
          <h2>How we use information</h2>
          <p>
            We use this information to respond to inquiries, prepare requested reviews and
            proposals, improve our website, prevent abuse, and operate our services. We do not sell
            personal information.
          </p>
        </section>

        <section>
          <h2>Service providers and retention</h2>
          <p>
            We may use hosting, analytics, and email-delivery providers to operate this website.
            They receive only the information needed to provide those services. We retain inquiry
            information only as long as reasonably necessary for business, security, and legal
            purposes.
          </p>
        </section>

        <section>
          <h2>Your choices</h2>
          <p>
            You may ask us to access, correct, or delete information you submitted by emailing{' '}
            <a href="mailto:admin@ploutos.llc">admin@ploutos.llc</a>.
          </p>
        </section>

        <section>
          <h2>Updates and contact</h2>
          <p>
            We may update this policy as our services change. The effective date above will reflect
            the latest revision. Questions can be sent to{' '}
            <a href="mailto:admin@ploutos.llc">admin@ploutos.llc</a>.
          </p>
        </section>
      </div>
    </main>
  )
}
