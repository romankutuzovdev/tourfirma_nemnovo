export default function ContactsPage() {
  return (
    <section style={{ padding: '3rem 2rem', minHeight: '60vh' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <h1
          style={{
            marginBottom: '0.5rem',
            fontSize: '2.5rem',
            color: '#2c2c2c',
          }}
        >
          Контакты
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Свяжитесь с нами для подбора тура или консультации
        </p>
        <div
          style={{
            background: '#CDD0DB',
            borderRadius: 12,
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ marginBottom: '1rem', color: '#2c2c2c', fontSize: '1.2rem' }}>
            Контактная информация
          </h2>
          <p style={{ marginBottom: '0.75rem', color: '#333' }}>
            <strong>Телефон:</strong> +7 (xxx) xxx-xx-xx
          </p>
          <p style={{ marginBottom: '0.75rem', color: '#333' }}>
            <strong>Email:</strong> info@nemnovo.ru
          </p>
          <p style={{ marginBottom: '0.75rem', color: '#333' }}>
            <strong>Адрес:</strong> г. [Город], ул. [Улица], д. [Номер]
          </p>
          <p style={{ color: '#333' }}>
            <strong>Режим работы:</strong> Пн–Пт 9:00–19:00, Сб 10:00–16:00
          </p>
        </div>
        <div
          style={{
            background: '#F7B557',
            borderRadius: 12,
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h3 style={{ marginBottom: '0.5rem', color: '#2c2c2c' }}>
            Оставьте заявку
          </h3>
          <p style={{ color: '#333', marginBottom: '1rem', fontSize: '0.95rem' }}>
            Опишите желаемое направление и даты — мы перезвоним в течение часа
          </p>
          <a
            href="tel:+7XXXXXXXXXX"
            style={{
              display: 'inline-block',
              background: '#2c2c2c',
              color: '#fff',
              padding: '1rem 2rem',
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Позвонить
          </a>
        </div>
      </div>
    </section>
  );
}
