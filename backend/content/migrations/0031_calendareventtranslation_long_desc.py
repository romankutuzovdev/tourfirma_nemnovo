# Add long_desc to CalendarEventTranslation

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0030_remove_how_to_get'),
    ]

    operations = [
        migrations.AddField(
            model_name='calendareventtranslation',
            name='long_desc',
            field=models.TextField(blank=True, verbose_name='Полное описание (страница подробнее)'),
        ),
    ]
