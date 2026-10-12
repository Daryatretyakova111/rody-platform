import { notFound } from 'next/navigation';
import { getSessionUserId, isAdmin } from '@/lib/auth';

export default async function AdminPage({ searchParams }: PageProps<'/admin'>) {
  const userId = await getSessionUserId();
  if (!userId || !(await isAdmin(userId))) notFound();

  const { result, email } = await searchParams;
  const shownEmail = typeof email === 'string' ? email : '';

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold text-foreground">Сбросить пароль</h1>
      <p className="mt-2 text-sm opacity-80">
        Введите email покупателя. Пароль будет удалён, и человек сможет задать новый на странице «Первый вход».
      </p>

      {result === 'ok' && (
        <p className="mt-4 rounded-xl bg-muted p-3 text-sm">
          Готово: пароль для {shownEmail} сброшен. Попросите человека открыть «Первый вход» и придумать новый.
        </p>
      )}
      {result === 'notfound' && (
        <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600">
          Пользователя с email {shownEmail} нет. Проверьте написание.
        </p>
      )}

      <form action="/api/admin/reset-password" method="post" className="mt-6 flex flex-col gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="email@покупателя"
          className="w-full rounded-xl border border-border bg-card px-3 py-2 focus:border-lilac focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-pink to-lilac px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Сбросить пароль
        </button>
      </form>
    </div>
  );
}
