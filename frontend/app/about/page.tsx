export default function AboutPage() {
  return (
    <section style={{ padding: '3rem 2rem', minHeight: '60vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1
          style={{
            marginBottom: '1rem',
            fontSize: '2.5rem',
            color: '#2c2c2c',
          }}
        >
          О турфирме
        </h1>
        <div
          style={{
            background: '#CDD0DB',
            borderRadius: 12,
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ marginBottom: '1rem', color: '#2c2c2c', fontSize: '1.3rem' }}>
            Кто мы
          </h2>
          <p style={{ color: '#333', lineHeight: 1.8, marginBottom: '1rem' }}>
            Турфирма Немново — это команда профессионалов, которая помогает путешественникам
            находить идеальные маршруты по всему миру. Мы работаем с проверенными отелями,
            авиакомпаниями и туроператорами, чтобы предложить вам лучшие условия.
          </p>
          <p style={{ color: '#333', lineHeight: 1.8 }}>
            Наша цель — сделать планирование поездки простым и приятным. Мы подберём тур
            под ваш бюджет, пожелания и сроки, организуем перелёт и проживание, поможем с
            визами и страховкой.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              background: '#F7B557',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2c2c2c' }}>10+</div>
            <div style={{ color: '#333', fontSize: '0.9rem' }}>лет опыта</div>
          </div>
          <div
            style={{
              padding: '1.5rem',
              background: '#F7B557',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2c2c2c' }}>50+</div>
            <div style={{ color: '#333', fontSize: '0.9rem' }}>направлений</div>
          </div>
          <div
            style={{
              padding: '1.5rem',
              background: '#F7B557',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2c2c2c' }}>1000+</div>
            <div style={{ color: '#333', fontSize: '0.9rem' }}>довольных клиентов</div>
          </div>
        </div>
      </div>
    </section>
  );
}
