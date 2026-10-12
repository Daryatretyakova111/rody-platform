import Link from 'next/link';
import { getOrderByClaim } from '@/lib/queries';
import { SUPPORT_URL } from '@/lib/config';
import AutoRefresh from '@/components/AutoRefresh';
import PasswordFields from '@/components/PasswordFields';

const buttonClass =
  'inline-block rounded-full bg-gradient-to-r from-pink to-lilac px-6 py-2.5 text-sm font-medium text-white hover:opacity-90';

export default async function OrderSuccessPage({ searchParams }: PageProps<'/order/success'>) {
  const { order: orderRef, t: token, error } = await searchParams;
  const order =
    typeof orderRef === 'string' && typeof token === 'string' ? await getOrderByClaim(orderRef, token) : null;

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground">Спасибо за покупку!</h1>
        <p className="mt-4 opacity-80">
          Если вы уже оплатили курс, нажмите «Первый вход» и придумайте пароль. Вход нужен по тому же email, который
          вы указали при заказе.
        </p>
        <div className="mt-6">
          <Link href="/first-login" className={buttonClass}>
            Первый вход
          </Link>
        </div>
      </div>
    );
  }

  if (order.status !== 'paid') {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <AutoRefresh />
        <h1 className="text-2xl font-bold text-foreground">Подтверждаем оплату…</h1>
        <p className="mt-4 opacity-80">Обычно это занимает несколько секунд. Не закрывайте страницу.</p>
        <p className="mt-6 text-sm opacity-70">
          Если ничего не происходит больше минуты, <a href={SUPPORT_URL} className="underline">напишите в поддержку</a>.
        </p>
      </div>
    );
  }

  if (order.has_password) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground">Оплата прошла, курс открыт</h1>
        <p className="mt-4 opacity-80">Войдите в личный кабинет по вашему email и паролю.</p>
        <div className="mt-6">
          <Link href="/login" className={buttonClass}>
            Войти
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-2xl font-bold text-foreground">Оплата прошла, спасибо!</h1>
      <p className="mt-2 opacity-80">
        Придумайте пароль для входа в личный кабинет. Ваш логин — <strong>{order.email}</strong>.
      </p>

      {error && (
        <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600">
          Пароли не совпадают или слишком короткие. Попробуйте ещё раз.
        </p>
      )}

      <form action="/api/auth/set-password" method="post" className="mt-6 flex flex-col gap-3">
        <input type="hidden" name="order" value={orderRef as string} />
        <input type="hidden" name="t" value={token as string} />
        <PasswordFields />
        <button type="submit" className={`${buttonClass} w-full`}>
          Сохранить и войти
        </button>
      </form>
    </div>
  );
}
