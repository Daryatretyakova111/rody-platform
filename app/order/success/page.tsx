import Link from 'next/link';

export default async function OrderSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-foreground">Спасибо за покупку!</h1>
      <p className="mt-4 opacity-80">
        Как только оплата подтвердится, курс появится в личном кабинете. Войдите по email и паролю, которые вы
        указали при оформлении заказа.
      </p>
      <div className="mt-6">
        <Link
          href="/login"
          className="inline-block rounded-full bg-gradient-to-r from-pink to-lilac px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Войти в личный кабинет
        </Link>
      </div>
    </div>
  );
}
