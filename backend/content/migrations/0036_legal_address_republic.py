# Add "Республика Беларусь" to legal_address if not present

from django.db import migrations


def add_republic_to_legal_address(apps, schema_editor):
    CompanyInfo = apps.get_model('content', 'CompanyInfo')
    prefix = 'Республика Беларусь, '
    for obj in CompanyInfo.objects.all():
        if obj.legal_address and not obj.legal_address.startswith('Республика Беларусь'):
            obj.legal_address = prefix + obj.legal_address
            obj.save()


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0035_float_trip_map_embed_textfield'),
    ]

    operations = [
        migrations.RunPython(add_republic_to_legal_address, noop),
    ]
