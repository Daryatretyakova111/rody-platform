import { createHmac, timingSafeEqual } from 'node:crypto';

const API_BASE = 'https://darya-erohina.getplatinum.ru/api/public/v2/pay';

export function isGetPlatinumConfigured(): boolean {
  return Boolean(process.env.GETPLATINUM_API_KEY);
}

function getApiKey(): string {
  const key = process.env.GETPLATINUM_API_KEY;
  if (!key) throw new Error('GETPLATINUM_API_KEY environment variable is not set');
  return key;
}

interface CreateOfferPaymentArgs {
  offerId: number;
  orderRef: string;
  userId: number;
  email: string;
  notificationUrl: string;
  successUrl: string;
  failUrl: string;
}

/**
 * Creates a payment page for one of the cabinet offers, tied to our order reference.
 * Returns the page URL and the amount (in kopecks) GetPlatinum will charge, taken from the offer.
 */
export async function createOfferPayment(args: CreateOfferPaymentArgs): Promise<{ url: string; amountCents: number }> {
  const response = await fetch(`${API_BASE}/init-payment-url-by-offer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      offerId: args.offerId,
      dealId: args.orderRef,
      clientParams: { clientId: String(args.userId), email: args.email },
      notificationUrl: args.notificationUrl,
      successUrl: args.successUrl,
      failUrl: args.failUrl,
    }),
  });

  const data = (await response.json().catch(() => null)) as {
    formUrl?: string;
    amount?: number;
    errorCode?: number;
    errorMessage?: string;
  } | null;

  if (!response.ok || !data?.formUrl || typeof data.amount !== 'number' || data.errorCode) {
    throw new Error(
      `GetPlatinum init-payment-url-by-offer failed (${response.status}): ${data?.errorMessage ?? 'no response body'}`
    );
  }
  return { url: data.formUrl, amountCents: data.amount };
}

/** Callback authenticity check: HMAC-SHA256 of the exact request body, keyed with the API key, upper-case hex. */
export function verifyChecksum(rawBody: string, receivedChecksum: string | null): boolean {
  if (!receivedChecksum) return false;
  const expected = createHmac('sha256', getApiKey()).update(rawBody).digest('hex').toUpperCase();
  const a = Buffer.from(expected);
  const b = Buffer.from(receivedChecksum);
  return a.length === b.length && timingSafeEqual(a, b);
}
