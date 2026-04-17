'use client'

import { useTranslations } from 'next-intl'
import { AnimateOnScroll } from './AnimateOnScroll'
import { FloatVideoPlayer } from './FloatVideoPlayer'
import type { AboutPageContent } from '@/lib/api'

type Props = { content: AboutPageContent }

/** Видео и презентация на странице «О нас». Одно видео (YouTube) + ссылка на презентацию PDF. */
export function AboutMediaSection({ content }: Props) {
  const t = useTranslations('aboutPage')
  const hasVideo = !!content?.video_url?.trim()
  const presentationUrl = content?.presentation || content?.presentation_url || ''

  if (!hasVideo && !presentationUrl) return null

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {hasVideo && (
          <AnimateOnScroll variant="scale" delay={80}>
            <FloatVideoPlayer
              videoUrl={content.video_url}
              title={content.title || 'Видео'}
            />
          </AnimateOnScroll>
        )}

        {presentationUrl && (
          <AnimateOnScroll variant="fade-up" delay={hasVideo ? 120 : 80} className="mt-10 text-left">
            <a
              href={presentationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-primary hover:underline"
            >
              <span aria-hidden>📄</span>
              {t('downloadPresentation')}
            </a>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  )
}
