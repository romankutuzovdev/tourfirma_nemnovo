# Replace map_points with map_embed_url for iframe

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0033_add_float_trip'),
    ]

    operations = [
        migrations.RemoveField(model_name='floattrip', name='map_points'),
        migrations.AddField(
            model_name='floattrip',
            name='map_embed_url',
            field=models.URLField(
                blank=True,
                help_text='URL из кода вставки Яндекс.Карт (атрибут src тега iframe)',
                verbose_name='Ссылка на карту (iframe src)',
            ),
        ),
    ]
