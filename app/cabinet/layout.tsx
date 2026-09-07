import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUserId } from '@/lib/auth';

export default async function CabinetLayout({ children }: LayoutProps<'/cabinet'>) {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect('/login');
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <nav className="mb-8 flex gap-6 text-sm opacity-80">
        <Link href="/cabinet">Мои курсы</Link>
        <Link href="/cabinet/library">Библиотека материалов</Link>
      </nav>
      {children}
    </div>
  );
}
