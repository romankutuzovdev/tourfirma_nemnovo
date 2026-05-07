import type { Metadata } from 'next'
import { PageLayout } from '@/components/PageLayout'
import { fetchLegalPage } from '@/lib/api'
import { FloatDescription } from '@/components/FloatDescription'

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchLegalPage('payment', 'ru')
  return {
    title: content?.seo_title?.trim() || content?.title || 'Оплата',
    description: content?.seo_description?.trim() || 'Условия и способы оплаты услуг Немново Тур.',
  }
}

export default async function PaymentPage() {
  const content = await fetchLegalPage('payment', 'ru')

  const title = content?.title || 'Условия оплаты'
  const body = content?.content?.trim() || ''

  return (
    <PageLayout title={title} titlePrimary simpleHomeLink hideBreadcrumbs>
      <section className="pt-4 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {body ? (
            <FloatDescription text={body} className="text-black/80" />
          ) : (
            <p className="font-sans text-black/70">Информация об условиях оплаты будет добавлена.</p>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
