from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0027_remove_hotoffer_image_url'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExcursionCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=80, unique=True)),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Категория экскурсий',
                'verbose_name_plural': 'Категории экскурсий',
                'ordering': ['order', 'slug'],
            },
        ),
        migrations.CreateModel(
            name='Excursion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=120, unique=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='excursions/')),
                ('image_url', models.URLField(blank=True, help_text='Если нет загрузки файла')),
                ('order', models.PositiveIntegerField(default=0)),
                ('category_slug', models.SlugField(blank=True, help_text='Группа, напр. grodno-region, minsk-belarus', max_length=80)),
            ],
            options={
                'verbose_name': 'Экскурсия',
                'verbose_name_plural': 'Экскурсии',
                'ordering': ['category_slug', 'order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='ExcursionCategoryTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('name', models.CharField(max_length=200)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.excursioncategory')),
            ],
            options={
                'ordering': ['category', 'locale'],
                'unique_together': {('category', 'locale')},
            },
        ),
        migrations.CreateModel(
            name='ExcursionTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locale', models.CharField(choices=[('ru', 'Русский'), ('be', 'Беларуская'), ('en', 'English'), ('pl', 'Polski'), ('zh', '中文')], max_length=5)),
                ('title', models.CharField(max_length=200)),
                ('short_desc', models.TextField(blank=True)),
                ('long_desc', models.TextField(blank=True)),
                ('excursion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='content.excursion')),
            ],
            options={
                'ordering': ['excursion', 'locale'],
                'unique_together': {('excursion', 'locale')},
            },
        ),
    ]
