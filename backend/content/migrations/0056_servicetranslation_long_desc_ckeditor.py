# ServiceTranslation.long_desc → CKEditor5Field (форматирование, шрифты для экскурсий и услуг)

from django.db import migrations
import django_ckeditor_5.fields


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0055_fix_hero_title_duplicate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='servicetranslation',
            name='long_desc',
            field=django_ckeditor_5.fields.CKEditor5Field(
                blank=True,
                config_name='default',
                help_text='Редактор с форматированием: шрифт, заголовки, списки, картинки. Для экскурсий и других услуг.',
                verbose_name='Подробное описание',
            ),
        ),
    ]
