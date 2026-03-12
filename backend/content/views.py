import io
import zipfile
from urllib.request import urlopen

import json
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Service, News, Promo, HotOffer, PortfolioItem, Review, Partner, CompanyInfo, CalendarEvent, CalendarBooking, FloatTrip, HeroContent, LegalPage, AboutContent, AboutPageContent
from .serializers import (
    ServiceListSerializer,
    ServiceDetailSerializer,
    NewsListSerializer,
    NewsDetailSerializer,
    PromoListSerializer,
    PromoDetailSerializer,
    HotOfferListSerializer,
    PortfolioItemListSerializer,
    PortfolioItemDetailSerializer,
    _portfolio_image_urls,
    ReviewSerializer,
    PartnerSerializer,
    CompanyInfoSerializer,
    CalendarEventListSerializer,
    CalendarEventDetailSerializer,
    FloatTripListSerializer,
    FloatTripDetailSerializer,
    HeroContentSerializer,
    LegalPageSerializer,
    AboutContentSerializer,
    AboutPageContentSerializer,
)

VALID_LOCALES = {'ru', 'be', 'en', 'pl', 'zh'}


def get_locale(request):
    loc = request.query_params.get('locale', 'ru')
    return loc if loc in VALID_LOCALES else 'ru'


@api_view(['GET'])
def company_info(request):
    """Реквизиты компании для футера (одна запись)."""
    info = CompanyInfo.objects.first()
    if not info:
        return Response({
            'company_name': 'ООО «Немново Тур»',
            'legal_address': '',
            'office_address': '',
            'unp': '',
            'okpo': '',
            'bank_account': '',
            'bank_institution': '',
            'trade_register': '',
            'services_register': '',
            'contact_email': 'office@nemnovotour.by',
        })
    serializer = CompanyInfoSerializer(info)
    return Response(serializer.data)


