# Data migration: создать страницы privacy, cookie-policy, payment если их нет

from django.db import migrations


def ensure_legal_pages(apps, schema_editor):
    LegalPage = apps.get_model('content', 'LegalPage')
    LegalPageTranslation = apps.get_model('content', 'LegalPageTranslation')

    pages_data = [
        ('privacy', 'Политика конфиденциальности', 'Информация о политике обработки персональных данных.'),
        ('cookie-policy', 'Политика в отношении cookie', 'Информация об использовании cookie.'),
        ('payment', 'Условия оплаты', 'Информация об условиях оплаты через WebPay будет добавлена в ближайшее время.'),
    ]

    for page_key, title_ru, content_ru in pages_data:
        page, created = LegalPage.objects.get_or_create(
            page_key=page_key,
            defaults={},
        )
        if created:
            LegalPageTranslation.objects.get_or_create(
                page=page,
                locale='ru',
                defaults={'title': title_ru, 'content': content_ru},
            )


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0048_legalpage_add_payment'),
    ]

    operations = [
        migrations.RunPython(ensure_legal_pages, noop),
    ]
