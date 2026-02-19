import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NextIntlClientProvider } from 'next-intl';

export const metadata: Metadata = {
  title: 'Турфирма Немново — Путешествия вашей мечты',
  description: 'Турфирма Немново — подбор и бронирование туров по всему миру. Отдых, экскурсии, приключения.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <NextIntlClientProvider>
          <LocaleProvider locale="ru" initialServices={[]} initialPromos={[]} initialPortfolio={[]} initialExcursions={[]}>
            <AuthProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </AuthProvider>
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
