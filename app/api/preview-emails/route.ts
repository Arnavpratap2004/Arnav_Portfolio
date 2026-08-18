// Local preview harness for the contact emails.
//
//   http://localhost:3000/api/preview-emails            -> notification
//   http://localhost:3000/api/preview-emails?t=reply    -> auto-reply
//
// Edit anything under emails/ and refresh. Never served in production.
import { createElement } from 'react';
import { render } from '@react-email/render';
import { ContactAutoReply } from '@/emails/ContactAutoReply';
import { ContactNotification } from '@/emails/ContactNotification';

const SAMPLE = {
  name: 'Priya Raghunathan',
  email: 'priya.raghunathan@northwind.io',
  subject: 'Backend role — Northwind (Series B, Bangalore)',
  message:
    "Hi Arnav,\n\nI came across your portfolio through the CAD-RAG write-up and the multi-agent debate work at IIT Patna — the token-cost reduction in particular is exactly the kind of thinking we need.\n\nWe're hiring a backend engineer to own our retrieval infrastructure. It's a Next.js + Postgres stack with a Python service layer, and there's real scope to shape the architecture.\n\nWould you be open to a short call next week?\n\nBest,\nPriya",
  timestamp: 'Tuesday, 18 August 2026 at 11:05 am',
};

export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 });
  }

  const which = new URL(request.url).searchParams.get('t');

  const element =
    which === 'reply'
      ? createElement(ContactAutoReply, {
          name: SAMPLE.name,
          subject: SAMPLE.subject,
          message: SAMPLE.message,
        })
      : createElement(ContactNotification, SAMPLE);

  return new Response(await render(element), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
