from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0061_add_seo_fields_to_translations'),
    ]

    operations = [
        migrations.AddField(
            model_name='floattriptranslation',
            name='seo_description',
            field=models.TextField(
                blank=True,
                help_text='Рекомендуется 140-160 символов.',
                verbose_name='SEO описание (description)',
            ),
        ),
        migrations.AddField(
            model_name='floattriptranslation',
            name='seo_title',
            field=models.CharField(
                blank=True,
                help_text='Если пусто, используется обычный заголовок страницы.',
                max_length=255,
                verbose_name='SEO заголовок (title)',
            ),
        ),
    ]

