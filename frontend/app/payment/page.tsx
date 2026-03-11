import { PageLayout } from '@/components/PageLayout'
import { fetchLegalPage } from '@/lib/api'
import { FloatDescription } from '@/components/FloatDescription'

export default async function PaymentPage() {
  const content = await fetchLegalPage('payment', 'ru')

  const title = content?.title || 'Условия оплаты'
  const body = content?.content?.trim() || ''

  return (
    <PageLayout>
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight mb-8">
            {title}
          </h1>
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
