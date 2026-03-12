import { PageLayout } from '@/components/PageLayout'
import { fetchCertificateContent } from '@/lib/api'
import { FloatDescription } from '@/components/FloatDescription'

export default async function CertificatePage() {
  const content = await fetchCertificateContent('ru')

  const title = content?.title || 'Подарочный сертификат'
  const body = content?.content?.trim() || ''

  return (
    <PageLayout title={title} simpleHomeLink hideBreadcrumbs>
      <section className="pt-4 pb-12 md:pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {body ? (
            <FloatDescription text={body} className="text-black/80" />
          ) : (
            <p className="font-sans text-black/70">Описание подарочного сертификата будет добавлено.</p>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
