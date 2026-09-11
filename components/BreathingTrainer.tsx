'use client';

import { useEffect, useRef, useState } from 'react';

const PRESETS = [
  { label: 'Медленное дыхание', hint: 'В начале схватки и в перерывах между ними', inhale: 4, exhale: 6 },
  { label: 'Лёгкое дыхание', hint: 'На пике схватки в активной фазе', inhale: 2, exhale: 2 },
  { label: 'Выдох свечой', hint: 'Чтобы сдержать раннее желание тужиться', inhale: 3, exhale: 5 },
];

export default function BreathingTrainer() {
  const [presetIndex, setPresetIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preset = PRESETS[presetIndex];

  useEffect(() => {
    if (!running) return;
    const duration = phase === 'inhale' ? preset.inhale : preset.exhale;
    timeoutRef.current = setTimeout(() => {
      setPhase((p) => (p === 'inhale' ? 'exhale' : 'inhale'));
    }, duration * 1000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [running, phase, preset]);

  function toggleRunning() {
    if (!running) setPhase('inhale');
    setRunning((r) => !r);
  }

  function selectPreset(index: number) {
    setPresetIndex(index);
    setPhase('inhale');
  }

  const duration = phase === 'inhale' ? preset.inhale : preset.exhale;
  const scale = running ? (phase === 'inhale' ? 1 : 0.55) : 0.7;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => selectPreset(index)}
            className={`rounded-full px-4 py-1.5 text-sm ${
              index === presetIndex
                ? 'bg-gradient-to-r from-pink to-lilac text-white'
                : 'bg-muted text-foreground hover:bg-lilac/20'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm opacity-70">{preset.hint}</p>

      <div className="mt-8 flex flex-col items-center">
        <div
          className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-pink to-lilac text-white"
          style={{
            transform: `scale(${scale})`,
            transition: running ? `transform ${duration}s ease-in-out` : 'transform 0.3s ease-out',
          }}
        >
          <span className="text-lg font-medium">{running ? (phase === 'inhale' ? 'Вдох' : 'Выдох') : 'Начнём?'}</span>
        </div>

        <button
          type="button"
          onClick={toggleRunning}
          className="mt-8 rounded-full bg-gradient-to-r from-pink to-lilac px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          {running ? 'Остановить' : 'Начать'}
        </button>
      </div>
    </div>
  );
}
