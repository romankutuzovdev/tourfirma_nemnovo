import { PageLayout } from '@/components/PageLayout'
import { fetchLegalPage } from '@/lib/api'
import { FloatDescription } from '@/components/FloatDescription'

export default async function ServiceContractPage() {
  const content = await fetchLegalPage('service-contract', 'ru')

  const title = content?.title || 'Договор услуг'
  const body = content?.content?.trim() || ''

  return (
    <PageLayout title={title} titlePrimary simpleHomeLink hideBreadcrumbs>
      <section className="pt-4 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {body ? (
            <FloatDescription text={body} className="text-black/80" />
          ) : (
            <p className="font-sans text-black/70">Содержание договора услуг будет добавлено.</p>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
