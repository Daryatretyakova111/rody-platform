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
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <ol className="mt-6 space-y-4">
        {modules.map((mod, index) => (
          <li key={mod.id} className="rounded-xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-sm opacity-60">Модуль {index + 1}</p>
            <p className="font-medium">{mod.title}</p>
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
