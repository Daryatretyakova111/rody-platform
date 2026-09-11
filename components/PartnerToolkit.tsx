'use client';

import { useEffect, useState } from 'react';

const CHECK_ITEMS = [
  { id: 'route', text: 'Знаю дорогу до роддома и запасной маршрут на случай пробок' },
  { id: 'rules', text: 'Уточнили в роддоме условия партнёрских родов и какие анализы нужны мне' },
  { id: 'bag', text: 'Собрал свою сумку: сменная одежда, бахилы, вода, перекус, зарядка' },
  { id: 'plan', text: 'Обсудили с ней план родов и её пожелания по родам' },
  { id: 'contacts', text: 'Знаю, куда звонить, если что-то пойдёт не по плану' },
  { id: 'charge', text: 'Зарядил телефон и камеру' },
  { id: 'kids-pets', text: 'Договорились, кто присмотрит за детьми или животными' },
  { id: 'anesthesia', text: 'Знаю, какие есть варианты обезболивания и кто их назначает' },
];

const TECHNIQUES = [
  {
    title: 'Контрдавление на крестец',
    text: 'Во время схватки сильно и ровно надавливайте основанием ладони на нижнюю часть спины — это уменьшает ощущение давления.',
  },
  {
    title: 'Двойное сжатие бёдер',
    text: 'Обхватите бёдра ладонями с внешней стороны и сжимайте по направлению друг к другу на пике схватки.',
  },
  {
    title: 'Массаж поясницы',
    text: 'Круговыми движениями массируйте поясницу в перерывах между схватками — не во время самой схватки, если прикосновения в этот момент неприятны.',
  },
  {
    title: 'Смена поз',
    text: 'Помогите встать, опереться на вас или стену, покачаться на фитболе — движение облегчает боль и помогает малышу продвигаться.',
  },
  {
    title: 'Синхронное дыхание',
    text: 'Дышите вместе с ней вслух, задавая ровный ритм — это помогает не сбиваться на частое поверхностное дыхание.',
  },
  {
    title: 'Тепло и прохлада',
    text: 'Тёплая грелка на поясницу или живот, прохладная салфетка на лоб и шею — уточните у персонала, что можно использовать в вашем роддоме.',
  },
];

const PHRASE_GROUPS = [
  {
    title: 'В начале родов',
    phrases: ['Всё идёт хорошо, у нас есть время', 'Я никуда не денусь, я рядом', 'Ты прекрасно справляешься'],
  },
  {
    title: 'В активную фазу, на сильных схватках',
    phrases: ['Дыши со мной — вдох... выдох...', 'Ещё одна схватка позади', 'Ты сильная, я горжусь тобой', 'Расслабь плечи, отпусти'],
  },
  {
    title: 'Перед потугами и во время них',
    phrases: ['Слушай врача, я рядом', 'Ещё немного, малыш уже близко', 'Ты справляешься невероятно'],
  },
  {
    title: 'После родов',
    phrases: ['Ты справилась', 'Я так тобой горжусь', 'Посмотри, какой у нас красивый малыш'],
  },
];

const STORAGE_KEY = 'partner-checklist-v1';

export default function PartnerToolkit() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen post-mount to avoid an SSR/client markup mismatch,
    // so this one-time hydration can't be done via a lazy useState initializer instead.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      // ignore unavailable storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      // ignore unavailable storage
    }
  }, [checked, loaded]);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="font-medium text-foreground">Что партнёру стоит проверить и подготовить</p>
        <ul className="mt-3 space-y-1.5">
          {CHECK_ITEMS.map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!checked[item.id]}
                  onChange={() => toggle(item.id)}
                  className="h-4 w-4 accent-pink"
                />
                <span className={checked[item.id] ? 'opacity-50 line-through' : ''}>{item.text}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="font-medium text-foreground">Чем партнёр может помочь физически</p>
        <div className="mt-3 space-y-3">
          {TECHNIQUES.map((technique) => (
            <div key={technique.title}>
              <p className="text-sm font-medium text-foreground">{technique.title}</p>
              <p className="text-sm opacity-80">{technique.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-foreground">Слова поддержки</p>
          <button
            type="button"
            onClick={() => window.print()}
            className="shrink-0 rounded-full bg-gradient-to-r from-pink to-lilac px-4 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            Распечатать
          </button>
        </div>
        <div id="printable-phrases" className="mt-3 space-y-4">
          {PHRASE_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-medium text-foreground">{group.title}</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm opacity-80">
                {group.phrases.map((phrase) => (
                  <li key={phrase}>«{phrase}»</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
