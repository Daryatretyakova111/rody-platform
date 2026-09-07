export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { sent, error } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-2xl font-bold">Вход в личный кабинет</h1>
      <p className="mt-2 opacity-80">Введите email, на который была совершена покупка — пришлём ссылку для входа.</p>

      {sent && (
        <p className="mt-4 rounded-lg bg-black/[.04] p-3 text-sm dark:bg-white/[.06]">
          Если такой email зарегистрирован, ссылка для входа уже отправлена.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-600">
          Ссылка недействительна или устарела. Запросите новую.
        </p>
      )}

      <form action="/api/auth/request-link" method="post" className="mt-6 flex flex-col gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
        />
        <button type="submit" className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background">
          Прислать ссылку для входа
        </button>
      </form>
    </div>
  );
}
