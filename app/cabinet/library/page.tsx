import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import { getMaterialsForUser } from '@/lib/queries';
import MaterialsList from '@/components/MaterialsList';

export default async function LibraryPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const materials = await getMaterialsForUser(userId);
  const byCourseTitle = new Map<string, typeof materials>();
  for (const material of materials) {
    const list = byCourseTitle.get(material.course_title) ?? [];
    list.push(material);
    byCourseTitle.set(material.course_title, list);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Библиотека материалов</h1>
      {materials.length === 0 ? (
        <p className="mt-4 opacity-80">Материалы появятся здесь после покупки курса.</p>
      ) : (
        Array.from(byCourseTitle.entries()).map(([courseTitle, items]) => (
          <div key={courseTitle} className="mt-8">
            <h2 className="text-lg font-semibold text-foreground">{courseTitle}</h2>
            <MaterialsList materials={items} />
          </div>
        ))
      )}
    </div>
  );
}
