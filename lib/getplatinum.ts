import { createHmac, timingSafeEqual } from 'node:crypto';

const API_BASE = 'https://darya-erohina.getplatinum.ru/api/public/v2/pay';

// Receipt categories from the GetPlatinum API docs (PositionDto.prefix).
export const POSITION_PREFIX_COURSE = 12;
export const POSITION_PREFIX_COURSE_SET = 17;

export function isGetPlatinumConfigured(): boolean {
  return Boolean(process.env.GETPLATINUM_API_KEY);
}

function getApiKey(): string {
  const key = process.env.GETPLATINUM_API_KEY;
  if (!key) throw new Error('GETPLATINUM_API_KEY environment variable is not set');
  return key;
}

interface CreatePaymentUrlArgs {
  orderRef: string;
  amountCents: number;
  productName: string;
  positionPrefix: number;
  userId: number;
  email: string;
  notificationUrl: string;
  successUrl: string;
  failUrl: string;
}

/** Asks GetPlatinum for a payment page for this order; the buyer is redirected to the returned URL. */
export async function createPaymentUrl(args: CreatePaymentUrlArgs): Promise<string> {
  const response = await fetch(`${API_BASE}/init-payment-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      dealId: args.orderRef,
      currency: 'RUB',
      amount: args.amountCents,
      positions: [
        {
          prefix: args.positionPrefix,
          name: args.productName,
          price: args.amountCents,
          quantity: 1,
          // Tax rate for the fiscal receipt — must match the organization's tax regime.
          vat: process.env.GETPLATINUM_VAT ?? 'none',
        },
      ],
      clientParams: { clientId: String(args.userId), email: args.email },
      notificationUrl: args.notificationUrl,
      successUrl: args.successUrl,
      failUrl: args.failUrl,
    }),
  });

  const data = (await response.json().catch(() => null)) as {
    formUrl?: string;
    errorCode?: number;
    errorMessage?: string;
  } | null;

  if (!response.ok || !data?.formUrl || data.errorCode) {
    throw new Error(
      `GetPlatinum init-payment-url failed (${response.status}): ${data?.errorMessage ?? 'no response body'}`
    );
  }
  return data.formUrl;
}

/** Callback authenticity check: HMAC-SHA256 of the exact request body, keyed with the API key, upper-case hex. */
export function verifyChecksum(rawBody: string, receivedChecksum: string | null): boolean {
  if (!receivedChecksum) return false;
  const expected = createHmac('sha256', getApiKey()).update(rawBody).digest('hex').toUpperCase();
  const a = Buffer.from(expected);
  const b = Buffer.from(receivedChecksum);
  return a.length === b.length && timingSafeEqual(a, b);
}
