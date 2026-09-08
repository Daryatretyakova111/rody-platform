import Link from 'next/link';
import Image from 'next/image';
import { getCourses } from '@/lib/queries';
import { BUNDLE_PRICE_CENTS, formatPrice } from '@/lib/config';
import CourseCard from '@/components/CourseCard';
import { IconSprout, IconLotus, IconCycle, IconHearts } from '@/components/icons';

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
  {
    Icon: IconSprout,
    title: 'Для первородящих',
    text: 'Первые роды? Разберём процесс по минутам: от первой схватки до выписки.',
  },
  {
    Icon: IconLotus,
    title: 'Для тех, кто осознанно подходит к родам',
    text: 'Хотите мягкие роды? Изучим биомеханику, техники дыхания и ваши права в роддоме.',
  },
  {
    Icon: IconCycle,
    title: 'Для тех, кто пошёл за вторым',
    text: 'Был негативный опыт? Поможем прожить страхи и составить новый, позитивный сценарий.',
  },
  {
    Icon: IconHearts,
    title: 'Для пар',
    text: 'Рожаете вместе? Сделаем из мужа супер-помощника (практические техники массажа).',
  },
];

const AUTHOR = {
  name: 'Дарья Владимировна Ерохина',
  bioLines: [
    'Врач-акушер-гинеколог, врач ультразвуковой диагностики. Стаж 8 лет, Санкт-Петербург.',
    'Основное место работы: Всеволожский родильный дом, «М+Клиник» (Кудрово).',
    'Образование: Тихоокеанский государственный медицинский университет (лечебное дело), ординатура по акушерству и гинекологии (НМИЦ им. В. А. Алмазова), ультразвуковая диагностика (СПбГУ).',
  ],
  rating: 'Рейтинг на ПроДокторов: 5,0 · 65 отзывов пациентов.',
  profileUrl: 'https://prodoctorov.ru/spb/vrach/989378-tretyakova/',
};

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
  {
    q: 'Есть ли противопоказания к упражнениям и техникам из курса?',
    a: 'Дыхательные практики и движения в курсе рассчитаны на физиологически протекающую беременность. При осложнениях — угрозе преждевременных родов, предлежании плаценты, гестозе и других — обязательно обсудите с наблюдающим врачом, какие именно практики вам подходят.',
  },
  {
    q: 'Подходит ли курс, если планируется кесарево сечение?',
    a: 'Да. В курсе «Роды» есть отдельный блок про плановое и экстренное КС, а курс «Восстановление» отдельно разбирает уход за швом и возвращение к активности после операции.',
  },
  {
    q: 'А если роды начнутся раньше, чем я пройду весь курс?',
    a: 'Доступ остаётся навсегда, и материалы не обязательно проходить по порядку. Если срок поджимает, начните с модулей о предвестниках родов и сумке в роддом — остальное можно доизучить позже, в том числе уже после рождения малыша.',
  },
  {
    q: 'Курс поможет в экстренной ситуации?',
    a: 'Курс даёт знания для спокойной подготовки, но не заменяет неотложную помощь. При тревожных симптомах — кровотечение, резкая боль, отсутствие шевелений плода и подобное — сразу обращайтесь к врачу или вызывайте скорую, не дожидаясь ответа на этот вопрос где-либо ещё.',
  },
];

export default async function HomePage() {
  const courses = await getCourses();

  return (
    <div>
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Авторские курсы Дарьи Ерохиной
            </h1>
            <p className="mt-4 text-xl italic text-lilac-dark">
              Пройди путь от беременности до восстановления спокойной, уверенной и подготовленной
            </p>
            <p className="mx-auto mt-4 max-w-xl text-lg opacity-80 md:mx-0">
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
          </div>
          <div className="mx-auto w-full max-w-xs md:max-w-sm">
            <Image
              src="/darya-erokhina.jpg"
              alt="Дарья Ерохина"
              width={1024}
              height={1280}
              priority
              className="rounded-3xl object-cover shadow-lg shadow-pink/20"
            />
          </div>
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
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {AUDIENCE.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-2xl border border-lilac/40 bg-lilac/10 p-5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lilac/20 text-lilac-dark">
                <item.Icon className="h-6 w-6" />
              </span>
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-sm opacity-80">{item.text}</p>
              </div>
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
          <p className="mt-2 opacity-80">Все три курса пакетом — доступ ко всем материалам сразу.</p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="text-xl font-medium">{formatPrice(BUNDLE_PRICE_CENTS)}</span>
            <Link
              href="/bundle"
              className="rounded-full bg-gradient-to-r from-pink to-lilac px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              Купить пакет
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid items-center gap-10 rounded-3xl border border-border bg-card p-8 shadow-sm shadow-lilac/10 md:grid-cols-[300px_1fr]">
          <div className="mx-auto w-full max-w-xs">
            <Image
              src="/author.jpg"
              alt={AUTHOR.name}
              width={1024}
              height={1280}
              className="rounded-3xl object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-pink-dark">Автор курса</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">{AUTHOR.name}</h2>
            <div className="mt-4 space-y-2 text-sm opacity-80">
              {AUTHOR.bioLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">{AUTHOR.rating}</p>
            <div className="mt-6">
              <a
                href={AUTHOR.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full bg-gradient-to-r from-pink to-lilac px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                Профиль врача на ПроДокторов
              </a>
            </div>
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
