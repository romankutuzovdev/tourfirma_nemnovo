import { Hero } from '@/components/Hero'
import { AboutSection } from '@/components/AboutSection'
import { PromosSection } from '@/components/PromosSection'
import { ServicesSection } from '@/components/ServicesSection'
import { CalendarSection } from '@/components/CalendarSection'
import { FAQSection } from '@/components/FAQSection'
import { FloatsSection } from '@/components/FloatsSection'
import { PartnersSection } from '@/components/PartnersSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <CalendarSection />
      <FloatsSection />
      <AboutSection />
      <PromosSection />
      <ServicesSection />
      <FAQSection />
      <PartnersSection />
    </>
  )
}
