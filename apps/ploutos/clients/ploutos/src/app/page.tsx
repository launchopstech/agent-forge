import { NavBar } from '@/components/NavBar'
import { HeroSection } from '@/components/HeroSection'
import { TrustSection } from '@/components/TrustSection'
import { ServicesSection } from '@/components/ServicesSection'
import { ArchitectSection } from '@/components/ArchitectSection'
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
        <ArchitectSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
