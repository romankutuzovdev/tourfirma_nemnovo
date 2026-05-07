from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0063_service_orders_and_variants'),
    ]

    operations = [
        migrations.AlterField(
            model_name='serviceorderitem',
            name='service',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='order_items', to='content.service'),
        ),
        migrations.AddField(
            model_name='serviceorderitem',
            name='float_trip',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='order_items', to='content.floattrip'),
        ),
    ]
