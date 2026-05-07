from django.conf import settings
from django.db import models
from django_ckeditor_5.fields import CKEditor5Field

LOCALE_CHOICES = [
    ('ru', 'Русский'),
    ('be', 'Беларуская'),
    ('en', 'English'),
    ('pl', 'Polski'),
    ('zh', '中文'),
]

LEGAL_PAGE_CHOICES = [
    ('privacy', 'Политика обработки персональных данных'),
    ('cookie-policy', 'Политика в отношении обработки cookie'),
    ('payment', 'Оплата'),
    ('public-offer', 'Договор публичной оферты'),
    ('service-contract', 'Договор услуг'),
    ('agencies', 'Для агентств'),
]


class Service(models.Model):
    """Услуга: slug и изображение общие, тексты — по локалям в ServiceTranslation. Поддерживает иерархию через parent."""
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='children',
        verbose_name='Родительский раздел',
        help_text='Оставьте пустым для корневого раздела (Велопрогулки, Экскурсии и т.д.)'
    )
    slug = models.SlugField(max_length=120, unique=True)
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='Если нет загрузки файла')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField('Активно', default=True)
    price = models.DecimalField(
        'Цена',
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Цена услуги в BYN. Если пусто, можно выбрать цену через варианты.',
    )

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
    long_desc = CKEditor5Field(
        'Подробное описание',
        blank=True,
        config_name='default',
        help_text='Редактор с форматированием: шрифт, заголовки, списки, картинки. Для экскурсий и других услуг.'
    )
    seo_title = models.CharField(
        'SEO заголовок (title)',
        max_length=255,
        blank=True,
        help_text='Если пусто, используется обычный заголовок страницы.',
    )
    seo_description = models.TextField(
        'SEO описание (description)',
        blank=True,
        help_text='Рекомендуется 140-160 символов.',
    )

    class Meta:
        unique_together = [('service', 'locale')]
        ordering = ['service', 'locale']

    def __str__(self):
        return f'{self.service.slug} ({self.locale})'


