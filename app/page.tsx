import Link from 'next/link';
import { getCourses } from '@/lib/queries';
import { bundlePriceCents, formatPrice, BUNDLE_DISCOUNT_PERCENT } from '@/lib/config';
import CourseCard from '@/components/CourseCard';

export default async function HomePage() {
  const courses = await getCourses();
  const bundlePrice = bundlePriceCents(courses.map((c) => c.price_cents));

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <section className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Пройти путь от беременности до восстановления спокойно и подготовленной
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg opacity-80">
          Три курса от врача акушера-гинеколога: подготовка к родам, сами роды и восстановление после них.
          Видео-уроки, гайды, чек-листы и инструкции — всё в одном личном кабинете.
        </p>
      </section>

      <section id="courses" className="mt-16 grid gap-6 sm:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-black/10 bg-black/[.03] p-8 text-center dark:border-white/10 dark:bg-white/[.03]">
        <h2 className="text-xl font-semibold">Весь путь целиком</h2>
        <p className="mt-2 opacity-80">
          Все три курса пакетом со скидкой {BUNDLE_DISCOUNT_PERCENT}% — доступ ко всем материалам сразу.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <span className="text-xl font-medium">{formatPrice(bundlePrice)}</span>
          <Link href="/bundle" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">
            Купить пакет
          </Link>
        </div>
      </section>
    </div>
  );
}
