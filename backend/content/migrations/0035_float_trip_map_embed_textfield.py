# Use TextField for map_embed_url to avoid URL validation issues with Yandex embeds

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0034_float_trip_map_embed_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='floattrip',
            name='map_embed_url',
            field=models.TextField(
                blank=True,
                default='',
                help_text='URL из кода вставки Яндекс.Карт — атрибут src тега iframe (только ссылка, не весь iframe)',
                verbose_name='Ссылка на карту (iframe src)',
            ),
        ),
    ]
