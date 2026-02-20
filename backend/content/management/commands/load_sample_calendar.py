"""
Добавляет примерные события в календарь.
Запуск: python manage.py load_sample_calendar
"""
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from content.models import CalendarEvent, CalendarEventTranslation

LOCALES = ['ru', 'be', 'en', 'pl', 'zh']


class Command(BaseCommand):
    help = 'Загружает примерные события календаря'

    def handle(self, *args, **options):
        today = date.today()
        samples = [
            (today, {
                'ru': ('Событие сегодня', 'Подробное описание события: программа, расписание, что взять с собой. Участие по предварительной записи. Сбор группы в 10:00.'),
                'be': ('Падзея сёння', 'Поўнае апісанне: праграма, расклад, што ўзяць з сабой.'),
                'en': ('Event today', 'Full description: program, schedule, what to bring. Registration required.'),
                'pl': ('Wydarzenie dziś', 'Pełny opis: program, harmonogram, co zabrać.'),
                'zh': ('今日活动', '完整描述：计划、时间、携带物品。'),
            }, 10.00, 15),
            (today + timedelta(days=7), {
                'ru': ('Турслёт выходного дня', 'Программа: квесты по территории, ориентирование, костёр с гитарой, баня. Включено: питание, снаряжение. Группа до 30 человек. Суббота–воскресенье.'),
                'be': ('Турслёт выходнага дня', 'Праграма: квесты, касцёр, лазня. Уключана харчаванне.'),
                'en': ('Weekend tour camp', 'Program: quests, campfire, sauna. Meals and gear included. Saturday–Sunday.'),
                'pl': ('Obóz turystyczny weekendowy', 'Program: gry terenowe, ognisko, sauna. Posiłki w cenie.'),
                'zh': ('周末旅游营地', '活动安排：寻宝、篝火、桑拿。含餐。'),
            }, 25.00, 30),
            (today + timedelta(days=14), {
                'ru': ('Мастер-класс по рыбалке', 'Теория и практика: выбор снастей, наживка, техника заброса. Рыбалка на озере. Снасти предоставляются. Длительность 4 часа.'),
                'be': ('Майстар-клас па рыбалцы', 'Тэорыя і практыка: снасці, нажыўка. Рыбалка на возеры.'),
                'en': ('Fishing workshop', 'Theory and practice: tackle, bait, casting. Lake fishing. Gear provided. 4 hours.'),
                'pl': ('Warsztaty wędkarskie', 'Teoria i praktyka. Sprzęt zapewniony. 4 godziny.'),
                'zh': ('钓鱼课程', '理论与实践：鱼具、鱼饵、抛竿。湖钓。提供装备。4小时。'),
            }, 15.00, 10),
            (today + timedelta(days=21), {
                'ru': ('Корпоратив на природе', 'Программа: командные игры, веревочный курс, баня, ужин у костра. Минимум 10 человек. Трансфер от Гродно по запросу.'),
                'be': ('Капраратыў на прыродзе', 'Праграма: камандныя гульні, вяроўкавы курс, лазня. Ад 10 чалавек.'),
                'en': ('Corporate event in nature', 'Program: team games, rope course, sauna, dinner. Min 10 people. Transfer from Grodno on request.'),
                'pl': ('Impreza firmowa na łonie natury', 'Program: gry zespołowe, sauna, kolacja. Min. 10 osób.'),
                'zh': ('户外团建', '活动：团队游戏、绳索课程、桑拿、晚餐。10人起。'),
            }, 50.00, 20),
        ]
        for d, trans, price, slots in samples:
            ev = CalendarEvent.objects.create(
                date=d,
                price=price,
                max_slots=slots,
                is_active=True,
                order=0,
            )
            for loc in LOCALES:
                row = trans.get(loc, trans['ru'])
                title = row[0]
                long_desc = row[1]
                CalendarEventTranslation.objects.update_or_create(
                    calendar_event=ev,
                    locale=loc,
                    defaults={'title': title, 'long_desc': long_desc},
                )
        self.stdout.write(self.style.SUCCESS('Создано примерных событий календаря.'))
