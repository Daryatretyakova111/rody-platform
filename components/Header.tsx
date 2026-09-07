import Link from 'next/link';
import { getSessionUserId } from '@/lib/auth';
import { SITE_NAME } from '@/lib/config';

export default async function Header() {
  const userId = await getSessionUserId();

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/#courses">Курсы</Link>
          {userId ? (
            <>
              <Link href="/cabinet">Личный кабинет</Link>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="cursor-pointer opacity-70 hover:opacity-100">
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <Link href="/login">Войти</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
