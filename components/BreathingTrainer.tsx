'use client';

import { useEffect, useRef, useState } from 'react';

type Phase = 'inhale' | 'exhale';
type Visual = 'circle' | 'bars' | 'candle';

interface Preset {
  label: string;
  hint: string;
  inhale: number;
  exhale: number;
  visual: Visual;
}

const PRESETS: Preset[] = [
  {
    label: 'Медленное дыхание',
    hint: 'В начале схватки и в перерывах между ними',
    inhale: 4,
    exhale: 6,
    visual: 'circle',
  },
  {
    label: 'Лёгкое дыхание',
    hint: 'На пике схватки в активной фазе',
    inhale: 2,
    exhale: 2,
    visual: 'bars',
  },
  {
    label: 'Выдох свечой',
    hint: 'Чтобы сдержать раннее желание тужиться',
    inhale: 3,
    exhale: 5,
    visual: 'candle',
  },
];

interface VisualProps {
  running: boolean;
  phase: Phase;
  duration: number;
}

function PhaseLabel({ running, phase, idleLabel }: { running: boolean; phase: Phase; idleLabel: string }) {
  if (!running) return <>{idleLabel}</>;
  return <>{phase === 'inhale' ? 'Вдох' : 'Выдох'}</>;
}

function CircleVisual({ running, phase, duration }: VisualProps) {
  const scale = running ? (phase === 'inhale' ? 1 : 0.55) : 0.7;
  return (
    <div
      className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-pink to-lilac text-white"
      style={{
        transform: `scale(${scale})`,
        transition: running ? `transform ${duration}s ease-in-out` : 'transform 0.3s ease-out',
      }}
    >
      <span className="text-lg font-medium">
        <PhaseLabel running={running} phase={phase} idleLabel="Начнём?" />
      </span>
    </div>
  );
}

function BarsVisual({ running, phase, duration }: VisualProps) {
  const heights = phase === 'inhale' ? [35, 65, 100, 65, 35] : [70, 45, 20, 45, 70];
  return (
    <div className="flex h-40 w-40 flex-col items-center justify-center gap-4">
      <div className="flex h-24 items-end gap-2">
        {heights.map((height, index) => (
          <div
            key={index}
            className="w-3 rounded-full bg-gradient-to-t from-pink to-lilac"
            style={{
              height: `${height}%`,
              transition: running ? `height ${duration}s ease-in-out` : 'height 0.3s ease-out',
            }}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-foreground">
        <PhaseLabel running={running} phase={phase} idleLabel="Начнём?" />
      </span>
    </div>
  );
}

function CandleVisual({ running, phase, duration }: VisualProps) {
  const tilt = running && phase === 'exhale' ? 35 : 0;
  return (
    <div className="flex h-40 w-40 flex-col items-center justify-center">
      <div
        className="h-6 w-6 rounded-full bg-gradient-to-t from-pink to-lilac"
        style={{
          transform: `rotate(${tilt}deg)`,
          transformOrigin: 'bottom center',
          transition: running ? `transform ${duration}s ease-in-out` : 'transform 0.3s ease-out',
        }}
      />
      <div className="h-16 w-4 rounded-sm bg-muted" />
      <span className="mt-3 text-sm font-medium text-foreground">
        {running ? (phase === 'inhale' ? 'Вдох' : 'Выдох — задуй свечу') : 'Начнём?'}
      </span>
    </div>
  );
}

export default function BreathingTrainer() {
  const [presetIndex, setPresetIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
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
  const visualProps: VisualProps = { running, phase, duration };

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
        {preset.visual === 'circle' && <CircleVisual {...visualProps} />}
        {preset.visual === 'bars' && <BarsVisual {...visualProps} />}
        {preset.visual === 'candle' && <CandleVisual {...visualProps} />}

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
