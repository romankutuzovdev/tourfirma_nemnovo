import { Hero } from '@/components/Hero'
import { AboutSection } from '@/components/AboutSection'
import { PromosSection } from '@/components/PromosSection'
import { ServicesSection } from '@/components/ServicesSection'
import { CalendarSection } from '@/components/CalendarSection'
import { FAQSection } from '@/components/FAQSection'
import { FloatsSection } from '@/components/FloatsSection'
import { PartnersSection } from '@/components/PartnersSection'
import { fetchHeroContent, fetchAboutContent } from '@/lib/api'
export default async function HomePage() {
  const [heroContent, aboutContent] = await Promise.all([
    fetchHeroContent('ru'),
    fetchAboutContent('ru'),
  ])

  return (
    <>
      <Hero content={heroContent} />
      <CalendarSection />
      <FloatsSection />
      <AboutSection content={aboutContent} />
      <PromosSection />
      <ServicesSection />
      <FAQSection />
      <PartnersSection />
    </>
  )
}
