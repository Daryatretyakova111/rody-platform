interface CheckoutFormProps {
  kind: 'course' | 'bundle';
  courseSlug?: string;
  priceLabel: string;
}

export default function CheckoutForm({ kind, courseSlug, priceLabel }: CheckoutFormProps) {
  return (
    <form action="/api/checkout" method="post" className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <input type="hidden" name="kind" value={kind} />
      {courseSlug && <input type="hidden" name="courseSlug" value={courseSlug} />}
      <div className="flex-1">
        <label htmlFor="email" className="block text-sm opacity-80">
          Email для доступа к личному кабинету
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 dark:border-white/20 dark:bg-transparent"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background"
      >
        Купить за {priceLabel}
      </button>
    </form>
  );
}
