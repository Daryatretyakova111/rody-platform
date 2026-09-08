import Link from 'next/link';
import { getSessionUserId } from '@/lib/auth';
import { getUserPurchasedCourses } from '@/lib/queries';

export default async function CabinetPage() {
  const userId = await getSessionUserId();
  const courses = userId ? await getUserPurchasedCourses(userId) : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Мои курсы</h1>

      {courses.length === 0 ? (
        <p className="mt-4 opacity-80">
          Пока нет купленных курсов. <Link href="/#courses" className="underline">Посмотреть курсы</Link>.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <li key={course.id} className="rounded-2xl border border-border bg-card p-6">
              <p className="font-medium text-foreground">{course.title}</p>
              <Link
                href={`/cabinet/courses/${course.slug}`}
                className="mt-4 inline-block rounded-full bg-gradient-to-r from-pink to-lilac px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Перейти к урокам
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
