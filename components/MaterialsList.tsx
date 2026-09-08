import { Material } from '@/lib/queries';

const TYPE_LABELS: Record<Material['type'], string> = {
  guide: 'Гайд',
  tip: 'Подсказка',
  checklist: 'Чек-лист',
  instruction: 'Инструкция',
};

export default function MaterialsList({ materials }: { materials: Material[] }) {
  if (materials.length === 0) return null;

  return (
    <ul className="mt-4 space-y-2">
      {materials.map((material) => (
        <li
          key={material.id}
          className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
        >
          <div>
            <span className="mr-2 rounded-full bg-muted px-2 py-0.5 text-xs text-lilac-dark">
              {TYPE_LABELS[material.type]}
            </span>
            {material.title}
          </div>
          {material.file_url ? (
            <a href={material.file_url} className="text-sm underline" target="_blank" rel="noreferrer">
              Скачать
            </a>
          ) : (
            <span className="text-sm opacity-50">Скоро</span>
          )}
        </li>
      ))}
    </ul>
  );
}
