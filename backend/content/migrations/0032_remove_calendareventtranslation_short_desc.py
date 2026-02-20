# Remove short_desc from CalendarEventTranslation

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0031_calendareventtranslation_long_desc'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='calendareventtranslation',
            name='short_desc',
        ),
    ]
