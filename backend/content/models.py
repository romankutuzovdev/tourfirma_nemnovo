from django.db import models

LOCALE_CHOICES = [
    ('ru', 'Русский'),
    ('be', 'Беларуская'),
    ('en', 'English'),
    ('pl', 'Polski'),
    ('zh', '中文'),
]


class Service(models.Model):
    """Услуга: slug и изображение общие, тексты — по локалям в ServiceTranslation."""
    slug = models.SlugField(max_length=120, unique=True)
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='Если нет загрузки файла')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'

    def __str__(self):
        return self.slug


class ServiceTranslation(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=200)
    short_desc = models.TextField(blank=True)
    long_desc = models.TextField(
        help_text='Блоки: строка-заголовок (без буллета), ниже строки с «• » — пункты списка. Новая строка без «• » начинает следующий блок.'
    )

    class Meta:
        unique_together = [('service', 'locale')]
        ordering = ['service', 'locale']

    def __str__(self):
        return f'{self.service.slug} ({self.locale})'


class Promo(models.Model):
    """Акция: изображение и порядок общие, тексты — по локалям."""
    slug = models.SlugField(max_length=120, unique=True)
    image = models.ImageField(upload_to='promos/', blank=True, null=True)
    image_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Акция'
        verbose_name_plural = 'Акции'

    def __str__(self):
        return self.slug


class PromoTranslation(models.Model):
    promo = models.ForeignKey(Promo, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=200)
    short_desc = models.TextField(blank=True)
    long_desc = models.TextField(blank=True)

    class Meta:
        unique_together = [('promo', 'locale')]
        ordering = ['promo', 'locale']

    def __str__(self):
        return f'{self.promo.slug} ({self.locale})'


class PortfolioItem(models.Model):
    """Фотоотчёт с мероприятия: можно закреплять (is_pinned), порядок, галерея изображений."""
    slug = models.SlugField(max_length=120, unique=True)
    image = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    image_url = models.URLField(blank=True)
    image_urls = models.JSONField(default=list, blank=True, help_text='Список URL дополнительных фото (устаревшее — используйте «Фото» ниже)')
    event_date = models.DateField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_pinned = models.BooleanField(default=False, help_text='Закрепить блок выше остальных')

    class Meta:
        ordering = ['-is_pinned', 'order', '-event_date', 'id']
        verbose_name = 'Элемент портфолио'
        verbose_name_plural = 'Элементы портфолио'

    def __str__(self):
        return self.slug


