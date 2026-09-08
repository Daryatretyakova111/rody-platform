import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/lib/queries';
import { formatPrice } from '@/lib/config';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card shadow-sm shadow-pink/10">
      {course.image_url && (
        <div className="relative aspect-[4/3] w-full">
          <Image src={course.image_url} alt={course.title} fill className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3 className="text-lg font-semibold uppercase tracking-wide text-foreground">{course.title}</h3>
          {course.subtitle && <p className="mt-2 text-sm opacity-80">{course.subtitle}</p>}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-lg font-medium">{formatPrice(course.price_cents)}</span>
          <Link
            href={`/courses/${course.slug}`}
            className="rounded-full bg-pink px-4 py-2 text-sm font-medium text-white hover:bg-pink-dark"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}
