'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'breathing-practice-tracker-v1';
const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function PracticeTracker() {
  const [markedDates, setMarkedDates] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date());

  useEffect(() => {
    // Reading localStorage must happen post-mount to avoid an SSR/client markup mismatch,
    // so this one-time hydration can't be done via a lazy useState initializer instead.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setMarkedDates(new Set(JSON.parse(raw)));
    } catch {
      // ignore unavailable storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(markedDates)));
    } catch {
      // ignore unavailable storage
    }
  }, [markedDates, loaded]);

  function toggleDay(key: string) {
    setMarkedDates((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const monthLabel = viewDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const todayKey = dateKey(new Date());

  const cells: (string | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => dateKey(new Date(year, month, i + 1))),
  ];
  const markedThisMonth = cells.filter((key) => key && markedDates.has(key)).length;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="rounded-full px-2 py-1 text-sm opacity-60 hover:opacity-100"
          aria-label="Предыдущий месяц"
        >
          ←
        </button>
        <p className="font-medium capitalize text-foreground">{monthLabel}</p>
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="rounded-full px-2 py-1 text-sm opacity-60 hover:opacity-100"
          aria-label="Следующий месяц"
        >
          →
        </button>
      </div>
      <p className="mt-1 text-center text-sm opacity-70">Тренировок в этом месяце: {markedThisMonth}</p>

      <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-xs opacity-50">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1.5">
        {cells.map((key, index) => {
          if (!key) return <div key={`empty-${index}`} />;
          const isMarked = markedDates.has(key);
          const isToday = key === todayKey;
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleDay(key)}
              className={`aspect-square rounded-lg text-xs font-medium transition-colors ${
                isMarked ? 'bg-gradient-to-br from-pink to-lilac text-white' : 'bg-muted text-foreground hover:bg-lilac/20'
              } ${isToday ? 'ring-2 ring-lilac-dark' : ''}`}
            >
              {Number(key.slice(-2))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
