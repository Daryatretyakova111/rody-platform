'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Re-fetches the server component every few seconds (used while a payment is being confirmed). */
export default function AutoRefresh({ intervalMs = 3000, maxTimes = 20 }: { intervalMs?: number; maxTimes?: number }) {
  const router = useRouter();

  useEffect(() => {
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      router.refresh();
      if (count >= maxTimes) clearInterval(timer);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [router, intervalMs, maxTimes]);

  return null;
}
