const inputClass =
  'w-full rounded-xl border border-border bg-card px-3 py-2 focus:border-lilac focus:outline-none';

export default function PasswordFields() {
  return (
    <>
      <input
        type="password"
        name="password"
        required
        minLength={6}
        placeholder="Придумайте пароль (минимум 6 символов)"
        autoComplete="new-password"
        className={inputClass}
      />
      <input
        type="password"
        name="password2"
        required
        minLength={6}
        placeholder="Повторите пароль"
        autoComplete="new-password"
        className={inputClass}
      />
    </>
  );
}
