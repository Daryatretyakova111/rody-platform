export default async function AdminLoginPage({ searchParams }: PageProps<'/admin-login'>) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-2xl font-bold text-foreground">Вход по паролю</h1>

      {error && (
        <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600">
          Неверный email или пароль.
        </p>
      )}

      <form action="/api/auth/password-login" method="post" className="mt-6 flex flex-col gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border border-border bg-card px-3 py-2 focus:border-lilac focus:outline-none"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Пароль"
          className="w-full rounded-xl border border-border bg-card px-3 py-2 focus:border-lilac focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-pink to-lilac px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
