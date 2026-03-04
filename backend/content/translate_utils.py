"""
Автоматический перевод текста при отсутствии локали.
Использует deep-translator (Google Translate) — бесплатно, без API-ключа.
Для продакшена: DEEPL_AUTH_KEY в .env для DeepL.
"""
import logging

from django.conf import settings

logger = logging.getLogger(__name__)


def _auto_translate_enabled():
    return getattr(settings, 'AUTO_TRANSLATE_MISSING', True)

# Маппинг наших локалей на коды Google/DeepL
LOCALE_TO_TRANSLATOR = {
    'ru': 'ru',
    'be': 'be',
    'en': 'en',
    'pl': 'pl',
    'zh': 'zh-CN',
}


def translate_text(text: str, target_locale: str, source_locale: str = 'ru') -> str:
    """
    Переводит текст из source_locale в target_locale.
    Возвращает оригинал при ошибке или пустом тексте.
    """
    if not text or not isinstance(text, str) or not text.strip():
        return text or ''
    if target_locale == source_locale:
        return text

    target = LOCALE_TO_TRANSLATOR.get(target_locale)
    source = LOCALE_TO_TRANSLATOR.get(source_locale)
    if not target or not source:
        return text

    try:
        auth_key = getattr(settings, 'DEEPL_AUTH_KEY', None)
        if auth_key:
            from deep_translator import DeeplTranslator
            result = DeeplTranslator(
                api_key=auth_key,
                source=source,
                target=target,
                use_free_api=not getattr(settings, 'DEEPL_PRO', False),
            ).translate(text=text)
        else:
            from deep_translator import GoogleTranslator
            result = GoogleTranslator(source=source, target=target).translate(text=text)
        return result if result else text
    except Exception as e:
        logger.warning('Auto-translate failed: %s', e)
        return text
