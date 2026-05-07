import type { Metadata } from 'next'
import Image from 'next/image'
import { PageLayout } from '@/components/PageLayout'
import { AboutPageSection } from '@/components/AboutPageSection'
import { AboutPhotosSection } from '@/components/AboutPhotosSection'
import { AboutMediaSection } from '@/components/AboutMediaSection'
import { fetchAboutPageContent } from '@/lib/api'

export const metadata: Metadata = {
  title: 'О нас',
  description: 'История и команда Немново Тур, фото и видео о компании.',
}

export default async function AboutPage() {
  const aboutContent = await fetchAboutPageContent('ru')
  return (
    <PageLayout hideBreadcrumbs simpleHomeLink>
      <AboutPageSection content={aboutContent} />
      {aboutContent?.images && aboutContent.images.length > 0 && (
        <AboutPhotosSection images={aboutContent.images} />
      )}
      {(aboutContent?.video_url || aboutContent?.presentation || aboutContent?.presentation_url) && (
        <AboutMediaSection content={aboutContent} />
      )}
    </PageLayout>
  )
}
