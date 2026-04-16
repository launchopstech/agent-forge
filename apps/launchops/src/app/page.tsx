import { Navbar } from '@/features/marketing/components/Navbar'
import { Hero } from '@/features/marketing/components/Hero'
import { ProofBar } from '@/features/marketing/components/ProofBar'
import { LogoMarquee } from '@/features/marketing/components/LogoMarquee'
import { Manifesto } from '@/features/marketing/components/Manifesto'
import { Services } from '@/features/marketing/components/Services'
import { Audience } from '@/features/marketing/components/Audience'
import { Process } from '@/features/marketing/components/Process'
import { Work } from '@/features/marketing/components/Work'
import { TechStack } from '@/features/marketing/components/TechStack'
import { Pricing } from '@/features/marketing/components/Pricing'
import { Faq } from '@/features/marketing/components/Faq'
import { CtaBand } from '@/features/marketing/components/CtaBand'
import { Contact } from '@/features/marketing/components/Contact'
import { Footer } from '@/features/marketing/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProofBar />
        <LogoMarquee />
        <Manifesto />
        <Services />
        <Audience />
        <Process />
        <Work />
        <TechStack />
        <Pricing />
        <Faq />
        <CtaBand />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
