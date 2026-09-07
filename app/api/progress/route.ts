import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { markLessonComplete } from '@/lib/queries';

export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { lessonId } = await request.json();
  if (typeof lessonId !== 'number') {
    return NextResponse.json({ error: 'Некорректный lessonId' }, { status: 400 });
  }

  await markLessonComplete(userId, lessonId);
  return NextResponse.json({ ok: true });
}
