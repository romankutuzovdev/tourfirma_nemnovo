import os

from django.db.models.signals import post_save
from django.dispatch import receiver

from .image_optimization import OptimizeOptions, optimize_image_bytes, should_optimize
from .models import (
    AboutPageImage,
    CalendarEvent,
    CertificateContent,
    FloatTrip,
    HeroContent,
    HotOffer,
    News,
    Partner,
    PortfolioItem,
    PortfolioItemImage,
    Promo,
    Service,
)


def _optimize_field_file(instance, field_name: str):
    f = getattr(instance, field_name, None)
    if not f:
        return
    try:
        if not getattr(f, 'name', None):
            return
        path = f.path  # local filesystem (MEDIA_ROOT)
        if not path or not os.path.exists(path):
            return
        with open(path, 'rb') as fp:
            raw = fp.read()
        optimized, _fmt = optimize_image_bytes(
            filename=f.name,
            data=raw,
            options=OptimizeOptions(),
        )
        if not should_optimize(original_size=len(raw), optimized_size=len(optimized)):
            return
        tmp = path + '.opt_tmp'
        with open(tmp, 'wb') as fp:
            fp.write(optimized)
        os.replace(tmp, path)
    except Exception:
        # never break request/save flow
        return


@receiver(post_save, sender=Service)
def _opt_service(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=Promo)
def _opt_promo(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=PortfolioItem)
def _opt_portfolio(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=PortfolioItemImage)
def _opt_portfolio_img(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=Partner)
def _opt_partner(sender, instance, **kwargs):
    _optimize_field_file(instance, 'logo')


@receiver(post_save, sender=News)
def _opt_news(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=HotOffer)
def _opt_hot_offer(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=CalendarEvent)
def _opt_calendar(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=FloatTrip)
def _opt_float(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=HeroContent)
def _opt_hero(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=AboutPageImage)
def _opt_about_gallery(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')


@receiver(post_save, sender=CertificateContent)
def _opt_certificate(sender, instance, **kwargs):
    _optimize_field_file(instance, 'image')

