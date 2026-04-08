'use client'

import { useCallback } from 'react'

// Клиентский shim для `next-intl`.
// Держим минимальный набор строк, чтобы UI не отображал ключи.
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

  // cookie banner
  'cookie.text': 'Мы используем cookies для работы сайта и аналитики. Продолжая, вы соглашаетесь с',
  'cookie.link': 'политикой конфиденциальности',
  'cookie.accept': 'Принять',

  // floats
  'floatsSection.title': 'Сплавы',
  'floatsSection.empty': 'Пока нет сплавов.',
  'floatsSection.km': 'км',
  'floatsSection.priceFrom': 'от',
  'floatsSection.byr': 'BYN',
  'floatsSection.perPerson': 'чел.',
  'floatsSection.more': 'Подробнее',
  'floatsSection.notFound': 'Сплав не найден',
  'floatsSection.backToList': 'Вернуться к списку',
  'floatsSection.videoTitle': 'Видео со сплава',
  'floatsSection.mapTitle': 'Маршрут на карте',

  // footer
  'footer.copyright': 'НемновоТур',
  'footer.addressLabel': 'Адрес',
  'footer.address': 'Республика Беларусь, 230002 г. Гродно, ул. Богуцкого, 2/1',
  'footer.legalAddressLabel': 'Юридический адрес:',
  'footer.officeAddressLabel': 'Адрес офиса:',
  'footer.workingHours': 'Время работы',
  'footer.workingHoursValue': 'ПН-ПТ –  9:00-17:00\nСБ-ВС – Выходной',
  'footer.phone1Label': 'Администратор\nТурбазы',
  'footer.phone2Label': 'Специалист по туризму',
  'footer.emailLabel': 'Электронная почта',
  'footer.requisites': 'Реквизиты',
  'footer.unpLabel': 'УНП',
  'footer.okpoLabel': 'ОКПО',
  'footer.bankAccountLabel': 'р/с',
  'footer.privacy': 'Политика конфиденциальности',
  'footer.personalDataPolicy': 'Политика обработки персональных данных',
  'footer.cookiePolicy': 'Политика в отношении обработки cookie',
  'footer.publicOffer': 'Договор публичной оферты',
  'footer.howToGet': 'Как добраться',
}

export function useTranslations(namespace?: string) {
  return useCallback(
    (key: string) => {
      const fullKey = namespace ? `${namespace}.${key}` : key
      return RU[fullKey] ?? ''
    },
    [namespace]
  )
}

