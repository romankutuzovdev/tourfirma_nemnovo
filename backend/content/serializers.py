from django.conf import settings as django_settings
from urllib.parse import quote
from rest_framework import serializers
from .translate_utils import translate_text, _auto_translate_enabled
from .models import (
    Service, ServiceTranslation,
    News, NewsTranslation,
    Promo, PromoTranslation,
    HotOffer, HotOfferTranslation,
    PortfolioItem, PortfolioItemImage, PortfolioItemTranslation,
    Review,
    Partner,
    CompanyInfo,
    CalendarEvent, CalendarEventTranslation, CalendarBooking,
    FloatTrip, FloatTripTranslation,
    HeroContent,
    LegalPage,
    AboutContent,
)


def _build_media_url(request, image_field):
    """Полный URL загруженного изображения. Путь всегда /media/ + name (name = news/file.png)."""
    if not image_field:
        return None
    name = (getattr(image_field, 'name', None) or '').strip().lstrip('/')
    if not name and hasattr(image_field, 'url'):
        try:
            raw = (image_field.url or '').strip().lstrip('/')
            if raw and not raw.startswith(('http://', 'https://')):
                prefix = django_settings.MEDIA_URL.strip('/')
                name = raw[len(prefix):].lstrip('/') if raw.startswith(prefix) else raw
        except Exception:
            pass
    if not name:
        return None
    media = django_settings.MEDIA_URL.strip('/')
    # Encode non-ASCII filenames (e.g. Cyrillic) to a valid URL path.
    path = '/' + media + '/' + quote(name, safe='/%')
    if request:
        return request.build_absolute_uri(path)
    return path


class ServiceTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceTranslation
        fields = ['locale', 'title', 'short_desc', 'long_desc']


class ServiceListSerializer(serializers.ModelSerializer):
    """Список услуг: один объект с полями перевода для запрошенной локали."""
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc']

    def _get_locale(self):
        return self.context.get('locale', 'ru')

    def _get_translation(self, obj):
        locale = self._get_locale()
        trans = obj.translations.filter(locale=locale).first()
        if trans:
            return trans
        ru = obj.translations.filter(locale='ru').first()
        if not ru or locale == 'ru':
            return ru
        if _auto_translate_enabled():
            try:
                trans = ServiceTranslation(
                    service=obj,
                    locale=locale,
                    title=translate_text(ru.title, locale),
                    short_desc=translate_text(ru.short_desc or '', locale),
                    long_desc=translate_text(ru.long_desc or '', locale),
                )
                trans.save()
                return trans
            except Exception:
                pass
        return ru

    def get_title(self, obj):
        t = self._get_translation(obj)
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = self._get_translation(obj)
        return t.short_desc if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


class ServiceDetailSerializer(serializers.ModelSerializer):
    """Одна услуга с полным переводом для локали."""
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    long_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc', 'long_desc']

    def _get_locale(self):
        return self.context.get('locale', 'ru')

    def _get_translation(self, obj):
        locale = self._get_locale()
        t = obj.translations.filter(locale=locale).first()
        if t:
            return t
        ru = obj.translations.filter(locale='ru').first()
        if not ru or locale == 'ru':
            return ru
        if _auto_translate_enabled():
            try:
                t = ServiceTranslation(
                    service=obj,
                    locale=locale,
                    title=translate_text(ru.title, locale),
                    short_desc=translate_text(ru.short_desc or '', locale),
                    long_desc=translate_text(ru.long_desc or '', locale),
                )
                t.save()
                return t
            except Exception:
                pass
        return ru

    def get_title(self, obj):
        t = self._get_translation(obj)
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = self._get_translation(obj)
        return t.short_desc if t else ''

    def get_long_desc(self, obj):
        t = self._get_translation(obj)
        return t.long_desc if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


def _locale_translation(queryset, locale):
    t = queryset.filter(locale=locale).first()
    return t or queryset.filter(locale='ru').first()


class NewsListSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S', read_only=True)

    class Meta:
        model = News
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc', 'created_at']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.short_desc if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


class NewsDetailSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    long_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S', read_only=True)

    class Meta:
        model = News
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc', 'long_desc', 'created_at']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.short_desc if t else ''

    def get_long_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.long_desc if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


class PromoListSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Promo
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.short_desc if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


class PromoDetailSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    long_desc = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Promo
        fields = ['slug', 'image', 'image_url', 'order', 'title', 'short_desc', 'long_desc']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.short_desc if t else ''

    def get_long_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.long_desc if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


class HotOfferListSerializer(serializers.ModelSerializer):
    """Горячее предложение для попапа: заголовок, описание, кнопка, картинка, ссылка, задержка, дата окончания."""
    title = serializers.SerializerMethodField()
    short_desc = serializers.SerializerMethodField()
    button_text = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    valid_until = serializers.SerializerMethodField()

    class Meta:
        model = HotOffer
        fields = ['slug', 'image', 'order', 'delay_seconds', 'valid_until', 'title', 'short_desc', 'button_text']

    def get_valid_until(self, obj):
        valid_until = obj.get_valid_until()
        if valid_until is None:
            return None
        return valid_until.isoformat()

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_short_desc(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.short_desc if t else ''

    def get_button_text(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return (t.button_text or 'Подробнее') if t else 'Подробнее'

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return None


class PortfolioItemListSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioItem
        fields = ['slug', 'image', 'image_url', 'image_urls', 'event_date', 'order', 'is_pinned', 'title', 'description']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_description(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.description if t else ''

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return (obj.image_url or None) if getattr(obj, 'image_url', None) else None


def _portfolio_image_urls(item, request):
    """Список URL всех фото: приоритет у загруженного image, затем image_url, image_urls, PortfolioItemImage."""
    urls = []
    if request:
        if item.image:
            u = _build_media_url(request, item.image)
            if u:
                urls.append(u)
        elif item.image_url:
            urls.append(item.image_url)
    if not urls and item.image_url:
        urls.append(item.image_url)
    urls.extend(item.image_urls or [])
    for img in item.images.all():
        if img.image and request:
            u = _build_media_url(request, img.image)
            if u:
                urls.append(u)
        elif img.image_url:
            urls.append(img.image_url)
    return urls


class PortfolioItemDetailSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioItem
        fields = ['slug', 'image', 'image_url', 'event_date', 'order', 'is_pinned', 'title', 'description', 'images']

    def get_title(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.title if t else obj.slug

    def get_description(self, obj):
        t = _locale_translation(obj.translations, self.context.get('locale', 'ru'))
        return t.description if t else ''

    def get_images(self, obj):
        return _portfolio_image_urls(obj, self.context.get('request'))


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'author', 'text', 'rating', 'order']


class PartnerSerializer(serializers.ModelSerializer):
    logo_display = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = ['id', 'name', 'logo_display', 'link', 'order']

    def get_logo_display(self, obj):
        return _build_media_url(self.context.get('request'), obj.logo) if obj.logo else None


class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = [
            'company_name', 'legal_address', 'office_address',
            'unp', 'okpo', 'state_registration', 'trade_register', 'services_register', 'contact_email',
        ]


class CalendarEventListSerializer(serializers.ModelSerializer):
    """Событие календаря для списка по месяцам."""
    title = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    available_slots = serializers.SerializerMethodField()
    price_display = serializers.SerializerMethodField()

    class Meta:
        model = CalendarEvent
        fields = [
            'id', 'date', 'title', 'image',
            'price', 'price_display', 'max_slots', 'available_slots', 'is_active',
        ]

    def _get_translation(self, obj):
        locale = self.context.get('locale', 'ru')
        t = obj.translations.filter(locale=locale).first()
        return t or obj.translations.filter(locale='ru').first()

    def get_title(self, obj):
        t = self._get_translation(obj)
        return t.title if t else str(obj.date)

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return obj.image_url or None

    def get_available_slots(self, obj):
        return obj.get_available_slots()

    def get_price_display(self, obj):
        return str(obj.price)


class CalendarEventDetailSerializer(CalendarEventListSerializer):
    """Детальная информация о событии в календаре (страница «подробнее»)."""
    long_desc = serializers.SerializerMethodField()

    class Meta(CalendarEventListSerializer.Meta):
        fields = CalendarEventListSerializer.Meta.fields + ['long_desc']

    def get_long_desc(self, obj):
        t = self._get_translation(obj)
        if not t:
            return ''
        return getattr(t, 'long_desc', '') or ''


class FloatTripListSerializer(serializers.ModelSerializer):
    """Сплав для списка: название, картинка, километраж, цена, slug."""
    title = serializers.SerializerMethodField()

    class Meta:
        model = FloatTrip
        fields = ['slug', 'title', 'image', 'image_url', 'distance_km', 'price_per_person', 'order']

    def _get_translation(self, obj):
        locale = self.context.get('locale', 'ru')
        t = obj.translations.filter(locale=locale).first()
        if t:
            return t
        ru = obj.translations.filter(locale='ru').first()
        if not ru:
            return None
        if locale == 'ru':
            return ru
        if _auto_translate_enabled():
            try:
                t = FloatTripTranslation(
                    float_trip=obj,
                    locale=locale,
                    title=translate_text(ru.title, locale),
                    description=translate_text(ru.description or '', locale),
                )
                t.save()
                return t
            except Exception:
                pass
        return ru

    def get_title(self, obj):
        t = self._get_translation(obj)
        return t.title if t else obj.slug


class FloatTripDetailSerializer(FloatTripListSerializer):
    """Сплав с полным описанием и ссылкой на карту."""
    description = serializers.SerializerMethodField()

    class Meta(FloatTripListSerializer.Meta):
        fields = FloatTripListSerializer.Meta.fields + ['description', 'map_embed_url']

    def get_description(self, obj):
        t = self._get_translation(obj)
        return t.description if t else ''


class HeroContentSerializer(serializers.ModelSerializer):
    """Контент главного блока: картинка и переводы badge/title1/title2/subtitle."""
    image = serializers.SerializerMethodField()
    badge = serializers.SerializerMethodField()
    title1 = serializers.SerializerMethodField()
    title2 = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()

    class Meta:
        model = HeroContent
        fields = ['image', 'image_url', 'badge', 'title1', 'title2', 'subtitle']

    def _get_translation(self, obj):
        locale = self.context.get('locale', 'ru')
        t = obj.translations.filter(locale=locale).first()
        return t or obj.translations.filter(locale='ru').first()

    def get_image(self, obj):
        if obj.image:
            return _build_media_url(self.context.get('request'), obj.image)
        return obj.image_url or None

    def get_badge(self, obj):
        t = self._get_translation(obj)
        return t.badge if t else ''

    def get_title1(self, obj):
        t = self._get_translation(obj)
        return t.title1 if t else ''

    def get_title2(self, obj):
        t = self._get_translation(obj)
        return t.title2 if t else ''

    def get_subtitle(self, obj):
        t = self._get_translation(obj)
        return t.subtitle if t else ''


class LegalPageSerializer(serializers.ModelSerializer):
    """Юридическая страница: заголовок и содержание для заданной локали."""
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    class Meta:
        model = LegalPage
        fields = ['page_key', 'title', 'content']

    def _get_translation(self, obj):
        locale = self.context.get('locale', 'ru')
        t = obj.translations.filter(locale=locale).first()
        return t or obj.translations.filter(locale='ru').first()

    def get_title(self, obj):
        t = self._get_translation(obj)
        return t.title if t else ''

    def get_content(self, obj):
        t = self._get_translation(obj)
        return t.content if t else ''


class AboutContentSerializer(serializers.ModelSerializer):
    """Блок «О нас»: заголовок и абзацы для заданной локали."""
    title = serializers.SerializerMethodField()
    paragraphs = serializers.SerializerMethodField()

    class Meta:
        model = AboutContent
        fields = ['title', 'paragraphs']

    def _get_translation(self, obj):
        locale = self.context.get('locale', 'ru')
        t = obj.translations.filter(locale=locale).first()
        return t or obj.translations.filter(locale='ru').first()

    def get_title(self, obj):
        t = self._get_translation(obj)
        return t.title if t else ''

    def get_paragraphs(self, obj):
        t = self._get_translation(obj)
        if not t or not t.paragraphs:
            return []
        return [p.strip() for p in t.paragraphs.split('\n\n') if p.strip()]
