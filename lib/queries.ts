import { sql } from '@/lib/db';

export interface Course {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  price_cents: number;
  sort_order: number;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  sort_order: number;
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  kinescope_video_id: string | null;
  sort_order: number;
}

export interface Material {
  id: number;
  type: 'guide' | 'tip' | 'checklist' | 'instruction';
  title: string;
  file_url: string | null;
  lesson_id: number | null;
  course_id: number | null;
}

export interface User {
  id: number;
  email: string;
  name: string | null;
}

export async function getCourses(): Promise<Course[]> {
  return (await sql`
    SELECT * FROM courses ORDER BY sort_order ASC
  `) as Course[];
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const rows = (await sql`
    SELECT * FROM courses WHERE slug = ${slug}
  `) as Course[];
  return rows[0] ?? null;
}

export async function getCourseById(id: number): Promise<Course | null> {
  const rows = (await sql`
    SELECT * FROM courses WHERE id = ${id}
  `) as Course[];
  return rows[0] ?? null;
}

export async function getModulesWithLessons(
  courseId: number
): Promise<(Module & { lessons: Lesson[] })[]> {
  const modules = (await sql`
    SELECT * FROM modules WHERE course_id = ${courseId} ORDER BY sort_order ASC
  `) as Module[];

  const lessons = (await sql`
    SELECT l.* FROM lessons l
    JOIN modules m ON m.id = l.module_id
    WHERE m.course_id = ${courseId}
    ORDER BY l.sort_order ASC
  `) as Lesson[];

  return modules.map((mod) => ({
    ...mod,
    lessons: lessons.filter((lesson) => lesson.module_id === mod.id),
  }));
}

export async function getLessonById(lessonId: number): Promise<Lesson | null> {
  const rows = (await sql`
    SELECT * FROM lessons WHERE id = ${lessonId}
  `) as Lesson[];
  return rows[0] ?? null;
}

export async function getLessonForCourse(lessonId: number, courseId: number): Promise<Lesson | null> {
  const rows = (await sql`
    SELECT l.* FROM lessons l
    JOIN modules m ON m.id = l.module_id
    WHERE l.id = ${lessonId} AND m.course_id = ${courseId}
  `) as Lesson[];
  return rows[0] ?? null;
}

export async function getMaterialsForLesson(lessonId: number): Promise<Material[]> {
  return (await sql`
    SELECT * FROM materials WHERE lesson_id = ${lessonId}
  `) as Material[];
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const rows = (await sql`
    SELECT id, email, name FROM users WHERE email = ${email}
  `) as User[];
  return rows[0] ?? null;
}

export async function getUserById(id: number): Promise<User | null> {
  const rows = (await sql`
    SELECT id, email, name FROM users WHERE id = ${id}
  `) as User[];
  return rows[0] ?? null;
}

export async function getOrCreateUser(email: string, name?: string): Promise<User> {
  const rows = (await sql`
    INSERT INTO users (email, name)
    VALUES (${email}, ${name ?? null})
    ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
    RETURNING id, email, name
  `) as User[];
  return rows[0];
}

/** Courses the user has access to: directly purchased, or via a bundle purchase (course_id IS NULL). */
export async function getUserPurchasedCourses(userId: number): Promise<Course[]> {
  return (await sql`
    SELECT DISTINCT c.* FROM courses c
    JOIN purchases p ON p.course_id = c.id OR p.course_id IS NULL
    WHERE p.user_id = ${userId}
    ORDER BY c.sort_order ASC
  `) as Course[];
}

export async function hasCourseAccess(userId: number, courseId: number): Promise<boolean> {
  const rows = (await sql`
    SELECT 1 FROM purchases
    WHERE user_id = ${userId} AND (course_id = ${courseId} OR course_id IS NULL)
    LIMIT 1
  `) as unknown[];
  return rows.length > 0;
}

export async function getCompletedLessonIds(userId: number, courseId: number): Promise<Set<number>> {
  const rows = (await sql`
    SELECT pr.lesson_id FROM progress pr
    JOIN lessons l ON l.id = pr.lesson_id
    JOIN modules m ON m.id = l.module_id
    WHERE pr.user_id = ${userId} AND m.course_id = ${courseId}
  `) as { lesson_id: number }[];
  return new Set(rows.map((r) => r.lesson_id));
}

export async function markLessonComplete(userId: number, lessonId: number): Promise<void> {
  await sql`
    INSERT INTO progress (user_id, lesson_id)
    VALUES (${userId}, ${lessonId})
    ON CONFLICT (user_id, lesson_id) DO NOTHING
  `;
}

export async function getMaterialsForUser(userId: number): Promise<(Material & { course_title: string })[]> {
  return (await sql`
    SELECT DISTINCT mat.*, c.title AS course_title
    FROM materials mat
    LEFT JOIN lessons l ON l.id = mat.lesson_id
    LEFT JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = COALESCE(m.course_id, mat.course_id)
    JOIN purchases p ON p.user_id = ${userId} AND (p.course_id = c.id OR p.course_id IS NULL)
    ORDER BY c.title ASC, mat.title ASC
  `) as (Material & { course_title: string })[];
}
