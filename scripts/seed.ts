import { config } from 'dotenv';
config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);

type MaterialType = 'guide' | 'tip' | 'checklist' | 'instruction';

interface SeedModule {
  title: string;
  lesson: string;
  material: { type: MaterialType; title: string };
}

interface SeedCourse {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  priceCents: number;
  modules: SeedModule[];
}

const courses: SeedCourse[] = [
  {
    slug: 'podgotovka-k-rodam',
    title: 'Подготовка к родам',
    subtitle: 'С 28–30 недели: как встретить роды спокойно и подготовленной',
    description:
      'Курс для будущих мам: что происходит с телом, как распознать начало родов, что взять с собой, как выбрать обезболивание и подготовиться психологически.',
    priceCents: 499000,
    modules: [
      { title: 'Триместр за триместром', lesson: 'Что происходит с телом и малышом', material: { type: 'guide', title: 'Норма vs повод к врачу' } },
      { title: 'Предвестники родов', lesson: 'Как распознать, что роды близко', material: { type: 'checklist', title: 'Схватки Брекстона-Хикса vs настоящие' } },
      { title: 'Когда ехать в роддом', lesson: 'Частота и длительность схваток', material: { type: 'checklist', title: 'Пора ехать: по интервалам схваток' } },
      { title: 'Сумка в роддом', lesson: 'Что брать маме и малышу', material: { type: 'checklist', title: 'Сумка в роддом по пунктам' } },
      { title: 'План родов (birth plan)', lesson: 'Как составить и обсудить с врачом', material: { type: 'instruction', title: 'Шаблон плана родов' } },
      { title: 'Обезболивание', lesson: 'Эпидуральная анестезия и альтернативы', material: { type: 'guide', title: 'Плюсы и риски методов обезболивания' } },
      { title: 'Партнёрские роды', lesson: 'Роль и задачи партнёра', material: { type: 'instruction', title: 'Инструкция для партнёра' } },
      { title: 'Дыхание и техники самопомощи', lesson: 'Практика дыхательных техник', material: { type: 'tip', title: 'Карточки с дыхательными техниками' } },
      { title: 'Если кесарево', lesson: 'Плановое и экстренное КС', material: { type: 'guide', title: 'Что будет происходить пошагово' } },
      { title: 'Психологическая подготовка', lesson: 'Работа со страхом родов', material: { type: 'guide', title: 'Техники релаксации' } },
    ],
  },
  {
    slug: 'rody',
    title: 'Роды',
    subtitle: 'Пошагово по периодам родов — держите под рукой в процессе',
    description:
      'Что происходит в каждом периоде родов, какие вмешательства возможны и зачем, как помогать себе и как партнёру поддержать вас.',
    priceCents: 499000,
    modules: [
      { title: 'Первый период: латентная фаза', lesson: 'Что происходит, как себя вести дома', material: { type: 'instruction', title: 'Когда фаза меняется' } },
      { title: 'Первый период: активная фаза', lesson: 'Схватки, позы, самопомощь', material: { type: 'tip', title: 'Позы для облегчения боли' } },
      { title: 'Медицинские вмешательства', lesson: 'Окситоцин, амниотомия, КТГ, эпизиотомия', material: { type: 'guide', title: 'Что это и зачем' } },
      { title: 'Второй период: потуги', lesson: 'Техника потуг, роль дыхания', material: { type: 'instruction', title: 'Как тужиться эффективно' } },
      { title: 'Рождение малыша', lesson: 'Первый контакт, кожа-к-коже', material: { type: 'checklist', title: 'Что происходит в первый час' } },
      { title: 'Третий период', lesson: 'Рождение последа', material: { type: 'instruction', title: 'Что происходит и сколько длится' } },
      { title: 'Если что-то пошло не по плану', lesson: 'Экстренное КС, вакуум, щипцы', material: { type: 'guide', title: 'Спокойное объяснение процедур' } },
      { title: 'Инструкция для партнёра', lesson: 'Пошагово по всем периодам родов', material: { type: 'checklist', title: 'Шпаргалка для партнёра' } },
    ],
  },
  {
    slug: 'vosstanovlenie',
    title: 'Восстановление после родов',
    subtitle: 'Первые 42 дня и дальше: тело, гормоны, грудное вскармливание',
    description:
      'Как проходит восстановление после естественных родов и кесарева, на что обращать внимание, когда возвращаться к спорту и близости, как наладить ГВ.',
    priceCents: 499000,
    modules: [
      { title: 'Первые 42 дня', lesson: 'Лохии, инволюция матки, норма выделений', material: { type: 'checklist', title: 'Тревожные симптомы: срочно к врачу' } },
      { title: 'Уход после естественных родов', lesson: 'Швы промежности, гигиена', material: { type: 'instruction', title: 'Пошаговый уход за швами' } },
      { title: 'Уход после кесарева', lesson: 'Уход за швом, ограничения по нагрузке', material: { type: 'checklist', title: 'Тревожные признаки после КС' } },
      { title: 'Тазовое дно и диастаз', lesson: 'Диагностика и первые упражнения', material: { type: 'guide', title: 'Как проверить диастаз самой' } },
      { title: 'Грудное вскармливание', lesson: 'Прикладывание, режим, частые проблемы', material: { type: 'checklist', title: 'Признаки правильного прикладывания' } },
      { title: 'Гормоны и психика', lesson: 'Бэби-блюз vs послеродовая депрессия', material: { type: 'checklist', title: 'Самодиагностика: когда к специалисту' } },
      { title: 'Питание и режим сна', lesson: 'Восстановление ресурса', material: { type: 'guide', title: 'Примерное меню на первые недели' } },
      { title: 'Возвращение к спорту', lesson: 'Поэтапный план по неделям', material: { type: 'checklist', title: 'Можно ли мне уже' } },
      { title: 'Интимная жизнь и контрацепция', lesson: 'Когда и как возвращаться', material: { type: 'guide', title: 'Гайд по возвращению к близости' } },
      { title: 'Плановые визиты к врачу', lesson: 'Осмотр в 6 недель и далее', material: { type: 'checklist', title: 'Обследования по срокам' } },
    ],
  },
];

