import { notFound } from 'next/navigation';
import { getCourseBySlug, getModulesWithLessons } from '@/lib/queries';
import { formatPrice } from '@/lib/config';
import CheckoutForm from '@/components/CheckoutForm';

const TEASER_COUNT = 3;

export default async function CoursePage({ params }: PageProps<'/courses/[slug]'>) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const modules = await getModulesWithLessons(course.id);
  const lessonCount = modules.reduce((sum, mod) => sum + mod.lessons.length, 0);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
      {course.subtitle && <p className="mt-2 text-lg opacity-80">{course.subtitle}</p>}
      {course.description && <p className="mt-4 opacity-80">{course.description}</p>}

      <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm shadow-pink/10">
        <CheckoutForm kind="course" courseSlug={course.slug} priceLabel={formatPrice(course.price_cents)} />
      </div>

      <div className="mt-12 rounded-2xl bg-muted p-6">
        <p className="font-medium text-foreground">
          {modules.length} модулей · {lessonCount} видео-уроков · гайды, чек-листы и инструкции к каждой теме
        </p>
        <ul className="mt-4 space-y-2">
          {modules.slice(0, TEASER_COUNT).map((mod, index) => (
            <li key={mod.id} className="text-sm opacity-80">
              {index + 1}. {mod.title}
            </li>
          ))}
          {modules.length > TEASER_COUNT && (
            <li className="text-sm opacity-60">и ещё {modules.length - TEASER_COUNT}…</li>
          )}
        </ul>
        <p className="mt-4 text-sm opacity-60">
          Полная программа, видео и материалы открываются в личном кабинете сразу после оплаты.
        </p>
      </div>
    </div>
  );
}
