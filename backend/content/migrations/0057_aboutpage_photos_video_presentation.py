# AboutPageContent: видео, презентация, галерея фото

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0056_servicetranslation_long_desc_ckeditor'),
    ]

    operations = [
        migrations.AddField(
            model_name='aboutpagecontent',
            name='video_url',
            field=models.URLField(
                blank=True,
                help_text='Ссылка на YouTube (youtube.com/watch?v=... или youtu.be/...). Только одно видео, как в сплавах.',
                verbose_name='Видео (YouTube)',
            ),
        ),
        migrations.AddField(
            model_name='aboutpagecontent',
            name='presentation',
            field=models.FileField(
                blank=True,
                null=True,
                upload_to='about/presentation/',
                help_text='PDF-файл презентации для скачивания',
                verbose_name='Презентация (PDF)',
            ),
        ),
        migrations.AddField(
            model_name='aboutpagecontent',
            name='presentation_url',
            field=models.URLField(
                blank=True,
                help_text='Если презентация размещена по ссылке (Google Drive и т.п.)',
                verbose_name='Ссылка на презентацию',
            ),
        ),
        migrations.CreateModel(
            name='AboutPageImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='about/gallery/')),
                ('image_url', models.URLField(blank=True, help_text='Если не загружаете файл')),
                ('order', models.PositiveIntegerField(default=0)),
                ('about_page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='content.aboutpagecontent')),
            ],
            options={
                'verbose_name': 'Фото «О нас»',
                'verbose_name_plural': 'Фото «О нас»',
                'ordering': ['order', 'id'],
            },
        ),
    ]
