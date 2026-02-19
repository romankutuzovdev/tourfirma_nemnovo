const destinations = [
  {
    region: 'Европа',
    countries: ['Турция', 'Греция', 'Испания', 'Италия', 'Франция', 'Чехия'],
  },
  {
    region: 'Азия',
    countries: ['Таиланд', 'Вьетнам', 'Индия', 'Шри-Ланка', 'ОАЭ', 'Мальдивы'],
  },
  {
    region: 'Африка',
    countries: ['Египет', 'Тунис', 'Марокко', 'Кения', 'Танзания'],
  },
  {
    region: 'Америка',
    countries: ['Куба', 'Доминикана', 'Мексика', 'США', 'Канада'],
  },
];

export default function DestinationsPage() {
  return (
    <section style={{ padding: '3rem 2rem', minHeight: '60vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1
          style={{
            marginBottom: '0.5rem',
            fontSize: '2.5rem',
            color: '#2c2c2c',
          }}
        >
          Направления
        </h1>
        <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          Исследуйте мир с турфирмой Немново
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {destinations.map((dest) => (
            <div
              key={dest.region}
              style={{
                background: '#CDD0DB',
                borderRadius: 12,
                padding: '2rem',
                borderLeft: '4px solid #F7B557',
              }}
            >
              <h2
                style={{
                  marginBottom: '1rem',
                  color: '#2c2c2c',
                  fontSize: '1.4rem',
                }}
              >
                {dest.region}
              </h2>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                {dest.countries.map((country) => (
                  <span
                    key={country}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#fff',
                      borderRadius: 8,
                      color: '#2c2c2c',
                      fontWeight: 500,
                    }}
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