class ServiceVariant(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField('Название', max_length=200)
    description = models.TextField('Описание', blank=True)
    price = models.DecimalField('Цена', max_digits=10, decimal_places=2, null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Вариант услуги'
        verbose_name_plural = 'Варианты услуг'

    def __str__(self):
        return f'{self.service.slug}: {self.name}'


class ServiceOrder(models.Model):
    STATUS_CHOICES = [
        ('new', 'Новый'),
        ('in_progress', 'В работе'),
        ('done', 'Завершён'),
        ('cancelled', 'Отменён'),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='service_orders',
        verbose_name='Пользователь',
    )
    customer_name = models.CharField('Имя заказчика', max_length=200)
    customer_email = models.EmailField('Email', blank=True)
    customer_phone = models.CharField('Телефон', max_length=50, blank=True)
    comment = models.TextField('Комментарий', blank=True)
    total_amount = models.DecimalField('Сумма заказа', max_digits=12, decimal_places=2, default=0)
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField('Создан', auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Заказ услуги'
        verbose_name_plural = 'Заказы услуг'

    def __str__(self):
        return f'Заказ #{self.id} — {self.customer_name}'


class ServiceOrderItem(models.Model):
    order = models.ForeignKey(ServiceOrder, on_delete=models.CASCADE, related_name='items')
    service = models.ForeignKey(Service, on_delete=models.PROTECT, related_name='order_items', null=True, blank=True)
    float_trip = models.ForeignKey('FloatTrip', on_delete=models.PROTECT, related_name='order_items', null=True, blank=True)
    variant_name = models.CharField('Вариант', max_length=200, blank=True)
    quantity = models.PositiveIntegerField('Количество', default=1)
    unit_price = models.DecimalField('Цена за единицу', max_digits=10, decimal_places=2)
    line_total = models.DecimalField('Сумма позиции', max_digits=12, decimal_places=2)

    class Meta:
        verbose_name = 'Позиция заказа услуги'
        verbose_name_plural = 'Позиции заказов услуг'

    def __str__(self):
        if self.service_id:
            return f'{self.service.slug} x{self.quantity}'
        if self.float_trip_id:
            return f'{self.float_trip.slug} x{self.quantity}'
        return f'item x{self.quantity}'


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
    seo_title = models.CharField(
        'SEO заголовок (title)',
        max_length=255,
        blank=True,
        help_text='Если пусто, используется обычный заголовок страницы.',
    )
    seo_description = models.TextField(
        'SEO описание (description)',
        blank=True,
        help_text='Рекомендуется 140-160 символов.',
    )

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
    seo_title = models.CharField(
        'SEO заголовок (title)',
        max_length=255,
        blank=True,
        help_text='Если пусто, используется обычный заголовок страницы.',
    )
    seo_description = models.TextField(
        'SEO описание (description)',
        blank=True,
        help_text='Рекомендуется 140-160 символов.',
    )

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
    """Событие в календаре: дата, время (опц.), цена, слоты. Можно привязать к сплаву (FloatTrip) или услуге (Service)."""
    date = models.DateField('Дата')
    time = models.TimeField('Время (опц.)', null=True, blank=True, help_text='Напр. 9:30, 11:00')
    float_trip = models.ForeignKey(
        'FloatTrip',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='calendar_events',
        verbose_name='Сплав',
        help_text='Если выбрано — название, описание и фото берутся из сплава',
    )
    service = models.ForeignKey(
        'Service',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='calendar_events',
        verbose_name='Услуга',
        help_text='Если выбрано — название и описание берутся из услуги',
    )
    price = models.DecimalField('Цена (BYN)', max_digits=10, decimal_places=2, default=0)
    max_slots = models.PositiveIntegerField('Макс. мест', default=20)
    image = models.ImageField(upload_to='calendar/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='Если нет загрузки')
    is_active = models.BooleanField('Активно', default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['date', 'time', 'order', 'id']
        verbose_name = 'Событие в календаре'
        verbose_name_plural = 'События в календаре'

    def __str__(self):
        t = self.translations.filter(locale='ru').first()
        title = t.title if (t and t.title) else None
        if not title and self.float_trip:
            ft_t = self.float_trip.translations.filter(locale='ru').first()
            title = ft_t.title if (ft_t and ft_t.title) else self.float_trip.slug
        if not title and self.service:
            s_t = self.service.translations.filter(locale='ru').first()
            title = s_t.title if (s_t and s_t.title) else self.service.slug
        time_str = f' {self.time.strftime("%H:%M")}' if self.time else ''
        return f'{self.date}{time_str} — {title or "event"}'

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
    """Сплав: название, километраж, цена, описание, картинка, карта, видео."""
    slug = models.SlugField(max_length=120, unique=True)
    image = models.ImageField('Изображение', upload_to='floats/', blank=True, null=True)
    image_url = models.URLField('URL изображения (если нет загрузки)', blank=True)
    is_active = models.BooleanField('Активно', default=True)
    video_url = models.URLField(
        'Видео',
        blank=True,
        help_text='Ссылка на YouTube (youtube.com/watch?v=... или youtube.com/embed/...), Vimeo (vimeo.com/...) или прямой URL видео (.mp4)',
    )
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
    description = CKEditor5Field('Описание', blank=True, config_name='default')
    seo_title = models.CharField(
        'SEO заголовок (title)',
        max_length=255,
        blank=True,
        help_text='Если пусто, используется обычный заголовок страницы.',
    )
    seo_description = models.TextField(
        'SEO описание (description)',
        blank=True,
        help_text='Рекомендуется 140-160 символов.',
    )

    class Meta:
        unique_together = [('float_trip', 'locale')]
        ordering = ['float_trip', 'locale']

    def __str__(self):
        return f'{self.float_trip} ({self.locale})'


class LegalPage(models.Model):
    """Информационная страница (политика, cookie, оплата). Одна запись на тип."""
    page_key = models.CharField(
        'Идентификатор',
        max_length=50,
        choices=LEGAL_PAGE_CHOICES,
        unique=True,
    )

    class Meta:
        verbose_name = 'Информационная страница'
        verbose_name_plural = 'Информационные страницы'

    def __str__(self):
        return self.get_page_key_display()


class LegalPageTranslation(models.Model):
    page = models.ForeignKey(LegalPage, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField('Заголовок', max_length=300)
    content = CKEditor5Field(
        'Содержание',
        blank=True,
        config_name='default',
        help_text='Можно вставлять картинки через кнопку «Изображение» в редакторе.',
    )
    seo_title = models.CharField(
        'SEO заголовок (title)',
        max_length=255,
        blank=True,
        help_text='Если пусто, используется обычный заголовок страницы.',
    )
    seo_description = models.TextField(
        'SEO описание (description)',
        blank=True,
        help_text='Рекомендуется 140-160 символов.',
    )

    class Meta:
        unique_together = [('page', 'locale')]
        ordering = ['page', 'locale']
        verbose_name = 'Перевод юридической страницы'
        verbose_name_plural = 'Переводы юридических страниц'

    def __str__(self):
        return f'{self.page} ({self.locale})'


class HeroContent(models.Model):
    """Контент главного блока (hero). Одна запись — картинка и переводы текстов."""
    image = models.ImageField(upload_to='hero/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='Если нет загрузки файла')

    class Meta:
        verbose_name = 'Главный блок (Hero)'
        verbose_name_plural = 'Главный блок (Hero)'

    def __str__(self):
        return 'Hero'


class HeroContentTranslation(models.Model):
    hero = models.ForeignKey(HeroContent, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    badge = models.CharField('Надпись-бейдж', max_length=200, blank=True)
    title1 = models.CharField('Заголовок строка 1', max_length=200, blank=True)
    title2 = models.CharField('Заголовок строка 2', max_length=200, blank=True)
    subtitle = models.TextField('Подзаголовок', blank=True)

    class Meta:
        unique_together = [('hero', 'locale')]
        ordering = ['hero', 'locale']
        verbose_name = 'Перевод Hero'
        verbose_name_plural = 'Переводы Hero'

    def __str__(self):
        return f'Hero ({self.locale})'


class AboutContent(models.Model):
    """Блок «О нас» на главной странице. Синглтон — одна запись."""

    class Meta:
        verbose_name = 'Блок «О нас» (главная)'
        verbose_name_plural = 'Блок «О нас» (главная)'

    def __str__(self):
        return 'О нас (главная)'


class AboutContentTranslation(models.Model):
    about = models.ForeignKey(AboutContent, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField('Заголовок', max_length=300, blank=True)
    paragraphs = models.TextField(
        'Текст (абзацы)',
        blank=True,
        help_text='Абзацы разделяются пустой строкой (\\n\\n).',
    )

    class Meta:
        unique_together = [('about', 'locale')]
        ordering = ['about', 'locale']
        verbose_name = 'Перевод блока «О нас»'
        verbose_name_plural = 'Переводы блока «О нас»'

    def __str__(self):
        return f'О нас ({self.locale})'


class AboutPageContent(models.Model):
    """Блок «О нас» на странице /about. Фото, видео (одно, ссылка YouTube), презентация."""
    video_url = models.URLField(
        'Видео (YouTube)',
        blank=True,
        help_text='Ссылка на YouTube (youtube.com/watch?v=... или youtu.be/...). Только одно видео, как в сплавах.',
    )
    presentation = models.FileField(
        'Презентация (PDF)',
        upload_to='about/presentation/',
        blank=True,
        null=True,
        help_text='PDF-файл презентации для скачивания',
    )
    presentation_url = models.URLField(
        'Ссылка на презентацию',
        blank=True,
        help_text='Если презентация размещена по ссылке (Google Drive и т.п.)',
    )

    class Meta:
        verbose_name = 'Страница «О нас»'
        verbose_name_plural = 'Страница «О нас»'

    def __str__(self):
        return 'О нас (страница)'


class AboutPageImage(models.Model):
    """Фото в галерее страницы «О нас»."""
    about_page = models.ForeignKey(
        AboutPageContent,
        on_delete=models.CASCADE,
        related_name='images',
    )
    image = models.ImageField(upload_to='about/gallery/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='Если не загружаете файл')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Фото «О нас»'
        verbose_name_plural = 'Фото «О нас»'

    def __str__(self):
        return f'О нас фото #{self.order}'


class AboutPageContentTranslation(models.Model):
    about_page = models.ForeignKey(AboutPageContent, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField('Заголовок', max_length=300, blank=True)
    paragraphs = models.TextField(
        'Текст (абзацы)',
        blank=True,
        help_text='Абзацы разделяются пустой строкой (\\n\\n).',
    )

    class Meta:
        unique_together = [('about_page', 'locale')]
        ordering = ['about_page', 'locale']
        verbose_name = 'Перевод страницы «О нас»'
        verbose_name_plural = 'Переводы страницы «О нас»'

    def __str__(self):
        return f'О нас страница ({self.locale})'


class CertificateContent(models.Model):
    """Подарочный сертификат: картинка для главной и страница с описанием из БД."""
    image = models.ImageField(upload_to='certificate/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='URL картинки, если не загружаете файл')

    class Meta:
        verbose_name = 'Подарочный сертификат'
        verbose_name_plural = 'Подарочный сертификат'

    def __str__(self):
        return 'Сертификат'


class CertificateContentTranslation(models.Model):
    certificate = models.ForeignKey(CertificateContent, on_delete=models.CASCADE, related_name='translations')
    locale = models.CharField(max_length=5, choices=LOCALE_CHOICES)
    title = models.CharField('Заголовок', max_length=300, blank=True)
    content = CKEditor5Field(
        'Описание',
        blank=True,
        config_name='default',
    )

    class Meta:
        unique_together = [('certificate', 'locale')]
        ordering = ['certificate', 'locale']

    def __str__(self):
        return f'Сертификат ({self.locale})'


class CompanyInfo(models.Model):
    """Одна запись — контактные/юридические данные для футера и страниц (редактируются в админке)."""
    company_name = models.CharField('Название', max_length=200, default='ООО «Немново Тур»')
    legal_address = models.TextField('Юридический адрес', blank=True)
    office_address = models.TextField('Адрес офиса', blank=True)
    unp = models.CharField('УНП', max_length=20, blank=True)
    okpo = models.CharField('ОКПО', max_length=30, blank=True)
    bank_account = models.CharField('р/с', max_length=50, blank=True, help_text='Расчётный счёт')
    bank_institution = models.CharField('Банк', max_length=200, blank=True, help_text='Напр.: в ЗАО «МТБанк», БИК MTBKBY22')
    state_registration = models.CharField('Свидетельство о госрегистрации', max_length=300, blank=True)
    trade_register = models.CharField('Регистрация в торговом реестре', max_length=200, blank=True)
    services_register = models.CharField('Регистрация в реестре бытовых услуг', max_length=200, blank=True)
    contact_email = models.EmailField('Email для контакта', blank=True, default='office@nemnovotour.by')

    class Meta:
        verbose_name = 'Реквизиты компании'
        verbose_name_plural = 'Реквизиты компании'

    def __str__(self):
        return self.company_name or 'Реквизиты'


