from django.contrib import admin, messages
from .models import (
    Service, ServiceTranslation,
    News, NewsTranslation,
    Promo, PromoTranslation,
    HotOffer, HotOfferTranslation,
    PortfolioItem, PortfolioItemImage, PortfolioItemTranslation,
    Review,
    Partner,
    CompanyInfo,
    LegalPage, LegalPageTranslation,
    CalendarEvent, CalendarEventTranslation, CalendarBooking,
    FloatTrip, FloatTripTranslation,
    HeroContent, HeroContentTranslation,
    AboutContent, AboutContentTranslation,
    AboutPageContent, AboutPageContentTranslation,
)


class ServiceTranslationInline(admin.TabularInline):
    model = ServiceTranslation
    extra = 0


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['slug', 'order', 'is_active']
    list_filter = ['is_active']
    list_editable = ['order', 'is_active']
    inlines = [ServiceTranslationInline]


class NewsTranslationInline(admin.TabularInline):
    model = NewsTranslation
    extra = 0


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['slug', 'order', 'is_published', 'created_at']
    list_filter = ['is_published']
    list_editable = ['order', 'is_published']
    inlines = [NewsTranslationInline]


class PromoTranslationInline(admin.TabularInline):
    model = PromoTranslation
    extra = 0


@admin.register(Promo)
class PromoAdmin(admin.ModelAdmin):
    list_display = ['slug', 'order', 'is_active']
    list_filter = ['is_active']
    inlines = [PromoTranslationInline]


def format_duration(seconds):
    """Секунды в строку ч:мм:сс (например 7140 -> 1:59:00)."""
    if seconds is None or seconds <= 0:
        return '—'
    try:
        seconds = int(seconds)
    except (TypeError, ValueError):
        return '—'
    if seconds <= 0:
        return '—'
    h = seconds // 3600
    m = (seconds % 3600) // 60
    s = seconds % 60
    if h > 0:
        return f'{h}:{m:02d}:{s:02d}'
    return f'{m}:{s:02d}'


def parse_duration(value):
    """Строка вида 1:59:00 или 59:00 -> секунды. Возвращает 0 при ошибке."""
    if not value or not str(value).strip():
        return 0
    parts = str(value).strip().split(':')
    try:
        if len(parts) == 1:
            return int(parts[0])
        if len(parts) == 2:
            return int(parts[0]) * 60 + int(parts[1])
        if len(parts) == 3:
            return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
    except (ValueError, TypeError):
        pass
    return 0


class HotOfferTranslationInline(admin.TabularInline):
    model = HotOfferTranslation
    extra = 0


from django import forms


class HotOfferAdminForm(forms.ModelForm):
    """Форма с полем «До конца акции» в формате ч:мм:сс (например 1:59:00)."""
    time_until_end = forms.CharField(
        label='До конца акции (ч:мм:сс)',
        required=False,
        help_text='Например: 1:59:00 или 59:00. Оставьте пустым, чтобы не показывать таймер.',
        max_length=20,
    )

    class Meta:
        model = HotOffer
        exclude = ['duration_seconds']  # задаётся через time_until_end (ч:мм:сс)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk and self.instance.duration_seconds:
            self.initial['time_until_end'] = format_duration(self.instance.duration_seconds)

    def save(self, commit=True):
        obj = super().save(commit=False)
        time_val = self.cleaned_data.get('time_until_end')
        if time_val is not None:
            obj.duration_seconds = parse_duration(time_val)
        if commit:
            obj.save()
        return obj


@admin.register(HotOffer)
class HotOfferAdmin(admin.ModelAdmin):
    form = HotOfferAdminForm
    list_display = ['slug', 'order', 'is_active', 'delay_seconds', '_time_until_end']
    list_filter = ['is_active']
    inlines = [HotOfferTranslationInline]

    def _time_until_end(self, obj):
        try:
            sec = getattr(obj, 'duration_seconds', None)
            return format_duration(sec)
        except Exception:
            return '—'
    _time_until_end.short_description = 'До конца'


class PortfolioItemTranslationInline(admin.TabularInline):
    model = PortfolioItemTranslation
    extra = 0


