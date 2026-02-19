'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export function NewsletterSection() {
  const t = useTranslations()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch(`${API_BASE}/newsletter/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (res.ok) {
        setStatus('ok')
        setEmail('')
      } else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-16 bg-primary/10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="font-serif-legacy text-3xl font-semibold text-black mb-4">
          {t('newsletter.title') || 'Подпишитесь на рассылку'}
        </h2>
        <p className="font-sans text-black/80 mb-6 max-w-lg mx-auto">
          {t('newsletter.description') || 'Получайте анонсы туров и экскурсий на email.'}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('newsletter.placeholder') || 'email@example.com'}
            className="flex-1 px-4 py-3 rounded-lg border border-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 rounded-lg bg-primary text-black font-sans font-semibold hover:bg-primary/90 disabled:opacity-60"
          >
            {status === 'loading' ? (t('newsletter.sending') || '…') : (t('newsletter.submit') || 'Подписаться')}
          </button>
        </form>
        {status === 'ok' && <p className="mt-3 font-sans text-sm text-green-700">{t('newsletter.success') || 'Спасибо! Подписка оформлена.'}</p>}
        {status === 'error' && <p className="mt-3 font-sans text-sm text-red-600">{t('newsletter.error') || 'Ошибка. Попробуйте позже.'}</p>}
      </div>
    </section>
  )
}
