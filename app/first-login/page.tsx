import PasswordFields from '@/components/PasswordFields';
import { SUPPORT_URL } from '@/lib/config';

export default async function FirstLoginPage({ searchParams }: PageProps<'/first-login'>) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-2xl font-bold text-foreground">Первый вход</h1>
      <p className="mt-2 opacity-80">
        Для тех, кто уже оплатил курс, но ещё не придумал пароль. Введите email, который вы указали при заказе.
      </p>

      {error && (
        <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600">
          Не получилось. Проверьте email и пароли. Если вы уже задавали пароль, войдите на странице входа, а если
          всё равно не выходит, <a href={SUPPORT_URL} className="underline">напишите в поддержку</a>.
        </p>
      )}

      <form action="/api/auth/first-login" method="post" className="mt-6 flex flex-col gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border border-border bg-card px-3 py-2 focus:border-lilac focus:outline-none"
        />
        <PasswordFields />
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-pink to-lilac px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Задать пароль и войти
        </button>
      </form>
    </div>
  );
}
