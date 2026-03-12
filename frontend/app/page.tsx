import { Hero } from '@/components/Hero'
import { AboutSection } from '@/components/AboutSection'
import { PromosSection } from '@/components/PromosSection'
import { CalendarSection } from '@/components/CalendarSection'
import { CertificateSection } from '@/components/CertificateSection'
import { FAQSection } from '@/components/FAQSection'
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
      <AboutSection content={aboutContent} />
      <CalendarSection />
      <PromosSection />
      <CertificateSection />
      <FAQSection />
      <PartnersSection />
    </>
  )
}
