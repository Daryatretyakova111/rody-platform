import Image from 'next/image';
import Link from 'next/link';
import { getSessionUserId } from '@/lib/auth';
import {
  getCompletedLessonIds,
  getModulesWithLessons,
  getSetting,
  getUserPurchasedCourses,
} from '@/lib/queries';
import ProgressBar from '@/components/ProgressBar';

export default async function CabinetPage() {
  const userId = await getSessionUserId();
  const courses = userId ? await getUserPurchasedCourses(userId) : [];
  const chatUrl = courses.length > 0 ? await getSetting('chat_url') : null;

  const cards = await Promise.all(
    courses.map(async (course) => {
      const modules = await getModulesWithLessons(course.id);
      const total = modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
      const completed = userId ? (await getCompletedLessonIds(userId, course.id)).size : 0;
      return { course, total, completed };
    })
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">Мои курсы</h1>
        {chatUrl && (
          <a
            href={chatUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-lilac/50 bg-card px-6 py-2.5 text-sm font-medium text-lilac-dark hover:bg-lilac/10"
          >
            Перейти в чат курса
          </a>
        )}
      </div>

      {cards.length === 0 ? (
        <p className="mt-4 opacity-80">
          Пока нет купленных курсов. <Link href="/#courses" className="underline">Посмотреть курсы</Link>.
          Если вы только что оплатили — курс появится здесь после подтверждения оплаты.
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {cards.map(({ course, total, completed }) => (
            <li
              key={course.id}
              className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-md shadow-pink/10 md:grid-cols-[340px_1fr]"
            >
              <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-64">
                {course.image_url && (
                  <Image
                    src={course.image_url}
                    alt={course.title}
                    fill
                    sizes="(min-width: 768px) 340px, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-pink-dark">Курс</p>
                <h2 className="mt-2 text-2xl font-semibold uppercase tracking-wide text-foreground">
                  {course.title}
                </h2>
                {course.subtitle && <p className="mt-2 opacity-80">{course.subtitle}</p>}
                <div className="mt-6">
                  <ProgressBar completed={completed} total={total} />
                </div>
                <div className="mt-6">
                  <Link
                    href={`/cabinet/courses/${course.slug}`}
                    className="inline-block rounded-full bg-gradient-to-r from-pink to-lilac px-8 py-3 text-sm font-medium text-white hover:opacity-90"
                  >
                    Перейти к урокам
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
