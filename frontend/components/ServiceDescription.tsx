'use client'

import { FloatDescription } from '@/components/FloatDescription'

/** Парсит legacy-формат: "Секция:\n• пункт1\n• пункт2" */
function parseServiceItems(text: string): { section?: string; items: string[] }[] {
  const blocks: { section?: string; items: string[] }[] = []
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  let current: { section?: string; items: string[] } = { items: [] }
  for (const line of lines) {
    if (line.startsWith('• ')) {
      current.items.push(line.slice(2).trim())
    } else {
      if (current.items.length > 0 || current.section) {
        blocks.push(current)
        current = { items: [] }
      }
      current.section = line.endsWith(':') ? line.slice(0, -1).trim() : line
    }
  }
  if (current.items.length > 0 || current.section) blocks.push(current)
  return blocks
}

function isHtml(text: string): boolean {
  return /<\/?[a-z][^>]*>/i.test(text)
}

export function ServiceDescription({ text }: { text: string }) {
  if (!text?.trim()) return null

  if (isHtml(text)) {
    return (
      <div className="mt-0">
        <FloatDescription
          text={text}
          className="service-description text-sm [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:first:mt-0 [&_h2]:text-base [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-sm [&_ul]:my-3 [&_ol]:my-3 [&_li]:mb-1"
        />
      </div>
    )
  }

  const blocks = parseServiceItems(text)
  return (
    <div className="mt-0 space-y-10">
      {blocks.map((block, i) => (
        <div key={i}>
          {block.section && (
            <h2 className="font-serif text-base font-medium text-black/90 mb-4">{block.section}</h2>
          )}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {block.items.map((item, j) => (
              <li
                key={j}
                className="flex items-center gap-3 p-4 md:p-5 bg-secondary/50 border border-secondary/10 rounded-lg font-sans text-sm text-black/90"
              >
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary/60" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
