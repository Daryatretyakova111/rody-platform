'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CompleteLessonButton({
  lessonId,
  initiallyCompleted,
}: {
  lessonId: number;
  initiallyCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setPending(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      });
      if (res.ok) {
        setCompleted(true);
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  if (completed) {
    return <p className="text-sm text-green-600">✅ Урок пройден</p>;
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded-full bg-gradient-to-r from-pink to-lilac px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Сохраняем…' : 'Отметить как пройденный'}
    </button>
  );
}
