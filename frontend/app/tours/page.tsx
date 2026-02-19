import Link from 'next/link';

const tours = [
  { id: 1, name: 'Турция, Анталья', price: '45 000 ₽', days: 7, desc: 'Пляжный отдых, всё включено' },
  { id: 2, name: 'Египет, Хургада', price: '55 000 ₽', days: 7, desc: 'Красное море, дайвинг' },
  { id: 3, name: 'ОАЭ, Дубай', price: '85 000 ₽', days: 7, desc: 'Шопинг, достопримечательности' },
  { id: 4, name: 'Таиланд, Пхукет', price: '95 000 ₽', days: 10, desc: 'Экзотика, пляжи, экскурсии' },
  { id: 5, name: 'Греция, Крит', price: '78 000 ₽', days: 7, desc: 'История, море, кухня' },
  { id: 6, name: 'Испания, Барселона', price: '92 000 ₽', days: 7, desc: 'Гауди, культура, море' },
];

export default function ToursPage() {
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
          Туры
        </h1>
        <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          Выберите направление для незабываемого путешествия
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {tours.map((tour) => (
            <div
              key={tour.id}
              style={{
                background: '#fff',
                border: '1px solid #CDD0DB',
                borderRadius: 12,
                padding: '1.5rem',
                transition: 'box-shadow 0.2s',
              }}
            >
              <h3 style={{ marginBottom: '0.5rem', color: '#2c2c2c', fontSize: '1.2rem' }}>
                {tour.name}
              </h3>
              <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1rem' }}>
                {tour.desc}
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div>
                  <span style={{ color: '#F7B557', fontWeight: 700, fontSize: '1.2rem' }}>
                    {tour.price}
                  </span>
                  <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                    / {tour.days} ночей
                  </span>
                </div>
                <Link
                  href="/contacts"
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#F7B557',
                    color: '#2c2c2c',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  Забронировать
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
