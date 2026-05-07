import io
import zipfile
from urllib.request import urlopen
from decimal import Decimal

import json
from django.conf import settings
from django.db.models import Prefetch
from django.core.mail import send_mail
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Service, ServiceOrder, ServiceOrderItem, News, Promo, HotOffer, PortfolioItem, Review, Partner, CompanyInfo, CalendarEvent, CalendarBooking, FloatTrip, HeroContent, LegalPage, AboutContent, AboutPageContent, CertificateContent
from .serializers import (
    ServiceListSerializer,
    ServiceTreeSerializer,
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
    CertificateContentSerializer,
    ServiceOrderCreateSerializer,
    ServiceOrderSerializer,
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
    use_tree = request.query_params.get('tree') == '1'
    if use_tree:
        child_qs = Service.objects.filter(is_active=True).prefetch_related(
            Prefetch('children', queryset=Service.objects.filter(is_active=True).order_by('order', 'id'))
        )
        qs = Service.objects.filter(is_active=True, parent__isnull=True).prefetch_related(
            Prefetch('children', queryset=child_qs.order_by('order', 'id'))
        )
        serializer = ServiceTreeSerializer(qs, many=True, context={'locale': locale, 'request': request})
    else:
        qs = Service.objects.filter(is_active=True)
        serializer = ServiceListSerializer(qs, many=True, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def service_detail(request, slug):
    locale = get_locale(request)
    try:
        service = Service.objects.prefetch_related(
            'children', 'children__translations'
        ).get(slug=slug, is_active=True)
    except Service.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = ServiceDetailSerializer(service, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def service_order_create(request):
    try:
        data = json.loads(request.body) if request.body else {}
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    raw_items = data.get('items') if isinstance(data, dict) else None
    if isinstance(raw_items, list):
        normalized_items = []
        for it in raw_items:
            if not isinstance(it, dict):
                continue
            normalized_items.append({
                'service_slug': it.get('service_slug') or it.get('serviceSlug') or it.get('slug'),
                'float_slug': it.get('float_slug') or it.get('floatSlug'),
                'variant_name': it.get('variant_name') or it.get('variantName'),
                'quantity': it.get('quantity', 1),
            })
        data['items'] = normalized_items

    serializer = ServiceOrderCreateSerializer(data=data)
    if not serializer.is_valid():
        first_error = 'Invalid payload'
        details = serializer.errors
        for val in details.values():
            if isinstance(val, list) and val:
                first_error = str(val[0])
                break
        return JsonResponse({'error': first_error, 'details': details}, status=400)

    payload = serializer.validated_data
    items_payload = payload.get('items') or []
    if not items_payload:
        return JsonResponse({'error': 'items required'}, status=400)
    service_slugs = [it['service_slug'] for it in items_payload if it.get('service_slug')]
    float_slugs = [it['float_slug'] for it in items_payload if it.get('float_slug')]

    services = Service.objects.filter(slug__in=service_slugs, is_active=True).prefetch_related('variants')
    services_map = {s.slug: s for s in services}
    floats = FloatTrip.objects.filter(slug__in=float_slugs, is_active=True)
    floats_map = {f.slug: f for f in floats}

    missing_services = [s for s in service_slugs if s not in services_map]
    if missing_services:
        return JsonResponse({'error': f'Unknown services: {", ".join(missing_services)}'}, status=400)
    missing_floats = [s for s in float_slugs if s not in floats_map]
    if missing_floats:
        return JsonResponse({'error': f'Unknown float trips: {", ".join(missing_floats)}'}, status=400)

    total = Decimal('0')
    normalized = []
    for item in items_payload:
        svc_slug = item.get('service_slug')
        fl_slug = item.get('float_slug')
        variant_name = (item.get('variant_name') or '').strip()

        if svc_slug:
            svc = services_map[svc_slug]
            variant = None
            if svc.variants.exists():
                if not variant_name:
                    variant = svc.variants.filter(price__isnull=False).order_by('order', 'id').first()
                    if not variant:
                        return JsonResponse({'error': f'Service {svc.slug} requires variant selection'}, status=400)
                    variant_name = variant.name
                else:
                    variant = svc.variants.filter(name=variant_name).first()
                    if not variant:
                        return JsonResponse({'error': f'Variant "{variant_name}" not found for {svc.slug}'}, status=400)
                if variant.price is None:
                    return JsonResponse({'error': f'Variant "{variant_name}" has no price'}, status=400)
                unit_price = variant.price
            else:
                if svc.price is None:
                    return JsonResponse({'error': f'Service {svc.slug} has no price'}, status=400)
                unit_price = svc.price
            item_type = 'service'
            item_obj = svc
        else:
            fl = floats_map[fl_slug]
            unit_price = fl.price_per_person
            variant_name = ''
            item_type = 'float'
            item_obj = fl
        qty = int(item.get('quantity') or 1)
        line_total = unit_price * qty
        total += line_total
        normalized.append((item_type, item_obj, variant_name, qty, unit_price, line_total))

    customer_name = (payload.get('name') or '').strip()
    if not customer_name:
        customer_name = (request.user.get_full_name() or request.user.username or '').strip() or 'Пользователь'
    customer_email = (payload.get('email') or '').strip() or (getattr(request.user, 'email', '') or '').strip()

    order = ServiceOrder.objects.create(
        user=request.user,
        customer_name=customer_name,
        customer_email=customer_email,
        customer_phone=(payload.get('phone') or '').strip(),
        comment=(payload.get('comment') or '').strip(),
        total_amount=total,
    )
    for item_type, item_obj, variant_name, qty, unit_price, line_total in normalized:
        kwargs = {
            'order': order,
            'variant_name': variant_name,
            'quantity': qty,
            'unit_price': unit_price,
            'line_total': line_total,
        }
        if item_type == 'service':
            kwargs['service'] = item_obj
        else:
            kwargs['float_trip'] = item_obj
        ServiceOrderItem.objects.create(**kwargs)

    to_email = getattr(settings, 'CONTACT_TEST_EMAIL', 'roman.kutuzov.dev@gmail.com')
    body_lines = [
        'Источник: заказ услуг с сайта турфирмы nemnovotour.by',
        f'Имя: {order.customer_name}',
        f'Email: {order.customer_email}',
        f'Телефон: {order.customer_phone}',
        '',
        'Позиции:',
    ]
    for item_type, item_obj, variant_name, qty, unit_price, line_total in normalized:
        if item_type == 'service':
            title_t = item_obj.translations.filter(locale='ru').first()
            title = title_t.title if title_t else item_obj.slug
        else:
            title_t = item_obj.translations.filter(locale='ru').first()
            title = title_t.title if title_t else item_obj.slug
        label = f'- {title}'
        if variant_name:
            label += f' ({variant_name})'
        label += f' x{qty} = {line_total} BYN ({unit_price} BYN/шт)'
        body_lines.append(label)
    body_lines.extend(['', f'Итого: {order.total_amount} BYN', '', f'Комментарий: {order.comment or "—"}'])
    recipients = [to_email]
    if order.customer_email and '@' in order.customer_email:
        recipients.append(order.customer_email)
    try:
        send_mail(
            subject=f'[Заказ услуги] #{order.id} — {order.customer_name}',
            message='\n'.join(body_lines),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            fail_silently=False,
        )
    except Exception:
        pass

    out = ServiceOrderSerializer(order, context={'locale': 'ru', 'request': request})
    return JsonResponse({'ok': True, 'order': out.data})


@api_view(['GET', 'HEAD'])
@permission_classes([IsAuthenticated])
def service_order_list(request):
    qs = ServiceOrder.objects.prefetch_related('items__service', 'items__service__translations').filter(user=request.user)
    serializer = ServiceOrderSerializer(qs[:100], many=True, context={'locale': get_locale(request), 'request': request})
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
    body = (
        "Источник: заявка с сайта турфирмы nemnovotour.by\n"
        f"Тип: {type_label}\n"
        f"Имя: {name}\n"
        f"Email: {email}\n\n"
        f"Сообщение:\n{message}"
    )
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
    """Контент страницы «О нас»: заголовок, абзацы, фото, видео, презентация."""
    locale = get_locale(request)
    obj = AboutPageContent.objects.prefetch_related('translations', 'images').first()
    if not obj:
        return Response({
            'title': '', 'paragraphs': [],
            'images': [], 'video_url': '', 'presentation': None, 'presentation_url': '',
        })
    serializer = AboutPageContentSerializer(obj, context={'locale': locale, 'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def certificate_content(request):
    """Контент подарочного сертификата: картинка, заголовок, описание."""
    locale = get_locale(request)
    obj = CertificateContent.objects.prefetch_related('translations').first()
    if not obj:
        return Response({'image': None, 'image_url': '', 'title': '', 'content': ''})
    serializer = CertificateContentSerializer(obj, context={'locale': locale, 'request': request})
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


