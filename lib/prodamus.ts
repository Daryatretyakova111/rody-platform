import { createHmac } from 'node:crypto';

/**
 * Integration with Продамус (payform.ru). Field names and the webhook
 * signature scheme below follow their public docs at integration time —
 * double-check against the actual shop's dashboard ("Настройки" →
 * "Результат оплаты") once real credentials are available, since Prodamus
 * lets each shop customize the notification format.
 */

function getShopDomain(): string {
  const domain = process.env.PRODAMUS_SHOP_DOMAIN;
  if (!domain) throw new Error('PRODAMUS_SHOP_DOMAIN environment variable is not set');
  return domain;
}

function getSecretKey(): string {
  const key = process.env.PRODAMUS_SECRET_KEY;
  if (!key) throw new Error('PRODAMUS_SECRET_KEY environment variable is not set');
  return key;
}

export interface BuildPaymentUrlArgs {
  orderId: string;
  customerEmail: string;
  productName: string;
  amountRub: number;
  successUrl: string;
  returnUrl: string;
}

export function buildPaymentUrl(args: BuildPaymentUrlArgs): string {
  const domain = getShopDomain();
  const params = new URLSearchParams({
    order_id: args.orderId,
    customer_email: args.customerEmail,
    'products[0][name]': args.productName,
    'products[0][price]': args.amountRub.toFixed(2),
    'products[0][quantity]': '1',
    urlSuccess: args.successUrl,
    urlReturn: args.returnUrl,
  });
  return `https://${domain}/?${params.toString()}`;
}

/** Recursively sorts object keys so the signed string is deterministic, per Prodamus's reference signing implementation. */
function sortForSigning(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortForSigning);
  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortForSigning((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}

export function computeSignature(payload: Record<string, unknown>): string {
  const sorted = sortForSigning(payload);
  const canonical = JSON.stringify(sorted);
  return createHmac('sha256', getSecretKey()).update(canonical).digest('hex');
}

export function verifyWebhookSignature(payload: Record<string, unknown>, signature: string | null): boolean {
  if (!signature) return false;
  const rest = { ...payload };
  delete rest.signature;
  const expected = computeSignature(rest);
  return expected.toLowerCase() === signature.toLowerCase();
}