@api_view(['GET'])
def service_list(request):
    locale = get_locale(request)
    qs = Service.objects.filter(is_active=True)
    serializer = ServiceListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def service_detail(request, slug):
    locale = get_locale(request)
    try:
        service = Service.objects.get(slug=slug, is_active=True)
    except Service.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = ServiceDetailSerializer(service, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def news_list(request):
    locale = get_locale(request)
    qs = News.objects.filter(is_published=True)
    serializer = NewsListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def news_detail(request, slug):
    locale = get_locale(request)
    try:
        news = News.objects.get(slug=slug, is_published=True)
    except News.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = NewsDetailSerializer(news, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def promo_list(request):
    locale = get_locale(request)
    qs = Promo.objects.filter(is_active=True)
    serializer = PromoListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def promo_detail(request, slug):
    locale = get_locale(request)
    try:
        promo = Promo.objects.get(slug=slug, is_active=True)
    except Promo.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = PromoDetailSerializer(promo, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def hot_offer_list(request):
    """Список активных горячих предложений для попапа (по одному показывают через 5 сек)."""
    locale = get_locale(request)
    qs = HotOffer.objects.filter(is_active=True)
    serializer = HotOfferListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def partner_list(request):
    """Список партнёров для блока «С кем мы сотрудничаем»."""
    qs = Partner.objects.all()
    serializer = PartnerSerializer(qs, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def review_list(request):
    """Список опубликованных отзывов для главной (автор, текст, оценка 1–5)."""
    qs = Review.objects.filter(is_published=True)
    serializer = ReviewSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def portfolio_list(request):
    locale = get_locale(request)
    qs = PortfolioItem.objects.all()
    serializer = PortfolioItemListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def portfolio_detail(request, slug):
    locale = get_locale(request)
    try:
        item = PortfolioItem.objects.get(slug=slug)
    except PortfolioItem.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = PortfolioItemDetailSerializer(item, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@csrf_exempt
@require_http_methods(['POST'])
def contact_submit(request):
    """Принимает JSON: type ('main'|'complaint'), name, email, message. Тестово письма уходят на CONTACT_TEST_EMAIL."""
    try:
        data = json.loads(request.body) if request.body else {}
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    form_type = data.get('type')
    if form_type not in ('main', 'complaint', 'hot_offer'):
        return JsonResponse({'error': 'type must be main, complaint or hot_offer'}, status=400)
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    message = (data.get('message') or '').strip()
    if not name or not email or not message:
        return JsonResponse({'error': 'name, email, message required'}, status=400)
    to_email = getattr(settings, 'CONTACT_TEST_EMAIL', 'roman.kutuzov.dev@gmail.com')
    subject_map = {'main': '[Заявка] Nemnovo Tour', 'complaint': '[Претензия/предложение] Nemnovo Tour', 'hot_offer': '[Горячее предложение] Nemnovo Tour'}
    subject = subject_map.get(form_type, '[Заявка] Nemnovo Tour')
    type_label = {'main': 'Заявка', 'complaint': 'Претензия/предложение', 'hot_offer': 'Горячее предложение'}.get(form_type, form_type)
    body = f"Тип: {type_label}\nИмя: {name}\nEmail: {email}\n\nСообщение:\n{message}"
    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=False,
        )
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'ok': True})


@api_view(['GET'])
def calendar_events_list(request):
    """Список событий календаря за месяц. Параметры: year, month, locale."""
    locale = get_locale(request)
    try:
        year = int(request.query_params.get('year', 0))
        month = int(request.query_params.get('month', 0))
    except (TypeError, ValueError):
        from django.utils import timezone
        now = timezone.now().date()
        year, month = now.year, now.month
    if not (1 <= month <= 12) or year < 2000 or year > 2100:
        from django.utils import timezone
        now = timezone.now().date()
        year, month = now.year, now.month
    from datetime import date
    from calendar import monthrange
    _, last_day = monthrange(year, month)
    start = date(year, month, 1)
    end = date(year, month, last_day)
    qs = CalendarEvent.objects.filter(date__gte=start, date__lte=end, is_active=True).select_related('float_trip', 'service').prefetch_related('translations')
    serializer = CalendarEventListSerializer(
        qs,
        many=True,
        context={'locale': locale, 'request': request},
    )
    return Response(serializer.data)


@api_view(['GET'])
def calendar_event_detail(request, pk):
    """Детали события в календаре."""
    locale = get_locale(request)
    try:
        ev = CalendarEvent.objects.select_related('float_trip', 'service').prefetch_related('translations').get(pk=pk, is_active=True)
    except CalendarEvent.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = CalendarEventDetailSerializer(ev, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def float_trip_list(request):
    """Список сплавов: название, километраж, цена."""
    locale = get_locale(request)
    qs = FloatTrip.objects.filter(is_active=True)
    serializer = FloatTripListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def float_trip_detail(request, slug):
    """Детали сплава: описание, точки маршрута для карты."""
    locale = get_locale(request)
    try:
        trip = FloatTrip.objects.get(slug=slug, is_active=True)
    except FloatTrip.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = FloatTripDetailSerializer(trip, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['POST'])
def calendar_event_book(request, pk):
    """Бронирование события: name, email, phone (опц.), participants_count."""
    try:
        ev = CalendarEvent.objects.get(pk=pk, is_active=True)
    except CalendarEvent.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    name = (request.data.get('name') or '').strip()
    email = (request.data.get('email') or '').strip()
    phone = (request.data.get('phone') or '').strip()
    participants_count = request.data.get('participants_count', 1)
    try:
        participants_count = max(1, int(participants_count))
    except (TypeError, ValueError):
        participants_count = 1
    if not name or not email:
        return Response({'error': 'name and email required'}, status=status.HTTP_400_BAD_REQUEST)
    available = ev.get_available_slots()
    if participants_count > available:
        return Response(
            {'error': f'Not enough slots. Available: {available}'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    booking = CalendarBooking.objects.create(
        calendar_event=ev,
        name=name,
        email=email,
        phone=phone,
        participants_count=participants_count,
        status='pending',
    )
    to_email = getattr(settings, 'CONTACT_TEST_EMAIL', 'roman.kutuzov.dev@gmail.com')
    subject = f'[Бронирование] {ev.date} — {name}'
    body = (
        f"Событие: {ev.date}\n"
        f"Имя: {name}\n"
        f"Email: {email}\n"
        f"Телефон: {phone}\n"
        f"Участников: {participants_count}\n"
    )
    try:
        send_mail(subject=subject, message=body, from_email=settings.DEFAULT_FROM_EMAIL, recipient_list=[to_email], fail_silently=False)
    except Exception:
        pass
    return Response({'ok': True, 'id': booking.id})


def portfolio_download(request, slug):
    """Скачать все фото мероприятия одним ZIP-архивом."""
    try:
        item = PortfolioItem.objects.get(slug=slug)
    except PortfolioItem.DoesNotExist:
        return HttpResponse('Not found', status=404)
    urls = _portfolio_image_urls(item, request)
    if not urls:
        return HttpResponse('Нет фото для скачивания', status=404)
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        for i, url in enumerate(urls):
            try:
                with urlopen(url, timeout=15) as r:
                    data = r.read()
                ext = '.jpg'
                if '.png' in url.lower():
                    ext = '.png'
                elif '.gif' in url.lower():
                    ext = '.gif'
                elif '.webp' in url.lower():
                    ext = '.webp'
                zf.writestr(f'{i + 1:03d}{ext}', data)
            except Exception:
                continue
    buf.seek(0)
    response = HttpResponse(buf.getvalue(), content_type='application/zip')
    response['Content-Disposition'] = f'attachment; filename="{slug}.zip"'
    return response


@api_view(['GET'])
def hero_content(request):
    """Контент главного блока (hero): картинка и переводы текстов."""
    locale = get_locale(request)
    obj = HeroContent.objects.prefetch_related('translations').first()
    if not obj:
        return Response({
            'image': None,
            'image_url': '',
            'badge': '',
            'title1': '',
            'title2': '',
            'subtitle': '',
        })
    serializer = HeroContentSerializer(obj, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def about_content(request):
    """Контент блока «О нас» на главной: заголовок и абзацы."""
    locale = get_locale(request)
    obj = AboutContent.objects.prefetch_related('translations').first()
    if not obj:
        return Response({'title': '', 'paragraphs': []})
    serializer = AboutContentSerializer(obj, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def about_page_content(request):
    """Контент страницы «О нас»: заголовок и абзацы (отдельно от главной)."""
    locale = get_locale(request)
    obj = AboutPageContent.objects.prefetch_related('translations').first()
    if not obj:
        return Response({'title': '', 'paragraphs': []})
    serializer = AboutPageContentSerializer(obj, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def legal_page(request, page_key):
    """Юридическая страница (privacy, cookie-policy)."""
    locale = get_locale(request)
    try:
        page = LegalPage.objects.prefetch_related('translations').get(page_key=page_key)
    except LegalPage.DoesNotExist:
        return Response({'detail': 'Not found'}, status=404)
    serializer = LegalPageSerializer(page, context={'locale': locale, 'request': request})
    return Response(serializer.data)


