import { HeroCarousel } from '@/components/HeroCarousel'
import { AboutSection } from '@/components/AboutSection'
import { VisaFreeSection } from '@/components/VisaFreeSection'
import { OffersSection } from '@/components/OffersSection'
import { ExcursionsSection } from '@/components/ExcursionsSection'
import { EventsCalendarSection } from '@/components/EventsCalendarSection'
import { GiftCertificateSection } from '@/components/GiftCertificateSection'
import { PromosSection } from '@/components/PromosSection'
import { PartnersSection } from '@/components/PartnersSection'
import { MapSection } from '@/components/MapSection'
import { HotOfferPopup } from '@/components/HotOfferPopup'
import { ChatBotPlaceholder } from '@/components/ChatBotPlaceholder'

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <AboutSection />
      <VisaFreeSection />
      <OffersSection />
      <ExcursionsSection />
      <EventsCalendarSection />
      <GiftCertificateSection />
      <PromosSection />
      <PartnersSection />
      <MapSection />
      <HotOfferPopup />
      <ChatBotPlaceholder />
    </>
  )
}
