// Серверный shim для `next-intl/server`.
// Важно: без `'use client'`, иначе Dev-сборка App Router может падать.

const RU: Record<string, string> = {
  // nav
  'nav.home': 'Главная',
  'nav.menuOpen': 'Меню',
  'nav.services': 'Услуги',
  'nav.about': 'О нас',
  'nav.portfolio': 'Портфолио',
  'nav.reviews': 'Отзывы',
  'nav.contact': 'Контакты',
  'nav.promos': 'Акции',
  'nav.news': 'Новости',
  'nav.calendar': 'Календарь',
  'nav.floats': 'Сплавы',
  'nav.cabinet': 'Личный кабинет',
  'nav.more': 'Ещё',
  'nav.agencies': 'Для агентств',
  'nav.payment': 'Оплата',
  'nav.tourfirm': 'ТУРБАЗА',
  'nav.login': 'Войти',
  'nav.logout': 'Выйти',
  'nav.register': 'Регистрация',
  'nav.translateLabel': 'Язык страницы',

  // common
  'common.allServices': 'Все услуги',
  'common.otherFloats': 'Другие сплавы',

  // hero
  'hero.cta1': 'Услуги',
  'hero.cta2': 'Оставить заявку',

  // about
  'about.title': 'Активный отдых с турагентством «Немново Тур»!',
  'about.p1': 'Туристическая компания «Немново Тур» — это организация и проведение активного отдыха и путешествий.',
  'about.p2': 'Близкая. Незнакомая. Беларусь. Создавайте яркие воспоминания вместе с нами!',

  // calendar
  'calendarPage.title': 'Календарь событий',
  'calendarPage.empty': 'В этом месяце нет запланированных событий',
  'calendarPage.prevMonth': 'Предыдущий месяц',
  'calendarPage.nextMonth': 'Следующий месяц',
  'calendarPage.more': 'Подробнее',
  'calendarPage.book': 'Забронировать',

  // events
  'eventsSection.allEvents': 'Все события',

  // certificate
  'certificateSection.title': 'Подарочный сертификат',

  // footer
  'footer.cookiePolicy': 'Политика в отношении обработки cookie',
}

export async function getTranslations(namespace?: string) {
  return (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    return RU[fullKey] ?? ''
  }
}

