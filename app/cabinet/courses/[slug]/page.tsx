import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import { getCourseBySlug, getModulesWithLessons, hasCourseAccess, getCompletedLessonIds } from '@/lib/queries';

export default async function CabinetCoursePage({ params }: PageProps<'/cabinet/courses/[slug]'>) {
  const { slug } = await params;
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const access = await hasCourseAccess(userId, course.id);
  if (!access) redirect(`/courses/${slug}`);

  const modules = await getModulesWithLessons(course.id);
  const completed = await getCompletedLessonIds(userId, course.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
      <ol className="mt-6 space-y-4">
        {modules.map((mod, index) => (
          <li key={mod.id} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm opacity-60">Модуль {index + 1}</p>
            <p className="font-medium text-foreground">{mod.title}</p>
            <ul className="mt-2 space-y-1">
              {mod.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    href={`/cabinet/courses/${slug}/lessons/${lesson.id}`}
                    className="flex items-center gap-2 text-sm opacity-90 hover:underline"
                  >
                    <span>{completed.has(lesson.id) ? '✅' : '▶️'}</span>
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
