import { Resend } from 'resend';
import { SITE_NAME } from '@/lib/config';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

export async function sendMagicLinkEmail(email: string, url: string): Promise<void> {
  if (!resend) {
    // Dev fallback: no Resend key configured, print the link instead of emailing it.
    console.log(`[mail] Magic link for ${email}: ${url}`);
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Вход в личный кабинет — ${SITE_NAME}`,
    html: `<p>Здравствуйте!</p><p>Чтобы войти в личный кабинет, перейдите по ссылке (действует 30 минут):</p><p><a href="${url}">${url}</a></p>`,
  });
}
