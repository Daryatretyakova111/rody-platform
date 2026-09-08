import Link from 'next/link';
import { getSessionUserId } from '@/lib/auth';
import { SITE_NAME } from '@/lib/config';

export default async function Header() {
  const userId = await getSessionUserId();

  return (
    <header className="border-b border-border bg-card/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold text-foreground">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/#courses" className="hover:text-pink-dark">
            Курсы
          </Link>
          {userId ? (
            <>
              <Link href="/cabinet" className="hover:text-pink-dark">
                Личный кабинет
              </Link>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="cursor-pointer opacity-70 hover:opacity-100">
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-lilac px-4 py-1.5 text-white hover:bg-lilac-dark"
            >
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
