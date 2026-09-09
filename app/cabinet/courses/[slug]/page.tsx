import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import { getCourseBySlug, getModulesWithLessons, hasCourseAccess, getCompletedLessonIds } from '@/lib/queries';
import ProgressBar from '@/components/ProgressBar';

export default async function CabinetCoursePage({ params }: PageProps<'/cabinet/courses/[slug]'>) {
  const { slug } = await params;
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const access = await hasCourseAccess(userId, course.id);
  if (!access) redirect(`/courses/${slug}`);

  const modules = await getModulesWithLessons(course.id);
  const lessons = modules.flatMap((mod) => mod.lessons);
  const completed = await getCompletedLessonIds(userId, course.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>

      <div className="mt-4">
        <ProgressBar completed={completed.size} total={lessons.length} />
      </div>

      <ol className="mt-6 space-y-2">
        {lessons.map((lesson, index) => (
          <li key={lesson.id}>
            <Link
              href={`/cabinet/courses/${slug}/lessons/${lesson.id}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-lilac"
            >
              <span>{completed.has(lesson.id) ? '✅' : '▶️'}</span>
              <span>
                <span className="text-sm opacity-60">Урок {index + 1}</span>
                <span className="block font-medium text-foreground">{lesson.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
