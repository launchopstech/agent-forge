import { NavBar } from '@/components/NavBar'
import { HeroSection } from '@/components/HeroSection'
import { TrustSection } from '@/components/TrustSection'
import { ServicesSection } from '@/components/ServicesSection'
import { ProcessSection } from '@/components/ProcessSection'
import { AiVisibilitySection } from '@/components/AiVisibilitySection'
import { ArchitectSection } from '@/components/ArchitectSection'
import { WorkSection } from '@/components/WorkSection'
import { PricingSection } from '@/components/PricingSection'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <TrustSection />
        <ServicesSection />
        <ProcessSection />
        <AiVisibilitySection />
        <ArchitectSection />
        <WorkSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
