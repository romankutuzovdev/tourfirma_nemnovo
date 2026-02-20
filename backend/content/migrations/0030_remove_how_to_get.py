# Remove How to Get feature

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0029_remove_event_and_calendar_event_fk'),
    ]

    operations = [
        migrations.DeleteModel(name='HowToGetRouteTranslation'),
        migrations.DeleteModel(name='HowToGetRoute'),
        migrations.RemoveField(
            model_name='companyinfo',
            name='destination_address',
        ),
        migrations.RemoveField(
            model_name='companyinfo',
            name='destination_gps_lat',
        ),
        migrations.RemoveField(
            model_name='companyinfo',
            name='destination_gps_lon',
        ),
    ]
