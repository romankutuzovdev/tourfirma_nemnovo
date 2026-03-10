'use client'

/**
 * Преобразует URL видео в embed-формат для iframe.
 * Поддерживает YouTube, Vimeo и прямые ссылки на .mp4.
 */
function getVideoEmbedUrl(url: string): { type: 'embed'; src: string } | { type: 'direct'; src: string } | null {
  if (!url?.trim()) return null
  const u = url.trim()

  // YouTube: watch?v=ID или youtu.be/ID или embed/ID
  const ytMatch = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) {
    return {
      type: 'embed',
      src: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`,
    }
  }

  // Vimeo: vimeo.com/ID или player.vimeo.com/video/ID
  const vimeoMatch = u.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/)
  if (vimeoMatch) {
    return {
      type: 'embed',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    }
  }

  // Прямая ссылка на видео (файл или любой HTTP URL)
  if (u.startsWith('http://') || u.startsWith('https://')) {
    return { type: 'direct', src: u }
  }

  return null
}

type Props = {
  videoUrl: string
  title: string
}

export function FloatVideoPlayer({ videoUrl, title }: Props) {
  const video = getVideoEmbedUrl(videoUrl)
  if (!video) return null

  return (
    <div className="rounded-xl overflow-hidden border border-secondary/20 bg-black shadow-lg">
      <div className="relative aspect-video w-full">
        {video.type === 'embed' ? (
          <iframe
            src={video.src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <video
            src={video.src}
            controls
            playsInline
            className="w-full h-full"
          >
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
        )}
      </div>
    </div>
  )
}
