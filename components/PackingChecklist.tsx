'use client';

import { useEffect, useState } from 'react';

interface Item {
  id: string;
  text: string;
}

const CATEGORIES: { title: string; items: Item[] }[] = [
  {
    title: 'Документы',
    items: [
      { id: 'doc-passport', text: 'Паспорт' },
      { id: 'doc-oms', text: 'Полис ОМС' },
      { id: 'doc-exchange-card', text: 'Обменная карта' },
      { id: 'doc-birth-cert', text: 'Родовой сертификат' },
      { id: 'doc-contract', text: 'Договор на роды (если платно)' },
      { id: 'doc-snils', text: 'СНИЛС' },
    ],
  },
  {
    title: 'Для мамы — в родзал',
    items: [
      { id: 'mama-shirt', text: 'Ночная сорочка или рубашка' },
      { id: 'mama-slippers', text: 'Моющиеся тапочки' },
      { id: 'mama-socks', text: 'Тёплые носки' },
      { id: 'mama-compression', text: 'Компрессионные чулки (если назначены)' },
      { id: 'mama-water', text: 'Вода без газа' },
      { id: 'mama-phone', text: 'Телефон и зарядка' },
    ],
  },
  {
    title: 'Для мамы — после родов и на выписку',
    items: [
      { id: 'mama-pads', text: 'Послеродовые прокладки' },
      { id: 'mama-pants', text: 'Одноразовые трусы' },
      { id: 'mama-robe', text: 'Халат' },
      { id: 'mama-nursing-bra', text: 'Бюстгальтер для кормления' },
      { id: 'mama-toiletries', text: 'Туалетные принадлежности' },
      { id: 'mama-discharge-outfit', text: 'Одежда на выписку' },
    ],
  },
  {
    title: 'Для малыша',
    items: [
      { id: 'baby-diapers', text: 'Подгузники 0 размера' },
      { id: 'baby-bodysuits', text: 'Боди или распашонки' },
      { id: 'baby-hat', text: 'Шапочка' },
      { id: 'baby-socks', text: 'Носочки' },
      { id: 'baby-blanket', text: 'Плед или конверт' },
      { id: 'baby-discharge-outfit', text: 'Комплект на выписку' },
    ],
  },
];

const STORAGE_KEY = 'packing-checklist-v1';

export default function PackingChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [customItems, setCustomItems] = useState<Item[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen post-mount to avoid an SSR/client markup mismatch,
    // so this one-time hydration can't be done via a lazy useState initializer instead.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setChecked(parsed.checked ?? {});
        setCustomItems(parsed.customItems ?? []);
      }
    } catch {
      // ignore unavailable storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ checked, customItems }));
    } catch {
      // ignore unavailable storage
    }
  }, [checked, customItems, loaded]);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function addCustomItem() {
    const text = newItemText.trim();
    if (!text) return;
    setCustomItems((prev) => [...prev, { id: `custom-${Date.now()}`, text }]);
    setNewItemText('');
  }

  function removeCustomItem(id: string) {
    setCustomItems((prev) => prev.filter((item) => item.id !== id));
    setChecked((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
      {CATEGORIES.map((category) => (
        <div key={category.title}>
          <p className="font-medium text-foreground">{category.title}</p>
          <ul className="mt-2 space-y-1.5">
            {category.items.map((item) => (
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
      ))}

      <div>
        <p className="font-medium text-foreground">Свои пункты</p>
        {customItems.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {customItems.map((item) => (
              <li key={item.id} className="flex items-center gap-2 text-sm">
                <label className="flex flex-1 cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!checked[item.id]}
                    onChange={() => toggle(item.id)}
                    className="h-4 w-4 accent-pink"
                  />
                  <span className={checked[item.id] ? 'opacity-50 line-through' : ''}>{item.text}</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeCustomItem(item.id)}
                  className="px-1 text-xs opacity-50 hover:opacity-100"
                  aria-label="Удалить пункт"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomItem();
              }
            }}
            placeholder="Добавить свой пункт"
            className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-sm focus:border-lilac focus:outline-none"
          />
          <button
            type="button"
            onClick={addCustomItem}
            className="rounded-full bg-gradient-to-r from-pink to-lilac px-4 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}
