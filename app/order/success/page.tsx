import Link from 'next/link';

export default async function OrderSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-foreground">Спасибо за покупку!</h1>
      <p className="mt-4 opacity-80">
        Мы отправили ссылку для входа в личный кабинет на вашу почту. Перейдите по ней, чтобы получить доступ
        к курсу — обычно письмо приходит в течение пары минут.
      </p>
      <p className="mt-6 text-sm opacity-70">
        Не пришло письмо? <Link href="/login" className="underline">Запросите ссылку для входа ещё раз</Link>.
      </p>
    </div>
  );
}
