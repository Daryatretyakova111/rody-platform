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
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 focus:border-lilac focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-gradient-to-r from-pink to-lilac px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Купить за {priceLabel}
      </button>
    </form>
  );
}
