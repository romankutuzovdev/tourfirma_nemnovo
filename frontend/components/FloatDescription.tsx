'use client'

import DOMPurify from 'isomorphic-dompurify'
import { toAbsoluteMediaUrl } from '@/lib/api'

/** Рендерит описание сплава. CKEditor: HTML. Резерв: Markdown ![alt](url). */
export function FloatDescription({
  text,
  className = '',
  stripImages = false,
}: {
  text: string
  className?: string
  /** Если true, картинки убираются (для превью) */
  stripImages?: boolean
}) {
  if (!text?.trim()) return null

  const isHtml = /<\/?[a-z][^>]*>/i.test(text)

  if (isHtml) {
    let sanitized = DOMPurify.sanitize(text, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'h2', 'h3', 'img', 'figure', 'figcaption'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'class'],
    })
    // Преобразуем относительные /media/ URL в абсолютные для кросс-доменных запросов
    sanitized = sanitized.replace(
      /<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi,
      (_, before, src, after) => `<img${before}src="${toAbsoluteMediaUrl(src)}"${after}>`
    )
    if (stripImages) {
      sanitized = sanitized.replace(/<img[^>]*>/gi, '').replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '')
    }
    return (
      <div
        className={`float-description font-sans text-base text-black/90 leading-relaxed [&_figure]:my-6 [&_figure]:flex [&_figure]:flex-col [&_figure]:items-center [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-black/60 [&_p]:mb-3 [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:font-serif [&_h2]:text-xl [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-lg [&_a]:text-primary [&_a]:underline hover:[&_a]:no-underline ${stripImages ? 'line-clamp-3' : ''} ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    )
  }

  // Legacy: Markdown ![alt](url)
  if (stripImages) {
    const stripped = text.replace(/!\[[^\]]*\]\([^)]+\)/g, '').trim()
    if (!stripped) return null
    return (
      <p className={`font-sans text-base text-black/90 leading-relaxed line-clamp-3 whitespace-pre-line ${className}`}>
        {stripped}
      </p>
    )
  }

  const parts: React.ReactNode[] = []
  const regex = /!\[([^\]]*)\]\(([^)]+)\)/g
  let lastIndex = 0
  let m: RegExpExecArray | null

  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push(
        <span key={`t-${lastIndex}`} className="whitespace-pre-line">
          {text.slice(lastIndex, m.index)}
        </span>
      )
    }
    parts.push(
      <figure key={`img-${m.index}`} className="my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={m[2]}
          alt={m[1] || ''}
          className="w-full rounded-xl object-cover max-h-[400px] border border-secondary/20"
        />
        {m[1] && (
          <figcaption className="mt-2 text-center font-sans text-sm text-black/60">{m[1]}</figcaption>
        )}
      </figure>
    )
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`t-${lastIndex}`} className="whitespace-pre-line">
        {text.slice(lastIndex)}
      </span>
    )
  }

  return <div className={`font-sans text-base text-black/90 leading-relaxed ${className}`}>{parts}</div>
}