class PortfolioItemImageInline(admin.TabularInline):
    model = PortfolioItemImage
    extra = 1


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    change_form_template = 'admin/content/portfolioitem/change_form.html'
    add_form_template = 'admin/content/portfolioitem/change_form.html'
    list_display = ['slug', 'event_date', 'order', 'is_pinned']
    list_filter = ['is_pinned']
    inlines = [PortfolioItemTranslationInline, PortfolioItemImageInline]

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        files = request.FILES.getlist('bulk_images')
        if files:
            max_order = (
                PortfolioItemImage.objects.filter(portfolio_item=obj)
                .order_by('-order')
                .values_list('order', flat=True)
                .first()
                or 0
            )
            added = 0
            for i, f in enumerate(files):
                if not f.content_type.startswith('image/'):
                    continue
                PortfolioItemImage.objects.create(
                    portfolio_item=obj,
                    image=f,
                    order=max_order + i + 1,
                )
                added += 1
            if added:
                messages.success(request, f'Загружено {added} фото.')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['author', 'rating', 'order', 'is_published']
    list_filter = ['is_published', 'rating']
    list_editable = ['order', 'is_published']


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'link', 'logo']
    list_editable = ['order']


class CalendarEventTranslationInline(admin.TabularInline):
    model = CalendarEventTranslation
    extra = 0


from django.http import HttpResponseRedirect
from django.urls import path, reverse
from django.shortcuts import render
from datetime import datetime, date, time, timedelta
from django.utils.dateparse import parse_time


def parse_times(value):
    """Парсит строку времени: "9:30, 11:00" или по строкам -> [(9,30), (11,0), ...]."""
    if not value or not str(value).strip():
        return []
    result = []
    for part in str(value).replace(',', '\n').split():
        part = part.strip()
        if not part:
            continue
        t = parse_time(part)
        if t:
            result.append(t)
        else:
            # пробуем 9:30 или 930
            try:
                if ':' in part:
                    h, m = part.split(':', 1)
                    result.append(time(int(h.strip()), int(m.strip())))
                else:
                    result.append(time(int(part[:2]), int(part[2:4]) if len(part) >= 4 else 0))
            except (ValueError, IndexError):
                pass
    return result


WEEKDAYS = [(i, ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i]) for i in range(7)]


@admin.register(CalendarEvent)
class CalendarEventAdmin(admin.ModelAdmin):
    list_display = ['date', '_time', 'float_trip', 'price', 'max_slots', '_available', 'is_active', 'order']
    list_filter = ['date', 'is_active', 'float_trip']
    list_editable = ['is_active', 'order', 'price', 'max_slots']
    date_hierarchy = 'date'
    inlines = [CalendarEventTranslationInline]
    change_list_template = 'admin/content/calendarevent/change_list.html'
    list_select_related = ['float_trip']
    fields = ['date', 'time', 'float_trip', 'price', 'max_slots', 'image', 'image_url', 'is_active', 'order']

    def _time(self, obj):
        return obj.time.strftime('%H:%M') if obj.time else '—'
    _time.short_description = 'Время'

    def _available(self, obj):
        return obj.get_available_slots()
    _available.short_description = 'Свободно мест'

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if obj.float_trip and not obj.translations.exists():
            for ft_t in obj.float_trip.translations.all():
                CalendarEventTranslation.objects.get_or_create(
                    calendar_event=obj,
                    locale=ft_t.locale,
                    defaults={'title': ft_t.title, 'long_desc': ft_t.description or ''},
                )

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path('bulk-create/', self.admin_site.admin_view(self.bulk_create_view), name='content_calendarevent_bulk_create'),
        ]
        return custom + urls

    def bulk_create_view(self, request):
        from .models import FloatTrip, CalendarEventTranslation

        float_trips = FloatTrip.objects.filter(is_active=True).order_by('order', 'id')
        form_data = {
            'float_trip': '',
            'date_from': '',
            'date_to': '',
            'weekdays': list(range(7)),
            'times': '9:30, 11:00, 13:30, 15:00',
            'price': '0',
            'max_slots': '20',
        }
        errors = []

        if request.method == 'POST':
            ft_val = request.POST.get('float_trip', '')
            try:
                form_data['float_trip'] = int(ft_val) if ft_val else ''
            except ValueError:
                form_data['float_trip'] = ''
            form_data['date_from'] = request.POST.get('date_from', '')
            form_data['date_to'] = request.POST.get('date_to', '')
            form_data['weekdays'] = [int(x) for x in request.POST.getlist('weekdays') if x.isdigit()]
            form_data['times'] = request.POST.get('times', '')
            form_data['price'] = request.POST.get('price', '0')
            form_data['max_slots'] = request.POST.get('max_slots', '20')

            errors = []
            if not form_data['float_trip']:
                errors.append('Выберите сплав.')
            try:
                date_from = datetime.strptime(form_data['date_from'], '%Y-%m-%d').date()
            except (ValueError, TypeError):
                errors.append('Некорректная дата «с».')
                date_from = None
            try:
                date_to = datetime.strptime(form_data['date_to'], '%Y-%m-%d').date()
            except (ValueError, TypeError):
                errors.append('Некорректная дата «по».')
                date_to = None
            if date_from and date_to and date_from > date_to:
                errors.append('Дата «с» не может быть позже даты «по».')
            if not form_data['weekdays']:
                errors.append('Выберите хотя бы один день недели.')
            times = parse_times(form_data['times'])
            if not times:
                errors.append('Укажите хотя бы одно время (например 9:30, 11:00).')
            try:
                price_val = float(form_data['price'])
            except (ValueError, TypeError):
                price_val = 0
            try:
                max_slots_val = max(1, int(form_data['max_slots']))
            except (ValueError, TypeError):
                max_slots_val = 20

            if not errors:
                float_trip = FloatTrip.objects.filter(pk=form_data['float_trip']).first()
                if not float_trip:
                    errors.append('Сплав не найден.')
                else:
                    created = 0
                    current = date_from
                    while current <= date_to:
                        if current.weekday() in form_data['weekdays']:
                            for t in times:
                                ev, was_created = CalendarEvent.objects.get_or_create(
                                    date=current,
                                    time=t,
                                    float_trip=float_trip,
                                    defaults={
                                        'price': price_val,
                                        'max_slots': max_slots_val,
                                        'is_active': True,
                                    },
                                )
                                if was_created:
                                    for loc in ['ru', 'be', 'en', 'pl', 'zh']:
                                        ft_t = float_trip.translations.filter(locale=loc).first()
                                        if ft_t:
                                            CalendarEventTranslation.objects.get_or_create(
                                                calendar_event=ev,
                                                locale=loc,
                                                defaults={'title': ft_t.title, 'long_desc': ft_t.description or ''},
                                            )
                                    created += 1
                        current += timedelta(days=1)

                    return render(request, 'admin/content/calendarevent/bulk_create.html', {
                        'float_trips': float_trips,
                        'form': form_data,
                        'weekdays': WEEKDAYS,
                        'created_count': created,
                        'errors': [],
                    })

        return render(request, 'admin/content/calendarevent/bulk_create.html', {
            'float_trips': float_trips,
            'form': form_data,
            'weekdays': WEEKDAYS,
            'created_count': None,
            'errors': errors if request.method == 'POST' else [],
        })