class PortfolioItemImage(models.Model):
    """Одно фото в рамках мероприятия (можно загружать много через админку)."""
    portfolio_item = models.ForeignKey(PortfolioItem, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='portfolio/gallery/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='Если не загружаете файл')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f'{self.portfolio_item.slug} #{self.order}'


class PortfolioItemTranslation(models.Model):
    portfolio_item = models.ForeignKey(PortfolioItem, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = [('portfolio_item', 'locale')]
        ordering = ['portfolio_item', 'locale']

    def __str__(self):
        return f'{self.portfolio_item.slug} ({self.locale})'


class Review(models.Model):
    """Отзыв гостя: автор, текст, оценка 1–5 звёзд (как на Яндекс.Картах), порядок вывода."""
    author = models.CharField('Автор', max_length=200)
    text = models.TextField('Текст отзыва')
    rating = models.PositiveSmallIntegerField(
        'Оценка (звёзды)',
        default=5,
        choices=[(i, f'{i} из 5') for i in range(1, 6)],
    )
    order = models.PositiveIntegerField('Порядок', default=0)
    is_published = models.BooleanField('Опубликован', default=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'

    def __str__(self):
        return f'{self.author} — {self.rating}/5'


class Partner(models.Model):
    """Партнёр: название, логотип (загрузка файла в БД), ссылка на сайт, порядок."""
    name = models.CharField('Название', max_length=200)
    logo = models.ImageField('Логотип', upload_to='partners/', blank=True, null=True)
    link = models.URLField('Ссылка на сайт', blank=True)
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Партнёр'
        verbose_name_plural = 'Партнёры'

    def __str__(self):
        return self.name


class News(models.Model):
    """Новость: slug и изображение общие, тексты — по локалям в NewsTranslation."""
    slug = models.SlugField(max_length=120, unique=True)
    image = models.ImageField(upload_to='news/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='Если нет загрузки файла')
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at', 'order', 'id']
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'

    def __str__(self):
        return self.slug


class NewsTranslation(models.Model):
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=200)
    short_desc = models.TextField(blank=True)
    long_desc = models.TextField(blank=True, help_text='Полный текст новости')

    class Meta:
        unique_together = [('news', 'locale')]
        ordering = ['news', 'locale']

    def __str__(self):
        return f'{self.news.slug} ({self.locale})'


class HotOffer(models.Model):
    """Горячее предложение для всплывающего окна. Время до конца задаётся в формате ч:мм:сс (например 1:59:00)."""
    slug = models.SlugField(max_length=120, unique=True)
    image = models.ImageField(upload_to='hot_offers/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    delay_seconds = models.PositiveIntegerField(
        default=5,
        help_text='Через сколько секунд после захода на сайт показать попап',
    )
    duration_seconds = models.PositiveIntegerField(
        default=0,
        help_text='Время до конца акции в секундах (например 7140 = 1:59:00). 0 — таймер не показывать.',
    )

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Горячее предложение'
        verbose_name_plural = 'Горячие предложения'

    def __str__(self):
        return self.slug

    def get_valid_until(self):
        """Момент окончания акции для таймера (сейчас + duration_seconds)."""
        if not self.duration_seconds:
            return None
        from django.utils import timezone
        from datetime import timedelta
        return timezone.now() + timedelta(seconds=self.duration_seconds)


class HotOfferTranslation(models.Model):
    hot_offer = models.ForeignKey(HotOffer, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=200)
    short_desc = models.TextField(blank=True)
    button_text = models.CharField(max_length=100, blank=True, default='Подробнее')

    class Meta:
        unique_together = [('hot_offer', 'locale')]
        ordering = ['hot_offer', 'locale']

    def __str__(self):
        return f'{self.hot_offer.slug} ({self.locale})'


class CalendarEvent(models.Model):
    """Событие в календаре: дата, цена, слоты. Переводы в CalendarEventTranslation."""
    date = models.DateField('Дата')
    price = models.DecimalField('Цена (BYN)', max_digits=10, decimal_places=2, default=0)
    max_slots = models.PositiveIntegerField('Макс. мест', default=20)
    image = models.ImageField(upload_to='calendar/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='Если нет загрузки')
    is_active = models.BooleanField('Активно', default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['date', 'order', 'id']
        verbose_name = 'Событие в календаре'
        verbose_name_plural = 'События в календаре'

    def __str__(self):
        t = self.translations.filter(locale='ru').first()
        return f'{self.date} — {t.title if t else "event"}'

    def get_booked_slots(self):
        from django.db.models import Sum
        r = self.bookings.filter(status__in=('pending', 'confirmed')).aggregate(total=Sum('participants_count'))
        return r['total'] or 0

    def get_available_slots(self):
        return max(0, self.max_slots - self.get_booked_slots())


class CalendarEventTranslation(models.Model):
    calendar_event = models.ForeignKey(CalendarEvent, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField('Заголовок', max_length=200)
    long_desc = models.TextField('Полное описание (страница подробнее)', blank=True)

    class Meta:
        unique_together = [('calendar_event', 'locale')]
        ordering = ['calendar_event', 'locale']

    def __str__(self):
        return f'{self.calendar_event} ({self.locale})'


class CalendarBooking(models.Model):
    """Бронирование события в календаре."""
    STATUS_CHOICES = [
        ('pending', 'Ожидает'),
        ('confirmed', 'Подтверждено'),
        ('cancelled', 'Отменено'),
    ]
    calendar_event = models.ForeignKey(
        CalendarEvent,
        on_delete=models.CASCADE,
        related_name='bookings',
    )
    name = models.CharField('Имя', max_length=200)
    email = models.EmailField('Email')
    phone = models.CharField('Телефон', max_length=50, blank=True)
    participants_count = models.PositiveIntegerField('Количество участников', default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Бронирование'
        verbose_name_plural = 'Бронирования'

    def __str__(self):
        return f'{self.calendar_event.date} — {self.name}'


class FloatTrip(models.Model):
    """Сплав: название, километраж, цена за человека, описание, ссылка на карту."""
    slug = models.SlugField(max_length=120, unique=True)
    distance_km = models.DecimalField('Километраж (км)', max_digits=8, decimal_places=2, default=0)
    price_per_person = models.DecimalField('Цена за человека (BYN)', max_digits=10, decimal_places=2, default=0)
    order = models.PositiveIntegerField('Порядок', default=0)
    map_embed_url = models.TextField(
        'Ссылка на карту (iframe src)',
        blank=True,
        default='',
        help_text='URL из кода вставки Яндекс.Карт — атрибут src тега iframe (только ссылка, не весь iframe)',
    )

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Сплав'
        verbose_name_plural = 'Сплавы'

    def __str__(self):
        t = self.translations.filter(locale='ru').first()
        return t.title if t else self.slug


class FloatTripTranslation(models.Model):
    float_trip = models.ForeignKey(FloatTrip, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField('Название', max_length=200)
    description = models.TextField('Описание', blank=True)

    class Meta:
        unique_together = [('float_trip', 'locale')]
        ordering = ['float_trip', 'locale']

    def __str__(self):
        return f'{self.float_trip} ({self.locale})'


class CompanyInfo(models.Model):
    """Одна запись — контактные/юридические данные для футера и страниц (редактируются в админке)."""
    company_name = models.CharField('Название', max_length=200, default='ООО «Немново Тур»')
    legal_address = models.TextField('Юридический адрес', blank=True)
    office_address = models.TextField('Адрес офиса', blank=True)
    unp = models.CharField('УНП', max_length=20, blank=True)
    okpo = models.CharField('ОКПО', max_length=30, blank=True)
    state_registration = models.CharField('Свидетельство о госрегистрации', max_length=300, blank=True)
    trade_register = models.CharField('Регистрация в торговом реестре', max_length=200, blank=True)
    services_register = models.CharField('Регистрация в реестре бытовых услуг', max_length=200, blank=True)
    contact_email = models.EmailField('Email для контакта', blank=True, default='office@nemnovotour.by')

    class Meta:
        verbose_name = 'Реквизиты компании'
        verbose_name_plural = 'Реквизиты компании'

    def __str__(self):
        return self.company_name or 'Реквизиты'


