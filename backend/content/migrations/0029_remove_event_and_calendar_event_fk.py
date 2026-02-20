# Generated manually

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0028_add_calendar_events'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='calendarevent',
            name='event',
        ),
        migrations.DeleteModel(
            name='EventTranslation',
        ),
        migrations.DeleteModel(
            name='Event',
        ),
    ]
