'use client'

import { PageLayout } from '@/components/PageLayout'
import { ContactSection } from '@/components/ContactSection'
import { useTranslations } from 'next-intl'

export default function ContactPage() {
  const t = useTranslations()
  return (
    <PageLayout title={t('contact.title')} titlePrimary simpleHomeLink hideBreadcrumbs>
      <ContactSection hideTitle />
    </PageLayout>
  )
}
