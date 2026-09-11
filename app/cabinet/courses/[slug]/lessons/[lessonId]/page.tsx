import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import {
  getCourseBySlug,
  hasCourseAccess,
  getLessonForCourse,
  getModulesWithLessons,
  getMaterialsForLesson,
  getCompletedLessonIds,
} from '@/lib/queries';
import VideoPlayer from '@/components/VideoPlayer';
import LessonContent from '@/components/LessonContent';
import PackingChecklist from '@/components/PackingChecklist';
import BreathingTrainer from '@/components/BreathingTrainer';
import MaterialsList from '@/components/MaterialsList';
import CompleteLessonButton from '@/components/CompleteLessonButton';

export default async function LessonPage({ params }: PageProps<'/cabinet/courses/[slug]/lessons/[lessonId]'>) {
  const { slug, lessonId } = await params;
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const access = await hasCourseAccess(userId, course.id);
  if (!access) redirect(`/courses/${slug}`);

  const lesson = await getLessonForCourse(Number(lessonId), course.id);
  if (!lesson) notFound();

  const modules = await getModulesWithLessons(course.id);
  const lessons = modules.flatMap((mod) => mod.lessons);
  const currentIndex = lessons.findIndex((item) => item.id === lesson.id);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const materials = await getMaterialsForLesson(lesson.id);
  const completed = await getCompletedLessonIds(userId, course.id);

  return (
    <div>
      <Link href={`/cabinet/courses/${slug}`} className="text-sm opacity-60 hover:text-pink-dark hover:opacity-100">
        ← {course.title}
      </Link>
      <h1 className="mt-1 text-2xl font-bold text-foreground">{lesson.title}</h1>

      <div className="mt-6">
        {lesson.kinescope_video_id ? (
          <VideoPlayer kinescopeVideoId={lesson.kinescope_video_id} />
        ) : lesson.content ? (
          <LessonContent content={lesson.content} />
        ) : (
          <VideoPlayer kinescopeVideoId={null} />
        )}
      </div>

      {lesson.widget === 'packing-checklist' && (
        <div className="mt-6">
          <PackingChecklist />
        </div>
      )}

      {lesson.widget === 'breathing-trainer' && (
        <div className="mt-6">
          <BreathingTrainer />
        </div>
      )}

      <div className="mt-6">
        <CompleteLessonButton lessonId={lesson.id} initiallyCompleted={completed.has(lesson.id)} />
      </div>

      {materials.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-semibold">Материалы к уроку</h2>
          <MaterialsList materials={materials} />
        </>
      )}

      <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
        {previousLesson ? (
          <Link
            href={`/cabinet/courses/${slug}/lessons/${previousLesson.id}`}
            className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm hover:border-lilac"
          >
            <span className="block opacity-60">← Назад</span>
            <span className="block font-medium text-foreground">{previousLesson.title}</span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {nextLesson ? (
          <Link
            href={`/cabinet/courses/${slug}/lessons/${nextLesson.id}`}
            className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-right text-sm hover:border-lilac"
          >
            <span className="block opacity-60">Вперёд →</span>
            <span className="block font-medium text-foreground">{nextLesson.title}</span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>

      <div className="mt-4 text-center">
        <Link
          href={`/cabinet/courses/${slug}`}
          className="inline-block rounded-full bg-gradient-to-r from-pink to-lilac px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          К программе курса
        </Link>
      </div>
    </div>
  );
}
