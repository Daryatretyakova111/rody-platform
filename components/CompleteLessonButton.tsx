'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LessonStatusIcon } from '@/components/icons';

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
    return (
      <p className="flex items-center gap-2 text-sm text-pink-dark">
        <LessonStatusIcon completed className="h-5 w-5 text-pink" />
        Урок пройден
      </p>
    );
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
