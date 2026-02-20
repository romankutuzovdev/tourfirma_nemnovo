# Generated manually - FloatTrip model for rafting trips

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0032_remove_calendareventtranslation_short_desc'),
    ]

    operations = [
        migrations.CreateModel(
            name='FloatTrip',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=120, unique=True)),
                ('distance_km', models.DecimalField(decimal_places=2, default=0, max_digits=8, verbose_name='Километраж (км)')),
                ('price_per_person', models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='Цена за человека (BYN)')),
                ('order', models.PositiveIntegerField(default=0, verbose_name='Порядок')),
                ('map_points', models.JSONField(blank=True, default=list, help_text='Список точек [[широта, долгота], ...] для отрисовки маршрута на карте', verbose_name='Координаты маршрута (lat, lon)')),
            ],
            options={
                'verbose_name': 'Сплав',
                'verbose_name_plural': 'Сплавы',
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='FloatTripTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('title', models.CharField(max_length=200, verbose_name='Название')),
                ('description', models.TextField(blank=True, verbose_name='Описание')),
                ('float_trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.floattrip')),
            ],
            options={
                'ordering': ['float_trip', 'locale'],
                'unique_together': {('float_trip', 'locale')},
            },
        ),
    ]
