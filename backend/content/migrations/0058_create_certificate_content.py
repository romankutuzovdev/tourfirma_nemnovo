from django.db import migrations


def create_certificate(apps, schema_editor):
    CertificateContent = apps.get_model('content', 'CertificateContent')
    CertificateContentTranslation = apps.get_model('content', 'CertificateContentTranslation')
    if CertificateContent.objects.exists():
        return
    cert = CertificateContent.objects.create()
    CertificateContentTranslation.objects.create(
        certificate=cert,
        locale='ru',
        title='Подарочный сертификат',
        content='',
    )


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0057_certificate_content'),
    ]

    operations = [
        migrations.RunPython(create_certificate, noop),
    ]
