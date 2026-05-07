from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0062_add_seo_fields_to_floattriptranslation'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='service',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Цена услуги в BYN. Если пусто, можно выбрать цену через варианты.', max_digits=10, null=True, verbose_name='Цена'),
        ),
        migrations.CreateModel(
            name='ServiceOrder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('customer_name', models.CharField(max_length=200, verbose_name='Имя заказчика')),
                ('customer_email', models.EmailField(blank=True, max_length=254, verbose_name='Email')),
                ('customer_phone', models.CharField(blank=True, max_length=50, verbose_name='Телефон')),
                ('comment', models.TextField(blank=True, verbose_name='Комментарий')),
                ('total_amount', models.DecimalField(decimal_places=2, default=0, max_digits=12, verbose_name='Сумма заказа')),
                ('status', models.CharField(choices=[('new', 'Новый'), ('in_progress', 'В работе'), ('done', 'Завершён'), ('cancelled', 'Отменён')], default='new', max_length=20, verbose_name='Статус')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='service_orders', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Заказ услуги',
                'verbose_name_plural': 'Заказы услуг',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ServiceVariant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='Название')),
                ('description', models.TextField(blank=True, verbose_name='Описание')),
                ('price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='Цена')),
                ('order', models.PositiveIntegerField(default=0)),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='variants', to='content.service')),
            ],
            options={
                'verbose_name': 'Вариант услуги',
                'verbose_name_plural': 'Варианты услуг',
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='ServiceOrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('variant_name', models.CharField(blank=True, max_length=200, verbose_name='Вариант')),
                ('quantity', models.PositiveIntegerField(default=1, verbose_name='Количество')),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Цена за единицу')),
                ('line_total', models.DecimalField(decimal_places=2, max_digits=12, verbose_name='Сумма позиции')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='content.serviceorder')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='order_items', to='content.service')),
            ],
            options={
                'verbose_name': 'Позиция заказа услуги',
                'verbose_name_plural': 'Позиции заказов услуг',
            },
        ),
    ]
