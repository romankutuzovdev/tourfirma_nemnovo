import { PageLayout } from '@/components/PageLayout'
import { AboutPageSection } from '@/components/AboutPageSection'
import { VideoSection } from '@/components/VideoSection'
import { fetchAboutPageContent } from '@/lib/api'

export default async function AboutPage() {
  const aboutContent = await fetchAboutPageContent('ru')
  return (
    <PageLayout hideBreadcrumbs simpleHomeLink>
      <AboutPageSection content={aboutContent} />
      <VideoSection />
    </PageLayout>
  )
}
