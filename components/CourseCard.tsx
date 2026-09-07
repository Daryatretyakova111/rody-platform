import Link from 'next/link';
import { Course } from '@/lib/queries';
import { formatPrice } from '@/lib/config';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-black/10 p-6 dark:border-white/10">
      <div>
        <h3 className="text-lg font-semibold">{course.title}</h3>
        {course.subtitle && <p className="mt-2 text-sm opacity-80">{course.subtitle}</p>}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg font-medium">{formatPrice(course.price_cents)}</span>
        <Link
          href={`/courses/${course.slug}`}
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
}
