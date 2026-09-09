export default function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">Прогресс курса</span>
        <span className="opacity-70">
          {completed} из {total} уроков · {percent}%
        </span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink to-lilac transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