async function main() {
  for (const [courseIndex, course] of courses.entries()) {
    const [courseRow] = await sql`
      INSERT INTO courses (slug, title, subtitle, description, price_cents, sort_order)
      VALUES (${course.slug}, ${course.title}, ${course.subtitle}, ${course.description}, ${course.priceCents}, ${courseIndex})
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        description = EXCLUDED.description,
        price_cents = EXCLUDED.price_cents,
        sort_order = EXCLUDED.sort_order
      RETURNING id
    `;
    const courseId = (courseRow as { id: number }).id;

    // Re-seed modules/lessons/materials for this course from scratch.
    await sql`DELETE FROM modules WHERE course_id = ${courseId}`;

    for (const [moduleIndex, mod] of course.modules.entries()) {
      const [moduleRow] = await sql`
        INSERT INTO modules (course_id, title, sort_order)
        VALUES (${courseId}, ${mod.title}, ${moduleIndex})
        RETURNING id
      `;
      const moduleId = (moduleRow as { id: number }).id;

      const [lessonRow] = await sql`
        INSERT INTO lessons (module_id, title, kinescope_video_id, sort_order)
        VALUES (${moduleId}, ${mod.lesson}, NULL, 0)
        RETURNING id
      `;
      const lessonId = (lessonRow as { id: number }).id;

      await sql`
        INSERT INTO materials (type, title, file_url, lesson_id, course_id)
        VALUES (${mod.material.type}, ${mod.material.title}, NULL, ${lessonId}, NULL)
      `;
    }

    console.log(`Seeded course "${course.title}" (${course.modules.length} modules).`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
