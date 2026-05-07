import { fetchFloatTripBySlug } from '@/lib/api'

type Props = {
  params: { slug: string }
}

export default async function Head({ params }: Props) {
  const trip = await fetchFloatTripBySlug(params.slug, 'ru')
  const title = trip?.seo_title?.trim() || trip?.title || 'Сплав не найден'
  const description =
    trip?.seo_description?.trim() ||
    trip?.description ||
    'Сплавы и активный отдых с Немново Тур.'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  )
}

