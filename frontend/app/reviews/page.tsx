'use client'

import { PageLayout } from '@/components/PageLayout'
import { ReviewsListSection } from '@/components/ReviewsListSection'
import { ComplaintFormSection } from '@/components/ComplaintFormSection'
import { useTranslations } from 'next-intl'

export default function ReviewsPage() {
  const t = useTranslations()

  return (
    <PageLayout title={t('contact.formComplaint')} titlePrimary simpleHomeLink hideBreadcrumbs>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <aside className="lg:sticky lg:top-24">
            <ComplaintFormSection hideTitle />
          </aside>
          <div className="min-w-0">
            <ReviewsListSection scrollable />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
