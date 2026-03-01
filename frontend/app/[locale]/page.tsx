import { Hero } from '@/components/Hero'
import { AboutSection } from '@/components/AboutSection'
import { PromosSection } from '@/components/PromosSection'
import { ServicesSection } from '@/components/ServicesSection'
import { CalendarSection } from '@/components/CalendarSection'
import { FAQSection } from '@/components/FAQSection'
import { FloatsSection } from '@/components/FloatsSection'
import { PartnersSection } from '@/components/PartnersSection'
import { fetchHeroContent, fetchAboutContent } from '@/lib/api'
import type { Locale } from '@/lib/i18n'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [heroContent, aboutContent] = await Promise.all([
    fetchHeroContent(locale as Locale),
    fetchAboutContent(locale as Locale),
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
