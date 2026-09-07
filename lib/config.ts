export const SITE_NAME = 'Роды и восстановление';

// Discount applied when a user buys all three courses as one bundle.
export const BUNDLE_DISCOUNT_PERCENT = 20;

export function bundlePriceCents(coursePricesCents: number[]): number {
  const total = coursePricesCents.reduce((sum, price) => sum + price, 0);
  return Math.round((total * (100 - BUNDLE_DISCOUNT_PERCENT)) / 100);
}

export function formatPrice(cents: number): string {
  return `${(cents / 100).toLocaleString('ru-RU')} ₽`;
}
