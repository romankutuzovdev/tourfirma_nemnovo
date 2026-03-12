# Fix duplicate "Беларусь." in Hero: title1 should be "Близкая. Незнакомая.", title2 "Беларусь."

from django.db import migrations


def fix_hero_titles(apps, schema_editor):
    HeroContentTranslation = apps.get_model('content', 'HeroContentTranslation')
    for t in HeroContentTranslation.objects.filter(locale='ru'):
        # If title1 contains "Беларусь" — split: title1 = "Близкая. Незнакомая.", title2 = "Беларусь."
        if t.title1 and 'Беларусь' in t.title1 and t.title1 != 'Беларусь.':
            t.title1 = 'Близкая. Незнакомая.'
            t.title2 = 'Беларусь.' if not t.title2 else t.title2
            t.save()


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0054_service_parent_hierarchy'),
    ]

    operations = [
        migrations.RunPython(fix_hero_titles, noop),
    ]
