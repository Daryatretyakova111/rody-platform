import { config } from 'dotenv';
config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);

type MaterialType = 'guide' | 'tip' | 'checklist' | 'instruction';
type LessonWidget = 'packing-checklist' | 'breathing-trainer' | 'partner-toolkit';

interface SeedLesson {
  title: string;
  kinescopeVideoId?: string;
  content?: string;
  widget?: LessonWidget;
}

interface SeedModule {
  title: string;
  lesson: SeedLesson;
  material?: { type: MaterialType; title: string };
}

interface SeedCourse {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  modules: SeedModule[];
}

const courses: SeedCourse[] = [
  {
    slug: 'podgotovka-k-rodam',
    title: 'Беременность и подготовка к родам',
    subtitle: 'Движение, питание, эмоции и подготовка к важному событию',
    description:
      'Курс для будущих мам: что происходит с телом, как распознать начало родов, что взять с собой и как подготовиться морально — себе и партнёру.',
    imageUrl: '/courses/podgotovka-k-rodam.jpg',
    priceCents: 290000,
    modules: [
      {
        title: 'Вводная лекция',
        lesson: {
          title: 'ВВОДНАЯ ЛЕКЦИЯ: что вас ждет на курсе',
          kinescopeVideoId: 'paRUKLWc2yYb5Vg2aT6pMq',
        },
      },
      {
        title: 'Триместры беременности',
        lesson: {
          title: 'Разбираем беременность по триместрам',
          kinescopeVideoId: 'f6ax5eNXuyy6j6UnXcq2B9',
        },
      },
      {
        title: 'Когда ехать в роддом',
        lesson: {
          title: 'Когда ехать в родильный дом',
          kinescopeVideoId: 'qDaCzeqKdzjsB7R8Dnshvg',
        },
      },
      {
        title: 'Сумка в роддом',
        lesson: {
          title: 'Собираем сумку в роддом',
          content:
            'За несколько недель до предполагаемых родов стоит собрать три сумки: с документами, для себя в родзал и на выписку, и отдельно — для малыша. Так в момент, когда пора выезжать, не придётся ничего судорожно искать по всей квартире.\n\nНиже — рабочий список: отмечайте галочками то, что уже собрано, и дописывайте в конце свои пункты — у каждой роддома свои требования, уточните список именно в вашем заранее.',
          widget: 'packing-checklist',
        },
      },
      {
        title: 'Партнёр в родах',
        lesson: {
          title: 'Роль и задачи партнёра',
          content:
            'Партнёр — это не просто зритель в родах, а важная часть команды поддержки. Ваша задача — не медицинские решения (это работа врачей и акушерок), а быть рядом физически и эмоционально, помогать маме оставаться спокойной и чувствовать себя в безопасности.\n\nДо родов: обсудите вместе план родов и её пожелания — какие позы ей комфортны, что она хочет слышать от вас во время схваток, нужна ли музыка или тишина. Уточните в роддоме условия партнёрских родов: какие анализы и документы нужны именно вам и можно ли остаться на всё время или только на сами роды. Продумайте дорогу и запасной маршрут, соберите свою сумку заранее — потом будет не до этого.\n\nВ первом периоде родов (схватки): считайте длительность и промежутки между схватками — это поможет понять, когда пора ехать. Помогайте менять позы: часто легче на четвереньках, у опоры или на фитболе, чем лёжа. Мягкое давление на поясницу или крестец во время схватки многим ощутимо облегчает боль — уточните у неё, приятно ли это именно ей. Дышите вместе с ней вслух, задавая ровный ритм, если она сбивается. Не настаивайте на еде или разговорах, если ей не до этого — просто будьте рядом, приносите воду, следите, чтобы было тепло или прохладно, как ей комфортнее.\n\nВо втором периоде (потуги): здесь особенно важно слушать врача и акушерку и не мешать их работе — они подскажут, если нужна конкретная помощь от вас, например, поддержать ногу или спину в определённой позе. Ваша эмоциональная поддержка сейчас особенно ценна: спокойный голос, слова ободрения, физический контакт (рука, лоб) помогают маме не терять концентрацию.\n\nСразу после родов: если это предусмотрено в роддоме, вы можете быть рядом при первом контакте «кожа к коже», сделать несколько фотографий, если это уместно. Не удивляйтесь, если в первые минуты всё внимание будет на малыше и маме, а не на вас — это нормально, и ваша роль на этом не заканчивается.',
          widget: 'partner-toolkit',
        },
      },
      {
        title: 'Дыхательные техники',
        lesson: {
          title: 'Дыхательные практики и техники',
          content:
            'Медленное глубокое дыхание — используйте в начале схватки и в перерывах между схватками: вдох носом на 4 счёта, выдох ртом на 6 счётов. Такое дыхание помогает не напрягаться раньше времени и экономить силы.\n\nЛёгкое дыхание — пригодится на пике схватки в активной фазе родов: короткие лёгкие вдохи и выдохи через рот, примерно на 2 счёта каждый.\n\nВыдох свечой — плавный длинный выдох через сложенные трубочкой губы. Помогает сдержать раннее желание тужиться, пока это не разрешил врач или акушерка.\n\nПотренируйтесь заранее с тренажёром ниже — это поможет телу запомнить ритм ещё до начала родов.',
          widget: 'breathing-trainer',
        },
      },
    ],
  },
  {
    slug: 'rody',
    title: 'Роды',
    subtitle: 'Теория всех этапов и практика самопомощи',
    description:
      'Что происходит в каждом периоде родов, какие вмешательства возможны и зачем, как помогать себе и как партнёру поддержать вас.',
    imageUrl: '/courses/rody.jpg',
    priceCents: 290000,
    modules: [
      {
        title: 'Первый период: латентная фаза',
        lesson: { title: 'Что происходит, как себя вести дома' },
        material: { type: 'instruction', title: 'Когда фаза меняется' },
      },
      {
        title: 'Первый период: активная фаза',
        lesson: { title: 'Схватки, позы, самопомощь' },
        material: { type: 'tip', title: 'Позы для облегчения боли' },
      },
      {
        title: 'Медицинские вмешательства',
        lesson: { title: 'Окситоцин, амниотомия, КТГ, эпизиотомия' },
        material: { type: 'guide', title: 'Что это и зачем' },
      },
      {
        title: 'Второй период: потуги',
        lesson: { title: 'Техника потуг, роль дыхания' },
        material: { type: 'instruction', title: 'Как тужиться эффективно' },
      },
      {
        title: 'Рождение малыша',
        lesson: { title: 'Первый контакт, кожа-к-коже' },
        material: { type: 'checklist', title: 'Что происходит в первый час' },
      },
      {
        title: 'Третий период',
        lesson: { title: 'Рождение последа' },
        material: { type: 'instruction', title: 'Что происходит и сколько длится' },
      },
      {
        title: 'Если что-то пошло не по плану',
        lesson: { title: 'Экстренное КС, вакуум, щипцы' },
        material: { type: 'guide', title: 'Спокойное объяснение процедур' },
      },
      {
        title: 'Инструкция для партнёра',
        lesson: { title: 'Пошагово по всем периодам родов' },
        material: { type: 'checklist', title: 'Шпаргалка для партнёра' },
      },
    ],
  },
  {
    slug: 'vosstanovlenie',
    title: 'Восстановление после родов',
    subtitle: 'Грудное вскармливание, «золотой час», импринтинг и уход за новорождённым',
    description:
      'Как проходит восстановление после естественных родов и кесарева, на что обращать внимание, когда возвращаться к спорту и близости, как наладить ГВ.',
    imageUrl: '/courses/vosstanovlenie.jpg',
    priceCents: 290000,
    modules: [
      {
        title: 'Первые 42 дня',
        lesson: { title: 'Лохии, инволюция матки, норма выделений' },
        material: { type: 'checklist', title: 'Тревожные симптомы: срочно к врачу' },
      },
      {
        title: 'Уход после естественных родов',
        lesson: { title: 'Швы промежности, гигиена' },
        material: { type: 'instruction', title: 'Пошаговый уход за швами' },
      },
      {
        title: 'Уход после кесарева',
        lesson: { title: 'Уход за швом, ограничения по нагрузке' },
        material: { type: 'checklist', title: 'Тревожные признаки после КС' },
      },
      {
        title: 'Тазовое дно и диастаз',
        lesson: { title: 'Диагностика и первые упражнения' },
        material: { type: 'guide', title: 'Как проверить диастаз самой' },
      },
      {
        title: 'Грудное вскармливание',
        lesson: { title: 'Прикладывание, режим, частые проблемы' },
        material: { type: 'checklist', title: 'Признаки правильного прикладывания' },
      },
      {
        title: 'Гормоны и психика',
        lesson: { title: 'Бэби-блюз vs послеродовая депрессия' },
        material: { type: 'checklist', title: 'Самодиагностика: когда к специалисту' },
      },
      {
        title: 'Питание и режим сна',
        lesson: { title: 'Восстановление ресурса' },
        material: { type: 'guide', title: 'Примерное меню на первые недели' },
      },
      {
        title: 'Возвращение к спорту',
        lesson: { title: 'Поэтапный план по неделям' },
        material: { type: 'checklist', title: 'Можно ли мне уже' },
      },
      {
        title: 'Интимная жизнь и контрацепция',
        lesson: { title: 'Когда и как возвращаться' },
        material: { type: 'guide', title: 'Гайд по возвращению к близости' },
      },
      {
        title: 'Плановые визиты к врачу',
        lesson: { title: 'Осмотр в 6 недель и далее' },
        material: { type: 'checklist', title: 'Обследования по срокам' },
      },
    ],
  },
];

async function main() {
  for (const [courseIndex, course] of courses.entries()) {
    const [courseRow] = await sql`
      INSERT INTO courses (slug, title, subtitle, description, image_url, price_cents, sort_order)
      VALUES (${course.slug}, ${course.title}, ${course.subtitle}, ${course.description}, ${course.imageUrl}, ${course.priceCents}, ${courseIndex})
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        description = EXCLUDED.description,
        image_url = EXCLUDED.image_url,
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
        INSERT INTO lessons (module_id, title, kinescope_video_id, content, widget, sort_order)
        VALUES (
          ${moduleId},
          ${mod.lesson.title},
          ${mod.lesson.kinescopeVideoId ?? null},
          ${mod.lesson.content ?? null},
          ${mod.lesson.widget ?? null},
          0
        )
        RETURNING id
      `;
      const lessonId = (lessonRow as { id: number }).id;

      if (mod.material) {
        await sql`
          INSERT INTO materials (type, title, file_url, lesson_id, course_id)
          VALUES (${mod.material.type}, ${mod.material.title}, NULL, ${lessonId}, NULL)
        `;
      }
    }

    console.log(`Seeded course "${course.title}" (${course.modules.length} lessons).`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
