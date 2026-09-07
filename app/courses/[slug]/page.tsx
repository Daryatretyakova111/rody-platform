import { notFound } from 'next/navigation';
import { getCourseBySlug, getModulesWithLessons } from '@/lib/queries';
import { formatPrice } from '@/lib/config';
import CheckoutForm from '@/components/CheckoutForm';

export default async function CoursePage({ params }: PageProps<'/courses/[slug]'>) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const modules = await getModulesWithLessons(course.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      {course.subtitle && <p className="mt-2 text-lg opacity-80">{course.subtitle}</p>}
      {course.description && <p className="mt-4 opacity-80">{course.description}</p>}

      <div className="mt-10 rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <CheckoutForm kind="course" courseSlug={course.slug} priceLabel={formatPrice(course.price_cents)} />
      </div>

      <h2 className="mt-12 text-xl font-semibold">Программа курса</h2>
      <ol className="mt-4 space-y-4">
        {modules.map((mod, index) => (
          <li key={mod.id} className="rounded-xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-sm opacity-60">Модуль {index + 1}</p>
            <p className="font-medium">{mod.title}</p>
            {mod.lessons.map((lesson) => (
              <p key={lesson.id} className="mt-1 text-sm opacity-80">
                {lesson.title}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
