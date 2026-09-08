export const SITE_NAME = 'Роды и восстановление';

// Fixed price for all three courses bought together as one bundle.
export const BUNDLE_PRICE_CENTS = 690000;

export function formatPrice(cents: number): string {
  return `${(cents / 100).toLocaleString('ru-RU')} ₽`;
}