@admin.register(CalendarBooking)
class CalendarBookingAdmin(admin.ModelAdmin):
    list_display = ['calendar_event', 'name', 'email', 'participants_count', 'status', 'created_at']
    list_filter = ['status', 'calendar_event__date']
    search_fields = ['name', 'email']


class FloatTripTranslationInline(admin.TabularInline):
    model = FloatTripTranslation
    extra = 0


@admin.register(FloatTrip)
class FloatTripAdmin(admin.ModelAdmin):
    list_display = ['slug', 'distance_km', 'price_per_person', 'order', 'is_active']
    list_filter = ['is_active']
    list_editable = ['order', 'distance_km', 'price_per_person', 'is_active']
    fields = ['slug', 'image', 'image_url', 'video_url', 'distance_km', 'price_per_person', 'order', 'is_active', 'map_embed_url']
    inlines = [FloatTripTranslationInline]


class HeroContentTranslationInline(admin.TabularInline):
    model = HeroContentTranslation
    extra = 0


@admin.register(HeroContent)
class HeroContentAdmin(admin.ModelAdmin):
    list_display = ['__str__']
    inlines = [HeroContentTranslationInline]


class AboutContentTranslationInline(admin.StackedInline):
    model = AboutContentTranslation
    extra = 0


@admin.register(AboutContent)
class AboutContentAdmin(admin.ModelAdmin):
    list_display = ['__str__']
    inlines = [AboutContentTranslationInline]


class AboutPageContentTranslationInline(admin.StackedInline):
    model = AboutPageContentTranslation
    extra = 0


@admin.register(AboutPageContent)
class AboutPageContentAdmin(admin.ModelAdmin):
    list_display = ['__str__']
    inlines = [AboutPageContentTranslationInline]


class LegalPageTranslationInline(admin.StackedInline):
    model = LegalPageTranslation
    extra = 0


@admin.register(LegalPage)
class LegalPageAdmin(admin.ModelAdmin):
    list_display = ['page_key', 'get_title']
    list_filter = ['page_key']

    def get_title(self, obj):
        t = obj.translations.filter(locale='ru').first()
        return t.title if t else '—'
    get_title.short_description = 'Заголовок (ru)'

    inlines = [LegalPageTranslationInline]


@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'contact_email']
    fields = [
        'company_name', 'legal_address', 'office_address',
        'unp', 'okpo', 'bank_account', 'bank_institution',
        'trade_register', 'services_register', 'contact_email',
    ]


