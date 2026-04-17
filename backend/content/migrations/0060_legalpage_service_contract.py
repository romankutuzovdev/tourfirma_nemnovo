from django.db import migrations, models


def ensure_service_contract_page(apps, schema_editor):
    LegalPage = apps.get_model('content', 'LegalPage')
    LegalPageTranslation = apps.get_model('content', 'LegalPageTranslation')

    page, _ = LegalPage.objects.get_or_create(
        page_key='service-contract',
        defaults={},
    )
    LegalPageTranslation.objects.get_or_create(
        page=page,
        locale='ru',
        defaults={
            'title': 'Договор услуг',
            'content': '<p>Содержание договора услуг будет добавлено в разделе администратора.</p>',
        },
    )


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ('content', '0059_merge_20260312_1522'),
    ]

    operations = [
        migrations.AlterField(
            model_name='legalpage',
            name='page_key',
            field=models.CharField(
                choices=[
                    ('privacy', 'Политика обработки персональных данных'),
                    ('cookie-policy', 'Политика в отношении обработки cookie'),
                    ('payment', 'Оплата'),
                    ('public-offer', 'Договор публичной оферты'),
                    ('service-contract', 'Договор услуг'),
                    ('agencies', 'Для агентств'),
                ],
                max_length=50,
                unique=True,
                verbose_name='Идентификатор',
            ),
        ),
        migrations.RunPython(ensure_service_contract_page, noop),
    ]
