# Generated manually

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0027_remove_hotoffer_image_url'),
    ]

    operations = [
        migrations.CreateModel(
            name='CalendarEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(verbose_name='Дата')),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='Цена (BYN)')),
                ('max_slots', models.PositiveIntegerField(default=20, verbose_name='Макс. мест')),
                ('image', models.ImageField(blank=True, null=True, upload_to='calendar/')),
                ('image_url', models.URLField(blank=True, help_text='Если нет загрузки')),
                ('is_active', models.BooleanField(default=True, verbose_name='Активно')),
                ('order', models.PositiveIntegerField(default=0)),
                ('event', models.ForeignKey(blank=True, help_text='Тип мероприятия (Марафон, Турслёт и т.д.). Необязательно.', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='calendar_events', to='content.event')),
            ],
            options={
                'verbose_name': 'Событие в календаре',
                'verbose_name_plural': 'События в календаре',
                'ordering': ['date', 'order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='CalendarEventTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('title', models.CharField(max_length=200, verbose_name='Заголовок')),
                ('short_desc', models.TextField(blank=True, verbose_name='Краткое описание')),
                ('calendar_event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.calendarevent')),
            ],
            options={
                'ordering': ['calendar_event', 'locale'],
                'unique_together': {('calendar_event', 'locale')},
            },
        ),
        migrations.CreateModel(
            name='CalendarBooking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='Имя')),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(blank=True, max_length=50, verbose_name='Телефон')),
                ('participants_count', models.PositiveIntegerField(default=1, verbose_name='Количество участников')),
                ('status', models.CharField(choices=[('pending', 'Ожидает'), ('confirmed', 'Подтверждено'), ('cancelled', 'Отменено')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('calendar_event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='content.calendarevent')),
            ],
            options={
                'verbose_name': 'Бронирование',
                'verbose_name_plural': 'Бронирования',
                'ordering': ['-created_at'],
            },
        ),
    ]
