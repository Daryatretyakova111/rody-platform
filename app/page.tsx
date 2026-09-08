import Link from 'next/link';
import { getCourses } from '@/lib/queries';
import { bundlePriceCents, formatPrice, BUNDLE_DISCOUNT_PERCENT } from '@/lib/config';
import CourseCard from '@/components/CourseCard';

const VALUE_PROPS = [
  {
    title: 'Без страшных историй',
    text: 'Только то, что реально происходит с телом и как себя вести — без нагнетания и пугающих подробностей.',
  },
  {
    title: 'По клиническим рекомендациям',
    text: 'Программа опирается на актуальные рекомендации по ведению беременности и родов, а не на форумы и мифы.',
  },
  {
    title: 'Всё в одном месте',
    text: 'Видео-уроки, гайды, чек-листы и инструкции — не нужно искать по десяти каналам и группам.',
  },
  {
    title: 'Под рукой в нужный момент',
    text: 'Личный кабинет открыт с телефона — чек-лист «когда ехать в роддom» можно открыть прямо во время схваток.',
  },
];

const AUDIENCE = [
  { title: 'Готовитесь к первым родам', text: 'Хотите понимать, что происходит на каждом этапе, и не полагаться только на интуицию.' },
  { title: 'Уже рожали и хотите иначе', text: 'В прошлый раз что-то пошло не так, как хотелось — сейчас хочется подготовиться осознаннее.' },
  { title: 'Партнёр, который хочет помочь', text: 'Не растеряться в родзале и понимать, чем реально можно быть полезным.' },
  { title: 'Тревожитесь и хотите разобраться', text: 'Страх часто держится на неизвестности — курс закрывает вопросы «а что если...».' },
];

const MATERIAL_TYPES = [
  { title: 'Видео-уроки', text: 'Короткие уроки по каждой теме' },
  { title: 'Гайды', text: 'Подробные разборы тем' },
  { title: 'Чек-листы', text: 'Что сделать и в каком порядке' },
  { title: 'Инструкции', text: 'Пошагово в момент, когда некогда думать' },
];

const FAQ = [
  {
    q: 'С какого срока беременности начинать?',
    a: 'Курс «Подготовка к родам» можно проходить с любого срока, но большинство слушательниц начинают в третьем триместре, с 28–30 недели.',
  },
  {
    q: 'Доступ ограничен по времени?',
    a: 'Нет, доступ к купленным курсам остаётся у вас навсегда — можно пересматривать материалы и во время следующей беременности.',
  },
  {
    q: 'Можно купить только один курс?',
    a: 'Да, каждый курс продаётся отдельно. Все три вместе — пакетом со скидкой.',
  },
  {
    q: 'Курс заменяет наблюдение у врача?',
    a: 'Нет. Курс дополняет, но не заменяет очное наблюдение и рекомендации вашего акушера-гинеколога.',
  },
];

export default async function HomePage() {
  const courses = await getCourses();
  const bundlePrice = bundlePriceCents(courses.map((c) => c.price_cents));

  return (
    <div>
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Пройти путь от беременности до восстановления спокойно и подготовленной
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg opacity-80">
          Три курса, которые дают знания и уверенность на каждом этапе: подготовка к родам, сами роды и
          восстановление после них. Видео-уроки, гайды, чек-листы и инструкции — в одном личном кабинете.
        </p>
        <div className="mt-8">
          <Link
            href="#courses"
            className="rounded-full bg-gradient-to-r from-pink to-lilac px-8 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Смотреть курсы
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((item) => (
            <div key={item.title} className="rounded-2xl bg-muted p-5">
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="mt-2 text-sm opacity-80">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-center text-2xl font-semibold text-foreground">Для кого этот курс</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCE.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="mt-2 text-sm opacity-80">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="courses" className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-center text-2xl font-semibold text-foreground">Курсы</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-center text-2xl font-semibold text-foreground">Что входит в каждый курс</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MATERIAL_TYPES.map((item) => (
            <div key={item.title} className="rounded-2xl bg-muted p-5 text-center">
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="mt-2 text-sm opacity-80">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm shadow-lilac/10">
          <h2 className="text-xl font-semibold text-foreground">Весь путь целиком</h2>
          <p className="mt-2 opacity-80">
            Все три курса пакетом со скидкой {BUNDLE_DISCOUNT_PERCENT}% — доступ ко всем материалам сразу.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="text-xl font-medium">{formatPrice(bundlePrice)}</span>
            <Link
              href="/bundle"
              className="rounded-full bg-gradient-to-r from-pink to-lilac px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              Купить пакет
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="text-center text-2xl font-semibold text-foreground">Частые вопросы</h2>
        <div className="mt-8 space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-medium text-foreground">{item.q}</p>
              <p className="mt-2 text-sm opacity-80">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
