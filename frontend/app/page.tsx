import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      title: 'Туры по всему миру',
      description:
        'Широкий выбор направлений — от пляжного отдыха до экстремального туризма.',
      icon: '🌍',
    },
    {
      title: 'Выгодные цены',
      description:
        'Работаем напрямую с отелями и авиакомпаниями. Скидки и спецпредложения.',
      icon: '💰',
    },
    {
      title: 'Поддержка 24/7',
      description:
        'Помощь на всех этапах поездки. Консультации и решение любых вопросов.',
      icon: '📞',
    },
  ];

  const popularTours = [
    { name: 'Турция', price: 'от 45 000 ₽', days: '7-14 ночей' },
    { name: 'Египет', price: 'от 55 000 ₽', days: '7-14 ночей' },
    { name: 'ОАЭ', price: 'от 85 000 ₽', days: '7-10 ночей' },
    { name: 'Таиланд', price: 'от 95 000 ₽', days: '10-14 ночей' },
  ];

  return (
    <>
      <section
        style={{
          background: 'linear-gradient(135deg, #F7B557 0%, #f9c97a 100%)',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#2c2c2c',
              marginBottom: '1rem',
              fontWeight: 700,
            }}
          >
            Путешествия вашей мечты
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              color: '#333',
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}
          >
            Турфирма Немново подберёт идеальный тур для вас. Пляжный отдых, экскурсии,
            приключения — всё в одном месте.
          </p>
          <Link
            href="/tours"
            style={{
              display: 'inline-block',
              background: '#2c2c2c',
              color: '#fff',
              padding: '1rem 2rem',
              borderRadius: 8,
              fontWeight: 600,
              transition: 'background 0.2s',
            }}
          >
            Смотреть туры
          </Link>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              marginBottom: '3rem',
              fontSize: '2rem',
              color: '#2c2c2c',
            }}
          >
            Почему выбирают нас
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: '2rem',
                  background: '#CDD0DB',
                  borderRadius: 12,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '0.75rem', color: '#2c2c2c' }}>{f.title}</h3>
                <p style={{ color: '#555', lineHeight: 1.6 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', background: '#CDD0DB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              marginBottom: '3rem',
              fontSize: '2rem',
              color: '#2c2c2c',
            }}
          >
            Популярные направления
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {popularTours.map((tour, i) => (
              <Link
                href="/tours"
                key={i}
                style={{
                  display: 'block',
                  padding: '1.5rem',
                  background: '#fff',
                  borderRadius: 12,
                  textAlign: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <h3 style={{ marginBottom: '0.5rem', color: '#2c2c2c' }}>{tour.name}</h3>
                <p style={{ color: '#F7B557', fontWeight: 700, fontSize: '1.1rem' }}>
                  {tour.price}
                </p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{tour.days}</p>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link
              href="/destinations"
              style={{
                color: '#F7B557',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Все направления →
            </Link>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, #F7B557 0%, #f9c97a 100%)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '2rem', color: '#2c2c2c' }}>
            Нужна консультация?
          </h2>
          <p style={{ color: '#333', marginBottom: '1.5rem' }}>
            Оставьте заявку — мы подберём тур под ваш бюджет и пожелания.
          </p>
          <Link
            href="/contacts"
            style={{
              display: 'inline-block',
              background: '#2c2c2c',
              color: '#fff',
              padding: '1rem 2rem',
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Связаться с нами
          </Link>
        </div>
      </section>
    </>
  );
}
