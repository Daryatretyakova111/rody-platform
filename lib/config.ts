export const SITE_NAME = 'Роды и восстановление';

// Fixed price for all three courses bought together as one bundle.
export const BUNDLE_PRICE_CENTS = 570000;

// GetPlatinum offers ("Продажи" → "Предложения" in the cabinet): the buyer's receipt, payment page and
// the post-payment email text ("Материалы для покупателя") come from the offer.
export const COURSE_OFFER_IDS: Record<string, number> = {
  'podgotovka-k-rodam': 1,
  rody: 2,
  vosstanovlenie: 3,
};
export const BUNDLE_OFFER_ID = 4;

export const SUPPORT_URL = 'https://t.me/ErohinaDV';

export function formatPrice(cents: number): string {
  return `${(cents / 100).toLocaleString('ru-RU')} ₽`;
}
