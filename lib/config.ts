export const SITE_NAME = 'Роды и восстановление';

// Fixed price for all three courses bought together as one bundle.
export const BUNDLE_PRICE_CENTS = 690000;

// GetPlatinum payment pages, keyed by course slug.
export const COURSE_PAYMENT_LINKS: Record<string, string> = {
  'podgotovka-k-rodam': 'https://darya-erohina.getplatinum.ru/payment/Y3GU1wY',
  rody: 'https://darya-erohina.getplatinum.ru/payment/KMKqebT',
  vosstanovlenie: 'https://darya-erohina.getplatinum.ru/payment/XCvXjfG',
};
export const BUNDLE_PAYMENT_LINK = 'https://darya-erohina.getplatinum.ru/payment/eybGcGX';

export function formatPrice(cents: number): string {
  return `${(cents / 100).toLocaleString('ru-RU')} ₽`;
}
