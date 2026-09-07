import { notFound, redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import {
  getCourseBySlug,
  hasCourseAccess,
  getLessonForCourse,
  getMaterialsForLesson,
  getCompletedLessonIds,
} from '@/lib/queries';
import VideoPlayer from '@/components/VideoPlayer';
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

  const materials = await getMaterialsForLesson(lesson.id);
  const completed = await getCompletedLessonIds(userId, course.id);

  return (
    <div>
      <p className="text-sm opacity-60">{course.title}</p>
      <h1 className="text-2xl font-bold">{lesson.title}</h1>

      <div className="mt-6">
        <VideoPlayer kinescopeVideoId={lesson.kinescope_video_id} />
      </div>

      <div className="mt-6">
        <CompleteLessonButton lessonId={lesson.id} initiallyCompleted={completed.has(lesson.id)} />
      </div>

      <h2 className="mt-10 text-lg font-semibold">Материалы к уроку</h2>
      <MaterialsList materials={materials} />
    </div>
  );
}
