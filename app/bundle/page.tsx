import { getCourses } from '@/lib/queries';
import { bundlePriceCents, formatPrice, BUNDLE_DISCOUNT_PERCENT } from '@/lib/config';
import CheckoutForm from '@/components/CheckoutForm';

export default async function BundlePage() {
  const courses = await getCourses();
  const bundlePrice = bundlePriceCents(courses.map((c) => c.price_cents));

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">Весь путь: подготовка, роды, восстановление</h1>
      <p className="mt-4 opacity-80">
        Доступ ко всем трём курсам сразу, со скидкой {BUNDLE_DISCOUNT_PERCENT}% от суммы отдельных покупок.
      </p>

      <ul className="mt-8 space-y-3">
        {courses.map((course) => (
          <li key={course.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
            <span className="font-medium text-foreground">{course.title}</span>
            <span className="text-sm opacity-70 line-through">{formatPrice(course.price_cents)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm shadow-lilac/10">
        <p className="mb-4 text-lg font-medium text-foreground">Итого: {formatPrice(bundlePrice)}</p>
        <CheckoutForm kind="bundle" priceLabel={formatPrice(bundlePrice)} />
      </div>
    </div>
  );
}
